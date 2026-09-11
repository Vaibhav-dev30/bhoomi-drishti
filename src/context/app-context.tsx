"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  UserRole,
  AuthUser,
  AccessRequest,
  ScopedAccessGrant,
  AuditLogEntry,
  JurisdictionLevel,
} from "@/types";
import {
  PRESEEDED_USERS,
  INITIAL_ACCESS_REQUESTS,
  INITIAL_SCOPED_GRANTS,
  INITIAL_AUDIT_LOGS,
} from "@/lib/auth-store";

interface AppContextType {
  // Authentication & Profile
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsPersona: (personaId: string) => void;
  signup: (userData: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    designation: string;
    department: string;
    jurisdictionLevel: JurisdictionLevel;
    state?: string;
    stateCode?: string;
    district?: string;
    districtCode?: string;
    tehsil?: string;
    projectId?: string;
    projectName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Cross-Jurisdiction Access Requests
  accessRequests: AccessRequest[];
  submitAccessRequest: (params: {
    targetType: "project" | "district" | "state" | "plots";
    targetId: string;
    targetName: string;
    reason: string;
    durationDays: number;
    routedToLevel: JurisdictionLevel;
    routedToRole: string;
  }) => Promise<AccessRequest>;
  approveAccessRequest: (requestId: string, comments: string, durationDays?: number) => void;
  rejectAccessRequest: (requestId: string, comments: string) => void;
  scopedGrants: ScopedAccessGrant[];

  // Audit Logs
  auditLogs: AuditLogEntry[];
  logAuditEvent: (
    action: AuditLogEntry["action"],
    targetResource: string,
    details: string
  ) => void;

  // Legacy Filter & UI Controls
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  resetFilters: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const ROLE_CONFIGS: Record<
  UserRole,
  { name: string; title: string; dept: string; jurisdiction: string; badge: string }
> = {
  super_admin: {
    name: "Dr. A. K. Sharma",
    title: "Chief System Administrator",
    dept: "National Informatics Centre (NIC)",
    jurisdiction: "All India (National)",
    badge: "Super Admin",
  },
  central_ministry: {
    name: "Smt. Rashmi Verma, IAS",
    title: "Joint Secretary (Infrastructure Monitoring)",
    dept: "Ministry of Road Transport & Highways",
    jurisdiction: "National Oversight",
    badge: "Central Ministry",
  },
  state_government: {
    name: "Shri Nitin Gadre, IAS",
    title: "Principal Secretary (Revenue)",
    dept: "Revenue & Forest Department, Maharashtra",
    jurisdiction: "State of Maharashtra",
    badge: "State Govt",
  },
  district_collector: {
    name: "Shri Jalaj Sharma, IAS",
    title: "District Collector & CALA",
    dept: "District Administration, Nashik",
    jurisdiction: "Nashik District",
    badge: "Collector / CALA",
  },
  lrb: {
    name: "Er. Manoj Kumar Sinha",
    title: "Chief General Manager (Land Acquisition)",
    dept: "National Highways Authority of India (NHAI)",
    jurisdiction: "Project Implementing Body",
    badge: "LRB Official",
  },
  rr_commissioner: {
    name: "Smt. Sunita Rao",
    title: "Commissioner (R&R)",
    dept: "Rehabilitation & Resettlement Authority",
    jurisdiction: "R&R Jurisdiction",
    badge: "R&R Comm.",
  },
  sia_agency: {
    name: "Prof. Dilip Joshi",
    title: "Lead Social Impact Assessor",
    dept: "Tata Institute of Social Sciences (TISS)",
    jurisdiction: "Empanelled SIA Unit",
    badge: "SIA Unit",
  },
  field_surveyor: {
    name: "Prakash Shinde",
    title: "Talathi / Revenue Inspector",
    dept: "Tehsil Office, Sinnar",
    jurisdiction: "Field Survey Unit",
    badge: "Surveyor",
  },
  public: {
    name: "Rameshwar Patil",
    title: "Affected Landowner",
    dept: "Citizen / Affected Family",
    jurisdiction: "Village Sinnar, Gat No. 42",
    badge: "Citizen",
  },
};

const STORAGE_KEYS = {
  USER: "bhoomi_auth_user",
  REQUESTS: "bhoomi_access_requests",
  GRANTS: "bhoomi_scoped_grants",
  LOGS: "bhoomi_audit_logs",
  USERS_LIST: "bhoomi_all_users",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Load initialized state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    // Default to null so unauthenticated visitors see the public landing page first
    return null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return PRESEEDED_USERS;
  });

  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_ACCESS_REQUESTS;
  });

  const [scopedGrants, setScopedGrants] = useState<ScopedAccessGrant[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.GRANTS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_SCOPED_GRANTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  // UI state
  const [role, setRoleState] = useState<UserRole>(currentUser?.role || "district_collector");
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Sync role with currentUser
  useEffect(() => {
    if (currentUser) {
      setRoleState(currentUser.role);
    }
  }, [currentUser]);

  // Save changes to localStorage
  const saveUserSession = (user: AuthUser | null) => {
    setCurrentUser(user);
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
  };

  const saveRequests = (reqs: AccessRequest[]) => {
    setAccessRequests(reqs);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(reqs));
    }
  };

  const saveGrants = (grants: ScopedAccessGrant[]) => {
    setScopedGrants(grants);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.GRANTS, JSON.stringify(grants));
    }
  };

  const saveLogs = (logs: AuditLogEntry[]) => {
    setAuditLogs(logs);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    }
  };

  const logAuditEvent = useCallback(
    (action: AuditLogEntry["action"], targetResource: string, details: string) => {
      const now = new Date();
      const timestamp =
        now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";

      const newEntry: AuditLogEntry = {
        id: `AUD-${Date.now().toString().slice(-6)}`,
        timestamp,
        userId: currentUser?.id || "ANONYMOUS",
        userName: currentUser?.name || "Unauthenticated Session",
        userRole: currentUser?.designation || currentUser?.role || "Public",
        userJurisdiction: currentUser?.jurisdiction.displayText || "Public",
        action,
        targetResource,
        details,
        ipAddress: "10." + Math.floor(Math.random() * 80 + 10) + "." + Math.floor(Math.random() * 200) + ".14",
      };

      setAuditLogs((prev) => {
        const updated = [newEntry, ...prev];
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
        }
        return updated;
      });
    },
    [currentUser]
  );

  // Authenticate user via email
  const login = async (email: string, _password?: string) => {
    const trimmed = email.trim().toLowerCase();
    const found = registeredUsers.find((u) => u.email.toLowerCase() === trimmed);

    if (!found) {
      return {
        success: false,
        error: "No administrator or citizen record found for this email address.",
      };
    }

    saveUserSession(found);
    logAuditEvent("LOGIN", "Authentication Portal", `Successful login as ${found.designation} (${found.jurisdiction.displayText})`);
    return { success: true };
  };

  // 1-Click quick persona login
  const loginAsPersona = (personaId: string) => {
    const persona = registeredUsers.find((u) => u.id === personaId) || PRESEEDED_USERS.find((u) => u.id === personaId);
    if (persona) {
      saveUserSession(persona);
      logAuditEvent("LOGIN", "1-Click Persona Switch", `Switched active persona to ${persona.name} (${persona.jurisdiction.displayText})`);
    }
  };

  // Register a new user
  const signup = async (data: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    designation: string;
    department: string;
    jurisdictionLevel: JurisdictionLevel;
    state?: string;
    stateCode?: string;
    district?: string;
    districtCode?: string;
    tehsil?: string;
    projectId?: string;
    projectName?: string;
  }) => {
    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (existing) {
      return { success: false, error: "An account with this email address already exists." };
    }

    let displayText = "All India (National Jurisdiction)";
    let parentTitle = "Central Ministry (MoRTH)";
    let parentName = "Smt. Rashmi Verma, IAS";

    if (data.jurisdictionLevel === "state") {
      displayText = `State of ${data.state || "Assigned State"}`;
      parentTitle = "Joint Secretary, Central Ministry";
      parentName = "Smt. Rashmi Verma, IAS";
    } else if (data.jurisdictionLevel === "district") {
      displayText = `${data.district || "District"}, ${data.state || "State"}`;
      parentTitle = "Principal Secretary (Revenue)";
      parentName = "State Government Authority";
    } else if (data.jurisdictionLevel === "tehsil" || data.jurisdictionLevel === "project") {
      displayText = `${data.projectName || data.tehsil || "Local Project Boundary"}`;
      parentTitle = "District Collector & CALA";
      parentName = "District Collector";
    }

    const newUser: AuthUser = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: data.name,
      email: data.email,
      phone: data.phone || "+91 98000 00000",
      role: data.role,
      designation: data.designation,
      department: data.department,
      jurisdiction: {
        level: data.jurisdictionLevel,
        state: data.state,
        stateCode: data.stateCode,
        district: data.district,
        districtCode: data.districtCode,
        tehsil: data.tehsil,
        projectId: data.projectId,
        projectName: data.projectName,
        displayText,
      },
      parentAuthorityTitle: parentTitle,
      parentAuthorityName: parentName,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updatedUsers));
    }

    saveUserSession(newUser);
    logAuditEvent(
      "SIGNUP",
      "Account Creation",
      `New ${newUser.jurisdiction.level}-level administrator enrolled: ${newUser.name} (${displayText})`
    );

    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      logAuditEvent("LOGOUT", "Session Termination", `User ${currentUser.name} signed out`);
    }
    saveUserSession(null);
    router.push("/");
  };

  // Submit a Request Access for Out-of-Jurisdiction Data
  const submitAccessRequest = async (params: {
    targetType: "project" | "district" | "state" | "plots";
    targetId: string;
    targetName: string;
    reason: string;
    durationDays: number;
    routedToLevel: JurisdictionLevel;
    routedToRole: string;
  }) => {
    if (!currentUser) {
      throw new Error("Must be authenticated to submit access request");
    }

    const newRequest: AccessRequest = {
      id: `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRole: currentUser.role,
      requesterDesignation: currentUser.designation,
      requesterJurisdiction: currentUser.jurisdiction.displayText,
      targetType: params.targetType,
      targetId: params.targetId,
      targetName: params.targetName,
      reason: params.reason,
      durationDays: params.durationDays,
      status: "pending",
      routedToLevel: params.routedToLevel,
      routedToRole: params.routedToRole,
      createdAt: new Date().toISOString(),
    };

    const updated = [newRequest, ...accessRequests];
    saveRequests(updated);

    logAuditEvent(
      "ACCESS_REQUEST_SUBMITTED",
      `${params.targetType.toUpperCase()}: ${params.targetName}`,
      `${currentUser.name} requested ${params.durationDays}-day scoped access. Reason: ${params.reason}`
    );

    return newRequest;
  };

  // Senior Administrator Approves Request
  const approveAccessRequest = (requestId: string, comments: string, customDurationDays?: number) => {
    if (!currentUser) return;

    const request = accessRequests.find((r) => r.id === requestId);
    if (!request) return;

    const days = customDurationDays || request.durationDays || 14;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    const updatedRequests = accessRequests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: "approved" as const,
          approverId: currentUser.id,
          approverName: currentUser.name,
          approverComments: comments || "Approved by Competent Authority under statutory provisions.",
          approvedAt: new Date().toISOString(),
          expiresAt,
        };
      }
      return r;
    });
    saveRequests(updatedRequests);

    // Issue Scoped Access Grant
    const newGrant: ScopedAccessGrant = {
      id: `GRT-${Date.now().toString().slice(-6)}`,
      requestId,
      userId: request.requesterId,
      targetType: request.targetType,
      targetId: request.targetId,
      targetName: request.targetName,
      grantedBy: `${currentUser.name} (${currentUser.designation})`,
      grantedAt: new Date().toISOString(),
      expiresAt,
    };

    const updatedGrants = [newGrant, ...scopedGrants];
    saveGrants(updatedGrants);

    logAuditEvent(
      "ACCESS_REQUEST_APPROVED",
      `${request.targetType.toUpperCase()}: ${request.targetName}`,
      `Approved by ${currentUser.name} for ${request.requesterName} (Valid ${days} days). Remarks: ${comments}`
    );
  };

  // Senior Administrator Rejects Request
  const rejectAccessRequest = (requestId: string, comments: string) => {
    if (!currentUser) return;

    const request = accessRequests.find((r) => r.id === requestId);
    if (!request) return;

    const updatedRequests = accessRequests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: "rejected" as const,
          approverId: currentUser.id,
          approverName: currentUser.name,
          approverComments: comments || "Access request does not fulfill statutory necessity criteria.",
          approvedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    saveRequests(updatedRequests);

    logAuditEvent(
      "ACCESS_REQUEST_REJECTED",
      `${request.targetType.toUpperCase()}: ${request.targetName}`,
      `Rejected by ${currentUser.name}. Justification: ${comments}`
    );
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    // Find preseeded user for this role if any
    const match = PRESEEDED_USERS.find((u) => u.role === newRole);
    if (match) {
      saveUserSession(match);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedState("all");
    setSelectedSector("all");
    setSelectedStatus("all");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        loginAsPersona,
        signup,
        logout,
        accessRequests,
        submitAccessRequest,
        approveAccessRequest,
        rejectAccessRequest,
        scopedGrants,
        auditLogs,
        logAuditEvent,
        role,
        setRole,
        language,
        setLanguage,
        searchQuery,
        setSearchQuery,
        selectedState,
        setSelectedState,
        selectedSector,
        setSelectedSector,
        selectedStatus,
        setSelectedStatus,
        resetFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
