// ============================================================
// BhoomiDrishti — BhuNaksha Cadastral Engine & Service Layer
// National Informatics Centre (NIC) Cadastral Integration Suite
// Exclusively configured for Delhi NCT & Ghaziabad, Uttar Pradesh
// ============================================================

export interface BhuNakshaParcel {
  id: string;
  projectId: string;
  khasraNumber: string; // e.g. "DEMO-482", "DEMO-101"
  surveyNumber: string;
  ulpin: string; // 14-digit Bhu-Aadhaar e.g. "DL010048200192"
  village: string;
  villageLgdCode: string; // Local Government Directory Code
  sheetNumber: string; // Cadastral Sajra Sheet No
  tehsil: string;
  district: string;
  state: string;
  stateCode: string;

  // Spatial Dimensions
  gisCalculatedAreaHa: number; // Calculated Area from BhuNaksha Vector Geometry
  recordedRoRAreaHa: number; // Recorded Area in RoR Register
  areaSqMeters: number;
  dimensions: string;

  // Land Attributes
  landClassification:
    | "irrigated_agricultural"
    | "rainfed_dryland"
    | "non_agricultural_commercial"
    | "barren_wasteland"
    | "gram_sabha_revenue"
    | "forest_boundary";
  soilClass: string;
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
  affectedAreaPercentage: number;
  residualAreaHa: number;
  acquisitionType: "full" | "partial" | "unaffected" | "buffer";
  severanceClaimEligible: boolean;

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

  // Demonstration Lifecycle
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
    baseMarketValue: number;
    ruralMultiplier: number;
    multipliedValue: number;
    solatiumAmount: number;
    assetsValue: number;
    additionalInterest: number;
    totalCompensationPayable: number;
  };

  coordinates: [number, number]; // Centroid [lat, lng]
  polygon: [number, number][];
  chauhaddi: {
    north: string;
    south: string;
    east: string;
    west: string;
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
  scaleRatio: string;
  surveyYear: string;

  corridorType: "linear_alignment" | "zonal_boundary";
  corridorWidthMeters?: number;
  corridorCenterline?: [number, number][];
  boundaryPolygon?: [number, number][];

  totalParcelsInVillageSheet: number;
  totalAffectedParcels: number;
  totalVillageAreaHa: number;
  totalAffectedAreaHa: number;
  totalUnaffectedAreaHa: number;

  totalEstimatedCompensationLakhs: number;
  totalCompensationDisbursedLakhs: number;

  currentWorkflowStageIndex: number;
  currentStageName: string;
  targetCompletionDate: string;
  calaOfficer: string;

  parcels: BhuNakshaParcel[];
}

