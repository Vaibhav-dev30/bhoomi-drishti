// ============================================================
// BhoomiDrishti — Authentication & Jurisdictional RBAC Engine
// Real-world administrative hierarchy (National -> State -> District -> Local)
// ============================================================

import {
  AuthUser,
  AdministrativeJurisdiction,
  AccessRequest,
  ScopedAccessGrant,
  AuditLogEntry,
  Project,
  LandParcel,
  DashboardMetrics,
} from "@/types";
import { MOCK_PROJECTS, MOCK_PLOTS, NATIONAL_METRICS } from "./mock-data";
import { BhuNakshaParcel } from "./bhunaksha-service";

// --- Seeded Administrative Personas across the 4 Authority Levels ---
export const PRESEEDED_USERS: AuthUser[] = [
  // 1. LEVEL 0: NATIONAL LEVEL
  {
    id: "USR-NAT-01",
    name: "Dr. A. K. Sharma",
    email: "admin@nic.in",
    phone: "+91 98100 12345",
    role: "super_admin",
    designation: "Chief System Administrator & Apex Registrar",
    department: "National Informatics Centre (NIC)",
    jurisdiction: {
      level: "national",
      displayText: "All India (National Jurisdiction)",
    },
    createdAt: "2024-01-01",
  },
  {
    id: "USR-NAT-02",
    name: "Smt. Rashmi Verma, IAS",
    email: "rashmi.verma@morth.nic.in",
    phone: "+91 98111 23456",
    role: "central_ministry",
    designation: "Joint Secretary (Infrastructure Monitoring)",
    department: "Ministry of Road Transport & Highways (MoRTH)",
    jurisdiction: {
      level: "national",
      displayText: "National Oversight (Central Ministries)",
    },
    createdAt: "2024-01-05",
  },

  // 2. LEVEL 1: STATE LEVEL
  {
    id: "USR-STA-DL",
    name: "Shri Naresh Kumar, IAS",
    email: "cs.delhi@nic.in",
    phone: "+91 98110 34567",
    role: "state_government",
    designation: "Principal Secretary (Revenue) & Chief Secretary",
    department: "Government of NCT of Delhi",
    jurisdiction: {
      level: "state",
      state: "Delhi",
      stateCode: "DL",
      displayText: "Government of NCT of Delhi",
    },
    parentAuthorityId: "USR-NAT-02",
    parentAuthorityTitle: "Joint Secretary, Central Ministry (MoRTH)",
    parentAuthorityName: "Smt. Rashmi Verma, IAS",
    createdAt: "2024-01-10",
  },
  {
    id: "USR-STA-RJ",
    name: "Smt. Anandi Rathore, IAS",
    email: "sec.rj@gov.in",
    phone: "+91 98290 45678",
    role: "state_government",
    designation: "Principal Secretary (Energy & Infrastructure)",
    department: "Department of Energy, Rajasthan",
    jurisdiction: {
      level: "state",
      state: "Rajasthan",
      stateCode: "RJ",
      displayText: "State of Rajasthan",
    },
    parentAuthorityId: "USR-NAT-02",
    parentAuthorityTitle: "Joint Secretary, Central Ministry (MoRTH)",
    parentAuthorityName: "Smt. Rashmi Verma, IAS",
    createdAt: "2024-01-12",
  },
  {
    id: "USR-STA-UP",
    name: "Shri Durga Shanker Mishra, IAS",
    email: "sec.up@gov.in",
    phone: "+91 94150 56789",
    role: "state_government",
    designation: "Principal Secretary (Urban Development)",
    department: "Urban Development Department, Uttar Pradesh",
    jurisdiction: {
      level: "state",
      state: "Uttar Pradesh",
      stateCode: "UP",
      displayText: "State of Uttar Pradesh",
    },
    parentAuthorityId: "USR-NAT-02",
    parentAuthorityTitle: "Joint Secretary, Central Ministry (MoRTH)",
    parentAuthorityName: "Smt. Rashmi Verma, IAS",
    createdAt: "2024-01-15",
  },

  // 3. LEVEL 2: DISTRICT LEVEL (Collector & CALA)
  {
    id: "USR-DIS-DEL",
    name: "Shri Ashwini Kumar, IAS",
    email: "dm.delhi@nic.in",
    phone: "+91 98110 54321",
    role: "district_collector",
    designation: "District Magistrate & Competent Authority (CALA)",
    department: "Revenue Department, Government of NCT of Delhi",
    jurisdiction: {
      level: "district",
      state: "Delhi",
      stateCode: "DL",
      district: "North Delhi",
      districtCode: "DEL",
      displayText: "North Delhi District, NCT of Delhi",
    },
    parentAuthorityId: "USR-NAT-02",
    parentAuthorityTitle: "Joint Secretary, Central Ministry (MoRTH)",
    parentAuthorityName: "Smt. Rashmi Verma, IAS",
    createdAt: "2024-01-20",
  },
  {
    id: "USR-DIS-GZB",
    name: "Shri Rakesh Kumar Singh, IAS",
    email: "dm.ghaziabad@nic.in",
    phone: "+91 94150 12345",
    role: "district_collector",
    designation: "District Magistrate & Competent Authority (CALA)",
    department: "District Collectorate, Ghaziabad",
    jurisdiction: {
      level: "district",
      state: "Uttar Pradesh",
      stateCode: "UP",
      district: "Ghaziabad",
      districtCode: "GZB",
      displayText: "Ghaziabad District, Uttar Pradesh",
    },
    parentAuthorityId: "USR-STA-UP",
    parentAuthorityTitle: "Principal Secretary (Urban Dev), UP",
    parentAuthorityName: "Shri Durga Shanker Mishra, IAS",
    createdAt: "2024-01-22",
  },
  {
    id: "USR-DIS-NSK", // Legacy ID compatibility alias to Delhi
    name: "Shri Ashwini Kumar, IAS",
    email: "collector.nsk@nic.in",
    phone: "+91 98110 54321",
    role: "district_collector",
    designation: "District Magistrate & Competent Authority (CALA)",
    department: "Revenue Department, Government of NCT of Delhi",
    jurisdiction: {
      level: "district",
      state: "Delhi",
      stateCode: "DL",
      district: "North Delhi",
      districtCode: "DEL",
      displayText: "North Delhi District, NCT of Delhi",
    },
    parentAuthorityId: "USR-NAT-02",
    parentAuthorityTitle: "Joint Secretary, Central Ministry (MoRTH)",
    parentAuthorityName: "Smt. Rashmi Verma, IAS",
    createdAt: "2024-01-20",
  },

  // 4. LEVEL 3: TEHSIL LEVEL
  {
    id: "USR-TEH-ALI",
    name: "Shri Vikas Sharma",
    email: "tehsildar.alipur@delhi.gov.in",
    phone: "+91 98110 88990",
    role: "field_surveyor",
    designation: "Tehsildar & Assistant CALA (Alipur)",
    department: "Tehsil Office, Alipur Sub-Division, North Delhi",
    jurisdiction: {
      level: "tehsil",
      state: "Delhi",
      stateCode: "DL",
      district: "North Delhi",
      districtCode: "DEL",
      tehsil: "Alipur",
      tehsilCode: "ALIPUR",
      projectId: "DL-INFRA-001",
      displayText: "Alipur Tehsil, North Delhi",
    },
    parentAuthorityId: "USR-DIS-DEL",
    parentAuthorityTitle: "District Magistrate & CALA, Delhi",
    parentAuthorityName: "Shri Ashwini Kumar, IAS",
    createdAt: "2024-02-01",
  },

  // 5. LEVEL 4: PROJECT OFFICER LEVEL
  {
    id: "USR-PRJ-GZB",
    name: "Er. Suresh Deshmukh",
    email: "project.gzb@ncrtc.gov.in",
    phone: "+91 94150 90123",
    role: "lrb",
    designation: "Field Project In-Charge & Nodal Officer",
    department: "NCRTC / Regional Infrastructure Unit",
    jurisdiction: {
      level: "project",
      state: "Uttar Pradesh",
      stateCode: "UP",
      district: "Ghaziabad",
      districtCode: "GZB",
      projectId: "DL-GZB-002",
      projectName: "Delhi–Ghaziabad Regional Connectivity Project",
      displayText: "Project DL-GZB-002 Corridor",
    },
    parentAuthorityId: "USR-DIS-GZB",
    parentAuthorityTitle: "District Magistrate & CALA, Ghaziabad",
    parentAuthorityName: "Shri Rakesh Kumar Singh, IAS",
    createdAt: "2024-02-05",
  },
  {
    id: "USR-PRJ-01",
    name: "Er. Rajiv Tyagi",
    email: "project.ncr@gov.in",
    phone: "+91 98110 90123",
    role: "lrb",
    designation: "Chief Project Engineer & Nodal Officer",
    department: "Delhi-NCR Regional Infrastructure Planning Cell",
    jurisdiction: {
      level: "project",
      state: "Delhi",
      stateCode: "DL",
      district: "North Delhi",
      districtCode: "DEL",
      projectId: "DL-INFRA-001",
      projectName: "Delhi Land & Infrastructure Development Project",
      displayText: "Project DL-INFRA-001 Scope",
    },
    parentAuthorityId: "USR-DIS-DEL",
    parentAuthorityTitle: "District Magistrate & CALA, Delhi",
    parentAuthorityName: "Shri Ashwini Kumar, IAS",
    createdAt: "2024-01-28",
  },

  // 5. CITIZEN LEVEL
  {
    id: "USR-CIT-01",
    name: "Shri Ramesh Chand (Demo Landholder)",
    email: "citizen.ramesh@gmail.com",
    phone: "+91 98110 01234",
    role: "public",
    designation: "Registered Landowner (Demonstration Data)",
    department: "Citizen Public Portal",
    jurisdiction: {
      level: "project",
      state: "Delhi",
      district: "North Delhi",
      projectId: "DL-INFRA-001",
      displayText: "Alipur Locality, Survey DEMO-482",
    },
    parentAuthorityId: "USR-PRJ-01",
    parentAuthorityTitle: "Chief Project Engineer, Delhi Planning Cell",
    parentAuthorityName: "Er. Rajiv Tyagi",
    createdAt: "2024-02-15",
  },
];

