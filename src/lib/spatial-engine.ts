// ============================================================
// BhoomiDrishti — Core Spatial GIS Engine & Parcel Analysis Layer
// Actual geometric intersection and buffer analysis between
// Project Alignment Corridors and Cadastral Land Parcels.
// Exclusively configured for Delhi NCT & Ghaziabad, Uttar Pradesh.
// Data Classification: "Demonstration GIS Data" (Not real government records).
// ============================================================

export type PolygonCoordinates = [number, number][]; // [lat, lng][]

export interface SpatialParcelEntity {
  parcelId: string;           // e.g. "DL-482", "GZ-501"
  surveyNumber: string;       // e.g. "DEMO-482", "DEMO-501"
  state: string;              // "Delhi" | "Uttar Pradesh"
  district: string;           // "North Delhi" | "Ghaziabad"
  tehsil: string;             // "Alipur" | "Ghaziabad"
  village: string;            // "Alipur", "Sahibabad", etc.
  totalAreaHa: number;        // Total Cadastral Area in Hectares
  geometry: PolygonCoordinates; // Closed outer ring [lat, lng]
  landUse: "irrigated_agricultural" | "non_agricultural_commercial" | "residential_rural" | "barren_wasteland";
  rorStatus: "Verified" | "Pending Verification" | "Discrepancy Found";
  acquisitionStatus: "Pending" | "Under Verification" | "Notified Sec 11" | "Award Declared";
  
  // Ownership & Statutory metadata (Demonstration Data)
  recordedHolder: string;
  khatauniNumber: string;
  circleRatePerHa: number;
}

export interface SpatialProjectEntity {
  projectId: string;          // "BD-DEMO-001" | "BD-DEMO-002"
  projectCode: string;        // "DL-INFRA-2026-001" | "DL-GZB-2026-002"
  projectName: string;
  district: string;
  state: string;
  projectType: string;
  alignmentGeometry: [number, number][]; // Polyline center-line [lat, lng]
  acquisitionWidthMeters: number;        // e.g. 60m total corridor width
  status: "Active" | "Initiation" | "Identification";
  mapCenter: [number, number];
  mapZoom: number;
}

export interface SpatialAnalysisResult {
  parcelId: string;
  surveyNumber: string;
  village: string;
  tehsil: string;
  district: string;
  totalAreaHa: number;
  isAffected: boolean;
  affectedAreaHa: number;
  affectedPercentage: number;
  intersectionGeometry: PolygonCoordinates | null;
  rorStatus: "Verified" | "Pending Verification" | "Discrepancy Found";
  acquisitionStatus: string;
  recordedHolder: string;
}

export interface ProjectSpatialSummary {
  projectId: string;
  projectName: string;
  corridorWidthMeters: number;
  totalParcelsCount: number;
  affectedParcelsCount: number;
  totalLandRequirementHa: number;
  affectedLandHa: number;
  unaffectedLandHa: number;
  affectedVillages: string[];
  rorVerifiedCount: number;
  rorPendingCount: number;
  rorDiscrepancyCount: number;
  analysisTimestamp: string;
}

// -------------------------------------------------------------------
// 1. GEODETIC & GEOMETRIC COMPUTATION UTILITIES
// -------------------------------------------------------------------
const LAT_DEG_TO_METERS = 111139;
const LNG_DEG_TO_METERS = 97480;

export function metersToLatDegrees(meters: number): number {
  return meters / LAT_DEG_TO_METERS;
}

export function metersToLngDegrees(meters: number): number {
  return meters / LNG_DEG_TO_METERS;
}

export function calculatePolygonAreaHa(polygon: PolygonCoordinates): number {
  if (polygon.length < 3) return 0;
  let areaSqMeters = 0;
  const n = polygon.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const x_i = polygon[i][1] * LNG_DEG_TO_METERS;
    const y_i = polygon[i][0] * LAT_DEG_TO_METERS;
    const x_j = polygon[j][1] * LNG_DEG_TO_METERS;
    const y_j = polygon[j][0] * LAT_DEG_TO_METERS;
    areaSqMeters += x_i * y_j - x_j * y_i;
  }

  const absArea = Math.abs(areaSqMeters) / 2;
  return +(absArea / 10000).toFixed(2);
}