export const STATUTORY_WORKFLOW_STAGES = [
  {
    stageNumber: 1,
    code: "SEC_4_PROPOSAL",
    title: "Project Requisition & Proposal",
    actReference: "RFCTLARR 2013 Section 4",
    description: "LRB submits formal land requirement proposal with project alignment and public purpose justification.",
    responsibleAuthority: "Land Requiring Body (LRB) / District Magistrate",
    durationDays: 30,
    requiredDocuments: ["Form-1A Requisition", "Alignment Map", "Feasibility Report"],
  },
  {
    stageNumber: 2,
    code: "BHUNAKSHA_IDENTIFICATION",
    title: "BhuNaksha Cadastral Identification",
    actReference: "NIC BhuNaksha & SVAMITVA Cadastre",
    description: "Overlay project alignment on digitized village Sajra cadastral sheets to extract intersecting khasras.",
    responsibleAuthority: "Survey Department & GIS Directorate",
    durationDays: 21,
    requiredDocuments: ["BhuNaksha Vector Layer", "Intersect Analysis Report", "ULPIN Cross-Check"],
  },
  {
    stageNumber: 3,
    code: "SEC_4_SIA",
    title: "Social Impact Assessment (SIA)",
    actReference: "RFCTLARR 2013 Sections 4-6",
    description: "Multi-disciplinary SIA study, public hearing with gram sabhas, and livelihood impact documentation.",
    responsibleAuthority: "State SIA Unit & Independent Social Evaluators",
    durationDays: 60,
    requiredDocuments: ["Draft SIA Report", "Public Hearing Minutes", "Social Management Plan (SIMP)"],
  },
  {
    stageNumber: 4,
    code: "SEC_7_EXPERT_APPRAISAL",
    title: "Expert Group Appraisal",
    actReference: "RFCTLARR 2013 Section 7",
    description: "Independent multi-disciplinary expert group evaluates SIA report and public purpose legitimacy.",
    responsibleAuthority: "Independent Multi-Disciplinary Expert Group",
    durationDays: 60,
    requiredDocuments: ["Expert Recommendation Report", "Mitigation Audit", "State Govt Clearance"],
  },
  {
    stageNumber: 5,
    code: "SEC_11_NOTIFICATION",
    title: "Section 11 Preliminary Notification",
    actReference: "RFCTLARR 2013 Section 11",
    description: "Official gazette notification freezing private land transactions and initiating RoR updating.",
    responsibleAuthority: "Competent Authority for Land Acquisition (CALA)",
    durationDays: 60,
    requiredDocuments: ["Gazette Notification Form 4", "Public Notice in 2 Newspapers", "Gram Panchayat Notice"],
  },
  {
    stageNumber: 6,
    code: "SEC_15_OBJECTIONS",
    title: "Section 15 Hearing of Objections",
    actReference: "RFCTLARR 2013 Section 15",
    description: "60-day statutory window for affected khatedars to submit written objections regarding boundary or valuation.",
    responsibleAuthority: "CALA / Land Acquisition Officer",
    durationDays: 60,
    requiredDocuments: ["Objection Dossiers", "Hearing Order Sheets", "CALA Inquiry Report"],
  },
  {
    stageNumber: 7,
    code: "SEC_19_DECLARATION",
    title: "Section 19 Final Declaration",
    actReference: "RFCTLARR 2013 Section 19",
    description: "Conclusive declaration that land is required for public purpose; published along with summary of R&R scheme.",
    responsibleAuthority: "Appropriate Government (State / Centre)",
    durationDays: 365,
    requiredDocuments: ["Section 19 Declaration Order", "Approved R&R Scheme Summary", "Gazette Extra-Ordinary"],
  },
  {
    stageNumber: 8,
    code: "SEC_23_AWARD",
    title: "Section 23 Compensation Award",
    actReference: "RFCTLARR 2013 Sections 23-30",
    description: "Collector's conclusive compensation award factoring Circle Rate, 100% Solatium, assets, and 12% interest.",
    responsibleAuthority: "CALA / District Collector",
    durationDays: 365,
    requiredDocuments: ["Award Enquiry Form 9", "Detailed Valuation Sheet", "Sanction Order"],
  },
  {
    stageNumber: 9,
    code: "SEC_38_POSSESSION",
    title: "Section 38 Physical Possession",
    actReference: "RFCTLARR 2013 Section 38",
    description: "Take encumbrance-free physical possession upon full compensation disbursement and execute revenue mutation.",
    responsibleAuthority: "CALA, Tehsildar & Requiring Agency",
    durationDays: 30,
    requiredDocuments: ["Possession Panchnama", "Handover Certificate", "RoR Mutation Form 6"],
  },
];

export interface Lams12Stage {
  stageNumber: number;
  code: string;
  title: string;
  shortTitle: string;
  actReference: string;
  actRef: string;
  phase: "Pre-Notification" | "Notification & Inquiries" | "Award & Disbursement" | "Handover & Settlement";
  description: string;
  badgeVariant: "default" | "secondary" | "outline";
}