// --- Initial Mock Access Requests ---
export const INITIAL_ACCESS_REQUESTS: AccessRequest[] = [
  {
    id: "REQ-2025-001",
    requesterId: "USR-DIS-GZB",
    requesterName: "Shri Rakesh Kumar Singh, IAS",
    requesterRole: "district_collector",
    requesterDesignation: "District Magistrate & CALA, Ghaziabad",
    requesterJurisdiction: "Ghaziabad District, Uttar Pradesh",
    targetType: "project",
    targetId: "DL-INFRA-001",
    targetName: "Delhi Land & Infrastructure Development Project",
    reason: "Inter-district alignment coordination between Delhi NCT boundary and Ghaziabad corridor node.",
    durationDays: 14,
    status: "pending",
    routedToLevel: "national",
    routedToRole: "central_ministry",
    createdAt: "2025-02-28T10:30:00Z",
  },
  {
    id: "REQ-2025-002",
    requesterId: "USR-DIS-DEL",
    requesterName: "Shri Ashwini Kumar, IAS",
    requesterRole: "district_collector",
    requesterDesignation: "District Magistrate & CALA, Delhi",
    requesterJurisdiction: "North Delhi District, Delhi",
    targetType: "project",
    targetId: "DL-GZB-002",
    targetName: "Delhi–Ghaziabad Regional Connectivity Project",
    reason: "Inter-district corridor interface coordination between Delhi NCT and Ghaziabad node.",
    durationDays: 30,
    status: "approved",
    routedToLevel: "national",
    routedToRole: "central_ministry",
    approverId: "USR-NAT-02",
    approverName: "Smt. Rashmi Verma, IAS",
    approverComments: "Approved for inter-district corridor interface coordination.",
    approvedAt: "2025-03-01T14:15:00Z",
    expiresAt: "2025-03-31T23:59:59Z",
    createdAt: "2025-02-25T09:00:00Z",
  },
];

