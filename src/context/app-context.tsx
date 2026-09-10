"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "@/types";

interface AppContextType {
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
    name: "Ramesh Patil",
    title: "Affected Landowner",
    dept: "Citizen / Affected Family",
    jurisdiction: "Village Sinnar, Gat No. 42",
    badge: "Citizen",
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("super_admin");
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedState("all");
    setSelectedSector("all");
    setSelectedStatus("all");
  };

  return (
    <AppContext.Provider
      value={{
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