export const LAMS_12_STAGES: Lams12Stage[] = [
  { stageNumber: 1, code: "proposal", title: "Project Proposal", shortTitle: "Proposal", actReference: "RFCTLARR Sec 4(1)", actRef: "Sec 4(1)", phase: "Pre-Notification", description: "Formal land requisition submitted with alignment corridor.", badgeVariant: "outline" },
  { stageNumber: 2, code: "identification", title: "Land Identification", shortTitle: "Identification", actReference: "NIC BhuNaksha", actRef: "BhuNaksha", phase: "Pre-Notification", description: "Cadastral khasras extracted from village digital sheets.", badgeVariant: "outline" },
  { stageNumber: 3, code: "affected_khasras", title: "Intersecting Khasras", shortTitle: "Intersect Analysis", actReference: "Spatial GIS Engine", actRef: "Spatial GIS", phase: "Pre-Notification", description: "Intersecting khasra polygons and acreage quantified.", badgeVariant: "outline" },
  { stageNumber: 4, code: "ror_verification", title: "RoR Verification", shortTitle: "RoR Check", actReference: "Bhulekh Land Records", actRef: "Land Records", phase: "Pre-Notification", description: "Bhulekh title & ownership records verified against revenue registers.", badgeVariant: "secondary" },
  { stageNumber: 5, code: "field_verification", title: "Field Verification", shortTitle: "Field Survey", actReference: "JMS Panchnama", actRef: "JMS Survey", phase: "Pre-Notification", description: "Joint measurement survey & DGPS boundary validation.", badgeVariant: "secondary" },
  { stageNumber: 6, code: "review_forward", title: "Scrutiny & Review", shortTitle: "SLAO Scrutiny", actReference: "SLAO Review Order", actRef: "SLAO Scrutiny", phase: "Pre-Notification", description: "SLAO scrutinizes parcel dossiers and submits for gazette notification.", badgeVariant: "secondary" },
  { stageNumber: 7, code: "notification", title: "Sec 11 Notification", shortTitle: "Sec 11 Gazette", actReference: "RFCTLARR Sec 11", actRef: "Sec 11", phase: "Notification & Inquiries", description: "Preliminary statutory gazette freezes private transfers.", badgeVariant: "default" },
  { stageNumber: 8, code: "award", title: "Sec 23 Award", shortTitle: "Sec 23 Award", actReference: "RFCTLARR Sec 23/30", actRef: "Sec 23/30", phase: "Notification & Inquiries", description: "Compensation award pronounced with 100% solatium & assets.", badgeVariant: "default" },
  { stageNumber: 9, code: "compensation", title: "Compensation Assessment", shortTitle: "Compensation", actReference: "PFMS Escrow Standard", actRef: "PFMS DBT", phase: "Award & Disbursement", description: "Individual PFMS escrow accounts credited with award amounts.", badgeVariant: "default" },
  { stageNumber: 10, code: "disbursement", title: "Direct Disbursement", shortTitle: "DBT Disbursement", actReference: "PFMS e-Kuber Protocol", actRef: "DBT Transfer", phase: "Award & Disbursement", description: "e-Kuber electronic direct benefit transfer to beneficiary bank accounts.", badgeVariant: "default" },
  { stageNumber: 11, code: "possession", title: "Physical Possession", shortTitle: "Possession", actReference: "RFCTLARR Sec 38", actRef: "Sec 38", phase: "Handover & Settlement", description: "Physical possession taken and handed over free of all encumbrances.", badgeVariant: "default" },
  { stageNumber: 12, code: "rr_completed", title: "R&R Settlement", shortTitle: "R&R Settled", actReference: "RFCTLARR Schedule II", actRef: "Schedule II", phase: "Handover & Settlement", description: "Second Schedule rehabilitation grants & housing allotments completed.", badgeVariant: "default" },
];

function makePolygon(lat: number, lng: number, size = 0.0015): [number, number][] {
  return [
    [lat - size, lng - size],
    [lat + size, lng - size],
    [lat + size, lng + size],
    [lat - size, lng + size],
  ];
}

