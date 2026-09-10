// ============================================================
// BhoomiDrishti — Core Type Definitions
// National Land Acquisition & Management System
// ============================================================

// --- Enums ---

export type ProjectStatus =
  | "proposal_submitted"
  | "sia_in_progress"
  | "sia_completed"
  | "expert_review"
  | "sec11_notified"
  | "objections_open"
  | "sec19_declared"
  | "award_in_progress"
  | "award_completed"
  | "compensation_disbursing"
  | "rr_in_progress"
  | "possession_taken"
  | "completed";

export type ProjectType =
  | "highway"
  | "railway"
  | "irrigation"
  | "industrial"
  | "urban_development"
  | "renewable_energy"
  | "defense"
  | "other";

export type LandType =
  | "agricultural"
  | "residential"
  | "commercial"
  | "industrial"
  | "forest"
  | "wasteland"
  | "water_body"
  | "government";

export type ParcelStatus =
  | "proposed"
  | "notified"
  | "surveyed"
  | "objection_filed"
  | "acquired"
  | "compensation_paid"
  | "possessed";

export type CompensationStatus =
  | "pending_assessment"
  | "assessed"
  | "approved"
  | "partially_paid"
  | "fully_paid"
  | "disputed";

export type RRStatus =
  | "not_started"
  | "plan_drafted"
  | "plan_approved"
  | "monetary_paid"
  | "housing_allotted"
  | "livelihood_provided"
  | "completed";

export type NotificationType =
  | "sec4_sia"
  | "sec11_preliminary"
  | "sec15_objection"
  | "sec19_declaration"
  | "sec21_notice"
  | "sec23_award"
  | "sec38_possession";

export type UserRole =
  | "super_admin"
  | "central_ministry"
  | "state_government"
  | "district_collector"
  | "lrb"
  | "rr_commissioner"
  | "sia_agency"
  | "field_surveyor"
  | "public";

// --- Core Entities ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  state?: string;
  district?: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  projectCode: string;
  type: ProjectType;
  status: ProjectStatus;
  description: string;
  lrbName: string;
  lrbType: string;
  state: string;
  stateCode: string;
  district: string;
  districtCode: string;
  tehsil: string;
  villages: string[];

  // Area metrics (hectares)
  totalAreaRequired: number;
  areaNotified: number;
  areaAcquired: number;
  areaPossessed: number;

  // Family metrics
  totalAffectedFamilies: number;
  displacedFamilies: number;
  rrCompletedFamilies: number;

  // Financial metrics (in lakhs ₹)
  estimatedCost: number;
  compensationAssessed: number;
  compensationDisbursed: number;
  rrCost: number;

  // Timeline
  proposalDate: string;
  siaStartDate?: string;
  siaCompletionDate?: string;
  sec11Date?: string;
  sec19Date?: string;
  awardDate?: string;
  possessionDate?: string;
  targetCompletionDate: string;

  // GIS
  centerLat: number;
  centerLng: number;
  parcels?: LandParcel[];
}

export interface LandParcel {
  id: string;
  projectId: string;
  surveyNumber: string;
  khasraNumber: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  areaHectares: number;
  landType: LandType;
  ownershipType: "private" | "government" | "community" | "forest";
  status: ParcelStatus;
  ownerName: string;
  ownerContact?: string;
  marketValue: number; // per hectare in ₹
  // GIS coordinates [lat, lng]
  coordinates: [number, number];
  // Polygon boundary [[lat, lng], ...]
  boundary?: [number, number][];
}

export interface AffectedFamily {
  id: string;
  projectId: string;
  parcelId: string;
  familyHeadName: string;
  fatherHusbandName: string;
  aadhaarRef?: string;
  familyMembers: number;
  category: "general" | "obc" | "sc" | "st";
  isBPL: boolean;
  isDisplaced: boolean;
  landLost: number; // hectares
  structureLost: boolean;
  livelihoods: string[];
  compensationStatus: CompensationStatus;
  rrStatus: RRStatus;
  totalCompensation: number;
  compensationPaid: number;
  village: string;
  district: string;
  state: string;
}

export interface Compensation {
  id: string;
  familyId: string;
  projectId: string;
  parcelId: string;
  marketValue: number;
  solatium: number;
  multiplierFactor: number;
  assetsValue: number; // structures, trees, crops
  totalAmount: number;
  amountPaid: number;
  interestAccrued: number;
  paymentStatus: CompensationStatus;
  awardDate?: string;
  paymentDate?: string;
}

