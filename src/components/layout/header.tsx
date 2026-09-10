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
  Filter,
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
    <header className="sticky top-0 z-20 flex flex-col border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-md">
      {/* Top Tricolor Brand Accent Line */}
      <div className="tricolor-stripe" />

      {/* Main Header Row */}
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 gap-3">
        {/* Left: Search input */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={
                language === "hi"
                  ? "परियोजना, खसरा सं, या जिला खोजें..."
                  : "Search projects, survey/khasra numbers, district..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Center: Global State & Sector Filters */}
        <div className="hidden lg:flex items-center gap-2">
          {/* State selector */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-900/80 border border-slate-800 rounded-lg px-2 py-1">
            <Building2 className="h-3.5 w-3.5 text-amber-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-200">
                {language === "hi" ? "सभी राज्य / केंद्र शासित" : "All States & UTs"}
              </option>
              {INDIAN_STATES.map((st) => (
                <option key={st.code} value={st.code} className="bg-slate-900 text-slate-200">
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sector selector */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-900/80 border border-slate-800 rounded-lg px-2 py-1">
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-200">
                {language === "hi" ? "सभी क्षेत्र (Sectors)" : "All Sectors"}
              </option>
              <option value="highway" className="bg-slate-900 text-slate-200">National Highways</option>
              <option value="railway" className="bg-slate-900 text-slate-200">Railways & HSR</option>
              <option value="irrigation" className="bg-slate-900 text-slate-200">River Linking & Irrigation</option>
              <option value="industrial" className="bg-slate-900 text-slate-200">Industrial Corridors / Ports</option>
              <option value="renewable_energy" className="bg-slate-900 text-slate-200">Solar & Renewable</option>
              <option value="urban_development" className="bg-slate-900 text-slate-200">Urban Development</option>
            </select>
          </div>
        </div>

        {/* Right: Clock, Language, Notifications, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live IST clock */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-slate-900/50 px-2 py-1 rounded border border-slate-800/60">
            <Clock className="h-3 w-3 text-emerald-400" />
            <span>{timeStr}</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
            title="Toggle Language / भाषा बदलें"
          >
            <Languages className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-semibold">{language === "en" ? "हिन्दी" : "EN"}</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
              title="Statutory Notifications & Alerts"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                {MOCK_NOTIFICATIONS.length}
              </span>
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-amber-400" />
                    Statutory Gazette Alerts
                  </h4>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {MOCK_NOTIFICATIONS.length} unread
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {MOCK_NOTIFICATIONS.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5 text-xs hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-white truncate">
                          {notif.title}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 uppercase">
                          {notif.issuedDate}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                        {notif.description}
                      </p>
                      {notif.gazetteRef && (
                        <p className="mt-1 text-[9px] font-mono text-amber-400/80">
                          Ref: {notif.gazetteRef}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-center">
                  <a
                    href="/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] font-medium text-amber-400 hover:underline"
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
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-700/80 px-2.5 py-1.5 text-xs hover:border-amber-500/60 transition-all cursor-pointer"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30">
                <UserCheck className="h-3.5 w-3.5" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-amber-400 leading-tight">
                  {ROLE_CONFIGS[role].badge}
                </span>
                <span className="text-[11px] text-slate-300 font-medium leading-tight truncate max-w-[120px]">
                  {ROLE_CONFIGS[role].name.split(" ")[0]}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50">
                <div className="p-2 border-b border-slate-800/80">
                  <p className="text-[11px] font-semibold text-white">
                    Switch Stakeholder Perspective
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Test the system across administrative tiers
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
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col ${
                        role === item.id
                          ? "bg-amber-500/15 border border-amber-500/30 text-white"
                          : "hover:bg-slate-900 text-slate-300"
                      }`}
                    >
                      <span className="font-semibold flex items-center justify-between">
                        {item.label}
                        {role === item.id && (
                          <span className="text-[10px] text-amber-400">✓ Active</span>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
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