// ------------------------------------------------------------
// PROJECT 1: Delhi Land & Infrastructure Development Project
// ------------------------------------------------------------
const DELHI_PARCELS_RAW = [
  { khasra: "DEMO-482", area: 1.84, owner: "Demo Landholder - Shri Ramesh Chand (Demonstration Data)", village: "Alipur", lat: 28.721, lng: 77.141, status: "Verified" as const },
  { khasra: "DEMO-101", area: 1.45, owner: "Demo Landholder - Smt. Kamla Devi (Demonstration Data)", village: "Alipur", lat: 28.723, lng: 77.143, status: "Verified" as const },
  { khasra: "DEMO-102", area: 1.62, owner: "Demo Landholder - Shri Naresh Yadav (Demonstration Data)", village: "Alipur", lat: 28.725, lng: 77.145, status: "Verified" as const },
  { khasra: "DEMO-103", area: 1.20, owner: "Demo Landholder - Shri Satish Bansal (Demonstration Data)", village: "Narela", lat: 28.727, lng: 77.148, status: "Verified" as const },
  { khasra: "DEMO-104", area: 1.75, owner: "Demo Landholder - Shri Om Prakash (Demonstration Data)", village: "Narela", lat: 28.729, lng: 77.151, status: "Verified" as const },
  { khasra: "DEMO-105", area: 1.30, owner: "Demo Landholder - Shri Suresh Tyagi (Demonstration Data)", village: "Narela", lat: 28.731, lng: 77.153, status: "Discrepancy Found" as const },
  { khasra: "DEMO-106", area: 1.55, owner: "Demo Landholder - Smt. Geeta Sharma (Demonstration Data)", village: "Hamidpur", lat: 28.718, lng: 77.137, status: "Verified" as const },
  { khasra: "DEMO-107", area: 1.40, owner: "Demo Landholder - Shri Jagdish Prasad (Demonstration Data)", village: "Hamidpur", lat: 28.716, lng: 77.134, status: "Verified" as const },
  { khasra: "DEMO-108", area: 1.50, owner: "Demo Landholder - Shri Harish Rawat (Demonstration Data)", village: "Hamidpur", lat: 28.714, lng: 77.131, status: "Verified" as const },
  { khasra: "DEMO-109", area: 1.60, owner: "Demo Landholder - Smt. Meena Varma (Demonstration Data)", village: "Hamidpur", lat: 28.712, lng: 77.128, status: "Pending Verification" as const },
  { khasra: "DEMO-110", area: 1.70, owner: "Demo Landholder - Shri Anil Gupta (Demonstration Data)", village: "Alipur", lat: 28.733, lng: 77.156, status: "Pending Verification" as const },
  { khasra: "DEMO-111", area: 1.49, owner: "Demo Landholder - Shri Vinod Chawla (Demonstration Data)", village: "Alipur", lat: 28.735, lng: 77.159, status: "Pending Verification" as const },
  { khasra: "DEMO-112", area: 2.10, owner: "Demo Landholder - Shri Mahender Pal (Demonstration Data)", village: "Alipur", lat: 28.738, lng: 77.164, status: "Verified" as const, isBuffer: true },
  { khasra: "DEMO-113", area: 2.00, owner: "Demo Landholder - Smt. Saroj Bala (Demonstration Data)", village: "Hamidpur", lat: 28.709, lng: 77.123, status: "Verified" as const, isBuffer: true },
];

