"use client";

import React, { useState, useMemo } from "react";
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

// Curate 4 flagship projects for judge demonstration
const DEMO_FLAGSHIP_PROJECTS = MOCK_PROJECTS.filter((p) =>
  ["PRJ-001", "PRJ-002", "PRJ-005", "PRJ-006"].includes(p.id)
);

// 6 bi-monthly data points for a clean, non-cramped trend chart
const CLEAN_TIMELINE_DATA = TIMELINE_DATA.filter((_, idx) => idx % 2 === 0);

export default function DashboardPage() {
  const { role, language } = useApp();
  const currentRole = ROLE_CONFIGS[role];

  // Active view tab for clean, uncongested presentation
  const [activeTab, setActiveTab] = useState<"overview" | "states" | "projects" | "audit">("overview");

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* ───── 1. Top Executive Banner (Spacious & Clean) ───── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {language === "hi" ? "राष्ट्रीय भू-अर्जन पोर्टल" : "National Land Acquisition Portal"}
              </span>
              <span className="text-xs text-slate-400 font-mono">RFCTLARR Act 2013</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {language === "hi"
                ? "राष्ट्रीय भू-अर्जन एवं प्रबंधन डैशबोर्ड"
                : "National Land Acquisition & Management Dashboard"}
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {language === "hi"
                ? "परियोजना प्रस्ताव से अंतिम कब्ज़ा एवं पुनर्वास (R&R) तक का पारदर्शी डिजिटल अनुश्रवण।"
                : "Real-time statutory monitoring, direct compensation disbursement, and GIS decision support across national corridors."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/map">
              <Button variant="default" size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/30">
                <MapPin className="h-4 w-4" />
                <span>Spatial Map</span>
              </Button>
            </Link>
            <Link href="/projects/new">
              <Button variant="outline" size="lg" className="gap-2 border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white">
                <PlusCircle className="h-4 w-4 text-amber-400" />
                <span>New Requisition</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Viewing Role Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Active Jurisdiction:</span>
            <span className="font-semibold text-white">{currentRole.name}</span>
            <span className="text-slate-400">({currentRole.title} • {currentRole.dept})</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              PFMS Direct Benefit Active
            </span>
            <span className="text-amber-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              ULPIN Cadastre Linked
            </span>
          </div>
        </div>
      </div>

      {/* ───── 2. Four Core High-Impact Metric Cards (Spacious & Readable) ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Land Acquired */}
        <Card className="border-slate-800 bg-slate-900/70 p-6 rounded-2xl shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Land Acquired
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Landmark className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {formatArea(NATIONAL_METRICS.totalAreaAcquired)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                42% of {formatArea(NATIONAL_METRICS.totalAreaProposed)} required
              </div>
            </div>
            <Progress
              value={getPercentage(NATIONAL_METRICS.totalAreaAcquired, NATIONAL_METRICS.totalAreaProposed)}
              className="h-2"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Notified: {formatArea(NATIONAL_METRICS.totalAreaNotified)}</span>
              <span className="text-emerald-400 font-medium">Possessed: {formatArea(NATIONAL_METRICS.totalAreaPossessed)}</span>
            </div>
          </div>
        </Card>

        {/* Metric 2: Financial Compensation */}
        <Card className="border-slate-800 bg-slate-900/70 p-6 rounded-2xl shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Compensation Disbursed
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(NATIONAL_METRICS.totalCompensationDisbursed)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                76% of {formatCurrency(NATIONAL_METRICS.totalCompensationAssessed)} assessed
              </div>
            </div>
            <Progress
              value={getPercentage(NATIONAL_METRICS.totalCompensationDisbursed, NATIONAL_METRICS.totalCompensationAssessed)}
              className="h-2"
              indicatorClassName="bg-emerald-500"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Pending: {formatCurrency(NATIONAL_METRICS.totalCompensationPending)}</span>
              <span className="text-emerald-400 font-medium">PFMS Direct Payout</span>
            </div>
          </div>
        </Card>

        {/* Metric 3: Strategic Project Status */}
        <Card className="border-slate-800 bg-slate-900/70 p-6 rounded-2xl shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Project Delivery
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {NATIONAL_METRICS.projectsOnTrack}{" "}
                <span className="text-xl font-normal text-slate-400">/ {NATIONAL_METRICS.totalProjects}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Major national infrastructure corridors
              </div>
            </div>
            <Progress
              value={getPercentage(NATIONAL_METRICS.projectsOnTrack, NATIONAL_METRICS.totalProjects)}
              className="h-2"
              indicatorClassName="bg-blue-500"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
              <span className="text-amber-400">Delayed: {NATIONAL_METRICS.projectsDelayed}</span>
              <span className="text-emerald-400">Completed: {NATIONAL_METRICS.projectsCompleted}</span>
            </div>
          </div>
        </Card>

        {/* Metric 4: Rehabilitation (R&R) */}
        <Card className="border-slate-800 bg-slate-900/70 p-6 rounded-2xl shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Families Resettled (R&R)
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {formatIndianNumber(NATIONAL_METRICS.totalRRCompleted)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Families settled under Sch II & III
              </div>
            </div>
            <Progress
              value={getPercentage(NATIONAL_METRICS.totalRRCompleted, NATIONAL_METRICS.totalDisplacedFamilies)}
              className="h-2"
              indicatorClassName="bg-purple-500"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Displaced: {formatIndianNumber(NATIONAL_METRICS.totalDisplacedFamilies)}</span>
              <span className="text-purple-400 font-medium">Total: {formatIndianNumber(NATIONAL_METRICS.totalAffectedFamilies)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ───── 3. RFCTLARR Statutory Watchdog Alert Banner ───── */}
      <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">
                RFCTLARR Statutory Watchdog: Section 25 Lapse Alert
              </h4>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                1 Warning
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Section 19 Declaration for <strong className="text-amber-300 font-semibold">Delhi-Varanasi High-Speed Rail Corridor</strong> must complete Collector's Award (Sec 23) within 214 days, or proceedings will lapse under Section 25.
            </p>
          </div>
        </div>
        <Link href="/projects/PRJ-002">
          <Button variant="outline" size="sm" className="shrink-0 text-amber-400 border-amber-500/40 hover:bg-amber-500/10 font-semibold">
            View Statutory Milestone →
          </Button>
        </Link>
      </div>

      {/* ───── 4. Clean Tabbed Deck (Eliminates Congestion) ───── */}
      <div className="space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              📈 Acquisition Analytics
            </button>
            <button
              onClick={() => setActiveTab("states")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "states"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🏛️ Key States (5 Demo)
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "projects"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🛣️ Flagship Corridors
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🛡️ Statutory Audit Log
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
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
            <Card className="lg:col-span-2 border-slate-800 bg-slate-900/60 p-6 rounded-2xl">
              <CardHeader className="p-0 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-white">
                      Land Progression Trajectory
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400 mt-1">
                      Bi-monthly notified area vs land formally acquired (Hectares)
                    </CardDescription>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
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
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="areaAcquiredGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0c152d",
                          borderColor: "#1e293b",
                          borderRadius: "10px",
                          color: "#f8fafc",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                      <Area
                        type="monotone"
                        dataKey="areaNotified"
                        name="Area Notified (ha)"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        fill="url(#areaNotifiedGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="areaAcquired"
                        name="Area Acquired (ha)"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fill="url(#areaAcquiredGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Sector Distribution (1 col) */}
            <Card className="border-slate-800 bg-slate-900/60 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-base font-bold text-white">
                    Sector Allocation
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Acquisition volume by national infrastructure sector
                  </CardDescription>
                </CardHeader>
                <div className="space-y-4 pt-2">
                  {SECTOR_METRICS.slice(0, 5).map((sec) => (
                    <div key={sec.sector} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: sec.color }} />
                          <span className="font-semibold text-slate-200">{sec.label}</span>
                        </div>
                        <span className="font-mono text-slate-400">
                          {formatArea(sec.areaAcquired)} ha ({sec.projectCount} prj)
                        </span>
                      </div>
                      <Progress
                        value={(sec.areaAcquired / 12000) * 100}
                        className="h-1.5"
                        indicatorClassName="bg-slate-400"
                        style={{ accentColor: sec.color }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                <span>Top Sector: <strong className="text-white">Renewable & Highways</strong></span>
                <Link href="/reports" className="text-amber-400 hover:underline">
                  Full MIS →
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* ───── Tab Content 2: Curated 5 Key States (No Congestion) ───── */}
        {activeTab === "states" && (
          <Card className="border-slate-800 bg-slate-900/60 p-6 rounded-2xl shadow-xl">
            <CardHeader className="p-0 pb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white">
                  Demonstration Benchmark: 5 Key Economic States
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-1">
                  Concise cross-regional representation: Western, Northern, Southern, and Eastern corridors
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono text-amber-400 border-amber-500/30">
                5 Active Revenue Boards
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-300 font-semibold">State / Region</TableHead>
                      <TableHead className="text-center text-slate-300 font-semibold">Active Projects</TableHead>
                      <TableHead className="text-slate-300 font-semibold">Land Acquired vs Notified</TableHead>
                      <TableHead className="text-slate-300 font-semibold">Compensation Disbursed</TableHead>
                      <TableHead className="text-slate-300 font-semibold">Completion %</TableHead>
                      <TableHead className="text-right text-slate-300 font-semibold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {STATE_METRICS.map((st) => (
                      <TableRow key={st.stateCode} className="border-slate-800/70 hover:bg-slate-800/40">
                        <TableCell className="font-semibold text-white py-4">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                              {st.stateCode}
                            </span>
                            <span className="text-sm">{st.stateName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-mono font-medium text-slate-200">
                          {st.totalProjects}
                        </TableCell>
                        <TableCell className="text-xs text-slate-300">
                          <div className="font-semibold text-white">{formatArea(st.areaAcquired)} ha</div>
                          <div className="text-[11px] text-slate-400">of {formatArea(st.areaNotified)} ha</div>
                        </TableCell>
                        <TableCell className="text-sm font-mono text-emerald-400 font-semibold">
                          ₹{st.compensationDisbursed} Cr
                        </TableCell>
                        <TableCell className="w-48">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono font-semibold">
                              <span className="text-slate-300">{st.completionPercentage}%</span>
                              <span className={st.completionPercentage > 70 ? "text-emerald-400" : "text-amber-400"}>
                                {st.completionPercentage > 70 ? "Fast Track" : "In Progress"}
                              </span>
                            </div>
                            <Progress
                              value={st.completionPercentage}
                              className="h-2"
                              indicatorClassName={st.completionPercentage > 70 ? "bg-emerald-500" : "bg-amber-500"}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/projects?state=${st.stateCode}`}>
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-amber-400 hover:text-white hover:bg-slate-800">
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
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
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

                  <h3 className="text-base font-bold text-white line-clamp-1">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Acquired / Required</span>
                      <span className="font-mono font-bold text-white text-sm">
                        {formatArea(proj.areaAcquired)} / {formatArea(proj.totalAreaRequired)} ha
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Disbursed (PFMS)</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        ₹{proj.compensationDisbursed} Lakh
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    {proj.district}, {proj.state}
                  </span>
                  <Link href={`/projects/${proj.id}`}>
                    <Button variant="outline" size="sm" className="text-xs text-amber-400 border-amber-500/30 hover:bg-amber-500/10 gap-1 font-semibold">
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
          <Card className="border-slate-800 bg-slate-900/60 p-6 rounded-2xl shadow-xl">
            <CardHeader className="p-0 pb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Statutory Legal Event Stream</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-1">
                  Chronological, immutable audit records of gazette notifications and compensation payouts
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
                MeghRaj Audited
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <div className="space-y-3">
                {RECENT_ACTIVITIES.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="text-lg p-2 rounded-lg bg-slate-900 border border-slate-800">{act.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{act.title}</span>
                          <span className="font-mono text-[10px] text-slate-400 px-2 py-0.2 rounded bg-slate-800">
                            {act.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{act.project}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 sm:text-right shrink-0">
                      <span className="text-amber-400">📍 {act.state}</span>
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
