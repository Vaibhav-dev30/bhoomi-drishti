"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FilePlus,
  ArrowLeft,
  CheckCircle2,
  Building,
  MapPin,
  Upload,
  FileText,
  FileJson,
  Trash2,
  Sparkles,
} from "lucide-react";
import { INDIAN_STATES } from "@/lib/mock-data";
import { ProjectType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewProjectProposalPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("highway");
  const [lrbName, setLrbName] = useState("");
  const [state, setState] = useState("MH");
  const [district, setDistrict] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [villages, setVillages] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [purposeDescription, setPurposeDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [sajraSheet, setSajraSheet] = useState("Sheet 04 - Alipur, North Delhi (110036)");
  const [corridorWidth, setCorridorWidth] = useState("60m");
  const [demoFiles, setDemoFiles] = useState<{name: string; size: string; type: string; icon: "pdf" | "geojson"}[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const loadDemoFiles = () => {
    setDemoFiles([
      {
        name: "DPR_NH48_Greenfield_Express_Bypass_v2.3_NHAI.pdf",
        size: "14.2 MB",
        type: "Detailed Project Report (DPR)",
        icon: "pdf",
      },
      {
        name: "NH48_Alignment_Corridor_Survey_EPSG4326.geojson",
        size: "1.8 MB",
        type: "GeoJSON Alignment Map",
        icon: "geojson",
      },
    ]);
  };

  const removeFile = (index: number) => {
    setDemoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects Register</span>
        </Link>
        <span className="text-xs font-mono font-bold text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full border border-[#BBF7D0]">
          Form-1A (RFCTLARR Land Requisition)
        </span>
      </div>

      {!submitted ? (
        <Card className="border-[#E5E0D6] bg-white shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <FilePlus className="h-5 w-5 text-[#15803D]" />
                  <span>Online Land Requisition Proposal</span>
                </CardTitle>
                <CardDescription className="mt-1 text-slate-600">
                  Submit project proposal for initiation of Social Impact Assessment (SIA) under Section 4 of RFCTLARR Act 2013
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono font-bold bg-[#E0F2FE] px-3 py-1.5 rounded-xl border border-[#BAE6FD] text-[#0284C7]">
                Step {step} of 3
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Project Metadata & LRB info */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800 border-b border-[#F2EFE8] pb-2 flex items-center gap-2">
                  <Building className="h-4 w-4 text-[#0284C7]" />
                  <span>1. Project Identity & Requiring Agency (LRB)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Full Project Name *
                    </label>
                    <Input
                      placeholder="e.g., Delhi-Amritsar-Katra Expressway Phase II"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Infrastructure Sector *
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value as ProjectType)}
                      className="w-full rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#0284C7] focus:outline-none"
                    >
                      <option value="highway">National Highway (MoRTH/NHAI)</option>
                      <option value="railway">Railway & Dedicated Freight Corridor</option>
                      <option value="irrigation">River Interlinking & Irrigation</option>
                      <option value="industrial">Industrial Corridor / Port / SEZ</option>
                      <option value="renewable_energy">Solar / Wind Renewable Energy</option>
                      <option value="urban_development">Urban Infrastructure & Metro</option>
                      <option value="defense">Strategic Defense Infrastructure</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Land Requiring Body (LRB) Name *
                    </label>
                    <Input
                      placeholder="e.g., National Highways Authority of India"
                      value={lrbName}
                      onChange={(e) => setLrbName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Public Purpose Justification & Scope *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Explain the public purpose under Section 2 of RFCTLARR Act..."
                      value={purposeDescription}
                      onChange={(e) => setPurposeDescription(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#0284C7] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Land Requisition */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800 border-b border-[#F2EFE8] pb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#15803D]" />
                  <span>2. Geographic Jurisdiction & Land Dimensions</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      State / UT *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#0284C7] focus:outline-none"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      District *
                    </label>
                    <Input
                      placeholder="e.g., North Delhi or Ghaziabad"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Tehsil / Sub-Division *
                    </label>
                    <Input
                      placeholder="e.g., Alipur or Ghaziabad"
                      value={tehsil}
                      onChange={(e) => setTehsil(e.target.value)}
                      required
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Notified Revenue Villages (Comma-separated) *
                    </label>
                    <Input
                      placeholder="e.g., Alipur, Narela, Sahibabad, Morta, Duhai"
                      value={villages}
                      onChange={(e) => setVillages(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Total Land Required (Hectares) *
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 450.5"
                      value={totalArea}
                      onChange={(e) => setTotalArea(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Estimated Outlay (₹ Lakhs) *
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g., 35000"
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Target Possession Date *
                    </label>
                    <Input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      BhuNaksha Cadastral Sheet (Sajra) *
                    </label>
                    <select
                      value={sajraSheet}
                      onChange={(e) => setSajraSheet(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#0284C7] focus:outline-none cursor-pointer"
                    >
                      <option value="Sheet 04 - Alipur, North Delhi (110036)">Sheet No. 04 - Alipur & Narela (LGD: 110036) [14 Khasras]</option>
                      <option value="Sheet 01 - Sahibabad, Ghaziabad (201005)">Sheet No. 01 - Sahibabad & Arthala (LGD: 201005) [20 Khasras]</option>
                      <option value="Sheet 02 - Duhai Regional Node">Sheet No. 02 - Duhai & Morta Node Cadastre</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Alignment Corridor Width (Right-of-Way) *
                    </label>
                    <select
                      value={corridorWidth}
                      onChange={(e) => setCorridorWidth(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#0284C7] focus:outline-none cursor-pointer"
                    >
                      <option value="60m">60m (National Highway 4/6-lane ROW)</option>
                      <option value="45m">45m (Expressway Greenfield Corridor)</option>
                      <option value="30m">30m (State Highway / Canal Feeder)</option>
                      <option value="zonal">Zonal Boundary Polygon (Solar / Industrial Park)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Document Uploads & DPR */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#F2EFE8] pb-2">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    <Upload className="h-4 w-4 text-[#0284C7]" />
                    <span>3. Document Annexures & Digital Affirmation</span>
                  </h3>
                  {demoFiles.length === 0 && (
                    <button
                      type="button"
                      onClick={loadDemoFiles}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#15803D] to-[#166534] text-[11px] font-bold text-white hover:from-[#166534] hover:to-[#14532D] transition-all shadow-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Load Demo Data
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Attached files list */}
                  {demoFiles.length > 0 && (
                    <div className="space-y-2">
                      {demoFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300"
                          style={{ animationDelay: `${idx * 120}ms`, animationFillMode: "both" }}
                        >
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            file.icon === "pdf"
                              ? "bg-red-100 text-red-600"
                              : "bg-[#E0F2FE] text-[#0284C7]"
                          }`}>
                            {file.icon === "pdf" ? (
                              <FileText className="h-5 w-5" />
                            ) : (
                              <FileJson className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {file.type} · {file.size}
                            </p>
                          </div>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                            <CheckCircle2 className="h-3 w-3" /> Uploaded
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="p-1 rounded-md hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload zone */}
                  <div className="rounded-2xl border border-dashed border-[#BAE6FD] bg-[#F0F9FF] p-6 text-center hover:bg-[#E0F2FE]/40 transition-colors">
                    <Upload className="mx-auto h-8 w-8 text-[#0284C7] mb-2" />
                    <p className="text-xs font-bold text-slate-900">
                      {demoFiles.length > 0
                        ? "Upload Additional Documents"
                        : "Upload Detailed Project Report (DPR) & Alignment Map"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      PDF, GeoJSON, or KML up to 50MB (Must contain survey schedule)
                    </p>
                    <input type="file" className="hidden" id="dpr-upload" />
                    <label
                      htmlFor="dpr-upload"
                      className="mt-3 inline-block px-4 py-2 rounded-xl bg-[#0284C7] text-xs font-bold text-white hover:bg-[#0369A1] cursor-pointer shadow-xs"
                    >
                      Browse Files
                    </label>
                  </div>

                  <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-xs text-slate-800 space-y-1">
                    <p className="font-bold text-[#92400E]">
                      Statutory Undertaking by Land Requiring Body:
                    </p>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      The LRB hereby undertakes to deposit the estimated cost of land acquisition, administrative charges, and Rehabilitation & Resettlement expenses as prescribed under Section 19(2) prior to statutory declaration.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-[#F2EFE8] pt-4">
            {step > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
              >
                ← Previous Step
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                size="sm"
                className="bg-[#0284C7] hover:bg-[#0369A1] text-white"
                onClick={() => setStep(step + 1)}
              >
                Next Step →
              </Button>
            ) : (
              <Button
                variant="emerald"
                size="sm"
                onClick={handleSubmit}
              >
                Submit Proposal to Collector →
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        /* Success State */
        <Card className="border-[#BBF7D0] bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Land Acquisition Proposal Submitted
          </h2>
          <p className="mt-2 text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Your requisition has been logged on the national portal and routed to the <strong>District Collector / CALA</strong> for initiation of Social Impact Assessment (SIA) under Section 4.
          </p>

          <div className="my-6 max-w-sm mx-auto rounded-2xl border border-[#E5E0D6] bg-[#FAF8F5] p-4 font-mono text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Proposal ID:</span>
              <span className="font-bold text-[#0284C7]">PRJ-2026-IN-089</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date Logged:</span>
              <span className="text-slate-700 font-semibold">{new Date().toLocaleDateString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Action Officer:</span>
              <span className="text-slate-900 font-bold">Collector & CALA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Next Statutory Step:</span>
              <span className="text-[#15803D] font-bold">Section 4 SIA Unit Appointment</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link href="/projects">
              <Button size="sm" variant="outline" className="text-xs font-bold">
                Return to Projects Register
              </Button>
            </Link>
            <Link href="/map">
              <Button size="sm" className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold">
                Open in BhuNaksha Cadastral Map →
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