const DELHI_PARCELS: BhuNakshaParcel[] = DELHI_PARCELS_RAW.map((p, idx) => {
  const isAffected = !p.isBuffer;
  const rate = 7000000;
  const baseMarketValue = Math.round(p.area * rate);
  const multipliedValue = Math.round(baseMarketValue * 1.5);
  const solatiumAmount = multipliedValue;
  const totalCompensation = multipliedValue + solatiumAmount + 250000;

  return {
    id: `BN-DL-${p.khasra}`,
    projectId: "DL-INFRA-001",
    khasraNumber: p.khasra,
    surveyNumber: p.khasra,
    ulpin: `DL0100${idx + 100}00192`,
    village: p.village,
    villageLgdCode: "110036",
    sheetNumber: "Sheet No. 04",
    tehsil: "Alipur",
    district: "North Delhi",
    state: "Delhi",
    stateCode: "DL",
    gisCalculatedAreaHa: p.area,
    recordedRoRAreaHa: p.area,
    areaSqMeters: Math.round(p.area * 10000),
    dimensions: "130m × 120m",
    landClassification: "irrigated_agricultural",
    soilClass: "Alluvial Class I (Yamuna Floodplain)",
    circleRatePerHa: rate,
    guidanceValuePerSqM: 700,
    owners: [
      {
        name: p.owner,
        fatherOrHusbandName: "Demonstration Record",
        sharePercentage: 100,
        khatauniNumber: `KH-DL-${idx + 400}`,
        casteCategory: "General",
        contactNumber: "+91 98110 00000",
      },
    ],
    isAffected,
    affectedAreaHa: isAffected ? p.area : 0,
    affectedAreaPercentage: isAffected ? 100 : 0,
    residualAreaHa: isAffected ? 0 : p.area,
    acquisitionType: isAffected ? "full" : "buffer",
    severanceClaimEligible: false,
    status: isAffected ? "notified_sec11" : "proposed",
    valuation: {
      baseMarketValue,
      ruralMultiplier: 1.5,
      multipliedValue,
      solatiumAmount,
      assetsValue: 250000,
      additionalInterest: Math.round(baseMarketValue * 0.12),
      totalCompensationPayable: totalCompensation,
    },
    coordinates: [p.lat, p.lng],
    polygon: makePolygon(p.lat, p.lng),
    chauhaddi: {
      north: "Adjacent Khasra Cadastral Border",
      south: "Internal Locality Road / Utility Line",
      east: "Agricultural Boundary",
      west: "Proposed Infrastructure Alignment",
    },
    rorVerification: {
      status: p.status,
      verificationDate: "2026-02-15",
      khatauniNo: `KH-DL-${idx + 400}`,
      verifiedBy: "A. K. Sharma (Patwari Alipur)",
      remarks: p.status === "Discrepancy Found"
        ? "Ownership discrepancy requires review — Khatauni succession entry requires CALA hearing"
        : "Record of Rights verified against Delhi revenue records.",
    },
  };
});

