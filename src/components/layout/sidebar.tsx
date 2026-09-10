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
import { Badge } from "@/components/ui/badge";

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
    badge: "Live",
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
        "relative flex flex-col border-r border-slate-800/80 bg-slate-950/95 transition-all duration-300 z-30",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-md shadow-amber-900/30 text-slate-950 font-bold">
              <Compass className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                भूमिदृष्टि
                <span className="text-xs font-normal px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  GOI
                </span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                BhoomiDrishti Portal
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
            <Compass className="h-6 w-6" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
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
        <div className="mx-3 mt-3 rounded-lg border border-slate-800/90 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {language === "hi" ? "सक्रिय भूमिका" : "Active Role View"}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
              {currentRoleConfig.badge}
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-white truncate">
            {currentRoleConfig.name}
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            {currentRoleConfig.dept}
          </p>
          <p className="mt-0.5 text-[10px] text-emerald-400 font-mono">
            📍 {currentRoleConfig.jurisdiction}
          </p>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {!collapsed && (language === "hi" ? "मुख्य मॉड्यूल" : "Core Modules")}
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
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-400 border-l-2 border-amber-500 font-semibold"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              )}
              title={collapsed ? (language === "hi" ? item.nameHi : item.name) : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? "text-amber-400"
                    : "text-slate-400 group-hover:text-slate-200"
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
                        "ml-auto text-[10px] px-1.5 py-0.2 rounded font-mono",
                        isActive
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-slate-800 text-slate-400"
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
        <div className="m-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            <span>RFCTLARR Act 2013</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Sec 11 to Sec 19 auto-lapse timer active. Strict adherence to statutory 12-month awards.
          </p>
        </div>
      )}

      {/* Bottom Footer Details */}
      <div className="border-t border-slate-800/80 p-3 text-center">
        {!collapsed ? (
          <div className="text-[10px] text-slate-500 space-y-0.5">
            <p className="font-medium text-slate-400">Department of Land Resources</p>
            <p>Ministry of Rural Development, GoI</p>
          </div>
        ) : (
          <span className="text-[9px] text-slate-600 font-mono">v1.0</span>
        )}
      </div>
    </aside>
  );
}
