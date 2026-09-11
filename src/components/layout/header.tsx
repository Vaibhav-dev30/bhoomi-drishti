"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Languages,
  UserCheck,
  ChevronDown,
  Building2,
  Clock,
  Layers,
  Check,
} from "lucide-react";
import { useApp, ROLE_CONFIGS } from "@/context/app-context";
import { UserRole } from "@/types";
import { INDIAN_STATES, MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const {
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
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const rolesList: { id: UserRole; label: string; desc: string }[] = [
    { id: "super_admin", label: "Super Admin (NIC / Central)", desc: "Full administrative & statutory configuration access" },
    { id: "central_ministry", label: "Central Ministry (Joint Secy)", desc: "All-India multi-state projects & policy tracking" },
    { id: "state_government", label: "State Government (Principal Secy)", desc: "State-level gazette publications & sanctions" },
    { id: "district_collector", label: "District Collector / CALA (Nashik)", desc: "Sec 11/19 declarations, awards, & hearings" },
    { id: "lrb", label: "Land Requiring Body (NHAI / Rly)", desc: "Proposal submissions & possession monitoring" },
    { id: "rr_commissioner", label: "R&R Commissioner", desc: "Schedule II/III entitlements & civic amenities" },
    { id: "sia_agency", label: "SIA Agency (TISS / Empanelled)", desc: "Social Impact Assessment studies & public hearings" },
    { id: "field_surveyor", label: "Field Surveyor / Talathi", desc: "Mobile GPS geotagging & ground-truth validation" },
    { id: "public", label: "Affected Landowner / Citizen", desc: "Claim search, compensation tracking, & objections" },
  ];

  return (
    <header className="sticky top-0 z-20 flex flex-col border-b border-[#E5E0D6] bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Tricolor Brand Accent Line */}
      <div className="tricolor-stripe" />

      {/* Main Header Row */}
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 gap-3">
        {/* Left: Search input */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0284C7]" />
            <input
              type="text"
              placeholder={
                language === "hi"
                  ? "परियोजना, खसरा सं, या जिला खोजें..."
                  : "Search projects, survey/khasra numbers, district..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#0284C7] focus:outline-none focus:ring-1 focus:ring-[#0284C7] transition-all"
            />
          </div>
        </div>

        {/* Center: Global State & Sector Filters */}
        <div className="hidden lg:flex items-center gap-2">
          {/* State selector */}
          <div className="flex items-center gap-1.5 text-xs bg-[#FAF8F5] border border-[#E5E0D6] rounded-xl px-2.5 py-1">
            <Building2 className="h-3.5 w-3.5 text-[#0284C7]" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-slate-700 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">
                {language === "hi" ? "सभी राज्य / केंद्र शासित" : "All States & UTs"}
              </option>
              {INDIAN_STATES.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sector selector */}
          <div className="flex items-center gap-1.5 text-xs bg-[#FAF8F5] border border-[#E5E0D6] rounded-xl px-2.5 py-1">
            <Layers className="h-3.5 w-3.5 text-[#15803D]" />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-transparent text-slate-700 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">
                {language === "hi" ? "सभी क्षेत्र (Sectors)" : "All Sectors"}
              </option>
              <option value="highway">National Highways</option>
              <option value="railway">Railways & HSR</option>
              <option value="irrigation">River Linking & Irrigation</option>
              <option value="industrial">Industrial Corridors / Ports</option>
              <option value="renewable_energy">Solar & Renewable</option>
              <option value="urban_development">Urban Development</option>
            </select>
          </div>
        </div>

        {/* Right: Clock, Language, Notifications, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live IST clock */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-600 font-mono bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E5E0D6]">
            <Clock className="h-3 w-3 text-[#15803D]" />
            <span>{timeStr}</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6] text-slate-700 hover:text-slate-900 hover:bg-[#F2EFE8] transition-colors"
            title="Toggle Language / भाषा बदलें"
          >
            <Languages className="h-3.5 w-3.5 text-[#0284C7]" />
            <span className="font-bold">{language === "en" ? "हिन्दी" : "EN"}</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6] text-slate-600 hover:text-slate-900 hover:bg-[#F2EFE8] transition-colors cursor-pointer"
              title="Statutory Notifications & Alerts"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0284C7] text-[10px] font-bold text-white">
                {MOCK_NOTIFICATIONS.length}
              </span>
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#E5E0D6] bg-white p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-[#0284C7]" />
                    <span>Statutory Gazette Alerts</span>
                  </h4>
                  <span className="text-[10px] text-[#0284C7] font-mono font-bold">
                    {MOCK_NOTIFICATIONS.length} active
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {MOCK_NOTIFICATIONS.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className="rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] p-2.5 text-xs hover:border-[#BAE6FD] hover:bg-[#F0F9FF] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 truncate">
                          {notif.title}
                        </span>
                        <span className="text-[9px] font-mono text-[#15803D] uppercase font-semibold">
                          {notif.issuedDate}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {notif.description}
                      </p>
                      {notif.gazetteRef && (
                        <p className="mt-1 text-[9px] font-mono text-[#0284C7] font-medium">
                          Ref: {notif.gazetteRef}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-center">
                  <a
                    href="/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] font-semibold text-[#0284C7] hover:underline"
                  >
                    View All Statutory Notifications →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6] px-3 py-1.5 text-xs hover:border-[#0284C7] transition-all cursor-pointer shadow-xs"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E0F2FE] text-[#0284C7] font-bold text-xs">
                <UserCheck className="h-3.5 w-3.5" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-[#0284C7] leading-tight">
                  {ROLE_CONFIGS[role].badge}
                </span>
                <span className="text-[11px] text-slate-800 font-semibold leading-tight truncate max-w-[120px]">
                  {ROLE_CONFIGS[role].name.split(" ")[0]}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-500" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-[#E5E0D6] bg-white p-2 shadow-2xl z-50">
                <div className="p-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold text-slate-900">
                    Switch Administrative Perspective
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Live role-based view switcher
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto py-1 space-y-1">
                  {rolesList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setRole(item.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex flex-col cursor-pointer ${
                        role === item.id
                          ? "bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1]"
                          : "hover:bg-[#FAF8F5] text-slate-700"
                      }`}
                    >
                      <span className="font-bold flex items-center justify-between">
                        {item.label}
                        {role === item.id && (
                          <span className="text-[10px] text-[#0284C7] font-semibold flex items-center gap-0.5">
                            <Check className="h-3 w-3" /> Active
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