// ------------------------------------------------------------
// PROJECT 2: Delhi–Ghaziabad Regional Connectivity Project
// ------------------------------------------------------------
const GZB_PARCELS_RAW = [
  { khasra: "DEMO-501", area: 1.56, owner: "Demo Landholder - Shri Virender Singh (Demonstration Data)", village: "Sahibabad", lat: 28.665, lng: 77.395, status: "Verified" as const },
  { khasra: "DEMO-502", area: 1.50, owner: "Demo Landholder - Smt. Usha Rani (Demonstration Data)", village: "Sahibabad", lat: 28.668, lng: 77.401, status: "Verified" as const },
  { khasra: "DEMO-503", area: 1.62, owner: "Demo Landholder - Shri Satendra Tyagi (Demonstration Data)", village: "Arthala", lat: 28.672, lng: 77.412, status: "Verified" as const },
  { khasra: "DEMO-504", area: 1.38, owner: "Demo Landholder - Shri Manoj Kumar (Demonstration Data)", village: "Arthala", lat: 28.675, lng: 77.420, status: "Verified" as const },
  { khasra: "DEMO-505", area: 1.75, owner: "Demo Landholder - Smt. Rajbala (Demonstration Data)", village: "Morta", lat: 28.679, lng: 77.428, status: "Verified" as const },
  { khasra: "DEMO-506", area: 1.43, owner: "Demo Landholder - Shri Jagdish Tyagi (Demonstration Data)", village: "Morta", lat: 28.682, lng: 77.433, status: "Discrepancy Found" as const },
  { khasra: "DEMO-507", area: 1.62, owner: "Demo Landholder - Shri Dharmender Singh (Demonstration Data)", village: "Duhai", lat: 28.686, lng: 77.441, status: "Verified" as const },
  { khasra: "DEMO-508", area: 1.44, owner: "Demo Landholder - Shri Sunil Sharma (Demonstration Data)", village: "Duhai", lat: 28.689, lng: 77.448, status: "Verified" as const },
  { khasra: "DEMO-509", area: 1.50, owner: "Demo Landholder - Shri Prem Chand (Demonstration Data)", village: "Sahibabad", lat: 28.663, lng: 77.391, status: "Verified" as const },
  { khasra: "DEMO-510", area: 1.35, owner: "Demo Landholder - Smt. Pushpa Devi (Demonstration Data)", village: "Sahibabad", lat: 28.661, lng: 77.387, status: "Verified" as const },
  { khasra: "DEMO-511", area: 1.40, owner: "Demo Landholder - Shri Rohit Tyagi (Demonstration Data)", village: "Arthala", lat: 28.670, lng: 77.408, status: "Verified" as const },
  { khasra: "DEMO-512", area: 1.55, owner: "Demo Landholder - Shri Devender Pal (Demonstration Data)", village: "Arthala", lat: 28.674, lng: 77.416, status: "Pending Verification" as const },
  { khasra: "DEMO-513", area: 1.45, owner: "Demo Landholder - Smt. Anita Chaudhry (Demonstration Data)", village: "Morta", lat: 28.677, lng: 77.424, status: "Pending Verification" as const },
  { khasra: "DEMO-514", area: 1.50, owner: "Demo Landholder - Shri Surender Kumar (Demonstration Data)", village: "Morta", lat: 28.680, lng: 77.430, status: "Pending Verification" as const },
  { khasra: "DEMO-515", area: 1.35, owner: "Demo Landholder - Shri Naresh Kumar (Demonstration Data)", village: "Duhai", lat: 28.684, lng: 77.437, status: "Pending Verification" as const },
  { khasra: "DEMO-516", area: 1.40, owner: "Demo Landholder - Smt. Sushila Devi (Demonstration Data)", village: "Duhai", lat: 28.687, lng: 77.444, status: "Pending Verification" as const },
  { khasra: "DEMO-517", area: 1.25, owner: "Demo Landholder - Shri Mukesh Verma (Demonstration Data)", village: "Sahibabad", lat: 28.659, lng: 77.383, status: "Pending Verification" as const },
  { khasra: "DEMO-518", area: 1.25, owner: "Demo Landholder - Shri Sanjay Singh (Demonstration Data)", village: "Duhai", lat: 28.691, lng: 77.452, status: "Verified" as const },
  { khasra: "DEMO-519", area: 2.80, owner: "Demo Landholder - Gram Sabha Reserve (Demonstration Data)", village: "Sahibabad", lat: 28.655, lng: 77.378, status: "Verified" as const, isBuffer: true },
  { khasra: "DEMO-520", area: 2.80, owner: "Demo Landholder - Gram Sabha Reserve (Demonstration Data)", village: "Duhai", lat: 28.695, lng: 77.458, status: "Verified" as const, isBuffer: true },
];

