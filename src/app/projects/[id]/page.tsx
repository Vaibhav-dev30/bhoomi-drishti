"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Users,
  Coins,
  ShieldCheck,
  Download,
  Share2,
  Printer,
  ExternalLink,
  ChevronRight,
  Landmark,
  Compass,
} from "lucide-react";
import { MOCK_PROJECTS, MOCK_FAMILIES, getProjectWorkflow } from "@/lib/mock-data";
import { formatArea, formatCurrency, formatDate, getPercentage } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const project = MOCK_PROJECTS.find((p) => p.id === projectId) || MOCK_PROJECTS[0];
  const workflowStages = getProjectWorkflow(project);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Top back bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Projects</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/map">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-slate-800">
              <Compass className="h-3.5 w-3.5 text-amber-400" />
              <span>Locate on GIS Map</span>
            </Button>
          </Link>
          <Button variant="secondary" size="sm" className="h-8 text-xs gap-1.5">
            <Printer className="h-3.5 w-3.5 text-slate-400" />
            <span>Print Dossier</span>
          </Button>
        </div>
      </div>

      {/* Project Hero Dossier Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold border border-slate-700">
                {project.projectCode}
              </span>
              <Badge variant="default" className="capitalize">
                {project.type}
              </Badge>
              <Badge variant="success" className="capitalize">
                {project.status.replace(/_/g, " ")}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                Requisition Date: {formatDate(project.proposalDate)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {project.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 text-xs">
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Land Requiring Agency (LRB)</span>
              <span className="font-semibold text-white">{project.lrbName}</span>
              <span className="text-[10px] text-slate-400 block">{project.lrbType}</span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Competent Authority (CALA)</span>
              <span className="font-semibold text-white">Collector, {project.district}</span>
              <span className="text-[10px] text-slate-400 block">State of {project.state}</span>
            </div>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Land Required</span>
            <span className="text-lg sm:text-xl font-bold text-white font-mono">
              {formatArea(project.totalAreaRequired)}
            </span>
            <span className="text-[10px] text-emerald-400 block">
              {formatArea(project.areaAcquired)} acquired ({getPercentage(project.areaAcquired, project.totalAreaRequired)}%)
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Compensation Assessed</span>
            <span className="text-lg sm:text-xl font-bold text-white font-mono">
              ₹{(project.compensationAssessed / 100).toFixed(1)} Cr
            </span>
            <span className="text-[10px] text-emerald-400 block">
              ₹{(project.compensationDisbursed / 100).toFixed(1)} Cr paid
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Affected Families</span>
            <span className="text-lg sm:text-xl font-bold text-white font-mono">
              {project.totalAffectedFamilies}
            </span>
            <span className="text-[10px] text-purple-400 block">
              {project.displacedFamilies} displaced
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">R&R Entitlements</span>
            <span className="text-lg sm:text-xl font-bold text-white font-mono">
              {project.rrCompletedFamilies} / {project.displacedFamilies}
            </span>
            <span className="text-[10px] text-cyan-400 block">
              {getPercentage(project.rrCompletedFamilies, project.displacedFamilies)}% completed
            </span>
          </div>
        </div>
      </div>

      {/* RFCTLARR Act 2013 10-Stage Statutory Stepper */}
      <Card className="border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>RFCTLARR Act 2013 — Statutory Lifecycle Stepper</span>
              </CardTitle>
              <CardDescription>
                Live monitoring of legal gates, gazette declarations, and Section 25 sunset timelines
              </CardDescription>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Active Milestone: {project.status.replace(/_/g, " ").toUpperCase()}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 overflow-x-auto">
          <div className="flex items-start justify-between min-w-[750px] relative">
            {/* Connecting line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 z-0" />

            {workflowStages.map((stage, idx) => (
              <div
                key={stage.id}
                className="relative z-10 flex flex-col items-center text-center max-w-[70px]"
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all ${
                    stage.status === "completed"
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20"
                      : stage.status === "current"
                      ? "bg-amber-500 text-slate-950 border-amber-300 animate-pulse shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20"
                      : "bg-slate-900 text-slate-500 border-slate-700"
                  }`}
                >
                  {stage.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className="mt-2 text-[10px] font-bold text-white leading-tight">
                  {stage.name}
                </span>
                <span className="text-[9px] font-mono text-amber-400 mt-0.5">
                  {stage.section}
                </span>
                {stage.completedDate && (
                  <span className="text-[8px] text-slate-400 mt-0.5 font-mono">
                    {stage.completedDate.slice(0, 7)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabbed Dossier Sections */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview & Scope</TabsTrigger>
          <TabsTrigger value="parcels">Land Parcels (Khasra)</TabsTrigger>
          <TabsTrigger value="families">Affected Families ({MOCK_FAMILIES.length})</TabsTrigger>
          <TabsTrigger value="compensation">Valuation Ledger (Sec 26-30)</TabsTrigger>
          <TabsTrigger value="documents">Statutory Documents (DMS)</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white">
                  Notified Revenue Villages & Administrative Scope
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">State:</span>
                  <span className="font-semibold text-white">{project.state} ({project.stateCode})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">District:</span>
                  <span className="font-semibold text-white">{project.district}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Tehsil / Taluk:</span>
                  <span className="font-semibold text-white">{project.tehsil}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Notified Villages:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.villages.map((v) => (
                      <span key={v} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-mono">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white">
                  Key Statutory Timelines & Sunsets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Proposal Date:</span>
                  <span className="font-mono text-white">{formatDate(project.proposalDate)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">SIA Completed (Sec 6):</span>
                  <span className="font-mono text-white">
                    {project.siaCompletionDate ? formatDate(project.siaCompletionDate) : "In Progress"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Sec 11 Preliminary Notification:</span>
                  <span className="font-mono text-white">
                    {project.sec11Date ? formatDate(project.sec11Date) : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Sec 19 Declaration:</span>
                  <span className="font-mono text-white">
                    {project.sec19Date ? formatDate(project.sec19Date) : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Collector's Award (Sec 23):</span>
                  <span className="font-mono text-emerald-400">
                    {project.awardDate ? formatDate(project.awardDate) : "Within 12 Months"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Land Parcels */}
        <TabsContent value="parcels" className="space-y-4 mt-4">
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-white">
                  Cadastral Register of Notified Parcels
                </CardTitle>
                <CardDescription>
                  Verified Gat/Survey numbers with 14-digit ULPIN (Bhu-Aadhaar)
                </CardDescription>
              </div>
              <Link href="/map">
                <Button variant="default" size="sm" className="text-xs gap-1">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Inspect on Map</span>
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ULPIN / Gat No</TableHead>
                    <TableHead>Village / Tehsil</TableHead>
                    <TableHead>Owner of Record</TableHead>
                    <TableHead>Land Category</TableHead>
                    <TableHead>Area (ha)</TableHead>
                    <TableHead>Acquisition Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-xs">
                      <div className="text-amber-400 font-bold">MH240019284712</div>
                      <div className="text-slate-400">Gat No. 42/1 (KH-892)</div>
                    </TableCell>
                    <TableCell className="text-xs">Sinnar, Nashik</TableCell>
                    <TableCell className="text-xs font-semibold text-white">Ramesh Patil & Sons</TableCell>
                    <TableCell className="text-xs">Agricultural (Irrigated)</TableCell>
                    <TableCell className="text-xs font-mono">2.5 ha</TableCell>
                    <TableCell>
                      <Badge variant="success">Acquired</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href="/compensation">
                        <Button variant="ghost" size="sm" className="text-xs text-amber-400">
                          Award Detail →
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">
                      <div className="text-amber-400 font-bold">MH240019284713</div>
                      <div className="text-slate-400">Gat No. 42/2 (KH-893)</div>
                    </TableCell>
                    <TableCell className="text-xs">Sinnar, Nashik</TableCell>
                    <TableCell className="text-xs font-semibold text-white">Suresh Gaikwad</TableCell>
                    <TableCell className="text-xs">Agricultural (Dry)</TableCell>
                    <TableCell className="text-xs font-mono">1.8 ha</TableCell>
                    <TableCell>
                      <Badge variant="default">Possessed</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href="/compensation">
                        <Button variant="ghost" size="sm" className="text-xs text-amber-400">
                          Award Detail →
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">
                      <div className="text-amber-400 font-bold">MH240019284714</div>
                      <div className="text-slate-400">Gat No. 43 (KH-901)</div>
                    </TableCell>
                    <TableCell className="text-xs">Sinnar, Nashik</TableCell>
                    <TableCell className="text-xs font-semibold text-white">Priya Deshmukh</TableCell>
                    <TableCell className="text-xs">Commercial / Highway Front</TableCell>
                    <TableCell className="text-xs font-mono">3.2 ha</TableCell>
                    <TableCell>
                      <Badge variant="outline">Notified Sec 11</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href="/compensation">
                        <Button variant="ghost" size="sm" className="text-xs text-amber-400">
                          Award Detail →
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Affected Families */}
        <TabsContent value="families" className="space-y-4 mt-4">
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-white">
                  Affected Families Register & Rehabilitation Status
                </CardTitle>
                <CardDescription>
                  Surveyed families entitled to compensation and Second Schedule R&R grants
                </CardDescription>
              </div>
              <Link href="/rr">
                <Button variant="outline" size="sm" className="text-xs">
                  Schedule II/III Checker →
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Family Head & Father</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Land Lost</TableHead>
                    <TableHead>Compensation</TableHead>
                    <TableHead>R&R Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_FAMILIES.map((fam) => (
                    <TableRow key={fam.id}>
                      <TableCell className="text-xs font-medium text-white">
                        <div>{fam.familyHeadName}</div>
                        <div className="text-[10px] text-slate-500">S/o {fam.fatherHusbandName} ({fam.familyMembers} members)</div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-300">{fam.village}</TableCell>
                      <TableCell className="text-xs uppercase font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${fam.isBPL ? "bg-red-500/20 text-red-300" : "bg-slate-800 text-slate-300"}`}>
                          {fam.category} {fam.isBPL ? "• BPL" : ""}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-mono">{fam.landLost} ha</TableCell>
                      <TableCell className="text-xs font-mono">
                        <div className="text-emerald-400">₹{(fam.compensationPaid / 100000).toFixed(1)} L paid</div>
                        <div className="text-[10px] text-slate-500">of ₹{(fam.totalCompensation / 100000).toFixed(1)} L</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={fam.rrStatus === "completed" ? "success" : "outline"} className="text-[10px]">
                          {fam.rrStatus.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Compensation */}
        <TabsContent value="compensation" className="space-y-4 mt-4">
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-white">
                Statutory Compensation Formula Engine (RFCTLARR Sec 26–30)
              </CardTitle>
              <CardDescription>
                Calculated per First Schedule: Market Value + Rural Multiplier + 100% Solatium
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                <p className="text-amber-400 font-bold">
                  Formula: Total Award = [(Base Market Value × Multiplier) + Attached Assets] × 2.0 (Solatium)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-300">
                  <div>• Rural Multiplier: <strong>1.50x</strong> (Distance 10-20km)</div>
                  <div>• Solatium: <strong>100% (Sec 30)</strong></div>
                  <div>• Additional Interest: <strong>12% p.a. (Sec 30(3))</strong></div>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/compensation">
                  <Button variant="default" size="sm">
                    Open Full Compensation Valuation Calculator →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Documents */}
        <TabsContent value="documents" className="space-y-4 mt-4">
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-white">
                Statutory Document Repository & Gazette Publications
              </CardTitle>
              <CardDescription>
                Digitally signed government orders, e-Gazette notifications, and SIA evaluations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { title: "Gazette Notification under Section 11(1)", date: "10 Feb 2024", size: "2.4 MB", ref: "GZ/MH/2024/1234" },
                  { title: "Social Impact Assessment (SIA) Final Report", date: "20 Nov 2023", size: "14.8 MB", ref: "SIA/TISS/2023/88" },
                  { title: "Expert Group Recommendation under Section 7", date: "15 Jan 2024", size: "1.1 MB", ref: "EG/REV/2024/02" },
                  { title: "Section 19 Declaration of Acquisition", date: "15 Aug 2024", size: "3.2 MB", ref: "GZ/MH/2024/5678" },
                  { title: "Collector's Draft Award Schedule (Sec 23)", date: "01 Mar 2025", size: "5.6 MB", ref: "AWD/NSK/2025/11" },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-amber-400 shrink-0" />
                      <div>
                        <p className="font-semibold text-white">{doc.title}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Ref: {doc.ref} • Published: {doc.date} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-amber-400 gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download PDF</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