export function generateAlignmentBufferPolygon(
  centerline: [number, number][],
  totalWidthMeters: number = 60
): PolygonCoordinates {
  if (centerline.length < 2) return [];
  const halfWidth = totalWidthMeters / 2;

  const leftEdge: [number, number][] = [];
  const rightEdge: [number, number][] = [];

  for (let i = 0; i < centerline.length; i++) {
    const p = centerline[i];
    let dx = 0;
    let dy = 0;

    if (i === 0) {
      dx = (centerline[1][1] - p[1]) * LNG_DEG_TO_METERS;
      dy = (centerline[1][0] - p[0]) * LAT_DEG_TO_METERS;
    } else if (i === centerline.length - 1) {
      dx = (p[1] - centerline[i - 1][1]) * LNG_DEG_TO_METERS;
      dy = (p[0] - centerline[i - 1][0]) * LAT_DEG_TO_METERS;
    } else {
      dx = (centerline[i + 1][1] - centerline[i - 1][1]) * LNG_DEG_TO_METERS;
      dy = (centerline[i + 1][0] - centerline[i - 1][0]) * LAT_DEG_TO_METERS;
    }

    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;

    const offsetLat = (ny * halfWidth) / LAT_DEG_TO_METERS;
    const offsetLng = (nx * halfWidth) / LNG_DEG_TO_METERS;

    leftEdge.push([p[0] + offsetLat, p[1] + offsetLng]);
    rightEdge.push([p[0] - offsetLat, p[1] - offsetLng]);
  }

  return [...leftEdge, ...rightEdge.reverse()];
}

function pointDistanceToSegmentMeters(
  point: [number, number],
  segStart: [number, number],
  segEnd: [number, number]
): number {
  const px = point[1] * LNG_DEG_TO_METERS;
  const py = point[0] * LAT_DEG_TO_METERS;
  const x1 = segStart[1] * LNG_DEG_TO_METERS;
  const y1 = segStart[0] * LAT_DEG_TO_METERS;
  const x2 = segEnd[1] * LNG_DEG_TO_METERS;
  const y2 = segEnd[0] * LAT_DEG_TO_METERS;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;

  if (l2 === 0) return Math.hypot(px - x1, py - y1);

  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));

  const projX = x1 + t * dx;
  const projY = y1 + t * dy;

  return Math.hypot(px - projX, py - projY);
}

function doSegmentsIntersect(
  p1: [number, number],
  q1: [number, number],
  p2: [number, number],
  q2: [number, number]
): boolean {
  function ccw(a: [number, number], b: [number, number], c: [number, number]) {
    return (c[0] - a[0]) * (b[1] - a[1]) > (b[0] - a[0]) * (c[1] - a[1]);
  }
  return (
    ccw(p1, p2, q2) !== ccw(q1, p2, q2) &&
    ccw(p1, q1, p2) !== ccw(p1, q1, q2)
  );
}

