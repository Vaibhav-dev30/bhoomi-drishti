// ============================================================
// BhoomiDrishti — BhuNaksha Cadastral Engine & Service Layer
// National Informatics Centre (NIC) Cadastral Integration Suite
// ============================================================

export interface BhuNakshaParcel {
  id: string;
  projectId: string;
  khasraNumber: string; // e.g. "104", "105/1"
  surveyNumber: string;
  ulpin: string; // 14-digit Bhu-Aadhaar e.g. "MH240019284701"
  village: string;
  villageLgdCode: string; // Local Government Directory Code
  sheetNumber: string; // Cadastral Sajra Sheet No (e.g. "Sheet 02")
  tehsil: string;
  district: string;
  state: string;
  stateCode: string;

  // Spatial Dimensions
  gisCalculatedAreaHa: number; // Calculated Area from BhuNaksha Vector Geometry
  recordedRoRAreaHa: number; // Recorded Area in Bhulekh / RoR Register
  areaSqMeters: number;
  dimensions: string; // e.g. "115m × 90m"

  // Land Attributes
  landClassification:
    | "irrigated_agricultural"
    | "rainfed_dryland"
    | "non_agricultural_commercial"
    | "barren_wasteland"
    | "gram_sabha_revenue"
    | "forest_boundary";
  soilClass: string; // e.g. "Kali Mitti (Black Soil Class I)"
  circleRatePerHa: number; // Market circle rate in ₹
  guidanceValuePerSqM: number;

  // Ownership from Bhulekh RoR (Record of Rights)
  owners: {
    name: string;
    fatherOrHusbandName: string;
    sharePercentage: number;
    khatauniNumber: string;
    casteCategory: "General" | "OBC" | "SC" | "ST";
    contactNumber?: string;
  }[];

  // Acquisition Impact Analysis
  isAffected: boolean;
  affectedAreaHa: number;
  affectedAreaPercentage: number; // e.g. 100% full, 45% partial
  residualAreaHa: number; // Area remaining with land-holder
  acquisitionType: "full" | "partial" | "unaffected" | "buffer";
  severanceClaimEligible: boolean; // Under RFCTLARR Sec 27 if residual < 0.2 Ha

  // Statutory Workflow Status
  status:
    | "proposed"
    | "notified_sec11"
    | "surveyed_verified"
    | "objection_filed"
    | "sec19_declared"
    | "award_assessed"
    | "compensation_paid"
    | "possessed_mutated";

  // 12-Stage Hackathon Demonstration Lifecycle
  stageIndex?: number; // 1 to 12
  stageCode?: string;
  stageTitle?: string;
  rorVerification?: {
    status: "Verified" | "Pending Verification" | "Discrepancy Found";
    verificationDate: string;
    khatauniNo: string;
    verifiedBy: string;
    remarks: string;
  };
  fieldVerification?: {
    status: "Verified" | "Pending Field Survey" | "Discrepancy Found";
    surveyDate: string;
    officer: string;
    dgpsAccuracyMeters: number;
    remarks: string;
    documents: string[];
  };
  reviewDetails?: {
    status: "Approved" | "Under Review" | "Sent Back" | "Query Raised";
    reviewedBy: string;
    reviewDate: string;
    remarks: string;
  };
  notificationDetails?: {
    gazetteRef: string;
    notificationDate: string;
    status: "Issued" | "Published" | "Pending";
  };
  awardDetails?: {
    awardNumber: string;
    awardDate: string;
    sanctionedBy: string;
    status: "Pronounced" | "Pending";
  };
  disbursementDetails?: {
    txnId: string;
    amountPaidLakhs: number;
    paymentDate: string;
    paymentMode: "PFMS e-Kuber" | "Treasury Transfer";
    status: "Disbursed" | "Pending" | "Processing";
  };
  possessionDetails?: {
    memoNumber: string;
    possessionDate: string;
    handoverTo: string;
    demarcationDone: boolean;
    status: "Possession Completed" | "Pending";
  };
  rrDetails?: {
    eligibleFamiliesCount: number;
    entitlementPackage: string;
    totalAssistanceLakhs: number;
    relocationStatus: "Relocated" | "In Transit" | "Not Required";
    status: "Completed" | "In Progress" | "Exempt";
  };

  // Objections filed under Section 15
  objections?: {
    id: string;
    objectorName: string;
    dateFiled: string;
    natureOfObjection: "Valuation Rate Dispute" | "Boundary Alignment Shift" | "Tree & Well Valuation" | "Alternate Route Proposal";
    details: string;
    status: "pending_hearing" | "heard_rejected" | "heard_upheld";
    hearingDate?: string;
  }[];

  // Valuation Breakdown under RFCTLARR Act 2013
  valuation: {
    baseMarketValue: number; // Market rate × Affected Area
    ruralMultiplier: number; // 1.0 to 2.0 based on distance from urban center
    multipliedValue: number;
    solatiumAmount: number; // 100% of multiplied value under Section 30(1)
    assetsValue: number; // Trees, tube wells, farm houses
    additionalInterest: number; // 12% p.a. from Sec 11 to award under Section 30(3)
    totalCompensationPayable: number;
  };

  // Geographic Geometry [lat, lng]
  coordinates: [number, number]; // Centroid for label
  polygon: [number, number][]; // Cadastral Parcel boundary vertices
  chauhaddi: {
    north: string; // e.g. "Khasra 103 (Sunil Patil)"
    south: string; // e.g. "Village Cart Track / PWD Road"
    east: string; // e.g. "Khasra 105 (Gaikwad)"
    west: string; // e.g. "Khasra 101 (State Canal)"
  };
}

export interface BhuNakshaProject {
  id: string;
  name: string;
  projectCode: string;
  sector: "highway" | "renewable_energy" | "railway" | "irrigation";
  department: string;
  state: string;
  stateCode: string;
  district: string;
  tehsil: string;
  village: string;
  villageLgdCode: string;
  sajraSheetNumber: string;
  scaleRatio: string; // e.g. "1:2500"
  surveyYear: string; // e.g. "2023-24 DGPS / SVAMITVA"

  // Alignment Corridor Details
  corridorType: "linear_alignment" | "zonal_boundary";
  corridorWidthMeters?: number; // e.g. 60m for highway Right-of-Way
  corridorCenterline?: [number, number][];
  boundaryPolygon?: [number, number][];

  // Area & Parcel Metrics
  totalParcelsInVillageSheet: number;
  totalAffectedParcels: number;
  totalVillageAreaHa: number;
  totalAffectedAreaHa: number;
  totalUnaffectedAreaHa: number;

  // Financials (in ₹ Lakhs)
  totalEstimatedCompensationLakhs: number;
  totalCompensationDisbursedLakhs: number;

  // Statutory Progress
  currentWorkflowStageIndex: number; // 0 to 9
  currentStageName: string;
  targetCompletionDate: string;
  calaOfficer: string; // Competent Authority for Land Acquisition

  // Parcels
  parcels: BhuNakshaParcel[];
}

// ------------------------------------------------------------
// RFCTLARR 2013 Statutory Workflow Stages
// ------------------------------------------------------------
export const STATUTORY_WORKFLOW_STAGES = [
  {
    stageNumber: 1,
    code: "SEC_4_PROPOSAL",
    title: "Project Requisition & Proposal",
    actReference: "RFCTLARR 2013 Section 4",
    description: "LRB submits formal land requirement proposal with project alignment and public purpose justification.",
    responsibleAuthority: "Land Requiring Body (LRB) / District Collector",
    durationDays: 30,
    requiredDocuments: ["Form-1A Requisition", "Alignment Map", "Feasibility Report"],
  },
  {
    stageNumber: 2,
    code: "BHUNAKSHA_IDENTIFICATION",
    title: "BhuNaksha Cadastral Identification",
    actReference: "NIC BhuNaksha & SVAMITVA Cadastre",
    description: "Overlay project alignment on digitized village Sajra cadastral sheets to extract intersecting khasras.",
    responsibleAuthority: "District Land Records Officer & Survey of India",
    durationDays: 21,
    requiredDocuments: ["BhuNaksha Cadastral Sheet", "ULPIN Ledger", "Intersection Analysis"],
  },
  {
    stageNumber: 3,
    code: "JOINT_SURVEY_VERIFICATION",
    title: "Joint Measurement Survey (JMS)",
    actReference: "RFCTLARR Section 12 & State Revenue Manual",
    description: "Physical ground-truthing with DGPS / Total Station by Tehsildar & LRB engineers; tree/structure census.",
    responsibleAuthority: "Tehsildar, Talathi & LRB Engineers",
    durationDays: 45,
    requiredDocuments: ["JMS Panchnama", "Tree Census List", "Structure Valuation Report"],
  },
  {
    stageNumber: 4,
    code: "SEC_11_NOTIFICATION",
    title: "Section 11 Preliminary Notification",
    actReference: "RFCTLARR 2013 Section 11",
    description: "Publication in Official Gazette, local newspapers, and Panchayat notice boards; freezes land transactions.",
    responsibleAuthority: "District Collector / CALA",
    durationDays: 60,
    requiredDocuments: ["Gazette Notification", "Panchayat Publication Proof", "Form-4 Public Notice"],
  },
  {
    stageNumber: 5,
    code: "SEC_15_OBJECTIONS_HEARING",
    title: "Section 15 Objections & Hearing",
    actReference: "RFCTLARR 2013 Section 15",
    description: "60-day statutory window for landowners to file objections regarding public purpose, area, or valuation.",
    responsibleAuthority: "Competent Authority for Land Acquisition (CALA)",
    durationDays: 60,
    requiredDocuments: ["Objection Dossier", "Hearing Minutes", "CALA Order under Sec 15(2)"],
  },
  {
    stageNumber: 6,
    code: "SEC_19_DECLARATION",
    title: "Section 19 Final Declaration",
    actReference: "RFCTLARR 2013 Section 19",
    description: "Formal declaration that identified land is required for public purpose; must be issued within 12 months of Sec 11.",
    responsibleAuthority: "State Revenue Department / Central Ministry",
    durationDays: 30,
    requiredDocuments: ["State Gazette Declaration", "R&R Scheme Summary", "Summary of Acquisition"],
  },
  {
    stageNumber: 7,
    code: "SEC_23_VALUATION_AWARD",
    title: "Section 23 Compensation Award Inquiry",
    actReference: "RFCTLARR 2013 Section 23, 26-30",
    description: "Determination of Market Value, Rural Multiplier (1.0–2.0), 100% Solatium, Assets, and 12% interest.",
    responsibleAuthority: "District Collector & Special Land Acquisition Officer (SLAO)",
    durationDays: 45,
    requiredDocuments: ["Award Enquiry Form", "Circle Rate Index", "Comparative Sale Deeds Analysis"],
  },
  {
    stageNumber: 8,
    code: "CALA_APPROVAL_SANCTION",
    title: "Statutory Sanction & Award Pronouncement",
    actReference: "RFCTLARR 2013 Section 27 & 31",
    description: "Competent Authority sanctions final financial award; deposit of compensation amount into Escrow Account.",
    responsibleAuthority: "Competent Authority (CALA) / State Finance Dept",
    durationDays: 15,
    requiredDocuments: ["Approved Award Statement", "Treasury Escrow Deposit Challan"],
  },
  {
    stageNumber: 9,
    code: "SEC_38_POSSESSION_HANDOVER",
    title: "Section 38 Taking Possession",
    actReference: "RFCTLARR 2013 Section 38",
    description: "Collector takes possession of land free from all encumbrances after full compensation has been paid or deposited.",
    responsibleAuthority: "District Collector & LRB Representative",
    durationDays: 30,
    requiredDocuments: ["Possession Panchnama", "Handover Certificate", "Site Demarcation Map"],
  },
  {
    stageNumber: 10,
    code: "DISBURSEMENT_BHULEKH_MUTATION",
    title: "DBT Payment & Land Mutation",
    actReference: "Public Finance Management System (PFMS) & BhuNaksha GIS",
    description: "Direct Bank Transfer to verified bank accounts; revenue mutation updating BhuNaksha & Bhulekh to Govt ownership.",
    responsibleAuthority: "Tehsildar & District Treasury Officer",
    durationDays: 20,
    requiredDocuments: ["PFMS DBT Acknowledgement", "Updated Khatauni (7/12 Extract)", "Mutated BhuNaksha Cadastre"],
  },
];

