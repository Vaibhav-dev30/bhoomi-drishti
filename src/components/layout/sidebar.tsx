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
  Pin,
  PinOff,
  ShieldAlert,
  ShieldCheck,
  Compass,
  FilePlus2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp, ROLE_CONFIGS } from "@/context/app-context";

interface NavItem {
  name: string;
  nameHi: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string | null;
}

interface NavGroup {
  id: string;
  title: string;
  titleHi: string;
  items: NavItem[];
}

const NAVIGATION_GROUPS: NavGroup[] = [
  {
    id: "operations",
    title: "Core Operations",
    titleHi: "मुख्य परिचालन",
    items: [
      {
        name: "Command Dashboard",
        nameHi: "कमांड डैशबोर्ड",
        href: "/dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        name: "BhuNaksha Cadastral Map",
        nameHi: "भू-नक्शा कैडस्ट्रल मैप",
        href: "/map",
        icon: MapPin,
        badge: "NIC GIS",
      },
      {
        name: "Projects Management",
        nameHi: "परियोजना प्रबंधन",
        href: "/projects",
        icon: FolderKanban,
        badge: "12 Stages",
      },
      {
        name: "Affected Families & Outreach",
        nameHi: "प्रभावित परिवार व संदेश",
        href: "/families",
        icon: Users,
        badge: "WhatsApp",
      },
      {
        name: "Valuation & Compensation",
        nameHi: "मूल्यांकन व मुआवज़ा",
        href: "/compensation",
        icon: Calculator,
        badge: "Sec 26-30",
      },
      {
        name: "Citizen Public Portal",
        nameHi: "नागरिक सेवा पोर्टल",
        href: "/public",
        icon: Globe2,
        badge: "G2C Live",
      },
    ],
  },
  {
    id: "compliance",
    title: "Statutory & Compliance",
    titleHi: "वैधानिक व अनुपालन",
    items: [
      {
        name: "Statutory Notifications",
        nameHi: "वैधानिक अधिसूचनाएं",
        href: "/notifications",
        icon: BellRing,
        badge: "Gazette",
      },
      {
        name: "Rehabilitation (R&R)",
        nameHi: "पुनर्वास और पुनर्स्थापन",
        href: "/rr",
        icon: HeartHandshake,
        badge: "Sch II",
      },
      {
        name: "MIS & Executive Reports",
        nameHi: "एमआईएस व रिपोर्ट",
        href: "/reports",
        icon: FileBarChart,
        badge: "CAG",
      },
      {
        name: "Audit Trail",
        nameHi: "ऑडिट ट्रेल",
        href: "/audit-trail",
        icon: ShieldAlert,
        badge: "Sec 101",
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const { role, language } = useApp();
  const currentRoleConfig = ROLE_CONFIGS[role];

  const expanded = isHovered || isPinned;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-[#E5E0D6] bg-[#FAF8F5] transition-all duration-300 ease-in-out select-none",
        expanded ? "w-72 shadow-2xl" : "w-16 shadow-xs"
      )}
    >
      {/* ───── 1. BRAND HEADER ───── */}
      <div className="flex h-14 items-center justify-between border-b border-[#E5E0D6] px-3 bg-white shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] font-bold shadow-xs">
            <Compass className="h-5 w-5" />
          </div>
          {expanded && (
            <div className="flex flex-col min-w-0 animate-in fade-in duration-200">
              <span className="text-sm font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 truncate">
                भूमिदृष्टि
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                  GOI
                </span>
              </span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold truncate">
                BhoomiDrishti Portal
              </span>
            </div>
          )}
        </div>

        {/* Pin toggle button when expanded */}
        {expanded && (
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={cn(
              "rounded-xl p-1.5 transition-colors cursor-pointer text-slate-400 hover:text-slate-800",
              isPinned ? "bg-[#DCFCE7] text-[#15803D]" : "hover:bg-[#F2EFE8]"
            )}
            title={isPinned ? "Unpin sidebar (auto-collapse)" : "Pin sidebar open"}
          >
            {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* ───── 2. ROLE PERSPECTIVE CARD ───── */}
      {expanded ? (
        <div className="mx-2.5 mt-3 rounded-2xl border border-[#E5E0D6] bg-white p-3 shadow-xs shrink-0 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
              {language === "hi" ? "सक्रिय भूमिका" : "Active Perspective"}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
              {currentRoleConfig.badge}
            </span>
          </div>
          <p className="mt-1 text-xs font-bold text-slate-900 truncate">
            {currentRoleConfig.name}
          </p>
          <p className="text-[10px] text-slate-500 truncate mt-0.5">
            {currentRoleConfig.dept}
          </p>
          <p className="mt-1 text-[10px] text-[#0284C7] font-semibold flex items-center gap-1 truncate">
            <span>📍</span> {currentRoleConfig.jurisdiction}
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-2.5 py-1">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#E5E0D6] text-[#15803D] text-[10px] font-mono font-bold shadow-xs cursor-default"
            title={`${currentRoleConfig.name} (${currentRoleConfig.badge}) — ${currentRoleConfig.jurisdiction}`}
          >
            CALA
          </div>
        </div>
      )}

      {/* ───── 3. GROUPED NAVIGATION LINKS ───── */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3 scrollbar-none">
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.id} className="space-y-1">
            {expanded ? (
              <div className="px-2.5 pt-1 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {language === "hi" ? group.titleHi : group.title}
              </div>
            ) : (
              <div className="my-1 border-t border-[#E5E0D6]/60 mx-2" />
            )}

            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
              const Icon = item.icon;

              return (
                <div key={item.href} className="relative group/nav">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl py-2 text-xs font-bold transition-all cursor-pointer",
                      expanded ? "px-3" : "px-0 justify-center",
                      isActive
                        ? "bg-[#E8F5E9] text-[#15803D] shadow-xs border-l-4 border-[#16A34A]"
                        : "text-slate-600 hover:bg-[#F2EFE8] hover:text-slate-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-[#15803D]"
                          : "text-slate-400 group-hover/nav:text-slate-700"
                      )}
                    />

                    {expanded && (
                      <div className="flex flex-1 items-center justify-between min-w-0 animate-in fade-in duration-150">
                        <span className="truncate">
                          {language === "hi" ? item.nameHi : item.name}
                        </span>
                        {item.badge && (
                          <span
                            className={cn(
                              "ml-1.5 text-[9px] px-1.5 py-0.2 rounded-md font-mono font-bold shrink-0",
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

                  {/* Tooltip on hover in collapsed state */}
                  {!expanded && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl opacity-0 group-hover/nav:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 flex items-center gap-2 border border-slate-700">
                      <span>{language === "hi" ? item.nameHi : item.name}</span>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-emerald-300 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ───── 4. BOTTOM STATUTORY FOOTER ───── */}
      <div className="border-t border-[#E5E0D6] p-2.5 text-center bg-white shrink-0">
        {expanded ? (
          <div className="text-[10px] text-slate-500 space-y-0.5 font-medium animate-in fade-in duration-150">
            <p className="font-bold text-slate-700">Department of Land Resources</p>
            <p className="text-[9px]">Ministry of Rural Development, GoI</p>
          </div>
        ) : (
          <span className="text-[9px] text-slate-400 font-mono block text-center">
            GoI
          </span>
        )}
      </div>
    </aside>
  );
}
