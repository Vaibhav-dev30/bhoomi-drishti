"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sparkles,
  ChevronUp,
  ChevronDown,
  Globe2,
  MessageSquare,
  MapPin,
  Calculator,
  UserCheck,
  X,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { PRESEEDED_USERS } from "@/lib/auth-store";

export function JudgeScenarioBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, loginAsPersona } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const scenarios = [
    {
      id: "citizen",
      title: "1. Citizen Portal & Grievances",
      subtext: "Track DEMO-482, 12-stage cycle, Sec 15 objection",
      icon: Globe2,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      action: () => router.push("/public"),
    },
    {
      id: "whatsapp",
      title: "2. WhatsApp Landowner Outreach",
      subtext: "Live handset mockup with Hindi Sec 11 dispatch",
      icon: MessageSquare,
      color: "text-sky-700 bg-sky-50 border-sky-200",
      action: () => {
        // Ensure user is authenticated to view families
        if (!currentUser) {
          loginAsPersona("USR-STA-DL");
        }
        router.push("/families");
      },
    },
    {
      id: "gis",
      title: "3. BhuNaksha GIS & Spatial",
      subtext: "Cadastral vector polygons, RoR & DGPS layers",
      icon: MapPin,
      color: "text-indigo-700 bg-indigo-50 border-indigo-200",
      action: () => {
        if (!currentUser) {
          loginAsPersona("USR-STA-DL");
        }
        router.push("/map");
      },
    },
    {
      id: "calculator",
      title: "4. What-If Compensation Calculator",
      subtext: "Live sliders for circle rate, rural multiplier, solatium",
      icon: Calculator,
      color: "text-amber-700 bg-amber-50 border-amber-200",
      action: () => router.push("/public?tab=calculator"),
    },
  ];

  return (
    <aside aria-label="Quick demo guide" className="fixed bottom-4 right-4 z-50 max-w-sm print:hidden">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-2xl hover:bg-slate-800 transition-all border border-slate-700 cursor-pointer ring-2 ring-emerald-500/50 hover:scale-105"
        >
          <Sparkles className="h-4 w-4 text-emerald-400 animate-spin" />
          <span>⚡ Quick Guide</span>
          <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
        </button>
      ) : (
        <div className="w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-2xl border border-slate-200 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Sparkles className="h-4 w-4 text-[#15803D]" />
              <span>Quick Guide</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mb-3">
            Click any scenario below to jump straight to the relevant feature with pre-seeded demonstration data:
          </p>

          <div className="space-y-2">
            {scenarios.map((sc) => {
              const Icon = sc.icon;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    sc.action();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-left hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${sc.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-[#15803D] transition-colors">
                        {sc.title}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {sc.subtext}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              );
            })}
          </div>

          {/* Quick Persona Switcher */}
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Current Officer Jurisdiction
            </span>
            <div className="flex items-center justify-between bg-slate-100 p-2 rounded-xl">
              <div>
                <span className="font-bold text-slate-800 text-[11px] block">
                  {currentUser ? currentUser.name : "Unauthenticated (Public View)"}
                </span>
                <span className="text-[10px] text-slate-500">
                  {currentUser ? currentUser.jurisdiction?.displayText || currentUser.role : "Citizen G2C Mode"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-[10px] font-bold text-[#0284C7] hover:underline"
              >
                Switch Role →
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
