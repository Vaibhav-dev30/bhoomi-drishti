"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Landmark,
  Coins,
  Users,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  MapPin,
  PlusCircle,
  TrendingUp,
  BarChart3,
  Layers,
  ChevronRight,
  CheckCircle2,
  CalendarClock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useApp, ROLE_CONFIGS } from "@/context/app-context";
import {
  NATIONAL_METRICS,
  STATE_METRICS,
  SECTOR_METRICS,
  TIMELINE_DATA,
  RECENT_ACTIVITIES,
  MOCK_PROJECTS,
} from "@/lib/mock-data";
import {
  formatArea,
  formatCurrency,
  formatIndianNumber,
  formatDate,
  getPercentage,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Curated 4 flagship projects for judge demonstration
const DEMO_FLAGSHIP_PROJECTS = MOCK_PROJECTS.filter((p) =>
  ["PRJ-001", "PRJ-002", "PRJ-005", "PRJ-006"].includes(p.id)
);

// 6 bi-monthly points for a clean, spacious chart
const CLEAN_TIMELINE_DATA = TIMELINE_DATA.filter((_, idx) => idx % 2 === 0);

export default function DashboardPage() {
  const { role, language } = useApp();
  const currentRole = ROLE_CONFIGS[role];

  // Active view tab for clean presentation
  const [activeTab, setActiveTab] = useState<"overview" | "states" | "projects" | "audit">("overview");

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* ───── 1. Top Executive Banner (Warm Off-White & Cream with Blue & Green Accents) ───── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E5E0D6] bg-white p-6 sm:p-8 shadow-sm">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E0F2FE]/50 via-[#DCFCE7]/30 to-transparent pointer-events-none rounded-full blur-3xl -z-0" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
                {language === "hi" ? "राष्ट्रीय भू-अर्जन पोर्टल" : "National Land Acquisition Portal"}
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">RFCTLARR Act 2013</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              {language === "hi"
                ? "राष्ट्रीय भू-अर्जन एवं प्रबंधन डैशबोर्ड"
                : "National Land Acquisition & Management Dashboard"}
            </h1>

            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {language === "hi"
                ? "परियोजना प्रस्ताव से अंतिम कब्ज़ा एवं पुनर्वास (R&R) तक का पारदर्शी डिजिटल अनुश्रवण।"
                : "Real-time statutory monitoring, direct compensation disbursement, and GIS decision support across national corridors."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/map">
              <Button size="lg" className="gap-2 bg-[#15803D] hover:bg-[#16A34A] text-white font-bold shadow-md shadow-[#15803D]/20 cursor-pointer">
                <MapPin className="h-4 w-4" />
                <span>GIS Spatial Map</span>
              </Button>
            </Link>
            <Link href="/projects/new">
              <Button variant="outline" size="lg" className="gap-2 border-[#BAE6FD] bg-[#F0F9FF] text-[#0284C7] hover:bg-[#E0F2FE] font-bold shadow-xs cursor-pointer">
                <PlusCircle className="h-4 w-4 text-[#0284C7]" />
                <span>New Requisition</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Viewing Role Bar */}
        <div className="mt-6 pt-4 border-t border-[#E5E0D6] flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Active Jurisdiction:</span>
            <span className="font-bold text-slate-900">{currentRole.name}</span>
            <span className="text-slate-500">({currentRole.title} • {currentRole.dept})</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="text-[#15803D] font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
              PFMS Direct Benefit Active
            </span>
            <span className="text-[#0284C7] font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
              ULPIN Bhu-Aadhaar Linked
            </span>
          </div>
        </div>
      </div>

      {/* ───── 2. Four Core High-Impact Metric Cards (Crisp White with Light Blue & Green Accents) ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Land Acquired (Light Blue Accent) */}
        <Card className="border-[#E5E0D6] bg-white p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-[#BAE6FD] transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Land Acquired
            </span>
            <div className="p-2.5 rounded-2xl bg-[#E0F2FE] text-[#0284C7]">
              <Landmark className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {formatArea(NATIONAL_METRICS.totalAreaAcquired)}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                42% of {formatArea(NATIONAL_METRICS.totalAreaProposed)} required
              </div>
            </div>
            <Progress
              value={getPercentage(NATIONAL_METRICS.totalAreaAcquired, NATIONAL_METRICS.totalAreaProposed)}
              className="h-2 bg-[#F2EFE8]"
              indicatorClassName="bg-[#0284C7]"
            />
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-[#F2EFE8]">
              <span>Notified: {formatArea(NATIONAL_METRICS.totalAreaNotified)}</span>
              <span className="text-[#15803D] font-bold">Possessed: {formatArea(NATIONAL_METRICS.totalAreaPossessed)}</span>
            </div>
          </div>
        </Card>

        {/* Metric 2: Financial Compensation (Emerald Green Accent) */}
        <Card className="border-[#E5E0D6] bg-white p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-[#BBF7D0] transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Compensation Disbursed
            </span>
            <div className="p-2.5 rounded-2xl bg-[#DCFCE7] text-[#15803D]">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold text-[#15803D] tracking-tight">
                {formatCurrency(NATIONAL_METRICS.totalCompensationDisbursed)}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                76% of {formatCurrency(NATIONAL_METRICS.totalCompensationAssessed)} assessed
              </div>
            </div>
            <Progress
              value={getPercentage(NATIONAL_METRICS.totalCompensationDisbursed, NATIONAL_METRICS.totalCompensationAssessed)}
              className="h-2 bg-[#F2EFE8]"
              indicatorClassName="bg-[#16A34A]"
            />
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-[#F2EFE8]">
              <span>Pending: {formatCurrency(NATIONAL_METRICS.totalCompensationPending)}</span>
              <span className="text-[#0284C7] font-bold">PFMS Direct Transfer</span>
            </div>
          </div>
        </Card>

        {/* Metric 3: Strategic Project Status (Light Blue & Navy Accent) */}
        <Card className="border-[#E5E0D6] bg-white p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-[#BAE6FD] transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Delivery
            </span>
            <div className="p-2.5 rounded-2xl bg-[#E0F2FE] text-[#0284C7]">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {NATIONAL_METRICS.projectsOnTrack}{" "}
                <span className="text-xl font-medium text-slate-400">/ {NATIONAL_METRICS.totalProjects}</span>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Major national infrastructure corridors
              </div>
            </div>
            <Progress
              value={getPercentage(NATIONAL_METRICS.projectsOnTrack, NATIONAL_METRICS.totalProjects)}
              className="h-2 bg-[#F2EFE8]"
              indicatorClassName="bg-[#0284C7]"
            />
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-[#F2EFE8]">
              <span className="text-amber-600 font-semibold">Delayed: {NATIONAL_METRICS.projectsDelayed}</span>
              <span className="text-[#15803D] font-bold">Completed: {NATIONAL_METRICS.projectsCompleted}</span>
            </div>
          </div>
        </Card>

        {/* Metric 4: Rehabilitation (R&R) (Sage Green Accent) */}
        <Card className="border-[#E5E0D6] bg-white p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-[#BBF7D0] transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Families Resettled (R&R)
            </span>
            <div className="p-2.5 rounded-2xl bg-[#DCFCE7] text-[#15803D]">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {formatIndianNumber(NATIONAL_METRICS.totalRRCompleted)}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                Families settled under Sch II & III
              </div>
            </div>
            <Progress
              value={getPercentage(NATIONAL_METRICS.totalRRCompleted, NATIONAL_METRICS.totalDisplacedFamilies)}
              className="h-2 bg-[#F2EFE8]"
              indicatorClassName="bg-[#15803D]"
            />
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-[#F2EFE8]">
              <span>Displaced: {formatIndianNumber(NATIONAL_METRICS.totalDisplacedFamilies)}</span>
              <span className="text-[#15803D] font-bold">Total: {formatIndianNumber(NATIONAL_METRICS.totalAffectedFamilies)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ───── 3. RFCTLARR Statutory Watchdog Alert Banner (Warm Cream with Amber & Blue Accents) ───── */}
      <div className="rounded-3xl border border-[#FDE68A] bg-[#FFFBEB] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#FEF3C7] text-amber-700 border border-[#FCD34D] shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-amber-950">
                RFCTLARR Statutory Watchdog: Section 25 Lapse Alert
              </h4>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold border border-red-200">
                1 Warning
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              Section 19 Declaration for <strong className="text-amber-950 font-bold">Delhi-Varanasi High-Speed Rail Corridor</strong> must complete Collector's Award (Sec 23) within 214 days, or proceedings will lapse under Section 25.
            </p>
          </div>
        </div>
        <Link href="/projects/PRJ-002">
          <Button variant="outline" size="sm" className="shrink-0 border-amber-300 bg-white text-amber-800 hover:bg-amber-50 font-bold shadow-xs">
            View Statutory Milestone →
          </Button>
        </Link>
      </div>

      {/* ───── 4. Clean Tabbed Deck (Beige & Off-White Container) ───── */}
      <div className="space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D6] pb-3">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#F5F2EB] border border-[#E5E0D6]">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#0284C7] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              📈 Acquisition Analytics
            </button>
            <button
              onClick={() => setActiveTab("states")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "states"
                  ? "bg-[#15803D] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              🏛️ Key States (5 Demo)
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "projects"
                  ? "bg-[#0284C7] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              🛣️ Flagship Corridors
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-[#15803D] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              🛡️ Statutory Audit Log
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono font-medium">
            {activeTab === "overview" && "FY 2025-26 National Trajectory"}
            {activeTab === "states" && "Curated 5 Economic Regions"}
            {activeTab === "projects" && "High-Priority Corridor Showcase"}
            {activeTab === "audit" && "Immutable Legal Event Stream"}
          </div>
        </div>

        {/* ───── Tab Content 1: Overview Analytics ───── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progression Trend (2 cols) */}
            <Card className="lg:col-span-2 border-[#E5E0D6] bg-white p-6 rounded-3xl shadow-sm">
              <CardHeader className="p-0 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-extrabold text-slate-900">
                      Land Progression Trajectory
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      Bi-monthly notified area vs land formally acquired (Hectares)
                    </CardDescription>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full border border-[#BBF7D0]">
                    +48% YoY Velocity
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CLEAN_TIMELINE_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaNotifiedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="areaAcquiredGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F2EFE8" />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E5E0D6",
                          borderRadius: "14px",
                          color: "#0F172A",
                          fontSize: "12px",
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                      <Area
                        type="monotone"
                        dataKey="areaNotified"
                        name="Area Notified (ha)"
                        stroke="#0284c7"
                        strokeWidth={2.5}
                        fill="url(#areaNotifiedGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="areaAcquired"
                        name="Area Acquired (ha)"
                        stroke="#16a34a"
                        strokeWidth={2.5}
                        fill="url(#areaAcquiredGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Sector Distribution (1 col) */}
            <Card className="border-[#E5E0D6] bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-base font-extrabold text-slate-900">
                    Sector Allocation
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Acquisition volume by national infrastructure sector
                  </CardDescription>
                </CardHeader>
                <div className="space-y-4 pt-2">
                  {SECTOR_METRICS.slice(0, 5).map((sec) => (
                    <div key={sec.sector} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: sec.color }} />
                          <span className="font-bold text-slate-800">{sec.label}</span>
                        </div>
                        <span className="font-mono text-slate-500">
                          {formatArea(sec.areaAcquired)} ha ({sec.projectCount} prj)
                        </span>
                      </div>
                      <Progress
                        value={(sec.areaAcquired / 12000) * 100}
                        className="h-2 bg-[#F2EFE8]"
                        indicatorClassName="bg-[#0284C7]"
                        style={{ accentColor: sec.color }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#F2EFE8] text-xs text-slate-600 flex items-center justify-between">
                <span>Top Sector: <strong className="text-slate-900">Renewable & Highways</strong></span>
                <Link href="/reports" className="text-[#0284C7] font-bold hover:underline">
                  Full MIS →
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* ───── Tab Content 2: Curated 5 Key States (Beige & White Table) ───── */}
        {activeTab === "states" && (
          <Card className="border-[#E5E0D6] bg-white p-6 rounded-3xl shadow-sm">
            <CardHeader className="p-0 pb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-extrabold text-slate-900">
                  Demonstration Benchmark: 5 Key Economic States
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  Concise cross-regional representation: Western, Northern, Southern, and Eastern corridors
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono font-bold text-[#0284C7] border-[#BAE6FD] bg-[#F0F9FF]">
                5 Active Revenue Boards
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#E5E0D6] bg-[#FAF8F5]">
                      <TableHead className="text-slate-700 font-bold">State / Region</TableHead>
                      <TableHead className="text-center text-slate-700 font-bold">Active Projects</TableHead>
                      <TableHead className="text-slate-700 font-bold">Land Acquired vs Notified</TableHead>
                      <TableHead className="text-slate-700 font-bold">Compensation Disbursed</TableHead>
                      <TableHead className="text-slate-700 font-bold">Completion %</TableHead>
                      <TableHead className="text-right text-slate-700 font-bold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {STATE_METRICS.map((st) => (
                      <TableRow key={st.stateCode} className="border-[#F2EFE8] hover:bg-[#FAF8F5] transition-colors">
                        <TableCell className="font-bold text-slate-900 py-4">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-[#E0F2FE] text-[#0369A1] font-bold border border-[#BAE6FD]">
                              {st.stateCode}
                            </span>
                            <span className="text-sm">{st.stateName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-mono font-bold text-slate-800">
                          {st.totalProjects}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          <div className="font-bold text-slate-900">{formatArea(st.areaAcquired)} ha</div>
                          <div className="text-[11px] text-slate-500">of {formatArea(st.areaNotified)} ha</div>
                        </TableCell>
                        <TableCell className="text-sm font-mono text-[#15803D] font-extrabold">
                          ₹{st.compensationDisbursed} Cr
                        </TableCell>
                        <TableCell className="w-48">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono font-bold">
                              <span className="text-slate-700">{st.completionPercentage}%</span>
                              <span className={st.completionPercentage > 70 ? "text-[#15803D]" : "text-[#0284C7]"}>
                                {st.completionPercentage > 70 ? "Fast Track" : "In Progress"}
                              </span>
                            </div>
                            <Progress
                              value={st.completionPercentage}
                              className="h-2 bg-[#F2EFE8]"
                              indicatorClassName={st.completionPercentage > 70 ? "bg-[#16A34A]" : "bg-[#0284C7]"}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/projects?state=${st.stateCode}`}>
                            <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-[#0284C7] hover:text-[#0369A1] hover:bg-[#E0F2FE]">
                              View Projects →
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ───── Tab Content 3: Curated 4 Flagship Projects (Judge Ready) ───── */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEMO_FLAGSHIP_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="rounded-3xl border border-[#E5E0D6] bg-white p-6 hover:shadow-md hover:border-[#BAE6FD] transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-slate-700 font-bold border border-[#E5E0D6]">
                      {proj.projectCode}
                    </span>
                    <Badge
                      variant={
                        proj.status === "completed" || proj.status === "possession_taken"
                          ? "success"
                          : proj.status === "compensation_disbursing"
                          ? "default"
                          : "info"
                      }
                      className="text-xs capitalize"
                    >
                      {proj.status.replace(/_/g, " ")}
                    </Badge>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 line-clamp-1">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#F2EFE8] text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">Acquired / Required</span>
                      <span className="font-mono font-extrabold text-slate-900 text-sm">
                        {formatArea(proj.areaAcquired)} / {formatArea(proj.totalAreaRequired)} ha
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">Disbursed (PFMS)</span>
                      <span className="font-mono font-extrabold text-[#15803D] text-sm">
                        ₹{proj.compensationDisbursed} Lakh
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#0284C7]" />
                    {proj.district}, {proj.state}
                  </span>
                  <Link href={`/projects/${proj.id}`}>
                    <Button variant="outline" size="sm" className="text-xs font-bold text-[#0284C7] border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] gap-1 shadow-xs">
                      <span>Statutory Dossier</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ───── Tab Content 4: Clean Audit Log ───── */}
        {activeTab === "audit" && (
          <Card className="border-[#E5E0D6] bg-white p-6 rounded-3xl shadow-sm">
            <CardHeader className="p-0 pb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
                  <span>Statutory Legal Event Stream</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  Chronological, immutable audit records of gazette notifications and compensation payouts
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono font-bold text-[#15803D] border-[#BBF7D0] bg-[#DCFCE7]">
                MeghRaj Audited
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <div className="space-y-3">
                {RECENT_ACTIVITIES.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-[#E5E0D6] bg-[#FAF8F5] hover:border-[#BAE6FD] hover:bg-[#F0F9FF] transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="text-lg p-2 rounded-xl bg-white border border-[#E5E0D6] shadow-xs">{act.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>{act.title}</span>
                          <span className="font-mono text-[10px] text-[#0284C7] font-bold px-2 py-0.5 rounded-md bg-[#E0F2FE]">
                            {act.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{act.project}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500 sm:text-right shrink-0">
                      <span className="text-[#15803D] font-bold">📍 {act.state}</span>
                      <span>{formatDate(act.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}