// --- Initial Approved Scoped Access Grants ---
export const INITIAL_SCOPED_GRANTS: ScopedAccessGrant[] = [
  {
    id: "GRT-001",
    requestId: "REQ-2025-002",
    userId: "USR-STA-DL",
    targetType: "project",
    targetId: "DL-GZB-002",
    targetName: "Delhi–Ghaziabad Regional Connectivity Project",
    grantedBy: "Smt. Rashmi Verma, IAS (Central Ministry)",
    grantedAt: "2025-03-01T14:15:00Z",
    expiresAt: "2025-03-31T23:59:59Z",
  },
];

// --- Initial Audit Trail Log Entries ---
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "AUD-1001",
    timestamp: "2025-03-01 14:15:22 IST",
    userId: "USR-NAT-02",
    userName: "Smt. Rashmi Verma, IAS",
    userRole: "Central Ministry",
    userJurisdiction: "National Oversight",
    action: "ACCESS_REQUEST_APPROVED",
    targetResource: "DL-GZB-002 (Delhi-Ghaziabad Connectivity)",
    details: "Granted 30-day scoped cross-jurisdiction access to Shri Naresh Kumar, IAS (Delhi State)",
    ipAddress: "10.20.14.82 (NIC GovNet)",
  },
  {
    id: "AUD-1002",
    timestamp: "2025-02-28 10:30:15 IST",
    userId: "USR-DIS-GZB",
    userName: "Shri Rakesh Kumar Singh, IAS",
    userRole: "District Collector",
    userJurisdiction: "Ghaziabad District",
    action: "ACCESS_REQUEST_SUBMITTED",
    targetResource: "DL-INFRA-001 (Delhi Infrastructure Project)",
    details: "Submitted inter-district alignment coordination request routed to Central Ministry",
    ipAddress: "10.45.88.19 (UP GovNet)",
  },
  {
    id: "AUD-1003",
    timestamp: "2025-02-28 09:12:04 IST",
    userId: "USR-DIS-DEL",
    userName: "Shri Ashwini Kumar, IAS",
    userRole: "District Collector",
    userJurisdiction: "North Delhi District",
    action: "LOGIN",
    targetResource: "BhoomiDrishti Portal",
    details: "Two-factor authenticated administrator session initiated",
    ipAddress: "10.45.88.19 (Delhi NICNet)",
  },
];