const GZB_PARCELS: BhuNakshaParcel[] = GZB_PARCELS_RAW.map((p, idx) => {
  const isAffected = !p.isBuffer;
  const rate = 6500000;
  const baseMarketValue = Math.round(p.area * rate);
  const multipliedValue = Math.round(baseMarketValue * 1.5);
  const solatiumAmount = multipliedValue;
  const totalCompensation = multipliedValue + solatiumAmount + 300000;

  return {
    id: `BN-GZB-${p.khasra}`,
    projectId: "DL-GZB-002",
    khasraNumber: p.khasra,
    surveyNumber: p.khasra,
    ulpin: `UP0900${idx + 500}00223`,
    village: p.village,
    villageLgdCode: "201005",
    sheetNumber: "Sheet No. 01",
    tehsil: "Ghaziabad",
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    stateCode: "UP",
    gisCalculatedAreaHa: p.area,
    recordedRoRAreaHa: p.area,
    areaSqMeters: Math.round(p.area * 10000),
    dimensions: "135m × 120m",
    landClassification: "irrigated_agricultural",
    soilClass: "Alluvial Loam (Hindon Basin)",
    circleRatePerHa: rate,
    guidanceValuePerSqM: 650,
    owners: [
      {
        name: p.owner,
        fatherOrHusbandName: "Demonstration Record",
        sharePercentage: 100,
        khatauniNumber: `KH-UP-${idx + 600}`,
        casteCategory: "General",
        contactNumber: "+91 98120 00000",
      },
    ],
    isAffected,
    affectedAreaHa: isAffected ? p.area : 0,
    affectedAreaPercentage: isAffected ? 100 : 0,
    residualAreaHa: isAffected ? 0 : p.area,
    acquisitionType: isAffected ? "full" : "buffer",
    severanceClaimEligible: false,
    status: isAffected ? "notified_sec11" : "proposed",
    valuation: {
      baseMarketValue,
      ruralMultiplier: 1.5,
      multipliedValue,
      solatiumAmount,
      assetsValue: 300000,
      additionalInterest: Math.round(baseMarketValue * 0.12),
      totalCompensationPayable: totalCompensation,
    },
    coordinates: [p.lat, p.lng],
    polygon: makePolygon(p.lat, p.lng),
    chauhaddi: {
      north: "National Highway / Arterial Road Boundary",
      south: "Locality Cadastral Boundary",
      east: "Village Farmland",
      west: "Regional Connectivity Corridor Buffer",
    },
    rorVerification: {
      status: p.status,
      verificationDate: "2026-02-20",
      khatauniNo: `KH-UP-${idx + 600}`,
      verifiedBy: "R. P. Verma (Lekhpal Ghaziabad)",
      remarks: p.status === "Discrepancy Found"
        ? "Ownership discrepancy requires review — Joint title mutation entry under revenue court review"
        : "Record of Rights verified against UP Bhulekh records.",
    },
  };
});

// ============================================================
// OFFICIAL BHUNAKSHA PROJECTS (DELHI & GHAZIABAD ONLY)
// ============================================================
export const BHUNAKSHA_PROJECTS: BhuNakshaProject[] = [
  {
    id: "DL-INFRA-001",
    name: "Delhi Land & Infrastructure Development Project",
    projectCode: "DL-INFRA-2026-001",
    sector: "highway",
    department: "Delhi Development Authority & Land Acquisition Collectorate (North Delhi)",
    state: "Delhi",
    stateCode: "DL",
    district: "North Delhi",
    tehsil: "Alipur",
    village: "Alipur, Narela & Hamidpur",
    villageLgdCode: "110036",
    sajraSheetNumber: "Sheet No. 04 (Delhi Digital Cadastre 2026)",
    scaleRatio: "1:2000 Cadastral Scale",
    surveyYear: "2026 DGPS & Drone Survey",
    corridorType: "linear_alignment",
    corridorWidthMeters: 60,
    corridorCenterline: [
      [28.708, 77.126],
      [28.716, 77.136],
      [28.724, 77.146],
      [28.732, 77.158],
    ],
    totalParcelsInVillageSheet: 14,
    totalAffectedParcels: 12,
    totalVillageAreaHa: 22.5,
    totalAffectedAreaHa: 18.4,
    totalUnaffectedAreaHa: 4.1,
    totalEstimatedCompensationLakhs: 3120.0,
    totalCompensationDisbursedLakhs: 980.0,
    currentWorkflowStageIndex: 1,
    currentStageName: "Stage 1 — Project Initiation",
    targetCompletionDate: "2026-12-31",
    calaOfficer: "Shri Ashwini Kumar, IAS (District Magistrate & CALA, North Delhi)",
    parcels: DELHI_PARCELS,
  },
  {
    id: "DL-GZB-002",
    name: "Delhi–Ghaziabad Regional Connectivity Project",
    projectCode: "DL-GZB-2026-002",
    sector: "highway",
    department: "National Capital Region Transport Corporation & UP PWD",
    state: "Uttar Pradesh",
    stateCode: "UP",
    district: "Ghaziabad",
    tehsil: "Ghaziabad",
    village: "Sahibabad, Arthala, Morta & Duhai",
    villageLgdCode: "201005",
    sajraSheetNumber: "Sheet No. 01 (NCR Cadastral Sheet 2026)",
    scaleRatio: "1:2500 Cadastral Scale",
    surveyYear: "2026 DGPS & Satellite Ortho",
    corridorType: "linear_alignment",
    corridorWidthMeters: 60,
    corridorCenterline: [
      [28.648, 77.375],
      [28.662, 77.398],
      [28.675, 77.420],
      [28.690, 77.445],
    ],
    totalParcelsInVillageSheet: 20,
    totalAffectedParcels: 18,
    totalVillageAreaHa: 32.4,
    totalAffectedAreaHa: 26.8,
    totalUnaffectedAreaHa: 5.6,
    totalEstimatedCompensationLakhs: 5240.0,
    totalCompensationDisbursedLakhs: 2150.0,
    currentWorkflowStageIndex: 2,
    currentStageName: "Stage 2 — Land Identification",
    targetCompletionDate: "2026-11-30",
    calaOfficer: "Shri Rakesh Kumar Singh, IAS (District Magistrate & CALA, Ghaziabad)",
    parcels: GZB_PARCELS,
  },
];

