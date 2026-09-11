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
    id: "USR-STA-MH",
    name: "Shri Nitin Gadre, IAS",
    email: "sec.mh@gov.in",
    phone: "+91 98222 34567",
    role: "state_government",
    designation: "Principal Secretary (Revenue & Land)",
    department: "Revenue & Forest Department, Maharashtra",
    jurisdiction: {
      level: "state",
      state: "Maharashtra",
      stateCode: "MH",
      displayText: "State of Maharashtra",
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
    id: "USR-DIS-NSK",
    name: "Shri Jalaj Sharma, IAS",
    email: "collector.nsk@nic.in",
    phone: "+91 94220 67890",
    role: "district_collector",
    designation: "District Collector & Competent Authority (CALA)",
    department: "District Collectorate, Nashik",
    jurisdiction: {
      level: "district",
      state: "Maharashtra",
      stateCode: "MH",
      district: "Nashik",
      districtCode: "NSK",
      displayText: "Nashik District, Maharashtra",
    },
    parentAuthorityId: "USR-STA-MH",
    parentAuthorityTitle: "Principal Secretary (Revenue), Maharashtra",
    parentAuthorityName: "Shri Nitin Gadre, IAS",
    createdAt: "2024-01-20",
  },
  {
    id: "USR-DIS-PHL",
    name: "Shri Vikramaditya Rathore, RAS",
    email: "collector.phl@nic.in",
    phone: "+91 94140 78901",
    role: "district_collector",
    designation: "District Collector & Sub-Divisional Officer",
    department: "District Administration, Phalodi (Jodhpur)",
    jurisdiction: {
      level: "district",
      state: "Rajasthan",
      stateCode: "RJ",
      district: "Jodhpur (Phalodi)",
      districtCode: "PHL",
      displayText: "Phalodi District, Rajasthan",
    },
    parentAuthorityId: "USR-STA-RJ",
    parentAuthorityTitle: "Principal Secretary (Energy), Rajasthan",
    parentAuthorityName: "Smt. Anandi Rathore, IAS",
    createdAt: "2024-01-22",
  },
  {
    id: "USR-DIS-VNS",
    name: "Shri Alok Srivastava, IAS",
    email: "comm.vns@nic.in",
    phone: "+91 94500 89012",
    role: "district_collector",
    designation: "Municipal Commissioner & Competent Authority",
    department: "Varanasi Nagar Nigam & Smart City Cell",
    jurisdiction: {
      level: "district",
      state: "Uttar Pradesh",
      stateCode: "UP",
      district: "Varanasi",
      districtCode: "VNS",
      displayText: "Varanasi District, Uttar Pradesh",
    },
    parentAuthorityId: "USR-STA-UP",
    parentAuthorityTitle: "Principal Secretary (Urban Dev), UP",
    parentAuthorityName: "Shri Durga Shanker Mishra, IAS",
    createdAt: "2024-01-25",
  },

  // 4. LEVEL 3: TEHSIL & PROJECT OFFICER LEVEL
  {
    id: "USR-PRJ-SIN",
    name: "Er. Suresh Deshmukh",
    email: "sinnar.midc@gov.in",
    phone: "+91 98230 90123",
    role: "lrb",
    designation: "Executive Project Officer & Field In-Charge",
    department: "Maharashtra Industrial Development Corporation (MIDC)",
    jurisdiction: {
      level: "project",
      state: "Maharashtra",
      stateCode: "MH",
      district: "Nashik",
      districtCode: "NSK",
      tehsil: "Sinnar",
      projectId: "PRJ-001",
      projectName: "Sinnar Agro-Industrial Logistics Park",
      displayText: "Sinnar Agro-Industrial Project (PRJ-001)",
    },
    parentAuthorityId: "USR-DIS-NSK",
    parentAuthorityTitle: "District Collector & CALA, Nashik",
    parentAuthorityName: "Shri Jalaj Sharma, IAS",
    createdAt: "2024-02-01",
  },

  // 5. CITIZEN LEVEL
  {
    id: "USR-CIT-01",
    name: "Rameshwar Patil",
    email: "citizen.patil@gmail.com",
    phone: "+91 99220 01234",
    role: "public",
    designation: "Registered Landowner (Private)",
    department: "Citizen Portal",
    jurisdiction: {
      level: "project",
      state: "Maharashtra",
      district: "Nashik",
      projectId: "PRJ-001",
      displayText: "Sinnar MIDC, Gat No. 42/1 (Plot 01)",
    },
    parentAuthorityId: "USR-PRJ-SIN",
    parentAuthorityTitle: "Executive Project Officer, Sinnar MIDC",
    parentAuthorityName: "Er. Suresh Deshmukh",
    createdAt: "2024-02-15",
  },
];

