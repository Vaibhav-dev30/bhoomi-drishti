"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  LogOut,
  ShieldCheck,
  KeyRound,
  FileCheck2,
  Inbox,
  Sparkles,
} from "lucide-react";
import { useApp, ROLE_CONFIGS } from "@/context/app-context";
import { PRESEEDED_USERS } from "@/lib/auth-store";
import { INDIAN_STATES, MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const {
    currentUser,
    loginAsPersona,
    logout,
    accessRequests,
    role,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    selectedState,
    setSelectedState,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
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

  // Pending requests for this authority
  const pendingRequestsCount = accessRequests.filter((r) => r.status === "pending").length;

  return (
    <header className="sticky top-0 z-20 flex flex-col border-b border-[#E5E0D6] bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Tricolor Brand Accent Line */}
      <div className="tricolor-stripe" />

      {/* Main Header Row */}
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 gap-3">
        {/* Left: Mobile Brand & Search input */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <Link href="/dashboard" className="flex md:hidden items-center gap-1.5 shrink-0">
            <img src="/logo.png" alt="BhoomiDrishti" className="h-8 w-8 object-contain rounded-lg border border-[#E5E0D6] bg-white p-0.5" />
          </Link>
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

        {/* Center: Jurisdiction Badge & Clock */}
        <div className="flex items-center gap-2">
          {currentUser && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
              <span className="text-[10.5px] uppercase font-bold text-slate-500 hidden sm:inline">Jurisdiction:</span>
              <span className="font-bold text-slate-900 font-mono text-[11px] truncate max-w-[180px] sm:max-w-[240px]">
                {currentUser.jurisdiction.displayText}
              </span>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-slate-500 bg-[#FAF8F5] border border-[#E5E0D6] px-2.5 py-1 rounded-full">
            <Clock className="h-3 w-3 text-[#0284C7]" />
            <span>{timeStr || "09:00:00 AM IST"}</span>
          </div>
        </div>

        {/* Right: Actions (Language, Access Requests Bell, Profile / Persona Switcher) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6] px-2.5 py-1.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-[#F2EFE8] transition-colors cursor-pointer"
            title="Switch Language / भाषा बदलें"
          >
            <Languages className="h-3.5 w-3.5 text-[#15803D]" />
            <span className="font-bold">{language === "en" ? "हिन्दी" : "EN"}</span>
          </button>

          {/* Access Requests Link / Bell */}
          <Link href="/access-requests">
            <button
              className="relative p-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6] text-slate-600 hover:text-slate-900 hover:bg-[#F2EFE8] transition-colors cursor-pointer"
              title="Access Requests & Senior Sanctions"
            >
              <Inbox className="h-4 w-4 text-[#0284C7]" />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-xs">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          </Link>

          {/* User Profile & Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6] px-3 py-1.5 text-xs hover:border-[#0284C7] transition-all cursor-pointer shadow-xs"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#15803D] font-bold text-xs">
                <UserCheck className="h-3.5 w-3.5" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-[#15803D] leading-tight">
                  {currentUser?.jurisdiction.level.toUpperCase()} LEVEL
                </span>
                <span className="text-[11px] text-slate-800 font-semibold leading-tight truncate max-w-[130px]">
                  {currentUser?.name || "Official"}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-500" />
            </button>

            {/* Profile & Switcher Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#E5E0D6] bg-white p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Active user card */}
                {currentUser && (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E0D6] space-y-1 mb-2">
                    <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-600 font-medium">{currentUser.designation}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{currentUser.department}</div>
                    <div className="pt-1 mt-1 border-t border-[#E5E0D6] text-[10px] text-[#0284C7] font-semibold flex items-center gap-1">
                      <span>Authority:</span>
                      <span className="font-mono">{currentUser.jurisdiction.displayText}</span>
                    </div>
                  </div>
                )}

                <div className="py-1">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#15803D]" />
                    <span>Quick Switch Persona (Demo)</span>
                  </div>

                  <div className="space-y-1 mt-1 max-h-56 overflow-y-auto pr-1">
                    {PRESEEDED_USERS.map((persona) => {
                      const isCurrent = currentUser?.id === persona.id;
                      return (
                        <button
                          key={persona.id}
                          onClick={() => {
                            loginAsPersona(persona.id);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full p-2 rounded-xl text-left text-xs transition-colors flex items-center justify-between ${
                            isCurrent
                              ? "bg-emerald-50 text-[#15803D] font-bold border border-emerald-200"
                              : "hover:bg-[#FAF8F5] text-slate-700"
                          }`}
                        >
                          <div className="truncate">
                            <div className="font-semibold truncate">{persona.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{persona.jurisdiction.displayText}</div>
                          </div>
                          <Badge variant="outline" className="text-[9px] uppercase shrink-0 font-mono">
                            {persona.jurisdiction.level}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer links & Logout */}
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link
                    href="/audit-trail"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="text-[#0284C7] hover:underline text-[11px] font-semibold"
                  >
                    Audit Trail
                  </Link>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