// ------------------------------------------------------------
// GeoJSON Export Generator
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
  ruralMultiplier?: number;
  assetsValue?: number;
  additionalInterestMonths?: number;
}) {
  const ruralMultiplier = params.ruralMultiplier ?? 1.5;
  const baseMarketValue = Math.round(params.affectedAreaHa * params.circleRatePerHa);
  const multipliedValue = Math.round(baseMarketValue * ruralMultiplier);
  const solatiumAmount = multipliedValue; // 100% Solatium under Section 30(1)
  const assetsValue = params.assetsValue ?? 0;
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
// 12-Stage Lifecycle Metadata Map
// ------------------------------------------------------------
export const KHASRA_12_STAGE_DATA: Record<string, Partial<BhuNakshaParcel>> = {
  "DEMO-482": {
    stageIndex: 3,
    stageCode: "ror_verification",
    stageTitle: "Stage 3 — Survey & RoR Verification",
    rorVerification: {
      status: "Verified",
      verificationDate: "2026-02-15",
      khatauniNo: "KH-DL-482",
      verifiedBy: "A. K. Sharma (Patwari Alipur)",
      remarks: "Title verified against Delhi computerized revenue records; 0 encumbrances.",
    },
    fieldVerification: {
      status: "Verified",
      surveyDate: "2026-02-18",
      officer: "Er. S. K. Gupta (DGPS Surveyor)",
      dgpsAccuracyMeters: 0.02,
      remarks: "Field boundary markers verified against BhuNaksha vector polygon.",
      documents: ["JMS-Delhi-482.pdf", "DGPS-Vertex-Report.csv"],
    },
  },
  "DEMO-501": {
    stageIndex: 4,
    stageCode: "review_forward",
    stageTitle: "Stage 4 — Scrutiny & Review",
    rorVerification: {
      status: "Verified",
      verificationDate: "2026-02-10",
      khatauniNo: "KH-UP-501",
      verifiedBy: "R. P. Verma (Lekhpal Ghaziabad)",
      remarks: "Verified title against UP Bhulekh records.",
    },
    fieldVerification: {
      status: "Verified",
      surveyDate: "2026-02-14",
      officer: "Er. Amit Yadav (SLAO Land Surveyor)",
      dgpsAccuracyMeters: 0.03,
      remarks: "Boundary verified on Sahibabad corridor interface.",
      documents: ["JMS-GZB-501.pdf", "DGPS-Report.csv"],
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
      status: parcel.isAffected ? (parcel.rorVerification?.status || "Verified") : "Pending Verification",
      verificationDate: "2026-02-15",
      khatauniNo: parcel.owners[0]?.khatauniNumber || "KH-000",
      verifiedBy: parcel.state === "Delhi" ? "Patwari Office Alipur" : "Lekhpal Office Ghaziabad",
      remarks: parcel.rorVerification?.remarks || "Record of Rights verified.",
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