// ------------------------------------------------------------
// LAMS 12-Stage End-to-End Land Acquisition Lifecycle
// ------------------------------------------------------------
export interface Lams12Stage {
  stageNumber: number; // 1 to 12
  stage?: number;
  code: string;
  title: string;
  shortTitle: string;
  actReference: string;
  legalRef?: string;
  description: string;
  demoAction: string;
  category: "pre_notification" | "verification" | "statutory" | "financial_settlement" | "possession_rr";
  badgeBg: string;
  badgeText: string;
}

export const LAMS_12_STAGES: Lams12Stage[] = [
  {
    stageNumber: 1,
    code: "proposal",
    title: "Stage 1 — Proposal",
    shortTitle: "Proposal",
    actReference: "RFCTLARR 2013 Sec 4",
    description: "Create and submit project proposal with alignment purpose, department authority, and required land estimate.",
    demoAction: "Proposal Submitted",
    category: "pre_notification",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-800",
  },
  {
    stageNumber: 2,
    code: "footprint",
    title: "Stage 2 — Project Footprint",
    shortTitle: "Footprint",
    actReference: "BhuNaksha GIS & DGPS Alignment",
    description: "Display project footprint on map with 60m highway right-of-way corridor intersecting village Sajra sheet.",
    demoAction: "Footprint Defined",
    category: "pre_notification",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
  },
  {
    stageNumber: 3,
    code: "affected",
    title: "Stage 3 — Affected Parcels",
    shortTitle: "Affected",
    actReference: "Spatial Vector Intersection",
    description: "Identify all intersecting khasras; highlight affected vs unaffected parcels with partial/full split.",
    demoAction: "Parcels Intersected",
    category: "pre_notification",
    badgeBg: "bg-red-100",
    badgeText: "text-red-800",
  },
  {
    stageNumber: 4,
    code: "ror_verified",
    title: "Stage 4 — RoR Verification",
    shortTitle: "RoR Verify",
    actReference: "Bhulekh 7/12 & Khatauni Integration",
    description: "Cross-reference computerised Record of Rights (RoR) for verified titleholders, recorded area, and bank encumbrances.",
    demoAction: "RoR Verified",
    category: "verification",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
  },
  {
    stageNumber: 5,
    code: "parcel_verified",
    title: "Stage 5 — Parcel Verification",
    shortTitle: "Parcel Verify",
    actReference: "Joint Measurement Survey (JMS)",
    description: "Detailed ground-truthing with DGPS boundary verification, tree/well census, structure valuation, and signed panchnama.",
    demoAction: "Field Verified",
    category: "verification",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
  },
  {
    stageNumber: 6,
    code: "reviewed",
    title: "Stage 6 — Parcel Review",
    shortTitle: "Review",
    actReference: "SLAO Scrutiny & Approval",
    description: "Comprehensive review of verified parcels; approve, raise queries, or mark for correction before notification.",
    demoAction: "Review Approved",
    category: "verification",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
  },
  {
    stageNumber: 7,
    code: "notified",
    title: "Stage 7 — Notification",
    shortTitle: "Notification",
    actReference: "RFCTLARR 2013 Sec 11",
    description: "Generate official Gazette acquisition notification for approved parcels, freezing private transactions.",
    demoAction: "Gazette Notified",
    category: "statutory",
    badgeBg: "bg-red-100",
    badgeText: "text-red-800",
  },
  {
    stageNumber: 8,
    code: "awarded",
    title: "Stage 8 — Award",
    shortTitle: "Award",
    actReference: "RFCTLARR 2013 Sec 23 & 31",
    description: "Pronounce formal Land Acquisition Award per parcel with legally determined compensation components by CALA.",
    demoAction: "Award Pronounced",
    category: "statutory",
    badgeBg: "bg-red-100",
    badgeText: "text-red-800",
  },
  {
    stageNumber: 9,
    code: "compensation",
    title: "Stage 9 — Compensation",
    shortTitle: "Compensation",
    actReference: "RFCTLARR 2013 Sec 26-30",
    description: "Statutory compensation computation: Base Value × 1.5 Multiplier + 100% Solatium + Attached Assets + 12% Interest.",
    demoAction: "Compensation Calculated",
    category: "financial_settlement",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
  },
  {
    stageNumber: 10,
    code: "disbursed",
    title: "Stage 10 — Disbursement",
    shortTitle: "Disbursement",
    actReference: "PFMS / e-Kuber DBT",
    description: "Direct Bank Transfer to verified bank accounts; generate transaction IDs and disbursement certificates.",
    demoAction: "Payment Disbursed",
    category: "financial_settlement",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
  },
  {
    stageNumber: 11,
    code: "possession",
    title: "Stage 11 — Possession",
    shortTitle: "Possession",
    actReference: "RFCTLARR 2013 Sec 38",
    description: "Take physical possession free from encumbrances; issue possession memo and update map to possessed state.",
    demoAction: "Possession Taken",
    category: "possession_rr",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
  },
  {
    stageNumber: 12,
    code: "rr_completed",
    title: "Stage 12 — R&R Completed",
    shortTitle: "R&R",
    actReference: "RFCTLARR 2013 Sch II & III",
    description: "Rehabilitation & Resettlement benefits for eligible affected families: subsistence grants, housing, and livelihood support.",
    demoAction: "R&R Completed",
    category: "possession_rr",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
  },
];

// ------------------------------------------------------------
// Curated Real-World BhuNaksha Projects with Cadastral Plots
// ------------------------------------------------------------

