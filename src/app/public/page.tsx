"use client";

import React, { useState } from "react";
import {
  Globe2,
  Search,
  FileCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Upload,
  Coins,
  ShieldCheck,
  Send,
  Building,
} from "lucide-react";
import { INDIAN_STATES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function CitizenPublicPortalPage() {
  // Search state
  const [searchKhasra, setSearchKhasra] = useState("");
  const [searchVillage, setSearchVillage] = useState("");
  const [searchResult, setSearchResult] = useState<boolean | null>(null);

  // Objection form state
  const [objectionSubmitted, setObjectionSubmitted] = useState(false);
  const [claimantName, setClaimantName] = useState("");
  const [claimantPhone, setClaimantPhone] = useState("");
  const [khasraNo, setKhasraNo] = useState("");
  const [objectionGround, setObjectionGround] = useState("measurement_error");
  const [objectionDetails, setObjectionDetails] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchResult(true);
  };

  const handleObjectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setObjectionSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/30 p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                G2C Citizen Service Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">RFCTLARR 2013</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Citizen Land Record & Compensation Inquiry
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Verify if your land parcel (Khasra/Gat) is notified for acquisition, track statutory compensation awards, and file Section 15 objections online.
            </p>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Toll-free Helpline</span>
            <span className="text-base font-bold text-amber-400 font-mono">1800-11-2013</span>
            <span className="text-[10px] text-slate-500 block">Ministry of Rural Dev</span>
          </div>
        </div>
      </div>

      {/* Grid: Search & Objection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Khasra Status Lookup (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Search className="h-4 w-4 text-amber-400" />
                <span>Search Land Acquisition Notice by Khasra</span>
              </CardTitle>
              <CardDescription>
                Check preliminary notification status under Section 11(1)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Select State</label>
                    <select className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200">
                      <option>Maharashtra</option>
                      <option>Uttar Pradesh</option>
                      <option>Gujarat</option>
                      <option>Madhya Pradesh</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">District</label>
                    <Input placeholder="e.g. Nashik" defaultValue="Nashik" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Revenue Village</label>
                    <Input
                      placeholder="e.g. Sinnar"
                      value={searchVillage}
                      onChange={(e) => setSearchVillage(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Survey / Gat / Khasra No *</label>
                    <Input
                      placeholder="e.g. 42/1"
                      value={searchKhasra}
                      onChange={(e) => setSearchKhasra(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="default" size="sm" className="w-full mt-2">
                  Verify Acquisition Status →
                </Button>
              </form>

              {/* Sample Search Result Box */}
              {searchResult && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-emerald-400">Record Found in Gazette</span>
                    <Badge variant="success">Acquisition Confirmed</Badge>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <p><strong>Project:</strong> Mumbai-Nagpur Expressway Phase III</p>
                    <p><strong>ULPIN:</strong> MH240019284712</p>
                    <p><strong>Owner of Record:</strong> Ramesh Patil & Sons</p>
                    <p><strong>Notified Area:</strong> 2.5 Hectares (Gat 42/1)</p>
                    <p><strong>Award Status:</strong> Passed on 01 Mar 2025</p>
                    <p className="text-emerald-400 font-bold">
                      <strong>Compensation Award:</strong> ₹42,50,000 (Credited via PFMS)
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Citizen Rights Explainer Card */}
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Your Rights Under RFCTLARR Act 2013</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-300">
              <p>• <strong>Fair Compensation:</strong> Minimum 2x to 4x of market value in rural areas plus 100% solatium (double the property valuation).</p>
              <p>• <strong>Right to Object:</strong> 60-day legal window under Section 15 to challenge public purpose, boundary errors, or inadequate circle rate.</p>
              <p>• <strong>No Eviction Without Full Payout:</strong> Under Section 38, possession cannot be taken until all money is deposited in your bank account.</p>
            </CardContent>
          </Card>
        </div>

        {/* Right: Section 15 Online Objection Filing Form (6 cols) */}
        <div className="lg:col-span-6">
          <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Send className="h-4 w-4 text-amber-400" />
                    <span>File Section 15 Objection Online</span>
                  </CardTitle>
                  <CardDescription>
                    Direct submission to the District Collector / Competent Authority
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  Statutory 60-Day Gate
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {!objectionSubmitted ? (
                <form onSubmit={handleObjectionSubmit} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Landowner / Claimant Full Name *</label>
                    <Input
                      placeholder="e.g. Ramesh Shankar Patil"
                      value={claimantName}
                      onChange={(e) => setClaimantName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Mobile Number (for SMS Alerts) *</label>
                      <Input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={claimantPhone}
                        onChange={(e) => setClaimantPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Gat / Survey / Khasra No *</label>
                      <Input
                        placeholder="e.g. Gat 42/1"
                        value={khasraNo}
                        onChange={(e) => setKhasraNo(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Ground of Objection *</label>
                    <select
                      value={objectionGround}
                      onChange={(e) => setObjectionGround(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200"
                    >
                      <option value="measurement_error">Measurement & Boundary Demarcation Error</option>
                      <option value="circle_rate_inadequate">Circle Rate / Market Valuation Inadequate</option>
                      <option value="multi_crop_land">Multi-Crop Irrigated Land (Food Security Clause Sec 10)</option>
                      <option value="public_purpose_challenge">Challenging Necessity / Public Purpose</option>
                      <option value="omission_of_claimant">Omission of Legal Co-sharer / Tenant</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Statement of Grounds & Remarks *</label>
                    <textarea
                      rows={3}
                      placeholder="Detail your objection for the Collector's hearing..."
                      value={objectionDetails}
                      onChange={(e) => setObjectionDetails(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/60 p-3 text-center">
                    <Upload className="mx-auto h-5 w-5 text-amber-400 mb-1" />
                    <span className="text-[11px] text-slate-400 block">
                      Attach 7/12 Extract / RoR Deed / Proof of Title (PDF up to 10MB)
                    </span>
                    <input type="file" className="hidden" id="claim-doc" />
                    <label
                      htmlFor="claim-doc"
                      className="mt-2 inline-block px-3 py-1 rounded bg-slate-800 text-[11px] text-slate-200 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>

                  <Button type="submit" variant="emerald" size="sm" className="w-full mt-2">
                    Submit Statutory Objection under Section 15 →
                  </Button>
                </form>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Section 15 Objection Registered
                  </h3>
                  <p className="text-xs text-slate-400">
                    Your formal objection has been logged with the District Collector. A notice for personal hearing will be issued within 30 days.
                  </p>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-amber-400">
                    Acknowledgment Reference: OBJ-RFCTLARR-2026-9042
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setObjectionSubmitted(false)}
                    className="text-xs"
                  >
                    File Another Objection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