// ============================================================
// Core Jurisdictional RBAC Checking Engine
// ============================================================

export interface ResourceAccessCheck {
  allowed: boolean;
  isScopedGrant?: boolean;
  reason?: string;
  seniorAuthority?: string;
  seniorRole?: string;
  seniorName?: string;
}

export function checkResourceAccess(
  user: AuthUser | null,
  grants: ScopedAccessGrant[],
  resource: {
    stateCode?: string;
    state?: string;
    districtCode?: string;
    district?: string;
    tehsilCode?: string;
    tehsil?: string;
    village?: string;
    projectId?: string;
    plotId?: string;
  }
): ResourceAccessCheck {
  if (!user) {
    return {
      allowed: false,
      reason: "Authentication required to access statutory land data.",
    };
  }

  const { jurisdiction } = user;

  // 1. Level 0: National administrators have all-India jurisdiction
  if (jurisdiction.level === "national" || user.role === "super_admin" || user.role === "central_ministry") {
    return { allowed: true };
  }

  // 2. Check if user holds an active, unexpired scoped grant for this resource
  const activeGrant = grants.find((g) => {
    const isUserGrant = g.userId === user.id;
    const notExpired = new Date(g.expiresAt).getTime() > Date.now();
    const matchesProject = g.targetType === "project" && g.targetId === resource.projectId;
    const matchesState = g.targetType === "state" && (g.targetId === resource.stateCode || g.targetId === resource.state);
    const matchesDistrict = g.targetType === "district" && g.targetId === resource.district;
    return isUserGrant && notExpired && (matchesProject || matchesState || matchesDistrict);
  });

  if (activeGrant) {
    return {
      allowed: true,
      isScopedGrant: true,
      reason: `Accessed under Temporary Scoped Grant issued by ${activeGrant.grantedBy} (Valid until ${new Date(activeGrant.expiresAt).toLocaleDateString()})`,
    };
  }

  // 3. Level 1: State authority check (State / UT level)
  if (jurisdiction.level === "state") {
    const userStateCode = jurisdiction.stateCode?.toUpperCase();
    const userState = (jurisdiction.state || "").toLowerCase();
    const resStateCode = resource.stateCode?.toUpperCase();
    const resState = (resource.state || "").toLowerCase();

    const matchesState =
      (resStateCode && userStateCode && resStateCode === userStateCode) ||
      (resState && userState && (resState === userState || (userStateCode === "DL" && resState.includes("delhi"))));

    if (matchesState) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `Outside authorized state jurisdiction. Your authority is restricted to ${jurisdiction.state || jurisdiction.displayText}.`,
      seniorAuthority: "Central Ministry / National Authority",
      seniorRole: "central_ministry",
      seniorName: user.parentAuthorityName || "Smt. Rashmi Verma, IAS",
    };
  }

  // 4. Level 2: District authority check
  if (jurisdiction.level === "district") {
    const userDist = (jurisdiction.district || "").toLowerCase();
    const userDistCode = jurisdiction.districtCode?.toUpperCase();
    const resDist = (resource.district || "").toLowerCase();
    const resDistCode = resource.districtCode?.toUpperCase();

    const matchesDistrict =
      (userDistCode && resDistCode && userDistCode === resDistCode) ||
      (userDist && resDist && (resDist.includes(userDist) || userDist.includes(resDist)));

    if (matchesDistrict) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `Outside authorized district boundary. Your authority is designated to ${jurisdiction.displayText}.`,
      seniorAuthority: user.parentAuthorityTitle || "State Government Authority",
      seniorRole: "state_government",
      seniorName: user.parentAuthorityName || "Principal Secretary (Revenue)",
    };
  }

  // 5. Level 3: Tehsil authority check
  if (jurisdiction.level === "tehsil") {
    const userTehsil = (jurisdiction.tehsil || "").toLowerCase();
    const resTehsil = (resource.tehsil || "").toLowerCase();
    const userProj = jurisdiction.projectId;
    const resProj = resource.projectId;

    // For projects: must match assigned project
    if (resProj && userProj && resProj !== userProj) {
      return {
        allowed: false,
        reason: `Outside assigned project/tehsil scope. Authorized strictly for ${jurisdiction.displayText}.`,
        seniorAuthority: user.parentAuthorityTitle || "District Magistrate & CALA",
        seniorRole: "district_collector",
        seniorName: user.parentAuthorityName || "District Collector",
      };
    }

    // For parcels: if parcel has tehsil, tehsil must match
    if (resTehsil && userTehsil && !resTehsil.includes(userTehsil) && !userTehsil.includes(resTehsil)) {
      return {
        allowed: false,
        reason: `Outside assigned tehsil boundary (${jurisdiction.tehsil}).`,
        seniorAuthority: user.parentAuthorityTitle || "Sub-Divisional Magistrate & CALA",
        seniorRole: "district_collector",
        seniorName: user.parentAuthorityName || "District Collector",
      };
    }

    return { allowed: true };
  }

  // 6. Level 4: Project authority check
  if (jurisdiction.level === "project") {
    const matchesProject = resource.projectId && resource.projectId === jurisdiction.projectId;
    if (matchesProject) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `Outside assigned project boundary. Authorized strictly for ${jurisdiction.projectName || jurisdiction.displayText}.`,
      seniorAuthority: user.parentAuthorityTitle || "District Collector & CALA",
      seniorRole: "district_collector",
      seniorName: user.parentAuthorityName || "District Collector",
    };
  }

  // Default: Public / Citizen
  if (user.role === "public") {
    if (resource.projectId && resource.projectId === jurisdiction.projectId) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: "Citizen portal access is restricted to notified plots in your registered village.",
      seniorAuthority: "Executive Project Officer",
      seniorRole: "lrb",
    };
  }

  return { allowed: false, reason: "Access denied by administrative jurisdiction policy." };
}

