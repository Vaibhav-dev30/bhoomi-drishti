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
  Lock,
  ShieldAlert,
  Key,
  Download,
  Share2,
  Printer,
  ExternalLink,
  ChevronRight,
  Landmark,
  Compass,
} from "lucide-react";
import { MOCK_PROJECTS, MOCK_FAMILIES, getProjectWorkflow } from "@/lib/mock-data";
import { BHUNAKSHA_PROJECTS } from "@/lib/bhunaksha-service";
import { AcquisitionWorkflowStepper } from "@/components/workflow/acquisition-workflow-stepper";
import { AffectedLandTable } from "@/components/workflow/affected-land-table";
import { useApp } from "@/context/app-context";
import { checkResourceAccess, filterBhuParcelsForUser } from "@/lib/auth-store";
import { RequestAccessModal } from "@/components/auth/request-access-modal";
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
  const project = MOCK_PROJECTS.find((p) => p.id === projectId);
  if (!project) {
    notFound();
  }
  const bhuProject = BHUNAKSHA_PROJECTS.find((p) => p.id === projectId) || BHUNAKSHA_PROJECTS[0];
  const workflowStages = getProjectWorkflow(project);
  const [activeTab, setActiveTab] = useState("overview");

  const { currentUser, scopedGrants } = useApp();
  const [showRequestModal, setShowRequestModal] = useState(false);

  const access = checkResourceAccess(currentUser, scopedGrants, {
    projectId: project.id,
    state: project.state,
    stateCode: project.stateCode,
    district: project.district,
    tehsil: project.tehsil,
  });

  const authorizedParcels = filterBhuParcelsForUser(currentUser, scopedGrants, bhuProject.parcels);
  const authorizedFamilies = MOCK_FAMILIES.filter((fam) => fam.projectId === project.id);

  // Statutory Gate for Out-of-Jurisdiction Access
  if (!access.allowed) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Projects</span>
        </Link>

        {/* Statutory Restriction Card */}
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-b from-[#FEF3C7]/40 via-white to-[#FAF8F5] p-8 shadow-md text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              RFCTLARR Statutory Jurisdiction Boundary
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Administrative Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              This statutory land acquisition dossier is outside your authorized administrative jurisdiction.
              Access to full project cadastres, landowner awards, and compensation registers requires formal senior delegation.
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto text-xs">
            <div className="bg-white rounded-2xl p-4 border border-[#E5E0D6] shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Your Current Authority
              </span>
              <div className="font-bold text-slate-900 text-sm">{currentUser?.name || "Official"}</div>
              <div className="text-slate-600 font-medium">{currentUser?.designation}</div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-700 font-semibold">
                <span>Jurisdiction:</span>
                <span className="text-[#15803D]">{currentUser?.jurisdiction.displayText || "Local"}</span>
              </div>
            </div>

            <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                Target Project Dossier
              </span>
              <div className="font-bold text-amber-950 text-sm">{project.name}</div>
              <div className="text-amber-800 font-medium">Requisitioning: {project.lrbName}</div>
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-amber-900 font-semibold">
                <span>Jurisdiction:</span>
                <span>{project.district}, {project.state}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => setShowRequestModal(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold gap-2 bg-[#15803D] hover:bg-[#166534] text-white shadow-xs"
            >
              <Lock className="w-4 h-4" />
              <span>Request Scoped Access from Senior Officer</span>
            </Button>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="default" className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0B2740] hover:bg-[#13385c] text-white">
                Return to Dashboard
              </Button>
            </Link>
            <Link href="/projects" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold border-[#E5E0D6] text-slate-700 hover:bg-[#F4EFEA]">
                Return to My Projects
              </Button>
            </Link>
          </div>

          <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-200/70 max-w-md mx-auto">
            Governed by Section 11 & Section 101 of RFCTLARR Act 2013 and Central Land Portal Access Standards.
          </div>
        </div>

        {/* Modal */}
        <RequestAccessModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          targetType="project"
          targetId={project.id}
          targetName={project.name}
          targetState={project.state}
          targetDistrict={project.district}
          seniorAuthorityName={access.seniorName || currentUser?.parentAuthorityName}
          seniorAuthorityRole={access.seniorRole || currentUser?.parentAuthorityTitle}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top back bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D6] pb-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Projects</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/map">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-[#BAE6FD] bg-[#F0F9FF] text-[#0284C7] hover:bg-[#E0F2FE]">
              <Compass className="h-3.5 w-3.5 text-[#0284C7]" />
              <span>Locate on GIS Map</span>
            </Button>
          </Link>
          <Button variant="secondary" size="sm" className="h-8 text-xs gap-1.5 border border-[#E5E0D6] bg-white hover:bg-[#FAF8F5] text-slate-700">
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print Dossier</span>
          </Button>
        </div>
      </div>

      {/* Project Hero Dossier Header */}
      <div className="rounded-3xl border border-[#E5E0D6] bg-gradient-to-br from-white via-[#FAF8F5] to-[#F0FDF4]/50 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-[#FEF3C7] text-[#B45309] font-bold border border-[#FDE68A]">
                {project.projectCode}
              </span>
              <Badge variant="default" className="capitalize bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]">
                {project.type}
              </Badge>
              <Badge variant="success" className="capitalize bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]">
                {project.status.replace(/_/g, " ")}
              </Badge>
              <span className="text-xs text-slate-500 font-mono">
                Requisition Date: {formatDate(project.proposalDate)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {project.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-normal">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 text-xs">
            <div className="bg-white p-3 rounded-2xl border border-[#E5E0D6] shadow-xs">
              <span className="text-[10px] text-slate-500 block font-semibold">Land Requiring Agency (LRB)</span>
              <span className="font-bold text-slate-900 block mt-0.5">{project.lrbName}</span>
              <span className="text-[10px] text-slate-500 block">{project.lrbType}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-[#E5E0D6] shadow-xs">
              <span className="text-[10px] text-slate-500 block font-semibold">Competent Authority (CALA)</span>
              <span className="font-bold text-slate-900 block mt-0.5">Collector, {project.district}</span>
              <span className="text-[10px] text-slate-500 block">State of {project.state}</span>
            </div>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="mt-6 pt-6 border-t border-[#E5E0D6] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Land Required</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
              {formatArea(project.totalAreaRequired)}
            </span>
            <span className="text-[10px] text-[#15803D] font-bold block">
              {formatArea(project.areaAcquired)} acquired ({getPercentage(project.areaAcquired, project.totalAreaRequired)}%)
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Compensation Assessed</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
              ₹{(project.compensationAssessed / 100).toFixed(1)} Cr
            </span>
            <span className="text-[10px] text-[#15803D] font-bold block">
              ₹{(project.compensationDisbursed / 100).toFixed(1)} Cr paid
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Affected Families</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
              {project.totalAffectedFamilies}
            </span>
            <span className="text-[10px] text-purple-700 font-bold block">
              {project.displacedFamilies} displaced
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">R&R Entitlements</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
              {project.rrCompletedFamilies} / {project.displacedFamilies}
            </span>
            <span className="text-[10px] text-[#0284C7] font-bold block">
              {getPercentage(project.rrCompletedFamilies, project.displacedFamilies)}% completed
            </span>
          </div>
        </div>
      </div>

      {/* RFCTLARR Act 2013 10-Stage Statutory Stepper */}
      <AcquisitionWorkflowStepper project={bhuProject} />

      {/* Main Tabbed Dossier Sections */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#F5F2EB] border border-[#E5E0D6] w-full justify-start overflow-x-auto p-1 rounded-2xl">
          <TabsTrigger value="overview">Overview & Scope</TabsTrigger>
          <TabsTrigger value="parcels">Land Parcels ({authorizedParcels.length})</TabsTrigger>
          <TabsTrigger value="families">Affected Families ({authorizedFamilies.length})</TabsTrigger>
          <TabsTrigger value="compensation">Valuation Ledger (Sec 26-30)</TabsTrigger>
          <TabsTrigger value="documents">Statutory Documents (DMS)</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
              <CardHeader className="pb-3 border-b border-[#F2EFE8]">
                <CardTitle className="text-sm font-extrabold text-slate-900">
                  Notified Revenue Villages & Administrative Scope
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs pt-4">
                <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                  <span className="text-slate-500 font-medium">State:</span>
                  <span className="font-bold text-slate-900">{project.state} ({project.stateCode})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                  <span className="text-slate-500 font-medium">District:</span>
                  <span className="font-bold text-slate-900">{project.district}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                  <span className="text-slate-500 font-medium">Tehsil / Taluk:</span>
                  <span className="font-bold text-slate-900">{project.tehsil}</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 font-medium block mb-1.5">Notified Villages:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.villages.map((v) => (
                      <span key={v} className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-slate-700 text-xs font-mono font-semibold border border-[#E5E0D6]">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
              <CardHeader className="pb-3 border-b border-[#F2EFE8]">
                <CardTitle className="text-sm font-extrabold text-slate-900">
                  Key Statutory Timelines & Sunsets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs pt-4">
                <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                  <span className="text-slate-500 font-medium">Proposal Date:</span>
                  <span className="font-mono font-bold text-slate-900">{formatDate(project.proposalDate)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                  <span className="text-slate-500 font-medium">SIA Completed (Sec 6):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {project.siaCompletionDate ? formatDate(project.siaCompletionDate) : "In Progress"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                  <span className="text-slate-500 font-medium">Sec 11 Preliminary Notification:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {project.sec11Date ? formatDate(project.sec11Date) : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                  <span className="text-slate-500 font-medium">Sec 19 Declaration:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {project.sec19Date ? formatDate(project.sec19Date) : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                  <span className="text-slate-500 font-medium">Collector's Award (Sec 23):</span>
                  <span className="font-mono font-bold text-[#15803D]">
                    {project.awardDate ? formatDate(project.awardDate) : "Within 12 Months"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Land Parcels */}
        <TabsContent value="parcels" className="space-y-4 mt-4">
          <AffectedLandTable parcels={authorizedParcels} />
        </TabsContent>

        {/* Tab 3: Affected Families */}
        <TabsContent value="families" className="space-y-4 mt-4">
          <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#F2EFE8] pb-4">
              <div>
                <CardTitle className="text-sm font-extrabold text-slate-900">
                  Affected Families Register & Rehabilitation Status
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Surveyed families entitled to statutory compensation and Second Schedule R&R grants
                </CardDescription>
              </div>
              <Link href="/rr">
                <Button variant="outline" size="sm" className="text-xs font-bold border-[#BAE6FD] bg-[#F0F9FF] text-[#0284C7] hover:bg-[#E0F2FE]">
                  Schedule II/III Checker →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E5E0D6] bg-[#FAF8F5]">
                    <TableHead className="text-slate-700 font-bold">Family Head & Kin</TableHead>
                    <TableHead className="text-slate-700 font-bold">Village</TableHead>
                    <TableHead className="text-slate-700 font-bold">Category</TableHead>
                    <TableHead className="text-slate-700 font-bold">Land Lost</TableHead>
                    <TableHead className="text-slate-700 font-bold">Compensation</TableHead>
                    <TableHead className="text-slate-700 font-bold">R&R Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authorizedFamilies.map((fam) => (
                    <TableRow key={fam.id} className="border-[#F2EFE8] hover:bg-[#FAF8F5] transition-colors">
                      <TableCell className="text-xs font-bold text-slate-900 py-3">
                        <div>{fam.familyHeadName}</div>
                        <div className="text-[10px] text-slate-500 font-normal">S/o {fam.fatherHusbandName} ({fam.familyMembers} members)</div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 font-medium">{fam.village}</TableCell>
                      <TableCell className="text-xs uppercase font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${fam.isBPL ? "bg-red-100 text-red-700 border border-red-200" : "bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]"}`}>
                          {fam.category} {fam.isBPL ? "• BPL" : ""}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-mono font-bold text-slate-900">{fam.landLost} ha</TableCell>
                      <TableCell className="text-xs font-mono">
                        <div className="text-[#15803D] font-extrabold">₹{(fam.compensationPaid / 100000).toFixed(1)} L paid</div>
                        <div className="text-[10px] text-slate-500 font-medium">of ₹{(fam.totalCompensation / 100000).toFixed(1)} L</div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${fam.rrStatus === "completed" ? "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]" : "bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]"}`}>
                          {fam.rrStatus.replace(/_/g, " ")}
                        </span>
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
          <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
            <CardHeader className="border-b border-[#F2EFE8] pb-4">
              <CardTitle className="text-sm font-extrabold text-slate-900">
                Statutory Compensation Formula Engine (RFCTLARR Sec 26–30)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Calculated per First Schedule: Market Value + Rural Multiplier + 100% Solatium
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D6] font-mono text-xs space-y-2">
                <p className="text-[#0369A1] font-bold">
                  Formula: Total Award = [(Base Market Value × Multiplier) + Attached Assets] × 2.0 (Solatium)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-700">
                  <div>• Rural Multiplier: <strong className="text-slate-900">1.50x</strong> (Distance 10-20km)</div>
                  <div>• Solatium: <strong className="text-slate-900">100% (Sec 30)</strong></div>
                  <div>• Additional Interest: <strong className="text-slate-900">12% p.a. (Sec 30(3))</strong></div>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/compensation">
                  <Button variant="default" size="sm" className="bg-[#15803D] hover:bg-[#166534] text-white">
                    Open Full Compensation Valuation Calculator →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Documents */}
        <TabsContent value="documents" className="space-y-4 mt-4">
          <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
            <CardHeader className="border-b border-[#F2EFE8] pb-4">
              <CardTitle className="text-sm font-extrabold text-slate-900">
                Statutory Document Repository & Gazette Publications
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Digitally signed government orders, e-Gazette notifications, and SIA evaluations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
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
                    className="flex items-center justify-between p-3 rounded-2xl border border-[#E5E0D6] bg-[#FAF8F5] hover:bg-white hover:border-[#CBD5E1] transition-all text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#B45309]">
                        <FileText className="h-4 w-4 shrink-0" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{doc.title}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Ref: {doc.ref} • Published: {doc.date} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-[#0284C7] hover:bg-[#E0F2FE] gap-1">
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
