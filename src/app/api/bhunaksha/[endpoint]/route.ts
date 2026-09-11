import { NextRequest, NextResponse } from "next/server";
import {
  BHUNAKSHA_PROJECTS,
  generateBhuNakshaGeoJSON,
  calculateRFCTLARRCompensation,
} from "@/lib/bhunaksha-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const resolvedParams = await params;
  const endpoint = resolvedParams.endpoint;
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get("projectId") || searchParams.get("project") || "DL-INFRA-001";
  const khasraNumber = searchParams.get("khasra") || searchParams.get("khasraNumber");

  const project = BHUNAKSHA_PROJECTS.find((p) => p.id === projectId) || BHUNAKSHA_PROJECTS[0];

  // 1. OGC WFS 2.0 Cadastral Feature Collection
  if (endpoint === "wfs" || endpoint === "cadastre") {
    const geojson = generateBhuNakshaGeoJSON(project);
    return NextResponse.json(geojson, {
      headers: {
        "Content-Type": "application/geo+json",
        "X-BhuNaksha-Service": "NIC-WFS-2.0.0",
        "X-Cadastral-Village-LGD": project.villageLgdCode,
        "X-Sajra-Sheet": project.sajraSheetNumber,
      },
    });
  }

  // 2. Bhulekh RoR (Record of Rights) Gateway
  if (endpoint === "ror" || endpoint === "bhulekh") {
    const parcel = khasraNumber
      ? project.parcels.find((p) => p.khasraNumber === khasraNumber)
      : project.parcels[0];

    if (!parcel) {
      return NextResponse.json(
        { error: "Khasra record not found in Bhulekh RoR register" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        source: "Bhulekh State Land Records Portal (RoR Integration)",
        khasraNumber: parcel.khasraNumber,
        ulpin: parcel.ulpin,
        village: parcel.village,
        tehsil: parcel.tehsil,
        district: parcel.district,
        state: parcel.state,
        recordedAreaHa: parcel.recordedRoRAreaHa,
        soilClass: parcel.soilClass,
        tenureType: "Bhumidhari / Occupant Class-1 (Freehold with Alienable Rights)",
        landClassification: parcel.landClassification,
        owners: parcel.owners,
        encumbrances: [
          {
            type: "Statutory Freeze",
            authority: "RFCTLARR 2013 Section 11 Notification",
            status: parcel.status !== "proposed" ? "Active" : "None",
            description: "No sale, mortgage, or transfer permitted during acquisition proceedings.",
          },
        ],
        chauhaddi: parcel.chauhaddi,
        circleRateINR: parcel.circleRatePerHa,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Bhulekh-Sync": "Verified-Live-Bridge",
        },
      }
    );
  }

  // 3. Affected Land Spatial Analysis Summary
  if (endpoint === "affected-analysis") {
    const affected = project.parcels.filter((p) => p.isAffected);
    const unaffected = project.parcels.filter((p) => !p.isAffected);

    const fullAcquisition = affected.filter((p) => p.acquisitionType === "full");
    const partialAcquisition = affected.filter((p) => p.acquisitionType === "partial");

    return NextResponse.json({
      projectId: project.id,
      projectName: project.name,
      corridorType: project.corridorType,
      corridorWidthMeters: project.corridorWidthMeters || "Zonal Polygon",
      sajraSheetNumber: project.sajraSheetNumber,
      metrics: {
        totalParcels: project.parcels.length,
        affectedParcelsCount: affected.length,
        unaffectedParcelsCount: unaffected.length,
        fullAcquisitionCount: fullAcquisition.length,
        partialAcquisitionCount: partialAcquisition.length,
        totalVillageAreaHa: project.totalVillageAreaHa,
        totalAffectedAreaHa: project.totalAffectedAreaHa,
        totalUnaffectedAreaHa: project.totalUnaffectedAreaHa,
        affectedAreaPercentage: Math.round((project.totalAffectedAreaHa / project.totalVillageAreaHa) * 100),
        estimatedCompensationTotalINR: project.parcels.reduce(
          (acc, p) => acc + p.valuation.totalCompensationPayable,
          0
        ),
      },
      affectedParcels: affected.map((p) => ({
        khasraNumber: p.khasraNumber,
        ulpin: p.ulpin,
        totalAreaHa: p.gisCalculatedAreaHa,
        affectedAreaHa: p.affectedAreaHa,
        residualAreaHa: p.residualAreaHa,
        percentageAffected: p.affectedAreaPercentage,
        acquisitionType: p.acquisitionType,
        owners: p.owners.map((o) => o.name),
        valuationINR: p.valuation.totalCompensationPayable,
        status: p.status,
      })),
    });
  }

  // 4. Default / Parcel Data endpoint
  return NextResponse.json({
    projectId: project.id,
    projectName: project.name,
    calaOfficer: project.calaOfficer,
    currentStage: project.currentStageName,
    totalParcels: project.parcels.length,
    parcels: project.parcels,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const resolvedParams = await params;
  const endpoint = resolvedParams.endpoint;

  if (endpoint === "calculate-compensation") {
    try {
      const body = await request.json();
      const result = calculateRFCTLARRCompensation({
        affectedAreaHa: Number(body.affectedAreaHa) || 1.0,
        circleRatePerHa: Number(body.circleRatePerHa) || 3000000,
        ruralMultiplier: Number(body.ruralMultiplier) || 1.5,
        assetsValue: Number(body.assetsValue) || 0,
        additionalInterestMonths: Number(body.additionalInterestMonths) || 12,
      });
      return NextResponse.json({ success: true, valuation: result });
    } catch {
      return NextResponse.json({ error: "Invalid calculation parameters" }, { status: 400 });
    }
  }

  return NextResponse.json({ error: "Invalid POST endpoint" }, { status: 404 });
}