// ============================================================
// Data Filtering by Authorized Jurisdiction
// ============================================================

export function filterProjectsForUser(
  user: AuthUser | null,
  grants: ScopedAccessGrant[],
  projects: Project[]
): Project[] {
  if (!user) return [];
  return projects.filter((project) => {
    const check = checkResourceAccess(user, grants, {
      projectId: project.id,
      stateCode: project.stateCode,
      state: project.state,
      districtCode: project.districtCode,
      district: project.district,
      tehsil: project.tehsil,
    });
    return check.allowed;
  });
}

export function filterPlotsForUser(
  user: AuthUser | null,
  grants: ScopedAccessGrant[],
  plots: LandParcel[]
): LandParcel[] {
  if (!user) return [];
  return plots.filter((plot) => {
    const check = checkResourceAccess(user, grants, {
      projectId: plot.projectId,
      stateCode: plot.state === "Delhi" ? "DL" : "UP",
      state: plot.state,
      district: plot.district,
      tehsil: plot.tehsil,
      village: plot.village,
      plotId: plot.id,
    });
    return check.allowed;
  });
}

export function filterBhuParcelsForUser(
  user: AuthUser | null,
  grants: ScopedAccessGrant[],
  parcels: BhuNakshaParcel[]
): BhuNakshaParcel[] {
  if (!user) return [];
  return parcels.filter((p) => {
    const check = checkResourceAccess(user, grants, {
      projectId: p.projectId,
      stateCode: p.stateCode || (p.state === "Delhi" ? "DL" : "UP"),
      state: p.state,
      district: p.district,
      tehsil: p.tehsil,
      village: p.village,
      plotId: p.khasraNumber,
    });
    return check.allowed;
  });
}

