"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  FolderKanban,
  Calculator,
  BellRing,
  Users,
  HeartHandshake,
  FileBarChart,
  Globe2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp, ROLE_CONFIGS } from "@/context/app-context";

const NAVIGATION_ITEMS = [
  {
    name: "National Dashboard",
    nameHi: "राष्ट्रीय डैशबोर्ड",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "GIS Spatial Map",
    nameHi: "जीआईएस स्थानिक मानचित्र",
    href: "/map",
    icon: MapPin,
    badge: "Live OGC",
  },
  {
    name: "Projects Management",
    nameHi: "परियोजना प्रबंधन",
    href: "/projects",
    icon: FolderKanban,
    badge: "12",
  },
  {
    name: "Valuation & Compensation",
    nameHi: "मूल्यांकन व मुआवज़ा",
    href: "/compensation",
    icon: Calculator,
    badge: "Sec 26-30",
  },
  {
    name: "Rehabilitation (R&R)",
    nameHi: "पुनर्वास और पुनर्स्थापन",
    href: "/rr",
    icon: HeartHandshake,
    badge: "Sch II/III",
  },
  {
    name: "Statutory Notifications",
    nameHi: "वैधानिक अधिसूचनाएं",
    href: "/notifications",
    icon: BellRing,
    badge: "8 Active",
  },
  {
    name: "Affected Families",
    nameHi: "प्रभावित परिवार",
    href: "/families",
    icon: Users,
    badge: null,
  },
  {
    name: "MIS & Executive Reports",
    nameHi: "एमआईएस व रिपोर्ट",
    href: "/reports",
    icon: FileBarChart,
    badge: "CAG",
  },
  {
    name: "Citizen Public Portal",
    nameHi: "नागरिक सेवा पोर्टल",
    href: "/public",
    icon: Globe2,
    badge: "G2C",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { role, language } = useApp();
  const currentRoleConfig = ROLE_CONFIGS[role];

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-[#E5E0D6] bg-[#FAF8F5] transition-all duration-300 z-30 shadow-xs",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#E5E0D6] px-4 bg-white">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] font-bold shadow-xs">
              <Compass className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                भूमिदृष्टि
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                  GOI
                </span>
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                BhoomiDrishti Portal
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#15803D] font-bold">
            <Compass className="h-5 w-5" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-xl p-1.5 text-slate-400 hover:bg-[#F2EFE8] hover:text-slate-800 transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Role Profile Indicator */}
      {!collapsed && (
        <div className="mx-3 mt-3.5 rounded-2xl border border-[#E5E0D6] bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              {language === "hi" ? "सक्रिय भूमिका" : "Active Perspective"}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
              {currentRoleConfig.badge}
            </span>
          </div>
          <p className="mt-1 text-xs font-bold text-slate-900 truncate">
            {currentRoleConfig.name}
          </p>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            {currentRoleConfig.dept}
          </p>
          <p className="mt-1 text-[10px] text-[#0284C7] font-semibold flex items-center gap-1">
            <span>📍</span> {currentRoleConfig.jurisdiction}
          </p>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-2 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          {!collapsed && (language === "hi" ? "मुख्य मॉड्यूल" : "Navigation Modules")}
        </div>
        {NAVIGATION_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer",
                isActive
                  ? "bg-[#E8F5E9] text-[#15803D] border-l-4 border-[#16A34A] shadow-xs"
                  : "text-slate-600 hover:bg-[#F2EFE8] hover:text-slate-900"
              )}
              title={collapsed ? (language === "hi" ? item.nameHi : item.name) : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? "text-[#15803D]"
                    : "text-slate-400 group-hover:text-slate-700"
                )}
              />
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between truncate">
                  <span className="truncate">
                    {language === "hi" ? item.nameHi : item.name}
                  </span>
                  {item.badge && (
                    <span
                      className={cn(
                        "ml-auto text-[10px] px-2 py-0.5 rounded-full font-mono font-bold",
                        isActive
                          ? "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]"
                          : "bg-[#F2EFE8] text-slate-500 border border-[#E5E0D6]"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* RFCTLARR Legal Compliance Alert Bar */}
      {!collapsed && (
        <div className="m-3 rounded-2xl border border-[#FDE68A] bg-[#FEF9C3]/80 p-3 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-[#92400E] font-bold mb-1">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
            <span>RFCTLARR Act 2013</span>
          </div>
          <p className="text-[11px] text-amber-900/80 leading-relaxed font-medium">
            Sec 11 to Sec 19 auto-lapse tracking active. Strict 12-month statutory award compliance.
          </p>
        </div>
      )}

      {/* Bottom Footer Details */}
      <div className="border-t border-[#E5E0D6] p-3 text-center bg-white">
        {!collapsed ? (
          <div className="text-[10px] text-slate-500 space-y-0.5 font-medium">
            <p className="font-bold text-slate-700">Department of Land Resources</p>
            <p>Ministry of Rural Development, GoI</p>
          </div>
        ) : (
          <span className="text-[9px] text-slate-400 font-mono">v1.0</span>
        )}
      </div>
    </aside>
  );
}