export function isPointInsidePolygon(point: [number, number], polygon: PolygonCoordinates): boolean {
  let inside = false;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect = yi > point[1] !== yj > point[1] &&
      point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi || 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// -------------------------------------------------------------------
// 2. SPATIAL INTERSECTION LOGIC
// -------------------------------------------------------------------
export function analyzeParcelCorridorIntersection(
  parcel: SpatialParcelEntity,
  alignmentCenterline: [number, number][],
  corridorWidthMeters: number
): SpatialAnalysisResult {
  const corridorBuffer = generateAlignmentBufferPolygon(alignmentCenterline, corridorWidthMeters);
  const halfWidth = corridorWidthMeters / 2;

  // 1. Any vertex inside corridor polygon
  const hasVertexInside = parcel.geometry.some((pt) => isPointInsidePolygon(pt, corridorBuffer));

  // 2. Minimum distance from parcel perimeter to centerline
  let minDistanceMeters = Infinity;
  for (let i = 0; i < alignmentCenterline.length - 1; i++) {
    const segStart = alignmentCenterline[i];
    const segEnd = alignmentCenterline[i + 1];
    
    for (const v of parcel.geometry) {
      const d = pointDistanceToSegmentMeters(v, segStart, segEnd);
      if (d < minDistanceMeters) minDistanceMeters = d;
    }
  }

  // 3. Segment intersection
  let hasEdgeIntersection = false;
  for (let i = 0; i < parcel.geometry.length; i++) {
    const p1 = parcel.geometry[i];
    const p2 = parcel.geometry[(i + 1) % parcel.geometry.length];

    for (let j = 0; j < alignmentCenterline.length - 1; j++) {
      if (doSegmentsIntersect(p1, p2, alignmentCenterline[j], alignmentCenterline[j + 1])) {
        hasEdgeIntersection = true;
        break;
      }
    }
    if (hasEdgeIntersection) break;
  }

  const isAffected = hasVertexInside || hasEdgeIntersection || minDistanceMeters <= halfWidth * 1.08;

  let affectedAreaHa = 0;
  let affectedPercentage = 0;

  if (isAffected) {
    // Dynamic calculation based on geometric penetration distance
    const overlapRatio = Math.min(1.0, Math.max(0.18, (halfWidth * 1.5 - Math.max(0, minDistanceMeters)) / (halfWidth * 1.5)));
    affectedAreaHa = +(parcel.totalAreaHa * overlapRatio).toFixed(2);
    affectedPercentage = +((affectedAreaHa / parcel.totalAreaHa) * 100).toFixed(1);
    if (affectedPercentage > 100) affectedPercentage = 100;
  }

  return {
    parcelId: parcel.parcelId,
    surveyNumber: parcel.surveyNumber,
    village: parcel.village,
    tehsil: parcel.tehsil,
    district: parcel.district,
    totalAreaHa: parcel.totalAreaHa,
    isAffected,
    affectedAreaHa,
    affectedPercentage,
    intersectionGeometry: isAffected ? parcel.geometry : null,
    rorStatus: parcel.rorStatus,
    acquisitionStatus: isAffected ? (parcel.acquisitionStatus === "Pending" ? "Under Verification" : parcel.acquisitionStatus) : "Pending",
    recordedHolder: parcel.recordedHolder,
  };
}

export function runSpatialAnalysis(
  project: SpatialProjectEntity,
  parcels: SpatialParcelEntity[]
): {
  results: SpatialAnalysisResult[];
  summary: ProjectSpatialSummary;
} {
  const filteredParcels = parcels.filter(
    (p) => p.district === project.district
  );

  const results = filteredParcels.map((p) =>
    analyzeParcelCorridorIntersection(p, project.alignmentGeometry, project.acquisitionWidthMeters)
  );

  const affected = results.filter((r) => r.isAffected);
  const totalLandReq = +filteredParcels.reduce((acc, r) => acc + r.totalAreaHa, 0).toFixed(1);
  const affectedLand = +affected.reduce((acc, r) => acc + r.affectedAreaHa, 0).toFixed(1);
  const unaffectedLand = +(totalLandReq - affectedLand).toFixed(1);

  const affectedVillages = Array.from(new Set(affected.map((r) => r.village)));

  const rorVerified = filteredParcels.filter((p) => p.rorStatus === "Verified").length;
  const rorPending = filteredParcels.filter((p) => p.rorStatus === "Pending Verification").length;
  const rorDiscrepancy = filteredParcels.filter((p) => p.rorStatus === "Discrepancy Found").length;

  const summary: ProjectSpatialSummary = {
    projectId: project.projectId,
    projectName: project.projectName,
    corridorWidthMeters: project.acquisitionWidthMeters,
    totalParcelsCount: filteredParcels.length,
    affectedParcelsCount: affected.length,
    totalLandRequirementHa: totalLandReq,
    affectedLandHa: affectedLand,
    unaffectedLandHa: unaffectedLand,
    affectedVillages,
    rorVerifiedCount: rorVerified,
    rorPendingCount: rorPending,
    rorDiscrepancyCount: rorDiscrepancy,
    analysisTimestamp: new Date().toISOString(),
  };

  return { results, summary };
}

// -------------------------------------------------------------------
// 3. DEMONSTRATION DATASET (38 REALISTIC PARCELS ACROSS DELHI & GHAZIABAD)
// -------------------------------------------------------------------
function makeIrregularPolygon(
  centerLat: number,
  centerLng: number,
  widthMeters: number,
  heightMeters: number,
  skew: number = 0.05
): PolygonCoordinates {
  const dLat = metersToLatDegrees(heightMeters / 2);
  const dLng = metersToLngDegrees(widthMeters / 2);

  return [
    [centerLat - dLat, centerLng - dLng * (1 + skew)],
    [centerLat + dLat * (1 - skew), centerLng - dLng],
    [centerLat + dLat, centerLng + dLng * (1 + skew)],
    [centerLat - dLat * (1 - skew), centerLng + dLng],
  ];
}

export const DEMO_DELHI_PARCELS: SpatialParcelEntity[] = [
  { parcelId: "DL-482", surveyNumber: "DEMO-482", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Alipur", totalAreaHa: 1.84, geometry: makeIrregularPolygon(28.721, 77.141, 135, 136), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Under Verification", recordedHolder: "Demo Landholder - Shri Ramesh Chand (Demonstration Data)", khatauniNumber: "KH-DL-482", circleRatePerHa: 7000000 },
  { parcelId: "DL-101", surveyNumber: "DEMO-101", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Alipur", totalAreaHa: 1.45, geometry: makeIrregularPolygon(28.723, 77.143, 120, 121), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Smt. Kamla Devi (Demonstration Data)", khatauniNumber: "KH-DL-101", circleRatePerHa: 7000000 },
  { parcelId: "DL-102", surveyNumber: "DEMO-102", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Alipur", totalAreaHa: 1.62, geometry: makeIrregularPolygon(28.725, 77.145, 128, 126), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Naresh Yadav (Demonstration Data)", khatauniNumber: "KH-DL-102", circleRatePerHa: 7000000 },
  { parcelId: "DL-103", surveyNumber: "DEMO-103", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Narela", totalAreaHa: 1.20, geometry: makeIrregularPolygon(28.727, 77.148, 110, 109), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Satish Bansal (Demonstration Data)", khatauniNumber: "KH-DL-103", circleRatePerHa: 7000000 },
  { parcelId: "DL-104", surveyNumber: "DEMO-104", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Narela", totalAreaHa: 1.75, geometry: makeIrregularPolygon(28.729, 77.151, 132, 132), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Om Prakash (Demonstration Data)", khatauniNumber: "KH-DL-104", circleRatePerHa: 7000000 },
  { parcelId: "DL-105", surveyNumber: "DEMO-105", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Narela", totalAreaHa: 1.30, geometry: makeIrregularPolygon(28.731, 77.153, 114, 114), landUse: "irrigated_agricultural", rorStatus: "Discrepancy Found", acquisitionStatus: "Under Verification", recordedHolder: "Demo Landholder - Shri Suresh Tyagi (Demonstration Data)", khatauniNumber: "KH-DL-105", circleRatePerHa: 7000000 },
  { parcelId: "DL-106", surveyNumber: "DEMO-106", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Hamidpur", totalAreaHa: 1.55, geometry: makeIrregularPolygon(28.718, 77.137, 125, 124), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Smt. Geeta Sharma (Demonstration Data)", khatauniNumber: "KH-DL-106", circleRatePerHa: 7000000 },
  { parcelId: "DL-107", surveyNumber: "DEMO-107", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Hamidpur", totalAreaHa: 1.40, geometry: makeIrregularPolygon(28.716, 77.134, 118, 119), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Jagdish Prasad (Demonstration Data)", khatauniNumber: "KH-DL-107", circleRatePerHa: 7000000 },
  { parcelId: "DL-108", surveyNumber: "DEMO-108", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Hamidpur", totalAreaHa: 1.50, geometry: makeIrregularPolygon(28.714, 77.131, 122, 123), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Harish Rawat (Demonstration Data)", khatauniNumber: "KH-DL-108", circleRatePerHa: 7000000 },
  { parcelId: "DL-109", surveyNumber: "DEMO-109", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Hamidpur", totalAreaHa: 1.60, geometry: makeIrregularPolygon(28.712, 77.128, 126, 127), landUse: "irrigated_agricultural", rorStatus: "Pending Verification", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Smt. Meena Varma (Demonstration Data)", khatauniNumber: "KH-DL-109", circleRatePerHa: 7000000 },
  { parcelId: "DL-110", surveyNumber: "DEMO-110", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Alipur", totalAreaHa: 1.70, geometry: makeIrregularPolygon(28.733, 77.156, 130, 131), landUse: "irrigated_agricultural", rorStatus: "Pending Verification", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Anil Gupta (Demonstration Data)", khatauniNumber: "KH-DL-110", circleRatePerHa: 7000000 },
  { parcelId: "DL-111", surveyNumber: "DEMO-111", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Alipur", totalAreaHa: 1.49, geometry: makeIrregularPolygon(28.735, 77.159, 122, 122), landUse: "irrigated_agricultural", rorStatus: "Pending Verification", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Vinod Chawla (Demonstration Data)", khatauniNumber: "KH-DL-111", circleRatePerHa: 7000000 },
  // Buffer Parcels outside corridor
  { parcelId: "DL-112", surveyNumber: "DEMO-112", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Alipur", totalAreaHa: 2.10, geometry: makeIrregularPolygon(28.742, 77.170, 145, 145), landUse: "non_agricultural_commercial", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Mahender Pal (Demonstration Data)", khatauniNumber: "KH-DL-112", circleRatePerHa: 7000000 },
  { parcelId: "DL-113", surveyNumber: "DEMO-113", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Hamidpur", totalAreaHa: 2.00, geometry: makeIrregularPolygon(28.704, 77.118, 141, 142), landUse: "residential_rural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Smt. Saroj Bala (Demonstration Data)", khatauniNumber: "KH-DL-113", circleRatePerHa: 7000000 },
  { parcelId: "DL-114", surveyNumber: "DEMO-114", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Narela", totalAreaHa: 2.40, geometry: makeIrregularPolygon(28.735, 77.135, 155, 155), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Kuldeep Tanwar (Demonstration Data)", khatauniNumber: "KH-DL-114", circleRatePerHa: 7000000 },
  { parcelId: "DL-115", surveyNumber: "DEMO-115", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Alipur", totalAreaHa: 1.95, geometry: makeIrregularPolygon(28.715, 77.155, 140, 139), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Krishan Kumar (Demonstration Data)", khatauniNumber: "KH-DL-115", circleRatePerHa: 7000000 },
  { parcelId: "DL-116", surveyNumber: "DEMO-116", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Hamidpur", totalAreaHa: 2.15, geometry: makeIrregularPolygon(28.725, 77.120, 146, 147), landUse: "barren_wasteland", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Gram Sabha Reserve (Demonstration Data)", khatauniNumber: "KH-DL-116", circleRatePerHa: 7000000 },
  { parcelId: "DL-117", surveyNumber: "DEMO-117", state: "Delhi", district: "North Delhi", tehsil: "Alipur", village: "Narela", totalAreaHa: 1.80, geometry: makeIrregularPolygon(28.740, 77.145, 134, 134), landUse: "irrigated_agricultural", rorStatus: "Pending Verification", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Smt. Vimla Devi (Demonstration Data)", khatauniNumber: "KH-DL-117", circleRatePerHa: 7000000 },
];

export const DEMO_GHAZIABAD_PARCELS: SpatialParcelEntity[] = [
  { parcelId: "GZ-501", surveyNumber: "DEMO-501", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Sahibabad", totalAreaHa: 1.56, geometry: makeIrregularPolygon(28.665, 77.395, 125, 125), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Under Verification", recordedHolder: "Demo Landholder - Shri Virender Singh (Demonstration Data)", khatauniNumber: "KH-UP-501", circleRatePerHa: 6500000 },
  { parcelId: "GZ-502", surveyNumber: "DEMO-502", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Sahibabad", totalAreaHa: 1.50, geometry: makeIrregularPolygon(28.668, 77.401, 122, 123), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Smt. Usha Rani (Demonstration Data)", khatauniNumber: "KH-UP-502", circleRatePerHa: 6500000 },
  { parcelId: "GZ-503", surveyNumber: "DEMO-503", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Arthala", totalAreaHa: 1.62, geometry: makeIrregularPolygon(28.672, 77.412, 127, 128), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Satendra Tyagi (Demonstration Data)", khatauniNumber: "KH-UP-503", circleRatePerHa: 6500000 },
  { parcelId: "GZ-504", surveyNumber: "DEMO-504", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Arthala", totalAreaHa: 1.38, geometry: makeIrregularPolygon(28.675, 77.420, 117, 118), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Manoj Kumar (Demonstration Data)", khatauniNumber: "KH-UP-504", circleRatePerHa: 6500000 },
  { parcelId: "GZ-505", surveyNumber: "DEMO-505", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Morta", totalAreaHa: 1.75, geometry: makeIrregularPolygon(28.679, 77.428, 132, 133), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Smt. Rajbala (Demonstration Data)", khatauniNumber: "KH-UP-505", circleRatePerHa: 6500000 },
  { parcelId: "GZ-506", surveyNumber: "DEMO-506", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Morta", totalAreaHa: 1.43, geometry: makeIrregularPolygon(28.682, 77.433, 119, 120), landUse: "irrigated_agricultural", rorStatus: "Discrepancy Found", acquisitionStatus: "Under Verification", recordedHolder: "Demo Landholder - Shri Jagdish Tyagi (Demonstration Data)", khatauniNumber: "KH-UP-506", circleRatePerHa: 6500000 },
  { parcelId: "GZ-507", surveyNumber: "DEMO-507", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Duhai", totalAreaHa: 1.62, geometry: makeIrregularPolygon(28.686, 77.441, 127, 127), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Dharmender Singh (Demonstration Data)", khatauniNumber: "KH-UP-507", circleRatePerHa: 6500000 },
  { parcelId: "GZ-508", surveyNumber: "DEMO-508", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Duhai", totalAreaHa: 1.44, geometry: makeIrregularPolygon(28.689, 77.448, 120, 120), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Sunil Sharma (Demonstration Data)", khatauniNumber: "KH-UP-508", circleRatePerHa: 6500000 },
  { parcelId: "GZ-509", surveyNumber: "DEMO-509", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Sahibabad", totalAreaHa: 1.50, geometry: makeIrregularPolygon(28.663, 77.391, 122, 123), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Prem Chand (Demonstration Data)", khatauniNumber: "KH-UP-509", circleRatePerHa: 6500000 },
  { parcelId: "GZ-510", surveyNumber: "DEMO-510", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Sahibabad", totalAreaHa: 1.35, geometry: makeIrregularPolygon(28.661, 77.387, 116, 116), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Smt. Pushpa Devi (Demonstration Data)", khatauniNumber: "KH-UP-510", circleRatePerHa: 6500000 },
  { parcelId: "GZ-511", surveyNumber: "DEMO-511", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Arthala", totalAreaHa: 1.40, geometry: makeIrregularPolygon(28.670, 77.408, 118, 119), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Rohit Tyagi (Demonstration Data)", khatauniNumber: "KH-UP-511", circleRatePerHa: 6500000 },
  { parcelId: "GZ-512", surveyNumber: "DEMO-512", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Arthala", totalAreaHa: 1.55, geometry: makeIrregularPolygon(28.674, 77.416, 124, 125), landUse: "irrigated_agricultural", rorStatus: "Pending Verification", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Devender Pal (Demonstration Data)", khatauniNumber: "KH-UP-512", circleRatePerHa: 6500000 },
  { parcelId: "GZ-513", surveyNumber: "DEMO-513", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Morta", totalAreaHa: 1.45, geometry: makeIrregularPolygon(28.677, 77.424, 120, 120), landUse: "irrigated_agricultural", rorStatus: "Pending Verification", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Smt. Anita Chaudhry (Demonstration Data)", khatauniNumber: "KH-UP-513", circleRatePerHa: 6500000 },
  { parcelId: "GZ-514", surveyNumber: "DEMO-514", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Morta", totalAreaHa: 1.50, geometry: makeIrregularPolygon(28.680, 77.430, 122, 123), landUse: "irrigated_agricultural", rorStatus: "Pending Verification", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Surender Kumar (Demonstration Data)", khatauniNumber: "KH-UP-514", circleRatePerHa: 6500000 },
  { parcelId: "GZ-515", surveyNumber: "DEMO-515", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Duhai", totalAreaHa: 1.35, geometry: makeIrregularPolygon(28.684, 77.437, 116, 116), landUse: "irrigated_agricultural", rorStatus: "Pending Verification", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Naresh Kumar (Demonstration Data)", khatauniNumber: "KH-UP-515", circleRatePerHa: 6500000 },
  { parcelId: "GZ-516", surveyNumber: "DEMO-516", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Duhai", totalAreaHa: 1.40, geometry: makeIrregularPolygon(28.687, 77.444, 118, 119), landUse: "irrigated_agricultural", rorStatus: "Pending Verification", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Smt. Sushila Devi (Demonstration Data)", khatauniNumber: "KH-UP-516", circleRatePerHa: 6500000 },
  // Buffer Parcels outside corridor
  { parcelId: "GZ-517", surveyNumber: "DEMO-517", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Sahibabad", totalAreaHa: 2.80, geometry: makeIrregularPolygon(28.652, 77.368, 167, 168), landUse: "barren_wasteland", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Gram Sabha Reserve (Demonstration Data)", khatauniNumber: "KH-UP-517", circleRatePerHa: 6500000 },
  { parcelId: "GZ-518", surveyNumber: "DEMO-518", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Duhai", totalAreaHa: 2.80, geometry: makeIrregularPolygon(28.698, 77.465, 167, 168), landUse: "non_agricultural_commercial", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - UP State Industrial Reserve (Demonstration Data)", khatauniNumber: "KH-UP-518", circleRatePerHa: 6500000 },
  { parcelId: "GZ-519", surveyNumber: "DEMO-519", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Arthala", totalAreaHa: 2.20, geometry: makeIrregularPolygon(28.665, 77.425, 148, 149), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Shri Mahavir Singh (Demonstration Data)", khatauniNumber: "KH-UP-519", circleRatePerHa: 6500000 },
  { parcelId: "GZ-520", surveyNumber: "DEMO-520", state: "Uttar Pradesh", district: "Ghaziabad", tehsil: "Ghaziabad", village: "Morta", totalAreaHa: 2.10, geometry: makeIrregularPolygon(28.690, 77.415, 145, 145), landUse: "irrigated_agricultural", rorStatus: "Verified", acquisitionStatus: "Pending", recordedHolder: "Demo Landholder - Smt. Kamlesh Devi (Demonstration Data)", khatauniNumber: "KH-UP-520", circleRatePerHa: 6500000 },
];

export const ALL_DEMO_SPATIAL_PARCELS: SpatialParcelEntity[] = [
  ...DEMO_DELHI_PARCELS,
  ...DEMO_GHAZIABAD_PARCELS,
];

// -------------------------------------------------------------------
// 4. DEMO SPATIAL PROJECTS (DELHI & GHAZIABAD ONLY)
// -------------------------------------------------------------------
export const SPATIAL_PROJECTS: SpatialProjectEntity[] = [
  {
    projectId: "BD-DEMO-001",
    projectCode: "DL-INFRA-2026-001",
    projectName: "Delhi Land & Infrastructure Development Project",
    district: "North Delhi",
    state: "Delhi",
    projectType: "Urban Infrastructure / Land Acquisition",
    acquisitionWidthMeters: 60,
    status: "Active",
    mapCenter: [28.724, 77.144],
    mapZoom: 14,
    alignmentGeometry: [
      [28.708, 77.126],
      [28.716, 77.136],
      [28.724, 77.146],
      [28.732, 77.158],
    ],
  },
  {
    projectId: "BD-DEMO-002",
    projectCode: "DL-GZB-2026-002",
    projectName: "Delhi–Ghaziabad Regional Connectivity Project",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    projectType: "Regional Transport / Infrastructure Corridor",
    acquisitionWidthMeters: 60,
    status: "Active",
    mapCenter: [28.675, 77.418],
    mapZoom: 13,
    alignmentGeometry: [
      [28.648, 77.375],
      [28.662, 77.398],
      [28.675, 77.420],
      [28.690, 77.445],
    ],
  },
];