// --- Initial Mock Access Requests ---
export const INITIAL_ACCESS_REQUESTS: AccessRequest[] = [
  {
    id: "REQ-2025-001",
    requesterId: "USR-DIS-NSK",
    requesterName: "Shri Jalaj Sharma, IAS",
    requesterRole: "district_collector",
    requesterDesignation: "District Collector, Nashik",
    requesterJurisdiction: "Nashik District, Maharashtra",
    targetType: "project",
    targetId: "PRJ-002",
    targetName: "Bhadla Clean Energy Solar Enclave",
    reason: "Inter-state benchmark study on solar park compensation models for proposed Malegaon green energy hub.",
    durationDays: 14,
    status: "pending",
    routedToLevel: "national",
    routedToRole: "central_ministry",
    createdAt: "2025-02-28T10:30:00Z",
  },
  {
    id: "REQ-2025-002",
    requesterId: "USR-STA-MH",
    requesterName: "Shri Nitin Gadre, IAS",
    requesterRole: "state_government",
    requesterDesignation: "Principal Secretary (Revenue), Maharashtra",
    requesterJurisdiction: "State of Maharashtra",
    targetType: "project",
    targetId: "PRJ-003",
    targetName: "Varanasi Riverfront Eco-Buffer & Greenway",
    reason: "Comparative evaluation of riparian buffer bio-fencing regulations under Section 4(1) SIA guidelines.",
    durationDays: 30,
    status: "approved",
    routedToLevel: "national",
    routedToRole: "central_ministry",
    approverId: "USR-NAT-02",
    approverName: "Smt. Rashmi Verma, IAS",
    approverComments: "Approved for inter-state policy alignment. Scoped strictly to riparian greenway survey data.",
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
    userId: "USR-STA-MH",
    targetType: "project",
    targetId: "PRJ-003",
    targetName: "Varanasi Riverfront Eco-Buffer & Greenway",
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
    targetResource: "PRJ-003 (Varanasi Eco-Buffer)",
    details: "Granted 30-day scoped cross-jurisdiction access to Shri Nitin Gadre, IAS (Maharashtra)",
    ipAddress: "10.20.14.82 (NIC GovNet)",
  },
  {
    id: "AUD-1002",
    timestamp: "2025-02-28 10:30:15 IST",
    userId: "USR-DIS-NSK",
    userName: "Shri Jalaj Sharma, IAS",
    userRole: "District Collector",
    userJurisdiction: "Nashik District",
    action: "ACCESS_REQUEST_SUBMITTED",
    targetResource: "PRJ-002 (Bhadla Solar Enclave)",
    details: "Submitted inter-state benchmark access request routed to Central Ministry",
    ipAddress: "10.45.88.19 (MahaOnline)",
  },
  {
    id: "AUD-1003",
    timestamp: "2025-02-28 09:12:04 IST",
    userId: "USR-DIS-NSK",
    userName: "Shri Jalaj Sharma, IAS",
    userRole: "District Collector",
    userJurisdiction: "Nashik District",
    action: "LOGIN",
    targetResource: "BhoomiDrishti Portal",
    details: "Two-factor authenticated administrator session initiated",
    ipAddress: "10.45.88.19 (MahaOnline)",
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
    district?: string;
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

  // 3. Level 1: State authority check
  if (jurisdiction.level === "state") {
    const matchesState =
      (resource.stateCode && resource.stateCode === jurisdiction.stateCode) ||
      (resource.state && resource.state === jurisdiction.state);

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
    const matchesDistrict = resource.district && resource.district.toLowerCase().includes((jurisdiction.district || "").toLowerCase());
    const matchesState =
      (resource.stateCode && resource.stateCode === jurisdiction.stateCode) ||
      (resource.state && resource.state === jurisdiction.state);

    if (matchesDistrict || (matchesState && !resource.district)) {
      return { allowed: true };
    }

    const seniorName = user.parentAuthorityName || "Principal Secretary (Revenue)";
    return {
      allowed: false,
      reason: `Outside authorized district boundary. Your authority is designated to ${jurisdiction.displayText}.`,
      seniorAuthority: user.parentAuthorityTitle || "State Government Authority",
      seniorRole: "state_government",
      seniorName,
    };
  }

  // 5. Level 3: Tehsil / Project officer check
  if (jurisdiction.level === "tehsil" || jurisdiction.level === "project") {
    const matchesProject = resource.projectId && resource.projectId === jurisdiction.projectId;

    if (matchesProject) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `Outside assigned project boundary. Authorized strictly for ${jurisdiction.displayText}.`,
      seniorAuthority: user.parentAuthorityTitle || "District Collector & CALA",
      seniorRole: "district_collector",
      seniorName: user.parentAuthorityName || "District Collector",
    };
  }

  // Default: Public or unassigned
  if (user.role === "public") {
    // Citizens can see their own project and public notifications
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
      district: project.district,
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
      stateCode: plot.state === "Maharashtra" ? "MH" : plot.state === "Rajasthan" ? "RJ" : "UP",
      state: plot.state,
      district: plot.district,
      plotId: plot.id,
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