export interface Notification {
  id: string;
  projectId: string;
  type: NotificationType;
  title: string;
  description: string;
  status: "draft" | "published" | "expired" | "cancelled";
  issuedDate: string;
  expiryDate?: string;
  gazetteRef?: string;
  documentUrl?: string;
}

export interface RREntitlement {
  id: string;
  familyId: string;
  projectId: string;
  housingAllotted: boolean;
  housingStatus: "not_applicable" | "allotted" | "constructed" | "handed_over";
  employmentProvided: boolean;
  employmentType?: "government_job" | "lump_sum_500000" | "annuity_2000_monthly";
  subsistenceAllowance: number; // ₹3000/month for 12 months
  transportGrant: number; // ₹50,000
  cattleShedGrant: number; // ₹25,000
  resettlementAllowance: number; // ₹50,000
  stampDutyExemption: boolean;
  totalEntitlement: number;
  amountDisbursed: number;
  status: RRStatus;
}

// --- Dashboard Metrics ---

export interface DashboardMetrics {
  // Area (hectares)
  totalAreaProposed: number;
  totalAreaNotified: number;
  totalAreaAcquired: number;
  totalAreaPossessed: number;

  // Financial (₹ Crore)
  totalCompensationAssessed: number;
  totalCompensationDisbursed: number;
  totalCompensationPending: number;

  // Families
  totalAffectedFamilies: number;
  totalDisplacedFamilies: number;
  totalRRCompleted: number;

  // Projects
  totalProjects: number;
  projectsOnTrack: number;
  projectsDelayed: number;
  projectsCompleted: number;

  // Notifications
  sec11Issued: number;
  sec19Declared: number;
  awardsCompleted: number;
  possessionTaken: number;
}

export interface StateMetrics {
  stateCode: string;
  stateName: string;
  totalProjects: number;
  areaAcquired: number;
  areaNotified: number;
  compensationDisbursed: number;
  affectedFamilies: number;
  completionPercentage: number;
}

export interface SectorMetrics {
  sector: ProjectType;
  label: string;
  projectCount: number;
  areaAcquired: number;
  compensation: number;
  families: number;
  color: string;
}

export interface TimelineDataPoint {
  month: string;
  areaNotified: number;
  areaAcquired: number;
  areaPossessed: number;
  compensationPaid: number;
}

export interface WorkflowStage {
  id: string;
  name: string;
  section: string;
  status: "completed" | "current" | "upcoming" | "overdue";
  startDate?: string;
  completedDate?: string;
  deadline?: string;
  description: string;
}

// --- UI Types ---

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  roles: UserRole[];
  children?: NavItem[];
}

export interface KPICard {
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: "blue" | "green" | "orange" | "red" | "purple" | "amber";
}

export interface FilterOption {
  label: string;
  value: string;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  proposal_submitted: "Proposal Submitted",
  sia_in_progress: "SIA In Progress",
  sia_completed: "SIA Completed",
  expert_review: "Expert Review",
  sec11_notified: "Sec 11 Notified",
  objections_open: "Objections Open",
  sec19_declared: "Sec 19 Declared",
  award_in_progress: "Award In Progress",
  award_completed: "Award Completed",
  compensation_disbursing: "Compensation Disbursing",
  rr_in_progress: "R&R In Progress",
  possession_taken: "Possession Taken",
  completed: "Completed",
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  highway: "National Highway",
  railway: "Railway",
  irrigation: "Irrigation",
  industrial: "Industrial Corridor",
  urban_development: "Urban Development",
  renewable_energy: "Renewable Energy",
  defense: "Defense",
  other: "Other",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  proposal_submitted: "bg-slate-500",
  sia_in_progress: "bg-blue-500",
  sia_completed: "bg-blue-600",
  expert_review: "bg-indigo-500",
  sec11_notified: "bg-amber-500",
  objections_open: "bg-orange-500",
  sec19_declared: "bg-purple-500",
  award_in_progress: "bg-pink-500",
  award_completed: "bg-rose-500",
  compensation_disbursing: "bg-emerald-500",
  rr_in_progress: "bg-teal-500",
  possession_taken: "bg-cyan-500",
  completed: "bg-green-600",
};

export const PROJECT_TYPE_COLORS: Record<ProjectType, string> = {
  highway: "#f59e0b",
  railway: "#3b82f6",
  irrigation: "#06b6d4",
  industrial: "#8b5cf6",
  urban_development: "#ec4899",
  renewable_energy: "#22c55e",
  defense: "#ef4444",
  other: "#6b7280",
};