export const BHUNAKSHA_PROJECTS: BhuNakshaProject[] = [
  // ----------------------------------------------------------
  // PROJECT 1: Linear Highway Corridor Expansion
  // ----------------------------------------------------------
  {
    id: "PRJ-001",
    name: "NH-48 Greenfield Express Bypass Corridor",
    projectCode: "NH48-BYPASS-MH-2024",
    sector: "highway",
    department: "National Highways Authority of India (NHAI / MoRTH)",
    state: "Maharashtra",
    stateCode: "MH",
    district: "Nashik",
    tehsil: "Sinnar",
    village: "Musalgaon",
    villageLgdCode: "552109",
    sajraSheetNumber: "Sheet No. 02 (Re-Surveyed 2023)",
    scaleRatio: "1:2000 Cadastral Scale",
    surveyYear: "2023 DGPS Survey",
    corridorType: "linear_alignment",
    corridorWidthMeters: 60,
    corridorCenterline: [
      [19.852, 73.991],
      [19.855, 73.996],
      [19.858, 74.002],
      [19.861, 74.008],
    ],
    totalParcelsInVillageSheet: 14,
    totalAffectedParcels: 10,
    totalVillageAreaHa: 18.42,
    totalAffectedAreaHa: 9.85,
    totalUnaffectedAreaHa: 8.57,
    totalEstimatedCompensationLakhs: 4120.5,
    totalCompensationDisbursedLakhs: 2850.0,
    currentWorkflowStageIndex: 6, // At Section 23 Award stage
    currentStageName: "Section 23 Compensation Award Inquiry",
    targetCompletionDate: "2025-11-30",
    calaOfficer: "Shri Jalaj Sharma, IAS (Collector & CALA Nashik)",
    parcels: [
      {
        id: "BN-001-101",
        projectId: "PRJ-001",
        khasraNumber: "101",
        surveyNumber: "Gat No. 101",
        ulpin: "MH240019284701",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 1.25,
        recordedRoRAreaHa: 1.25,
        areaSqMeters: 12500,
        dimensions: "125m × 100m",
        landClassification: "irrigated_agricultural",
        soilClass: "Bagayat (Perennial Well Irrigated)",
        circleRatePerHa: 3200000,
        guidanceValuePerSqM: 320,
        owners: [
          {
            name: "Rameshwar Bhaurao Patil",
            fatherOrHusbandName: "Bhaurao Patil",
            sharePercentage: 50,
            khatauniNumber: "KH-412",
            casteCategory: "General",
            contactNumber: "+91 98221 44510",
          },
          {
            name: "Suresh Bhaurao Patil",
            fatherOrHusbandName: "Bhaurao Patil",
            sharePercentage: 50,
            khatauniNumber: "KH-412",
            casteCategory: "General",
            contactNumber: "+91 98221 44511",
          },
        ],
        isAffected: true,
        affectedAreaHa: 1.25,
        affectedAreaPercentage: 100,
        residualAreaHa: 0.0,
        acquisitionType: "full",
        severanceClaimEligible: false,
        status: "award_assessed",
        valuation: {
          baseMarketValue: 4000000,
          ruralMultiplier: 1.5,
          multipliedValue: 6000000,
          solatiumAmount: 6000000,
          assetsValue: 850000, // 1 Borewell + 42 Pomegranate Trees
          additionalInterest: 720000,
          totalCompensationPayable: 13570000,
        },
        coordinates: [19.853, 73.992],
        polygon: [
          [19.8515, 73.9905],
          [19.8545, 73.9905],
          [19.8545, 73.9935],
          [19.8515, 73.9935],
        ],
        chauhaddi: {
          north: "Khasra 102 (Deshmukh)",
          south: "Village Cart Track / Gaothan",
          east: "Khasra 104 (Gaikwad)",
          west: "Canal Distributary No. 4",
        },
      },
      {
        id: "BN-001-102-1",
        projectId: "PRJ-001",
        khasraNumber: "102/1",
        surveyNumber: "Gat No. 102 Part A",
        ulpin: "MH240019284702",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 1.1,
        recordedRoRAreaHa: 1.1,
        areaSqMeters: 11000,
        dimensions: "110m × 100m",
        landClassification: "irrigated_agricultural",
        soilClass: "Bagayat (Drip Irrigated Vineyards)",
        circleRatePerHa: 3200000,
        guidanceValuePerSqM: 320,
        owners: [
          {
            name: "Sunil Baburao Deshmukh",
            fatherOrHusbandName: "Baburao Deshmukh",
            sharePercentage: 100,
            khatauniNumber: "KH-518",
            casteCategory: "General",
            contactNumber: "+91 94220 88231",
          },
        ],
        isAffected: true,
        affectedAreaHa: 0.72,
        affectedAreaPercentage: 65.5,
        residualAreaHa: 0.38,
        acquisitionType: "partial",
        severanceClaimEligible: false,
        status: "award_assessed",
        valuation: {
          baseMarketValue: 2304000,
          ruralMultiplier: 1.5,
          multipliedValue: 3456000,
          solatiumAmount: 3456000,
          assetsValue: 620000, // Grape trellis structure
          additionalInterest: 414720,
          totalCompensationPayable: 7946720,
        },
        coordinates: [19.856, 73.992],
        polygon: [
          [19.8545, 73.9905],
          [19.8575, 73.9905],
          [19.8575, 73.9935],
          [19.8545, 73.9935],
        ],
        chauhaddi: {
          north: "Khasra 103 (Wagh)",
          south: "Khasra 101 (Patil)",
          east: "Khasra 105 (Sanap)",
          west: "Canal Distributary No. 4",
        },
      },
      {
        id: "BN-001-102-2",
        projectId: "PRJ-001",
        khasraNumber: "102/2",
        surveyNumber: "Gat No. 102 Part B",
        ulpin: "MH240019284703",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 0.95,
        recordedRoRAreaHa: 0.95,
        areaSqMeters: 9500,
        dimensions: "95m × 100m",
        landClassification: "rainfed_dryland",
        soilClass: "Jirayat Class II",
        circleRatePerHa: 2600000,
        guidanceValuePerSqM: 260,
        owners: [
          {
            name: "Kisan Tukaram Wagh",
            fatherOrHusbandName: "Tukaram Wagh",
            sharePercentage: 100,
            khatauniNumber: "KH-520",
            casteCategory: "OBC",
          },
        ],
        isAffected: false,
        affectedAreaHa: 0.0,
        affectedAreaPercentage: 0,
        residualAreaHa: 0.95,
        acquisitionType: "unaffected",
        severanceClaimEligible: false,
        status: "proposed",
        valuation: {
          baseMarketValue: 0,
          ruralMultiplier: 1.5,
          multipliedValue: 0,
          solatiumAmount: 0,
          assetsValue: 0,
          additionalInterest: 0,
          totalCompensationPayable: 0,
        },
        coordinates: [19.859, 73.992],
        polygon: [
          [19.8575, 73.9905],
          [19.8605, 73.9905],
          [19.8605, 73.9935],
          [19.8575, 73.9935],
        ],
        chauhaddi: {
          north: "Village Boundary (Musalgaon-Gonde)",
          south: "Khasra 102/1 (Deshmukh)",
          east: "Khasra 106 (Jadhav)",
          west: "Forest Reserve Block 12",
        },
      },
      {
        id: "BN-001-104",
        projectId: "PRJ-001",
        khasraNumber: "104",
        surveyNumber: "Gat No. 104",
        ulpin: "MH240019284704",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 1.4,
        recordedRoRAreaHa: 1.4,
        areaSqMeters: 14000,
        dimensions: "140m × 100m",
        landClassification: "irrigated_agricultural",
        soilClass: "Bagayat Class I",
        circleRatePerHa: 3200000,
        guidanceValuePerSqM: 320,
        owners: [
          {
            name: "Priya Vasant Gaikwad",
            fatherOrHusbandName: "Vasant Gaikwad",
            sharePercentage: 60,
            khatauniNumber: "KH-610",
            casteCategory: "General",
          },
          {
            name: "Ashok Vasant Gaikwad",
            fatherOrHusbandName: "Vasant Gaikwad",
            sharePercentage: 40,
            khatauniNumber: "KH-610",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 1.15,
        affectedAreaPercentage: 82.1,
        residualAreaHa: 0.25,
        acquisitionType: "partial",
        severanceClaimEligible: false,
        status: "objection_filed",
        objections: [
          {
            id: "OBJ-104-01",
            objectorName: "Priya Vasant Gaikwad",
            dateFiled: "2024-07-15",
            natureOfObjection: "Valuation Rate Dispute",
            details: "Recorded circle rate does not account for 2023 high-density pomegranate plantation and drip irrigation equipment valued at ₹9.5 Lakhs.",
            status: "pending_hearing",
            hearingDate: "2024-10-12",
          },
        ],
        valuation: {
          baseMarketValue: 3680000,
          ruralMultiplier: 1.5,
          multipliedValue: 5520000,
          solatiumAmount: 5520000,
          assetsValue: 950000,
          additionalInterest: 662400,
          totalCompensationPayable: 12652400,
        },
        coordinates: [19.853, 73.995],
        polygon: [
          [19.8515, 73.9935],
          [19.8545, 73.9935],
          [19.8545, 73.9965],
          [19.8515, 73.9965],
        ],
        chauhaddi: {
          north: "Khasra 105 (Sanap)",
          south: "State Highway 30",
          east: "Khasra 107 (Pawar)",
          west: "Khasra 101 (Patil)",
        },
      },
      {
        id: "BN-001-105",
        projectId: "PRJ-001",
        khasraNumber: "105",
        surveyNumber: "Gat No. 105",
        ulpin: "MH240019284705",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 1.35,
        recordedRoRAreaHa: 1.35,
        areaSqMeters: 13500,
        dimensions: "135m × 100m",
        landClassification: "irrigated_agricultural",
        soilClass: "Bagayat (Onion & Soybean Belt)",
        circleRatePerHa: 3200000,
        guidanceValuePerSqM: 320,
        owners: [
          {
            name: "Dnyaneshwar Mahadu Sanap",
            fatherOrHusbandName: "Mahadu Sanap",
            sharePercentage: 100,
            khatauniNumber: "KH-614",
            casteCategory: "OBC",
          },
        ],
        isAffected: true,
        affectedAreaHa: 1.35,
        affectedAreaPercentage: 100,
        residualAreaHa: 0.0,
        acquisitionType: "full",
        severanceClaimEligible: false,
        status: "sec19_declared",
        valuation: {
          baseMarketValue: 4320000,
          ruralMultiplier: 1.5,
          multipliedValue: 6480000,
          solatiumAmount: 6480000,
          assetsValue: 420000, // Farm storage shed
          additionalInterest: 777600,
          totalCompensationPayable: 14157600,
        },
        coordinates: [19.856, 73.995],
        polygon: [
          [19.8545, 73.9935],
          [19.8575, 73.9935],
          [19.8575, 73.9965],
          [19.8545, 73.9965],
        ],
        chauhaddi: {
          north: "Khasra 106 (Jadhav)",
          south: "Khasra 104 (Gaikwad)",
          east: "Khasra 108 (Gram Sabha)",
          west: "Khasra 102/1 (Deshmukh)",
        },
      },
      {
        id: "BN-001-106",
        projectId: "PRJ-001",
        khasraNumber: "106",
        surveyNumber: "Gat No. 106",
        ulpin: "MH240019284706",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 1.2,
        recordedRoRAreaHa: 1.2,
        areaSqMeters: 12000,
        dimensions: "120m × 100m",
        landClassification: "rainfed_dryland",
        soilClass: "Jirayat Class I",
        circleRatePerHa: 2600000,
        guidanceValuePerSqM: 260,
        owners: [
          {
            name: "Anandrao Namdeo Jadhav",
            fatherOrHusbandName: "Namdeo Jadhav",
            sharePercentage: 100,
            khatauniNumber: "KH-622",
            casteCategory: "General",
          },
        ],
        isAffected: false,
        affectedAreaHa: 0.0,
        affectedAreaPercentage: 0,
        residualAreaHa: 1.2,
        acquisitionType: "unaffected",
        severanceClaimEligible: false,
        status: "proposed",
        valuation: {
          baseMarketValue: 0,
          ruralMultiplier: 1.5,
          multipliedValue: 0,
          solatiumAmount: 0,
          assetsValue: 0,
          additionalInterest: 0,
          totalCompensationPayable: 0,
        },
        coordinates: [19.859, 73.995],
        polygon: [
          [19.8575, 73.9935],
          [19.8605, 73.9935],
          [19.8605, 73.9965],
          [19.8575, 73.9965],
        ],
        chauhaddi: {
          north: "Boundary Musalgaon Village",
          south: "Khasra 105 (Sanap)",
          east: "Khasra 109 (Shinde)",
          west: "Khasra 102/2 (Wagh)",
        },
      },
      {
        id: "BN-001-107",
        projectId: "PRJ-001",
        khasraNumber: "107",
        surveyNumber: "Gat No. 107",
        ulpin: "MH240019284707",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 1.5,
        recordedRoRAreaHa: 1.5,
        areaSqMeters: 15000,
        dimensions: "150m × 100m",
        landClassification: "non_agricultural_commercial",
        soilClass: "NA Commercial (Highway Roadside)",
        circleRatePerHa: 5800000,
        guidanceValuePerSqM: 580,
        owners: [
          {
            name: "Rajendra Kashinath Pawar",
            fatherOrHusbandName: "Kashinath Pawar",
            sharePercentage: 100,
            khatauniNumber: "KH-705",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 1.5,
        affectedAreaPercentage: 100,
        residualAreaHa: 0.0,
        acquisitionType: "full",
        severanceClaimEligible: false,
        status: "compensation_paid",
        valuation: {
          baseMarketValue: 8700000,
          ruralMultiplier: 1.5,
          multipliedValue: 13050000,
          solatiumAmount: 13050000,
          assetsValue: 1850000, // Commercial weighbridge & boundary wall
          additionalInterest: 1566000,
          totalCompensationPayable: 29516000,
        },
        coordinates: [19.853, 73.998],
        polygon: [
          [19.8515, 73.9965],
          [19.8545, 73.9965],
          [19.8545, 73.9995],
          [19.8515, 73.9995],
        ],
        chauhaddi: {
          north: "Khasra 108 (Gram Sabha)",
          south: "State Highway 30",
          east: "Khasra 110 (Chavan)",
          west: "Khasra 104 (Gaikwad)",
        },
      },
      {
        id: "BN-001-108",
        projectId: "PRJ-001",
        khasraNumber: "108",
        surveyNumber: "Gat No. 108 (Gaikran)",
        ulpin: "MH240019284708",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 2.1,
        recordedRoRAreaHa: 2.1,
        areaSqMeters: 21000,
        dimensions: "210m × 100m",
        landClassification: "gram_sabha_revenue",
        soilClass: "Government Revenue / Charnot (Grazing)",
        circleRatePerHa: 2200000,
        guidanceValuePerSqM: 220,
        owners: [
          {
            name: "Gram Panchayat Musalgaon / Government of Maharashtra",
            fatherOrHusbandName: "Public Authority",
            sharePercentage: 100,
            khatauniNumber: "GOV-01",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 1.45,
        affectedAreaPercentage: 69.0,
        residualAreaHa: 0.65,
        acquisitionType: "partial",
        severanceClaimEligible: false,
        status: "possessed_mutated",
        valuation: {
          baseMarketValue: 3190000,
          ruralMultiplier: 1.0, // Inter-departmental transfer factor
          multipliedValue: 3190000,
          solatiumAmount: 0, // Exempt for government land transfer
          assetsValue: 120000, // Community water pond
          additionalInterest: 0,
          totalCompensationPayable: 3310000,
        },
        coordinates: [19.856, 73.998],
        polygon: [
          [19.8545, 73.9965],
          [19.8575, 73.9965],
          [19.8575, 73.9995],
          [19.8545, 73.9995],
        ],
        chauhaddi: {
          north: "Khasra 109 (Shinde)",
          south: "Khasra 107 (Pawar)",
          east: "Khasra 111 (Borse)",
          west: "Khasra 105 (Sanap)",
        },
      },
      {
        id: "BN-001-109",
        projectId: "PRJ-001",
        khasraNumber: "109",
        surveyNumber: "Gat No. 109",
        ulpin: "MH240019284709",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 1.15,
        recordedRoRAreaHa: 1.15,
        areaSqMeters: 11500,
        dimensions: "115m × 100m",
        landClassification: "rainfed_dryland",
        soilClass: "Jirayat Class II",
        circleRatePerHa: 2600000,
        guidanceValuePerSqM: 260,
        owners: [
          {
            name: "Ramdas Bansi Shinde",
            fatherOrHusbandName: "Bansi Shinde",
            sharePercentage: 100,
            khatauniNumber: "KH-740",
            casteCategory: "General",
          },
        ],
        isAffected: false,
        affectedAreaHa: 0.0,
        affectedAreaPercentage: 0,
        residualAreaHa: 1.15,
        acquisitionType: "unaffected",
        severanceClaimEligible: false,
        status: "proposed",
        valuation: {
          baseMarketValue: 0,
          ruralMultiplier: 1.5,
          multipliedValue: 0,
          solatiumAmount: 0,
          assetsValue: 0,
          additionalInterest: 0,
          totalCompensationPayable: 0,
        },
        coordinates: [19.859, 73.998],
        polygon: [
          [19.8575, 73.9965],
          [19.8605, 73.9965],
          [19.8605, 73.9995],
          [19.8575, 73.9995],
        ],
        chauhaddi: {
          north: "Village Boundary Musalgaon",
          south: "Khasra 108 (Gram Sabha)",
          east: "Khasra 112 (Waje)",
          west: "Khasra 106 (Jadhav)",
        },
      },
      {
        id: "BN-001-110",
        projectId: "PRJ-001",
        khasraNumber: "110",
        surveyNumber: "Gat No. 110",
        ulpin: "MH240019284710",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 1.3,
        recordedRoRAreaHa: 1.3,
        areaSqMeters: 13000,
        dimensions: "130m × 100m",
        landClassification: "irrigated_agricultural",
        soilClass: "Bagayat Class I",
        circleRatePerHa: 3200000,
        guidanceValuePerSqM: 320,
        owners: [
          {
            name: "Sambhaji Vishwanath Chavan",
            fatherOrHusbandName: "Vishwanath Chavan",
            sharePercentage: 100,
            khatauniNumber: "KH-802",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 1.3,
        affectedAreaPercentage: 100,
        residualAreaHa: 0.0,
        acquisitionType: "full",
        severanceClaimEligible: false,
        status: "award_assessed",
        valuation: {
          baseMarketValue: 4160000,
          ruralMultiplier: 1.5,
          multipliedValue: 6240000,
          solatiumAmount: 6240000,
          assetsValue: 530000, // 2 Open wells + irrigation pipeline
          additionalInterest: 748800,
          totalCompensationPayable: 13758800,
        },
        coordinates: [19.853, 74.001],
        polygon: [
          [19.8515, 73.9995],
          [19.8545, 73.9995],
          [19.8545, 74.0025],
          [19.8515, 74.0025],
        ],
        chauhaddi: {
          north: "Khasra 111 (Borse)",
          south: "State Highway 30",
          east: "Khasra 113 (Khairnar)",
          west: "Khasra 107 (Pawar)",
        },
      },
      {
        id: "BN-001-111",
        projectId: "PRJ-001",
        khasraNumber: "111",
        surveyNumber: "Gat No. 111",
        ulpin: "MH240019284711",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 1.25,
        recordedRoRAreaHa: 1.25,
        areaSqMeters: 12500,
        dimensions: "125m × 100m",
        landClassification: "irrigated_agricultural",
        soilClass: "Bagayat Class I",
        circleRatePerHa: 3200000,
        guidanceValuePerSqM: 320,
        owners: [
          {
            name: "Vijay Pandurang Borse",
            fatherOrHusbandName: "Pandurang Borse",
            sharePercentage: 100,
            khatauniNumber: "KH-815",
            casteCategory: "OBC",
          },
        ],
        isAffected: true,
        affectedAreaHa: 0.95,
        affectedAreaPercentage: 76.0,
        residualAreaHa: 0.3,
        acquisitionType: "partial",
        severanceClaimEligible: false,
        status: "surveyed_verified",
        valuation: {
          baseMarketValue: 3040000,
          ruralMultiplier: 1.5,
          multipliedValue: 4560000,
          solatiumAmount: 4560000,
          assetsValue: 310000,
          additionalInterest: 547200,
          totalCompensationPayable: 9977200,
        },
        coordinates: [19.856, 74.001],
        polygon: [
          [19.8545, 73.9995],
          [19.8575, 73.9995],
          [19.8575, 74.0025],
          [19.8545, 74.0025],
        ],
        chauhaddi: {
          north: "Khasra 112 (Waje)",
          south: "Khasra 110 (Chavan)",
          east: "Khasra 114 (Nalawade)",
          west: "Khasra 108 (Gram Sabha)",
        },
      },
      {
        id: "BN-001-112",
        projectId: "PRJ-001",
        khasraNumber: "112",
        surveyNumber: "Gat No. 112",
        ulpin: "MH240019284712",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 1.1,
        recordedRoRAreaHa: 1.1,
        areaSqMeters: 11000,
        dimensions: "110m × 100m",
        landClassification: "rainfed_dryland",
        soilClass: "Jirayat Class II",
        circleRatePerHa: 2600000,
        guidanceValuePerSqM: 260,
        owners: [
          {
            name: "Nivruti Bhikaji Waje",
            fatherOrHusbandName: "Bhikaji Waje",
            sharePercentage: 100,
            khatauniNumber: "KH-830",
            casteCategory: "General",
          },
        ],
        isAffected: false,
        affectedAreaHa: 0.0,
        affectedAreaPercentage: 0,
        residualAreaHa: 1.1,
        acquisitionType: "unaffected",
        severanceClaimEligible: false,
        status: "proposed",
        valuation: {
          baseMarketValue: 0,
          ruralMultiplier: 1.5,
          multipliedValue: 0,
          solatiumAmount: 0,
          assetsValue: 0,
          additionalInterest: 0,
          totalCompensationPayable: 0,
        },
        coordinates: [19.859, 74.001],
        polygon: [
          [19.8575, 73.9995],
          [19.8605, 73.9995],
          [19.8605, 74.0025],
          [19.8575, 74.0025],
        ],
        chauhaddi: {
          north: "Village Boundary",
          south: "Khasra 111 (Borse)",
          east: "Village Forest Patch",
          west: "Khasra 109 (Shinde)",
        },
      },
      {
        id: "BN-001-113",
        projectId: "PRJ-001",
        khasraNumber: "113",
        surveyNumber: "Gat No. 113",
        ulpin: "MH240019284713",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 0.88,
        recordedRoRAreaHa: 0.88,
        areaSqMeters: 8800,
        dimensions: "88m × 100m",
        landClassification: "irrigated_agricultural",
        soilClass: "Bagayat Class I",
        circleRatePerHa: 3200000,
        guidanceValuePerSqM: 320,
        owners: [
          {
            name: "Dattatraya Baban Khairnar",
            fatherOrHusbandName: "Baban Khairnar",
            sharePercentage: 100,
            khatauniNumber: "KH-842",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 0.73,
        affectedAreaPercentage: 83.0,
        residualAreaHa: 0.15,
        acquisitionType: "partial",
        severanceClaimEligible: true, // Residual < 0.2 Ha
        status: "surveyed_verified",
        valuation: {
          baseMarketValue: 2336000,
          ruralMultiplier: 1.5,
          multipliedValue: 3504000,
          solatiumAmount: 3504000,
          assetsValue: 240000,
          additionalInterest: 420480,
          totalCompensationPayable: 7668480,
        },
        coordinates: [19.853, 74.004],
        polygon: [
          [19.8515, 74.0025],
          [19.8545, 74.0025],
          [19.8545, 74.0055],
          [19.8515, 74.0055],
        ],
        chauhaddi: {
          north: "Khasra 114 (Nalawade)",
          south: "State Highway 30",
          east: "Village Approach Road",
          west: "Khasra 110 (Chavan)",
        },
      },
      {
        id: "BN-001-114",
        projectId: "PRJ-001",
        khasraNumber: "114",
        surveyNumber: "Gat No. 114",
        ulpin: "MH240019284714",
        village: "Musalgaon",
        villageLgdCode: "552109",
        sheetNumber: "Sheet 02",
        tehsil: "Sinnar",
        district: "Nashik",
        state: "Maharashtra",
        stateCode: "MH",
        gisCalculatedAreaHa: 0.89,
        recordedRoRAreaHa: 0.89,
        areaSqMeters: 8900,
        dimensions: "89m × 100m",
        landClassification: "irrigated_agricultural",
        soilClass: "Bagayat Class I",
        circleRatePerHa: 3200000,
        guidanceValuePerSqM: 320,
        owners: [
          {
            name: "Bhagwan Trimbak Nalawade",
            fatherOrHusbandName: "Trimbak Nalawade",
            sharePercentage: 100,
            khatauniNumber: "KH-855",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 0.45,
        affectedAreaPercentage: 50.5,
        residualAreaHa: 0.44,
        acquisitionType: "partial",
        severanceClaimEligible: false,
        status: "notified_sec11",
        valuation: {
          baseMarketValue: 1440000,
          ruralMultiplier: 1.5,
          multipliedValue: 2160000,
          solatiumAmount: 2160000,
          assetsValue: 180000,
          additionalInterest: 259200,
          totalCompensationPayable: 4759200,
        },
        coordinates: [19.856, 74.004],
        polygon: [
          [19.8545, 74.0025],
          [19.8575, 74.0025],
          [19.8575, 74.0055],
          [19.8545, 74.0055],
        ],
        chauhaddi: {
          north: "Village Boundary",
          south: "Khasra 113 (Khairnar)",
          east: "Panchayat Wells",
          west: "Khasra 111 (Borse)",
        },
      },
    ],
  },

  // ----------------------------------------------------------
  // PROJECT 2: Renewable Energy Zonal Solar Substation
  // ----------------------------------------------------------
  {
    id: "PRJ-002",
    name: "Rewa Ultra-Mega Clean Energy Solar Evacuation Substation",
    projectCode: "RUMSL-REWA-MP-2024",
    sector: "renewable_energy",
    department: "Rewa Ultra Mega Solar Limited (RUMSL / MP Urja Vikas Nigam)",
    state: "Madhya Pradesh",
    stateCode: "MP",
    district: "Rewa",
    tehsil: "Gurh",
    village: "Badwar",
    villageLgdCode: "481920",
    sajraSheetNumber: "Sheet No. 01 (Digital Sajra MP-Bhunaksha)",
    scaleRatio: "1:2500 Scale",
    surveyYear: "2024 Drone Resurvey",
    corridorType: "zonal_boundary",
    boundaryPolygon: [
      [24.515, 81.335],
      [24.525, 81.335],
      [24.525, 81.348],
      [24.515, 81.348],
    ],
    totalParcelsInVillageSheet: 12,
    totalAffectedParcels: 8,
    totalVillageAreaHa: 26.5,
    totalAffectedAreaHa: 18.2,
    totalUnaffectedAreaHa: 8.3,
    totalEstimatedCompensationLakhs: 2150.0,
    totalCompensationDisbursedLakhs: 1420.0,
    currentWorkflowStageIndex: 3, // At Section 11 Notification
    currentStageName: "Section 11 Preliminary Notification",
    targetCompletionDate: "2026-03-31",
    calaOfficer: "Smt. Pratibha Pal, IAS (Collector Rewa)",
    parcels: [
      {
        id: "BN-002-201",
        projectId: "PRJ-002",
        khasraNumber: "201",
        surveyNumber: "Khasra 201/1",
        ulpin: "MP230048192001",
        village: "Badwar",
        villageLgdCode: "481920",
        sheetNumber: "Sheet 01",
        tehsil: "Gurh",
        district: "Rewa",
        state: "Madhya Pradesh",
        stateCode: "MP",
        gisCalculatedAreaHa: 2.5,
        recordedRoRAreaHa: 2.5,
        areaSqMeters: 25000,
        dimensions: "160m × 155m",
        landClassification: "barren_wasteland",
        soilClass: "Pathar / Banjar (Rocky Wasteland)",
        circleRatePerHa: 1200000,
        guidanceValuePerSqM: 120,
        owners: [
          {
            name: "Ramkripal Shivprasad Tiwari",
            fatherOrHusbandName: "Shivprasad Tiwari",
            sharePercentage: 100,
            khatauniNumber: "KH-102",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 2.5,
        affectedAreaPercentage: 100,
        residualAreaHa: 0.0,
        acquisitionType: "full",
        severanceClaimEligible: false,
        status: "notified_sec11",
        valuation: {
          baseMarketValue: 3000000,
          ruralMultiplier: 1.5,
          multipliedValue: 4500000,
          solatiumAmount: 4500000,
          assetsValue: 0,
          additionalInterest: 360000,
          totalCompensationPayable: 9360000,
        },
        coordinates: [24.518, 81.338],
        polygon: [
          [24.516, 81.336],
          [24.52, 81.336],
          [24.52, 81.34],
          [24.516, 81.34],
        ],
        chauhaddi: {
          north: "Khasra 202 (Govt Revenue)",
          south: "Village Cart Track",
          east: "Khasra 204 (Shukla)",
          west: "State Highway 9",
        },
      },
      {
        id: "BN-002-202",
        projectId: "PRJ-002",
        khasraNumber: "202",
        surveyNumber: "Khasra 202 (Nazul)",
        ulpin: "MP230048192002",
        village: "Badwar",
        villageLgdCode: "481920",
        sheetNumber: "Sheet 01",
        tehsil: "Gurh",
        district: "Rewa",
        state: "Madhya Pradesh",
        stateCode: "MP",
        gisCalculatedAreaHa: 4.2,
        recordedRoRAreaHa: 4.2,
        areaSqMeters: 42000,
        dimensions: "210m × 200m",
        landClassification: "gram_sabha_revenue",
        soilClass: "Government Revenue Nazul",
        circleRatePerHa: 1000000,
        guidanceValuePerSqM: 100,
        owners: [
          {
            name: "Revenue Department, Govt of Madhya Pradesh",
            fatherOrHusbandName: "State Government",
            sharePercentage: 100,
            khatauniNumber: "GOV-MP-01",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 4.2,
        affectedAreaPercentage: 100,
        residualAreaHa: 0.0,
        acquisitionType: "full",
        severanceClaimEligible: false,
        status: "possessed_mutated",
        valuation: {
          baseMarketValue: 4200000,
          ruralMultiplier: 1.0,
          multipliedValue: 4200000,
          solatiumAmount: 0,
          assetsValue: 0,
          additionalInterest: 0,
          totalCompensationPayable: 4200000,
        },
        coordinates: [24.522, 81.338],
        polygon: [
          [24.52, 81.336],
          [24.524, 81.336],
          [24.524, 81.34],
          [24.52, 81.34],
        ],
        chauhaddi: {
          north: "Badwar Hill Ridge",
          south: "Khasra 201 (Tiwari)",
          east: "Khasra 205 (Govt Grazing)",
          west: "State Highway 9",
        },
      },
      {
        id: "BN-002-203",
        projectId: "PRJ-002",
        khasraNumber: "203",
        surveyNumber: "Khasra 203",
        ulpin: "MP230048192003",
        village: "Badwar",
        villageLgdCode: "481920",
        sheetNumber: "Sheet 01",
        tehsil: "Gurh",
        district: "Rewa",
        state: "Madhya Pradesh",
        stateCode: "MP",
        gisCalculatedAreaHa: 1.8,
        recordedRoRAreaHa: 1.8,
        areaSqMeters: 18000,
        dimensions: "150m × 120m",
        landClassification: "rainfed_dryland",
        soilClass: "Single Crop Rainfed Dryland",
        circleRatePerHa: 1400000,
        guidanceValuePerSqM: 140,
        owners: [
          {
            name: "Ramnaresh Badriprasad Shukla",
            fatherOrHusbandName: "Badriprasad Shukla",
            sharePercentage: 100,
            khatauniNumber: "KH-188",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 1.8,
        affectedAreaPercentage: 100,
        residualAreaHa: 0.0,
        acquisitionType: "full",
        severanceClaimEligible: false,
        status: "surveyed_verified",
        valuation: {
          baseMarketValue: 2520000,
          ruralMultiplier: 1.5,
          multipliedValue: 3780000,
          solatiumAmount: 3780000,
          assetsValue: 150000,
          additionalInterest: 302400,
          totalCompensationPayable: 8012400,
        },
        coordinates: [24.518, 81.342],
        polygon: [
          [24.516, 81.34],
          [24.52, 81.34],
          [24.52, 81.344],
          [24.516, 81.344],
        ],
        chauhaddi: {
          north: "Khasra 205 (Grazing land)",
          south: "Village Nullah",
          east: "Khasra 206 (Kol)",
          west: "Khasra 201 (Tiwari)",
        },
      },
      {
        id: "BN-002-204",
        projectId: "PRJ-002",
        khasraNumber: "204",
        surveyNumber: "Khasra 204",
        ulpin: "MP230048192004",
        village: "Badwar",
        villageLgdCode: "481920",
        sheetNumber: "Sheet 01",
        tehsil: "Gurh",
        district: "Rewa",
        state: "Madhya Pradesh",
        stateCode: "MP",
        gisCalculatedAreaHa: 1.6,
        recordedRoRAreaHa: 1.6,
        areaSqMeters: 16000,
        dimensions: "140m × 115m",
        landClassification: "rainfed_dryland",
        soilClass: "Dryland Jirayat",
        circleRatePerHa: 1400000,
        guidanceValuePerSqM: 140,
        owners: [
          {
            name: "Ramkhelawan Mahabir Kol",
            fatherOrHusbandName: "Mahabir Kol",
            sharePercentage: 100,
            khatauniNumber: "KH-210",
            casteCategory: "ST", // Tribal land protection under Section 41
          },
        ],
        isAffected: true,
        affectedAreaHa: 1.6,
        affectedAreaPercentage: 100,
        residualAreaHa: 0.0,
        acquisitionType: "full",
        severanceClaimEligible: false,
        status: "notified_sec11",
        valuation: {
          baseMarketValue: 2240000,
          ruralMultiplier: 1.5,
          multipliedValue: 3360000,
          solatiumAmount: 3360000,
          assetsValue: 120000,
          additionalInterest: 268800,
          totalCompensationPayable: 7108800,
        },
        coordinates: [24.518, 81.346],
        polygon: [
          [24.516, 81.344],
          [24.52, 81.344],
          [24.52, 81.348],
          [24.516, 81.348],
        ],
        chauhaddi: {
          north: "Khasra 207 (Gautam)",
          south: "Village Nullah",
          east: "Panchayat Pasture",
          west: "Khasra 203 (Shukla)",
        },
      },
      {
        id: "BN-002-205",
        projectId: "PRJ-002",
        khasraNumber: "205",
        surveyNumber: "Khasra 205 (Gair Mumkin)",
        ulpin: "MP230048192005",
        village: "Badwar",
        villageLgdCode: "481920",
        sheetNumber: "Sheet 01",
        tehsil: "Gurh",
        district: "Rewa",
        state: "Madhya Pradesh",
        stateCode: "MP",
        gisCalculatedAreaHa: 3.5,
        recordedRoRAreaHa: 3.5,
        areaSqMeters: 35000,
        dimensions: "190m × 185m",
        landClassification: "gram_sabha_revenue",
        soilClass: "Gram Sabha Pasture",
        circleRatePerHa: 1000000,
        guidanceValuePerSqM: 100,
        owners: [
          {
            name: "Gram Sabha Badwar",
            fatherOrHusbandName: "Community Land",
            sharePercentage: 100,
            khatauniNumber: "GOV-MP-02",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 3.5,
        affectedAreaPercentage: 100,
        residualAreaHa: 0.0,
        acquisitionType: "full",
        severanceClaimEligible: false,
        status: "surveyed_verified",
        valuation: {
          baseMarketValue: 3500000,
          ruralMultiplier: 1.0,
          multipliedValue: 3500000,
          solatiumAmount: 0,
          assetsValue: 0,
          additionalInterest: 0,
          totalCompensationPayable: 3500000,
        },
        coordinates: [24.522, 81.342],
        polygon: [
          [24.52, 81.34],
          [24.524, 81.34],
          [24.524, 81.344],
          [24.52, 81.344],
        ],
        chauhaddi: {
          north: "Badwar Hill Ridge",
          south: "Khasra 203 (Shukla)",
          east: "Khasra 207 (Gautam)",
          west: "Khasra 202 (Nazul)",
        },
      },
      {
        id: "BN-002-206",
        projectId: "PRJ-002",
        khasraNumber: "206",
        surveyNumber: "Khasra 206",
        ulpin: "MP230048192006",
        village: "Badwar",
        villageLgdCode: "481920",
        sheetNumber: "Sheet 01",
        tehsil: "Gurh",
        district: "Rewa",
        state: "Madhya Pradesh",
        stateCode: "MP",
        gisCalculatedAreaHa: 2.1,
        recordedRoRAreaHa: 2.1,
        areaSqMeters: 21000,
        dimensions: "150m × 140m",
        landClassification: "barren_wasteland",
        soilClass: "Rocky Outcrop Banjar",
        circleRatePerHa: 1200000,
        guidanceValuePerSqM: 120,
        owners: [
          {
            name: "Kamleshwar Prasad Gautam",
            fatherOrHusbandName: "Prasad Gautam",
            sharePercentage: 100,
            khatauniNumber: "KH-240",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 2.1,
        affectedAreaPercentage: 100,
        residualAreaHa: 0.0,
        acquisitionType: "full",
        severanceClaimEligible: false,
        status: "notified_sec11",
        valuation: {
          baseMarketValue: 2520000,
          ruralMultiplier: 1.5,
          multipliedValue: 3780000,
          solatiumAmount: 3780000,
          assetsValue: 0,
          additionalInterest: 302400,
          totalCompensationPayable: 7862400,
        },
        coordinates: [24.522, 81.346],
        polygon: [
          [24.52, 81.344],
          [24.524, 81.344],
          [24.524, 81.348],
          [24.52, 81.348],
        ],
        chauhaddi: {
          north: "Badwar Hill Ridge",
          south: "Khasra 204 (Kol)",
          east: "Panchayat Pasture",
          west: "Khasra 205 (Grazing)",
        },
      },
      {
        id: "BN-002-207",
        projectId: "PRJ-002",
        khasraNumber: "207",
        surveyNumber: "Khasra 207",
        ulpin: "MP230048192007",
        village: "Badwar",
        villageLgdCode: "481920",
        sheetNumber: "Sheet 01",
        tehsil: "Gurh",
        district: "Rewa",
        state: "Madhya Pradesh",
        stateCode: "MP",
        gisCalculatedAreaHa: 1.5,
        recordedRoRAreaHa: 1.5,
        areaSqMeters: 15000,
        dimensions: "130m × 115m",
        landClassification: "rainfed_dryland",
        soilClass: "Jirayat Class I",
        circleRatePerHa: 1400000,
        guidanceValuePerSqM: 140,
        owners: [
          {
            name: "Deepak Sunderlal Mishra",
            fatherOrHusbandName: "Sunderlal Mishra",
            sharePercentage: 100,
            khatauniNumber: "KH-265",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 1.3,
        affectedAreaPercentage: 86.6,
        residualAreaHa: 0.2,
        acquisitionType: "partial",
        severanceClaimEligible: false,
        status: "surveyed_verified",
        valuation: {
          baseMarketValue: 1820000,
          ruralMultiplier: 1.5,
          multipliedValue: 2730000,
          solatiumAmount: 2730000,
          assetsValue: 80000,
          additionalInterest: 218400,
          totalCompensationPayable: 5758400,
        },
        coordinates: [24.518, 81.35],
        polygon: [
          [24.516, 81.348],
          [24.52, 81.348],
          [24.52, 81.352],
          [24.516, 81.352],
        ],
        chauhaddi: {
          north: "Khasra 208 (Mishra)",
          south: "Village Nullah",
          east: "Gurh Tehsil Border",
          west: "Khasra 204 (Kol)",
        },
      },
      {
        id: "BN-002-208",
        projectId: "PRJ-002",
        khasraNumber: "208",
        surveyNumber: "Khasra 208",
        ulpin: "MP230048192008",
        village: "Badwar",
        villageLgdCode: "481920",
        sheetNumber: "Sheet 01",
        tehsil: "Gurh",
        district: "Rewa",
        state: "Madhya Pradesh",
        stateCode: "MP",
        gisCalculatedAreaHa: 1.2,
        recordedRoRAreaHa: 1.2,
        areaSqMeters: 12000,
        dimensions: "120m × 100m",
        landClassification: "rainfed_dryland",
        soilClass: "Jirayat Class I",
        circleRatePerHa: 1400000,
        guidanceValuePerSqM: 140,
        owners: [
          {
            name: "Rajkumar Sunderlal Mishra",
            fatherOrHusbandName: "Sunderlal Mishra",
            sharePercentage: 100,
            khatauniNumber: "KH-266",
            casteCategory: "General",
          },
        ],
        isAffected: true,
        affectedAreaHa: 1.2,
        affectedAreaPercentage: 100,
        residualAreaHa: 0.0,
        acquisitionType: "full",
        severanceClaimEligible: false,
        status: "notified_sec11",
        valuation: {
          baseMarketValue: 1680000,
          ruralMultiplier: 1.5,
          multipliedValue: 2520000,
          solatiumAmount: 2520000,
          assetsValue: 60000,
          additionalInterest: 201600,
          totalCompensationPayable: 5301600,
        },
        coordinates: [24.522, 81.35],
        polygon: [
          [24.52, 81.348],
          [24.524, 81.348],
          [24.524, 81.352],
          [24.52, 81.352],
        ],
        chauhaddi: {
          north: "Badwar Hill Ridge",
          south: "Khasra 207 (Mishra)",
          east: "Gurh Tehsil Border",
          west: "Khasra 206 (Gautam)",
        },
      },
      {
        id: "BN-002-209",
        projectId: "PRJ-002",
        khasraNumber: "209",
        surveyNumber: "Khasra 209",
        ulpin: "MP230048192009",
        village: "Badwar",
        villageLgdCode: "481920",
        sheetNumber: "Sheet 01",
        tehsil: "Gurh",
        district: "Rewa",
        state: "Madhya Pradesh",
        stateCode: "MP",
        gisCalculatedAreaHa: 2.0,
        recordedRoRAreaHa: 2.0,
        areaSqMeters: 20000,
        dimensions: "150m × 133m",
        landClassification: "barren_wasteland",
        soilClass: "Banjar Class II",
        circleRatePerHa: 1200000,
        guidanceValuePerSqM: 120,
        owners: [
          {
            name: "Santosh Kumar Patel",
            fatherOrHusbandName: "Kumar Patel",
            sharePercentage: 100,
            khatauniNumber: "KH-290",
            casteCategory: "OBC",
          },
        ],
        isAffected: false,
        affectedAreaHa: 0.0,
        affectedAreaPercentage: 0,
        residualAreaHa: 2.0,
        acquisitionType: "unaffected",
        severanceClaimEligible: false,
        status: "proposed",
        valuation: {
          baseMarketValue: 0,
          ruralMultiplier: 1.5,
          multipliedValue: 0,
          solatiumAmount: 0,
          assetsValue: 0,
          additionalInterest: 0,
          totalCompensationPayable: 0,
        },
        coordinates: [24.514, 81.338],
        polygon: [
          [24.512, 81.336],
          [24.516, 81.336],
          [24.516, 81.34],
          [24.512, 81.34],
        ],
        chauhaddi: {
          north: "Khasra 201 (Tiwari)",
          south: "Village Habitation / Basti",
          east: "Khasra 210 (Patel)",
          west: "State Highway 9",
        },
      },
      {
        id: "BN-002-210",
        projectId: "PRJ-002",
        khasraNumber: "210",
        surveyNumber: "Khasra 210",
        ulpin: "MP230048192010",
        village: "Badwar",
        villageLgdCode: "481920",
        sheetNumber: "Sheet 01",
        tehsil: "Gurh",
        district: "Rewa",
        state: "Madhya Pradesh",
        stateCode: "MP",
        gisCalculatedAreaHa: 1.9,
        recordedRoRAreaHa: 1.9,
        areaSqMeters: 19000,
        dimensions: "140m × 135m",
        landClassification: "rainfed_dryland",
        soilClass: "Jirayat Class I",
        circleRatePerHa: 1400000,
        guidanceValuePerSqM: 140,
        owners: [
          {
            name: "Mahesh Kumar Patel",
            fatherOrHusbandName: "Kumar Patel",
            sharePercentage: 100,
            khatauniNumber: "KH-292",
            casteCategory: "OBC",
          },
        ],
        isAffected: false,
        affectedAreaHa: 0.0,
        affectedAreaPercentage: 0,
        residualAreaHa: 1.9,
        acquisitionType: "unaffected",
        severanceClaimEligible: false,
        status: "proposed",
        valuation: {
          baseMarketValue: 0,
          ruralMultiplier: 1.5,
          multipliedValue: 0,
          solatiumAmount: 0,
          assetsValue: 0,
          additionalInterest: 0,
          totalCompensationPayable: 0,
        },
        coordinates: [24.514, 81.342],
        polygon: [
          [24.512, 81.34],
          [24.516, 81.34],
          [24.516, 81.344],
          [24.512, 81.344],
        ],
        chauhaddi: {
          north: "Khasra 203 (Shukla)",
          south: "Village Primary School",
          east: "Khasra 211 (Singh)",
          west: "Khasra 209 (Patel)",
        },
      },
      {
        id: "BN-002-211",
        projectId: "PRJ-002",
        khasraNumber: "211",
        surveyNumber: "Khasra 211",
        ulpin: "MP230048192011",
        village: "Badwar",
        villageLgdCode: "481920",
        sheetNumber: "Sheet 01",
        tehsil: "Gurh",
        district: "Rewa",
        state: "Madhya Pradesh",
        stateCode: "MP",
        gisCalculatedAreaHa: 2.2,
        recordedRoRAreaHa: 2.2,
        areaSqMeters: 22000,
        dimensions: "155m × 142m",
        landClassification: "rainfed_dryland",
        soilClass: "Jirayat Class I",
        circleRatePerHa: 1400000,
        guidanceValuePerSqM: 140,
        owners: [
          {
            name: "Brijbhan Singh Parihar",
            fatherOrHusbandName: "Singh Parihar",
            sharePercentage: 100,
            khatauniNumber: "KH-310",
            casteCategory: "General",
          },
        ],
        isAffected: false,
        affectedAreaHa: 0.0,
        affectedAreaPercentage: 0,
        residualAreaHa: 2.2,
        acquisitionType: "unaffected",
        severanceClaimEligible: false,
        status: "proposed",
        valuation: {
          baseMarketValue: 0,
          ruralMultiplier: 1.5,
          multipliedValue: 0,
          solatiumAmount: 0,
          assetsValue: 0,
          additionalInterest: 0,
          totalCompensationPayable: 0,
        },
        coordinates: [24.514, 81.346],
        polygon: [
          [24.512, 81.344],
          [24.516, 81.344],
          [24.516, 81.348],
          [24.512, 81.348],
        ],
        chauhaddi: {
          north: "Khasra 204 (Kol)",
          south: "Gurh-Badwar Road",
          east: "Khasra 212 (Parihar)",
          west: "Khasra 210 (Patel)",
        },
      },
      {
        id: "BN-002-212",
        projectId: "PRJ-002",
        khasraNumber: "212",
        surveyNumber: "Khasra 212",
        ulpin: "MP230048192012",
        village: "Badwar",
        villageLgdCode: "481920",
        sheetNumber: "Sheet 01",
        tehsil: "Gurh",
        district: "Rewa",
        state: "Madhya Pradesh",
        stateCode: "MP",
        gisCalculatedAreaHa: 2.0,
        recordedRoRAreaHa: 2.0,
        areaSqMeters: 20000,
        dimensions: "150m × 133m",
        landClassification: "rainfed_dryland",
        soilClass: "Jirayat Class I",
        circleRatePerHa: 1400000,
        guidanceValuePerSqM: 140,
        owners: [
          {
            name: "Suryabhan Singh Parihar",
            fatherOrHusbandName: "Singh Parihar",
            sharePercentage: 100,
            khatauniNumber: "KH-312",
            casteCategory: "General",
          },
        ],
        isAffected: false,
        affectedAreaHa: 0.0,
        affectedAreaPercentage: 0,
        residualAreaHa: 2.0,
        acquisitionType: "unaffected",
        severanceClaimEligible: false,
        status: "proposed",
        valuation: {
          baseMarketValue: 0,
          ruralMultiplier: 1.5,
          multipliedValue: 0,
          solatiumAmount: 0,
          assetsValue: 0,
          additionalInterest: 0,
          totalCompensationPayable: 0,
        },
        coordinates: [24.514, 81.35],
        polygon: [
          [24.512, 81.348],
          [24.516, 81.348],
          [24.516, 81.352],
          [24.512, 81.352],
        ],
        chauhaddi: {
          north: "Khasra 207 (Mishra)",
          south: "Gurh-Badwar Road",
          east: "Tehsil Boundary",
          west: "Khasra 211 (Singh)",
        },
      },
    ],
  },
];

// ------------------------------------------------------------
// BhuNaksha API Simulation & GeoJSON Factory
// ------------------------------------------------------------

export function generateBhuNakshaGeoJSON(project: BhuNakshaProject) {
  return {
    type: "FeatureCollection",
    metadata: {
      source: "National Informatics Centre (NIC) BhuNaksha WFS 2.0",
      crs: "EPSG:4326 (WGS 84)",
      villageLgdCode: project.villageLgdCode,
      villageName: project.village,
      sheetNumber: project.sajraSheetNumber,
      totalFeatures: project.parcels.length,
      timestamp: new Date().toISOString(),
      surveyAgency: "Survey of India & Revenue Department",
    },
    features: project.parcels.map((parcel) => ({
      type: "Feature",
      id: parcel.ulpin,
      geometry: {
        type: "Polygon",
        coordinates: [
          // Leaflet is [lat, lng], GeoJSON standard is [lng, lat]
          [...parcel.polygon.map(([lat, lng]) => [lng, lat]), [parcel.polygon[0][1], parcel.polygon[0][0]]],
        ],
      },
      properties: {
        khasraNumber: parcel.khasraNumber,
        surveyNumber: parcel.surveyNumber,
        ulpin: parcel.ulpin,
        village: parcel.village,
        tehsil: parcel.tehsil,
        district: parcel.district,
        state: parcel.state,
        gisAreaHa: parcel.gisCalculatedAreaHa,
        recordedRoRAreaHa: parcel.recordedRoRAreaHa,
        areaSqMeters: parcel.areaSqMeters,
        landClassification: parcel.landClassification,
        soilClass: parcel.soilClass,
        circleRatePerHa: parcel.circleRatePerHa,
        isAffected: parcel.isAffected,
        affectedAreaHa: parcel.affectedAreaHa,
        affectedAreaPercentage: parcel.affectedAreaPercentage,
        residualAreaHa: parcel.residualAreaHa,
        acquisitionType: parcel.acquisitionType,
        status: parcel.status,
        ownersCount: parcel.owners.length,
        primaryOwner: parcel.owners[0]?.name || "N/A",
        totalValuationINR: parcel.valuation.totalCompensationPayable,
      },
    })),
  };
}

// ------------------------------------------------------------
// Statutory RFCTLARR Compensation Formula Calculation
// ------------------------------------------------------------
export function calculateRFCTLARRCompensation(params: {
  affectedAreaHa: number;
  circleRatePerHa: number;
  ruralMultiplier?: number; // Defaults to 1.5
  assetsValue?: number;
  additionalInterestMonths?: number;
}) {
  const ruralMultiplier = params.ruralMultiplier ?? 1.5;
  const baseMarketValue = Math.round(params.affectedAreaHa * params.circleRatePerHa);
  const multipliedValue = Math.round(baseMarketValue * ruralMultiplier);
  const solatiumAmount = multipliedValue; // 100% Solatium under Section 30(1)
  const assetsValue = params.assetsValue ?? 0;

  // 12% per annum interest from date of Sec 11 notification to award date (Section 30(3))
  const months = params.additionalInterestMonths ?? 12;
  const additionalInterest = Math.round((baseMarketValue * 0.12 * months) / 12);

  const totalPayable = multipliedValue + solatiumAmount + assetsValue + additionalInterest;

  return {
    baseMarketValue,
    ruralMultiplier,
    multipliedValue,
    solatiumAmount,
    assetsValue,
    additionalInterest,
    totalCompensationPayable: totalPayable,
  };
}

// ------------------------------------------------------------
// 12-Stage Lifecycle Parcel Metadata Map & Helpers
// ------------------------------------------------------------
export const KHASRA_12_STAGE_DATA: Record<string, Partial<BhuNakshaParcel>> = {
  "101": {
    stageIndex: 12,
    stageCode: "rr_completed",
    stageTitle: "Stage 12 — R&R Completed",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-12",
      khatauniNo: "KH-412",
      verifiedBy: "A. K. Shinde (Talathi Musalgaon)",
      remarks: "Title verified against Bhulekh computerised record; 0 encumbrances.",
    },
    fieldVerification: {
      status: "Verified",
      surveyDate: "2024-04-05",
      officer: "M. P. Deshmukh (SLAO Land Surveyor)",
      dgpsAccuracyMeters: 0.02,
      remarks: "Field coordinates matched BhuNaksha polygon; 1 borewell and 42 pomegranate trees enumerated.",
      documents: ["JMS-Panchnama-101.pdf", "DGPS-Vertex-Report.csv", "Tree-Census-101.pdf"],
    },
    reviewDetails: {
      status: "Approved",
      reviewedBy: "SLAO Nashik Division",
      reviewDate: "2024-04-20",
      remarks: "Scrutiny completed; 0 boundary queries. Approved for Section 11 Gazette notification.",
    },
    notificationDetails: {
      gazetteRef: "MH-GAZ-REV-2024-1102/101",
      notificationDate: "2024-05-15",
      status: "Published",
    },
    awardDetails: {
      awardNumber: "LARR/NSK/2024/AWD-041",
      awardDate: "2024-07-10",
      sanctionedBy: "Shri Jalaj Sharma, IAS (Collector & CALA)",
      status: "Pronounced",
    },
    disbursementDetails: {
      txnId: "PFMS-MH-2024-881920",
      amountPaidLakhs: 135.7,
      paymentDate: "2024-08-02",
      paymentMode: "PFMS e-Kuber",
      status: "Disbursed",
    },
    possessionDetails: {
      memoNumber: "MEMO-POSS-2024-101",
      possessionDate: "2024-08-20",
      handoverTo: "NHAI Project Director (Nashik PIU)",
      demarcationDone: true,
      status: "Possession Completed",
    },
    rrDetails: {
      eligibleFamiliesCount: 2,
      entitlementPackage: "RFCTLARR Sch II — Construction Grant + Subsistence Allowance",
      totalAssistanceLakhs: 5.5,
      relocationStatus: "Relocated",
      status: "Completed",
    },
  },
  "102/1": {
    stageIndex: 11,
    stageCode: "possession",
    stageTitle: "Stage 11 — Possession",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-14",
      khatauniNo: "KH-519",
      verifiedBy: "A. K. Shinde (Talathi Musalgaon)",
      remarks: "Verified title with State Co-operative Bank NOC.",
    },
    fieldVerification: {
      status: "Verified",
      surveyDate: "2024-04-08",
      officer: "M. P. Deshmukh (SLAO Land Surveyor)",
      dgpsAccuracyMeters: 0.03,
      remarks: "Partial acquisition pegging completed (65.5% affected area = 0.55 Ha).",
      documents: ["JMS-Panchnama-102-1.pdf", "Corridor-Intersection-Map.pdf"],
    },
    reviewDetails: {
      status: "Approved",
      reviewedBy: "SLAO Nashik Division",
      reviewDate: "2024-04-22",
      remarks: "Residual area 0.29 Ha viable; approved for Section 11 Gazette.",
    },
    notificationDetails: {
      gazetteRef: "MH-GAZ-REV-2024-1102/102",
      notificationDate: "2024-05-15",
      status: "Published",
    },
    awardDetails: {
      awardNumber: "LARR/NSK/2024/AWD-042",
      awardDate: "2024-07-12",
      sanctionedBy: "Shri Jalaj Sharma, IAS (Collector & CALA)",
      status: "Pronounced",
    },
    disbursementDetails: {
      txnId: "PFMS-MH-2024-881921",
      amountPaidLakhs: 48.2,
      paymentDate: "2024-08-05",
      paymentMode: "PFMS e-Kuber",
      status: "Disbursed",
    },
    possessionDetails: {
      memoNumber: "MEMO-POSS-2024-102",
      possessionDate: "2024-08-25",
      handoverTo: "NHAI Project Director (Nashik PIU)",
      demarcationDone: true,
      status: "Possession Completed",
    },
    rrDetails: {
      eligibleFamiliesCount: 1,
      entitlementPackage: "RFCTLARR Sch II — One-time Resettlement Allowance",
      totalAssistanceLakhs: 2.8,
      relocationStatus: "In Transit",
      status: "In Progress",
    },
  },
  "103": {
    stageIndex: 10,
    stageCode: "disbursed",
    stageTitle: "Stage 10 — Disbursement",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-16",
      khatauniNo: "KH-603",
      verifiedBy: "A. K. Shinde (Talathi Musalgaon)",
      remarks: "Single owner; clear title.",
    },
    fieldVerification: {
      status: "Verified",
      surveyDate: "2024-04-10",
      officer: "M. P. Deshmukh (SLAO Land Surveyor)",
      dgpsAccuracyMeters: 0.02,
      remarks: "Full plot within 60m highway corridor.",
      documents: ["JMS-Panchnama-103.pdf", "Title-Clearance-103.pdf"],
    },
    reviewDetails: {
      status: "Approved",
      reviewedBy: "SLAO Nashik Division",
      reviewDate: "2024-04-25",
      remarks: "Approved for award and payment.",
    },
    notificationDetails: {
      gazetteRef: "MH-GAZ-REV-2024-1102/103",
      notificationDate: "2024-05-15",
      status: "Published",
    },
    awardDetails: {
      awardNumber: "LARR/NSK/2024/AWD-043",
      awardDate: "2024-07-15",
      sanctionedBy: "Shri Jalaj Sharma, IAS (Collector & CALA)",
      status: "Pronounced",
    },
    disbursementDetails: {
      txnId: "PFMS-MH-2024-994103",
      amountPaidLakhs: 27.8,
      paymentDate: "2024-08-10",
      paymentMode: "PFMS e-Kuber",
      status: "Disbursed",
    },
    possessionDetails: {
      memoNumber: "PENDING-SEC-38-NOTICE",
      possessionDate: "Scheduled: 2024-10-15",
      handoverTo: "NHAI PIU",
      demarcationDone: false,
      status: "Pending",
    },
    rrDetails: {
      eligibleFamiliesCount: 0,
      entitlementPackage: "Non-residential agricultural parcel",
      totalAssistanceLakhs: 0,
      relocationStatus: "Not Required",
      status: "Exempt",
    },
  },
  "104": {
    stageIndex: 9,
    stageCode: "compensation",
    stageTitle: "Stage 9 — Compensation",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-18",
      khatauniNo: "KH-680",
      verifiedBy: "A. K. Shinde (Talathi Musalgaon)",
      remarks: "Ownership verified; joint shareholding.",
    },
    fieldVerification: {
      status: "Verified",
      surveyDate: "2024-04-12",
      officer: "M. P. Deshmukh (SLAO Land Surveyor)",
      dgpsAccuracyMeters: 0.02,
      remarks: "Section 15 objection filed regarding fruit trees & drip irrigation system; revised joint inspection completed.",
      documents: ["JMS-Panchnama-104.pdf", "Horticulture-Valuation-104.pdf"],
    },
    reviewDetails: {
      status: "Approved",
      reviewedBy: "SLAO Nashik Division",
      reviewDate: "2024-04-28",
      remarks: "Section 15 objection settled; revised horticulture valuation incorporated into compensation matrix.",
    },
    notificationDetails: {
      gazetteRef: "MH-GAZ-REV-2024-1102/104",
      notificationDate: "2024-05-15",
      status: "Published",
    },
    awardDetails: {
      awardNumber: "LARR/NSK/2024/AWD-044",
      awardDate: "2024-07-18",
      sanctionedBy: "Shri Jalaj Sharma, IAS (Collector & CALA)",
      status: "Pronounced",
    },
    disbursementDetails: {
      txnId: "PENDING-ESCROW",
      amountPaidLakhs: 0,
      paymentDate: "Pending Treasury Release",
      paymentMode: "PFMS e-Kuber",
      status: "Pending",
    },
    possessionDetails: {
      memoNumber: "N/A",
      possessionDate: "Pending Disbursement",
      handoverTo: "NHAI PIU",
      demarcationDone: false,
      status: "Pending",
    },
    rrDetails: {
      eligibleFamiliesCount: 1,
      entitlementPackage: "Livelihood Assistance Grant",
      totalAssistanceLakhs: 1.5,
      relocationStatus: "Not Required",
      status: "In Progress",
    },
  },
  "105": {
    stageIndex: 8,
    stageCode: "awarded",
    stageTitle: "Stage 8 — Award",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-20",
      khatauniNo: "KH-710",
      verifiedBy: "A. K. Shinde (Talathi Musalgaon)",
      remarks: "Verified clear title.",
    },
    fieldVerification: {
      status: "Verified",
      surveyDate: "2024-04-15",
      officer: "M. P. Deshmukh",
      dgpsAccuracyMeters: 0.03,
      remarks: "Full acquisition 0.85 Ha within ROW.",
      documents: ["JMS-Panchnama-105.pdf"],
    },
    reviewDetails: {
      status: "Approved",
      reviewedBy: "SLAO Nashik",
      reviewDate: "2024-05-02",
      remarks: "Approved for award pronouncement under Sec 23.",
    },
    notificationDetails: {
      gazetteRef: "MH-GAZ-REV-2024-1102/105",
      notificationDate: "2024-05-15",
      status: "Published",
    },
    awardDetails: {
      awardNumber: "LARR/NSK/2024/AWD-045",
      awardDate: "2024-08-01",
      sanctionedBy: "Shri Jalaj Sharma, IAS (Collector & CALA)",
      status: "Pronounced",
    },
    disbursementDetails: {
      txnId: "PENDING",
      amountPaidLakhs: 0,
      paymentDate: "Awaiting Bank Account Validation",
      paymentMode: "PFMS e-Kuber",
      status: "Pending",
    },
    possessionDetails: {
      memoNumber: "N/A",
      possessionDate: "Pending Award Payment",
      handoverTo: "NHAI",
      demarcationDone: false,
      status: "Pending",
    },
    rrDetails: {
      eligibleFamiliesCount: 0,
      entitlementPackage: "Exempt",
      totalAssistanceLakhs: 0,
      relocationStatus: "Not Required",
      status: "Exempt",
    },
  },
  "106": {
    stageIndex: 7,
    stageCode: "notified",
    stageTitle: "Stage 7 — Notification",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-22",
      khatauniNo: "KH-740",
      verifiedBy: "A. K. Shinde",
      remarks: "Ownership verified.",
    },
    fieldVerification: {
      status: "Verified",
      surveyDate: "2024-04-18",
      officer: "M. P. Deshmukh",
      dgpsAccuracyMeters: 0.02,
      remarks: "Field verified.",
      documents: ["JMS-Panchnama-106.pdf"],
    },
    reviewDetails: {
      status: "Approved",
      reviewedBy: "SLAO",
      reviewDate: "2024-05-04",
      remarks: "Approved for notification.",
    },
    notificationDetails: {
      gazetteRef: "MH-GAZ-REV-2024-1102/106",
      notificationDate: "2024-05-15",
      status: "Published",
    },
    awardDetails: {
      awardNumber: "IN-PROGRESS",
      awardDate: "Under Sec 23 Inquiry",
      sanctionedBy: "CALA",
      status: "Pending",
    },
    disbursementDetails: {
      txnId: "N/A",
      amountPaidLakhs: 0,
      paymentDate: "N/A",
      paymentMode: "PFMS e-Kuber",
      status: "Pending",
    },
    possessionDetails: {
      memoNumber: "N/A",
      possessionDate: "N/A",
      handoverTo: "N/A",
      demarcationDone: false,
      status: "Pending",
    },
    rrDetails: {
      eligibleFamiliesCount: 0,
      entitlementPackage: "Pending Assessment",
      totalAssistanceLakhs: 0,
      relocationStatus: "Not Required",
      status: "In Progress",
    },
  },
  "107": {
    stageIndex: 6,
    stageCode: "reviewed",
    stageTitle: "Stage 6 — Parcel Review",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-25",
      khatauniNo: "KH-770",
      verifiedBy: "Talathi",
      remarks: "Verified title.",
    },
    fieldVerification: {
      status: "Verified",
      surveyDate: "2024-04-20",
      officer: "M. P. Deshmukh",
      dgpsAccuracyMeters: 0.02,
      remarks: "JMS verified.",
      documents: ["JMS-Panchnama-107.pdf"],
    },
    reviewDetails: {
      status: "Approved",
      reviewedBy: "SLAO Nashik Division",
      reviewDate: "2024-05-10",
      remarks: "Cleared for Gazette publication.",
    },
    notificationDetails: {
      gazetteRef: "DRAFT-GAZETTE",
      notificationDate: "Scheduled Next Batch",
      status: "Pending",
    },
  },
  "108": {
    stageIndex: 5,
    stageCode: "parcel_verified",
    stageTitle: "Stage 5 — Parcel Verification",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-26",
      khatauniNo: "KH-790",
      verifiedBy: "Talathi",
      remarks: "Verified title.",
    },
    fieldVerification: {
      status: "Verified",
      surveyDate: "2024-04-22",
      officer: "M. P. Deshmukh",
      dgpsAccuracyMeters: 0.02,
      remarks: "Field DGPS completed.",
      documents: ["JMS-Panchnama-108.pdf"],
    },
    reviewDetails: {
      status: "Under Review",
      reviewedBy: "SLAO Scrutiny Desk",
      reviewDate: "In Queue",
      remarks: "Under verification review.",
    },
  },
  "109": {
    stageIndex: 4,
    stageCode: "ror_verified",
    stageTitle: "Stage 4 — RoR Verification",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-28",
      khatauniNo: "KH-810",
      verifiedBy: "A. K. Shinde (Talathi)",
      remarks: "RoR linked and confirmed from Bhulekh database.",
    },
    fieldVerification: {
      status: "Pending Field Survey",
      surveyDate: "Scheduled: 2024-10-18",
      officer: "Survey Team B",
      dgpsAccuracyMeters: 0,
      remarks: "Notice issued to landowner for Joint Measurement Survey.",
      documents: [],
    },
  },
  "110": {
    stageIndex: 3,
    stageCode: "affected",
    stageTitle: "Stage 3 — Affected Parcels",
    rorVerification: {
      status: "Pending Verification",
      verificationDate: "Scheduled",
      khatauniNo: "KH-820",
      verifiedBy: "Talathi Office",
      remarks: "RoR fetch request pending.",
    },
  },
  "111": {
    stageIndex: 2,
    stageCode: "footprint",
    stageTitle: "Stage 2 — Project Footprint",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-01",
      khatauniNo: "KH-825",
      verifiedBy: "Talathi",
      remarks: "Buffer parcel; outside direct ROW.",
    },
  },
  "112": {
    stageIndex: 2,
    stageCode: "footprint",
    stageTitle: "Stage 2 — Project Footprint",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-01",
      khatauniNo: "KH-830",
      verifiedBy: "Talathi",
      remarks: "Buffer parcel; outside direct ROW.",
    },
  },
  "113": {
    stageIndex: 9,
    stageCode: "compensation",
    stageTitle: "Stage 9 — Compensation",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-15",
      khatauniNo: "KH-840",
      verifiedBy: "Talathi",
      remarks: "Verified title.",
    },
    fieldVerification: {
      status: "Verified",
      surveyDate: "2024-04-14",
      officer: "M. P. Deshmukh",
      dgpsAccuracyMeters: 0.02,
      remarks: "Severance claim under RFCTLARR Section 27 confirmed (Residual area 0.15 Ha < 0.2 Ha).",
      documents: ["JMS-Panchnama-113.pdf", "Sec27-Severance-Consent.pdf"],
    },
    reviewDetails: {
      status: "Approved",
      reviewedBy: "SLAO & CALA",
      reviewDate: "2024-05-02",
      remarks: "Compulsory total acquisition recommended due to non-viable residual plot.",
    },
    notificationDetails: {
      gazetteRef: "MH-GAZ-REV-2024-1102/113",
      notificationDate: "2024-05-15",
      status: "Published",
    },
    awardDetails: {
      awardNumber: "LARR/NSK/2024/AWD-049",
      awardDate: "2024-07-22",
      sanctionedBy: "Shri Jalaj Sharma, IAS (Collector & CALA)",
      status: "Pronounced",
    },
  },
  "114": {
    stageIndex: 2,
    stageCode: "footprint",
    stageTitle: "Stage 2 — Project Footprint",
    rorVerification: {
      status: "Verified",
      verificationDate: "2024-03-01",
      khatauniNo: "KH-850",
      verifiedBy: "Talathi",
      remarks: "Buffer parcel; outside direct ROW.",
    },
  },
};

// Helper: Get complete 12-stage metadata for any parcel
export function getParcel12StageInfo(parcel: BhuNakshaParcel): BhuNakshaParcel {
  const extra = KHASRA_12_STAGE_DATA[parcel.khasraNumber] || {};
  const stageIndex = extra.stageIndex ?? (parcel.isAffected ? 3 : 2);
  const stageMeta = LAMS_12_STAGES.find((s) => s.stageNumber === stageIndex) || LAMS_12_STAGES[0];

  return {
    ...parcel,
    stageIndex,
    stageCode: stageMeta.code,
    stageTitle: stageMeta.title,
    rorVerification: extra.rorVerification ?? {
      status: parcel.isAffected ? "Verified" : "Pending Verification",
      verificationDate: "2024-03-15",
      khatauniNo: parcel.owners[0]?.khatauniNumber || "KH-000",
      verifiedBy: "Talathi Office",
      remarks: "Record of Rights verified.",
    },
    fieldVerification: extra.fieldVerification,
    reviewDetails: extra.reviewDetails,
    notificationDetails: extra.notificationDetails,
    awardDetails: extra.awardDetails,
    disbursementDetails: extra.disbursementDetails,
    possessionDetails: extra.possessionDetails,
    rrDetails: extra.rrDetails,
  };
}

// Helper: Calculate 12-stage project metrics
export function getProject12StageMetrics(project: BhuNakshaProject) {
  const enrichedParcels = project.parcels.map(getParcel12StageInfo);

  const totalParcels = enrichedParcels.length;
  const affectedParcels = enrichedParcels.filter((p) => p.isAffected).length;
  const rorVerifiedCount = enrichedParcels.filter((p) => p.rorVerification?.status === "Verified").length;
  const fieldVerifiedCount = enrichedParcels.filter((p) => p.fieldVerification?.status === "Verified").length;
  const reviewedCount = enrichedParcels.filter((p) => p.reviewDetails?.status === "Approved").length;
  const notifiedCount = enrichedParcels.filter((p) => p.notificationDetails?.status === "Published").length;
  const awardCompletedCount = enrichedParcels.filter((p) => p.awardDetails?.status === "Pronounced").length;
  const compensationCasesCount = enrichedParcels.filter((p) => (p.stageIndex ?? 0) >= 9).length;
  const disbursedCount = enrichedParcels.filter((p) => p.disbursementDetails?.status === "Disbursed").length;
  const possessionCompletedCount = enrichedParcels.filter((p) => p.possessionDetails?.status === "Possession Completed").length;
  const rrCompletedCount = enrichedParcels.filter((p) => p.rrDetails?.status === "Completed").length;

  return {
    totalParcels,
    affectedParcels,
    rorVerifiedCount,
    fieldVerifiedCount,
    reviewedCount,
    notifiedCount,
    awardCompletedCount,
    compensationCasesCount,
    disbursedCount,
    possessionCompletedCount,
    rrCompletedCount,
    totalCompensationAssessedCr: (project.totalEstimatedCompensationLakhs / 100).toFixed(2),
    totalDisbursedCr: (project.totalCompensationDisbursedLakhs / 100).toFixed(2),
  };
}

// Helper: Map Parcel to visual color representation according to 12-stage status
export function getParcelStageVisualColor(parcel: BhuNakshaParcel): {
  fillColor: string;
  borderColor: string;
  labelBg: string;
  labelText: string;
  categoryLabel: string;
} {
  const stage = parcel.stageIndex ?? (parcel.isAffected ? 3 : 2);

  // Unaffected buffer
  if (!parcel.isAffected || stage <= 2) {
    return {
      fillColor: "#DCFCE7",
      borderColor: "#16A34A",
      labelBg: "bg-emerald-100",
      labelText: "text-emerald-800",
      categoryLabel: "Unaffected",
    };
  }

  // Under Verification / Review (Stages 4, 5, 6)
  if (stage >= 4 && stage <= 6) {
    return {
      fillColor: "#FEF3C7",
      borderColor: "#D97706",
      labelBg: "bg-amber-100",
      labelText: "text-amber-800",
      categoryLabel: "Under Verification",
    };
  }

  // Confirmed Affected / Notified / Award / Compensation (Stages 3, 7, 8, 9)
  if (stage === 3 || (stage >= 7 && stage <= 9)) {
    return {
      fillColor: "#FEE2E2",
      borderColor: "#DC2626",
      labelBg: "bg-red-100",
      labelText: "text-red-800",
      categoryLabel: "Acquisition Active",
    };
  }

  // Disbursed / Possession Taken / R&R (Stages 10, 11, 12)
  return {
    fillColor: "#EDE9FE",
    borderColor: "#7C3AED",
    labelBg: "bg-purple-100",
    labelText: "text-purple-800",
    categoryLabel: "Possessed / R&R",
  };
}