export function calculateMetricsForUser(
  user: AuthUser | null,
  grants: ScopedAccessGrant[]
): DashboardMetrics {
  const allowedProjects = filterProjectsForUser(user, grants, MOCK_PROJECTS);
  const allowedPlots = filterPlotsForUser(user, grants, MOCK_PLOTS);

  const totalAreaProposed = allowedProjects.reduce((sum, p) => sum + p.totalAreaRequired, 0);
  const totalAreaNotified = allowedProjects.reduce((sum, p) => sum + p.areaNotified, 0);
  const totalAreaAcquired = allowedProjects.reduce((sum, p) => sum + p.areaAcquired, 0);
  const totalAreaPossessed = allowedProjects.reduce((sum, p) => sum + p.areaPossessed, 0);

  const totalCompensationAssessed = allowedProjects.reduce((sum, p) => sum + p.compensationAssessed, 0);
  const totalCompensationDisbursed = allowedProjects.reduce((sum, p) => sum + p.compensationDisbursed, 0);
  const totalCompensationPending = totalCompensationAssessed - totalCompensationDisbursed;

  const totalAffectedFamilies = allowedProjects.reduce((sum, p) => sum + p.totalAffectedFamilies, 0);
  const totalDisplacedFamilies = allowedProjects.reduce((sum, p) => sum + p.displacedFamilies, 0);
  const totalRRCompleted = allowedProjects.reduce((sum, p) => sum + p.rrCompletedFamilies, 0);

  return {
    totalAreaProposed: Number(totalAreaProposed.toFixed(1)),
    totalAreaNotified: Number(totalAreaNotified.toFixed(1)),
    totalAreaAcquired: Number(totalAreaAcquired.toFixed(1)),
    totalAreaPossessed: Number(totalAreaPossessed.toFixed(1)),
    totalCompensationAssessed,
    totalCompensationDisbursed,
    totalCompensationPending: Math.max(0, totalCompensationPending),
    totalAffectedFamilies,
    totalDisplacedFamilies,
    totalRRCompleted,
    totalProjects: allowedProjects.length,
    projectsOnTrack: allowedProjects.length,
    projectsDelayed: 0,
    projectsCompleted: allowedProjects.filter((p) => p.status === "possession_taken").length,
    sec11Issued: allowedProjects.filter((p) => p.sec11Date).length,
    sec19Declared: allowedProjects.filter((p) => p.sec19Date).length,
    awardsCompleted: allowedProjects.filter((p) => p.awardDate).length,
    possessionTaken: allowedProjects.filter((p) => p.possessionDate).length,
  };
}
