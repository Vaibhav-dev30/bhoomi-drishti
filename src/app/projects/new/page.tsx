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
  FileText,
  Upload,
  AlertCircle,
  Coins,
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
  const [lrbType, setLrbType] = useState("Central PSU / Authority");
  const [state, setState] = useState("MH");
  const [district, setDistrict] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [villages, setVillages] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [purposeDescription, setPurposeDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects Register</span>
        </Link>
        <span className="text-xs font-mono text-amber-400">
          Form Form-1A (RFCTLARR Land Requisition)
        </span>
      </div>

      {!submitted ? (
        <Card className="border-slate-800 bg-slate-900/60 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <FilePlus className="h-5 w-5 text-amber-400" />
                  <span>Online Land Requisition Proposal</span>
                </CardTitle>
                <CardDescription className="mt-1">
                  Submit project proposal for initiation of Social Impact Assessment (SIA) under Section 4 of RFCTLARR Act 2013
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-slate-400">
                Step {step} of 3
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Project Metadata & LRB info */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-amber-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>1. Project Identity & Requiring Agency (LRB)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
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
                    <label className="text-xs font-medium text-slate-300">
                      Infrastructure Sector *
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value as ProjectType)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
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
                    <label className="text-xs font-medium text-slate-300">
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
                    <label className="text-xs font-medium text-slate-300">
                      Public Purpose Justification & Scope *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Explain the public purpose under Section 2 of RFCTLARR Act..."
                      value={purposeDescription}
                      onChange={(e) => setPurposeDescription(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Land Requisition */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-amber-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>2. Geographic Jurisdiction & Land Dimensions</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      State / UT *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      District *
                    </label>
                    <Input
                      placeholder="e.g., Nashik"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Tehsil / Sub-Division *
                    </label>
                    <Input
                      placeholder="e.g., Sinnar"
                      value={tehsil}
                      onChange={(e) => setTehsil(e.target.value)}
                      required
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Notified Revenue Villages (Comma-separated) *
                    </label>
                    <Input
                      placeholder="e.g., Sinnar, Ghoti, Ozar, Dindori, Niphad"
                      value={villages}
                      onChange={(e) => setVillages(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
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
                    <label className="text-xs font-medium text-slate-300">
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
                    <label className="text-xs font-medium text-slate-300">
                      Target Possession Date *
                    </label>
                    <Input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Document Uploads & DPR */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-amber-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>3. Document Annexures & Digital Affirmation</span>
                </h3>

                <div className="space-y-3">
                  <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center hover:border-amber-500/50 transition-colors">
                    <Upload className="mx-auto h-8 w-8 text-amber-400 mb-2" />
                    <p className="text-xs font-medium text-white">
                      Upload Detailed Project Report (DPR) & Alignment Map
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      PDF, GeoJSON, or KML up to 50MB (Must contain survey schedule)
                    </p>
                    <input type="file" className="hidden" id="dpr-upload" />
                    <label
                      htmlFor="dpr-upload"
                      className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 cursor-pointer"
                    >
                      Browse Files
                    </label>
                  </div>

                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-amber-400">
                      Statutory Undertaking by Land Requiring Body:
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      The LRB hereby undertakes to deposit the estimated cost of land acquisition, administrative charges, and Rehabilitation & Resettlement expenses as prescribed under Section 19(2) prior to statutory declaration.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-slate-800 pt-4">
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
                variant="default"
                size="sm"
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
        <Card className="border-emerald-500/30 bg-slate-900/80 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Land Acquisition Proposal Submitted
          </h2>
          <p className="mt-2 text-xs text-slate-300 max-w-md mx-auto">
            Your requisition has been logged on the national portal and routed to the <strong>District Collector / CALA</strong> for initiation of Social Impact Assessment (SIA) under Section 4.
          </p>

          <div className="my-6 max-w-sm mx-auto rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-left space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Proposal ID:</span>
              <span className="font-bold text-amber-400">PRJ-2026-IN-089</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date Logged:</span>
              <span className="text-slate-300">{new Date().toLocaleDateString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Action Officer:</span>
              <span className="text-white">Collector & CALA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Next Statutory Step:</span>
              <span className="text-emerald-400">Section 4 SIA Unit Appointment</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link href="/projects">
              <Button variant="default" size="sm">
                Return to Projects Register
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="outline" size="sm">
                View on Spatial Map
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
