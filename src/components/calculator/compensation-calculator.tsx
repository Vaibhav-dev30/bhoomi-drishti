"use client";

import React, { useState } from "react";
import {
  Calculator,
  Coins,
  TrendingUp,
  Scale,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CompensationCalculator({
  initialArea = 1.84,
  initialCircleRate = 7000000,
  initialMultiplier = 1.5,
  initialAssets = 1250000,
  lang = "hi",
}: {
  initialArea?: number;
  initialCircleRate?: number;
  initialMultiplier?: number;
  initialAssets?: number;
  lang?: "hi" | "en";
}) {
  const [area, setArea] = useState<number>(initialArea);
  const [circleRate, setCircleRate] = useState<number>(initialCircleRate);
  const [locationType, setLocationType] = useState<"rural" | "urban">("rural");
  const [multiplier, setMultiplier] = useState<number>(initialMultiplier);
  const [assetsValue, setAssetsValue] = useState<number>(initialAssets);
  const [interestMonths, setInterestMonths] = useState<number>(14);

  // Calculations under RFCTLARR Act 2013 (First Schedule & Section 26-30)
  const effectiveMultiplier = locationType === "urban" ? 1.0 : multiplier;
  const baseLandValue = area * circleRate;
  const multipliedLandValue = baseLandValue * effectiveMultiplier;
  const totalPropertyBeforeSolatium = multipliedLandValue + assetsValue;
  const solatiumAmount = totalPropertyBeforeSolatium * 1.0; // 100% statutory solatium under Section 30
  const additionalInterest = totalPropertyBeforeSolatium * 0.12 * (interestMonths / 12); // 12% p.a. under Sec 30(3)
  const totalAward = totalPropertyBeforeSolatium + solatiumAmount + additionalInterest;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const resetDefaults = () => {
    setArea(1.84);
    setCircleRate(7000000);
    setLocationType("rural");
    setMultiplier(1.5);
    setAssetsValue(1250000);
    setInterestMonths(14);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Input Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
            <CardHeader className="border-b border-[#F2EFE8] pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-[#15803D]" />
                    <span>
                      {lang === "hi"
                        ? "वैधानिक प्रतिकर सिमुलेटर (First Schedule Simulator)"
                        : "Statutory Compensation Simulator (First Schedule)"}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    {lang === "hi"
                      ? "RFCTLARR 2013 की धारा 26, 29 एवं 30 के अनुसार वास्तविक वित्तीय गणना"
                      : "Real-time calculation compliant with Sections 26, 29 & 30 of RFCTLARR Act 2013"}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetDefaults}
                  className="text-xs text-slate-500 hover:text-slate-800 gap-1 h-8 px-2"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{lang === "hi" ? "रीसेट" : "Reset"}</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-5">
              {/* 1. Land Area Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    {lang === "hi" ? "1. अधिग्रहित भू-क्षेत्र (Hectares)" : "1. Acquired Land Area (Hectares)"}
                  </label>
                  <span className="font-mono text-xs font-bold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                    {area.toFixed(2)} Ha ({Math.round(area * 10000).toLocaleString("en-IN")} sq.m)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10.0"
                  step="0.05"
                  value={area}
                  onChange={(e) => setArea(parseFloat(e.target.value))}
                  className="w-full accent-[#15803D] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.10 Ha</span>
                  <span>5.00 Ha</span>
                  <span>10.00 Ha</span>
                </div>
              </div>

              {/* 2. Circle Rate / Market Rate Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    {lang === "hi" ? "2. सर्किल दर / न्यूनतम बाजार मूल्य (₹/Ha)" : "2. Circle Rate / Base Market Rate (₹/Ha)"}
                  </label>
                  <span className="font-mono text-xs font-bold text-[#15803D] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {formatINR(circleRate)} / Ha
                  </span>
                </div>
                <input
                  type="range"
                  min="1000000"
                  max="25000000"
                  step="500000"
                  value={circleRate}
                  onChange={(e) => setCircleRate(parseInt(e.target.value))}
                  className="w-full accent-[#15803D] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹10 Lakh/Ha</span>
                  <span>₹1.25 Cr/Ha</span>
                  <span>₹2.50 Cr/Ha</span>
                </div>
              </div>

              {/* 3. Location & Rural Multiplier Factor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {lang === "hi" ? "3. क्षेत्र वर्गीकरण (Location)" : "3. Land Zone"}
                  </label>
                  <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => setLocationType("rural")}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        locationType === "rural"
                          ? "bg-white text-[#15803D] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {lang === "hi" ? "ग्रामीण (Rural)" : "Rural"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationType("urban")}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        locationType === "urban"
                          ? "bg-white text-[#0284C7] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {lang === "hi" ? "शहरी (Urban)" : "Urban (1.0x)"}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>{lang === "hi" ? "दूरी गुणक (Multiplier)" : "Rural Multiplier"}</span>
                    <span className="font-mono text-xs font-bold text-[#15803D]">
                      {effectiveMultiplier.toFixed(2)}x
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1.0"
                    max="2.0"
                    step="0.05"
                    disabled={locationType === "urban"}
                    value={effectiveMultiplier}
                    onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                    className="w-full accent-[#15803D] cursor-pointer h-2 bg-slate-200 rounded-lg disabled:opacity-40"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    {locationType === "urban" ? "Fixed at 1.00x under Sec 26" : "1.00x to 2.00x based on distance"}
                  </span>
                </div>
              </div>

              {/* 4. Assets & Structures on Land (Trees, Tube-wells, Pucca Construction) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    {lang === "hi" ? "4. संपत्ति, पेड़ व निर्माण मूल्यांकन (Section 29)" : "4. Value of Attached Assets / Structures (Section 29)"}
                  </label>
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    {formatINR(assetsValue)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="50000"
                  value={assetsValue}
                  onChange={(e) => setAssetsValue(parseInt(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <span className="text-[10px] text-slate-400 block">
                  Includes horticulture valuation, private tube-well borings, cattle sheds, and boundary walls.
                </span>
              </div>

              {/* 5. Statutory 12% Interest Duration */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    {lang === "hi" ? "5. धारा 11 अधिसूचना से बीता समय (Sec 30(3) 12% Interest)" : "5. Time from Sec 11 Notification (Sec 30(3) 12% p.a.)"}
                  </label>
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                    {interestMonths} Months ({(interestMonths / 12).toFixed(1)} Yrs)
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="36"
                  step="1"
                  value={interestMonths}
                  onChange={(e) => setInterestMonths(parseInt(e.target.value))}
                  className="w-full accent-[#0284C7] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <span className="text-[10px] text-slate-400 block">
                  Statutory 12% per annum accrued from Section 11 gazette date until Collector&apos;s award date.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Award Breakdown & Solatium Certificate Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-[#BBF7D0] bg-gradient-to-b from-[#F0FDF4] to-white rounded-3xl shadow-md overflow-hidden">
            <CardHeader className="border-b border-[#BBF7D0] bg-[#DCFCE7]/60 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-[#15803D]" />
                  <CardTitle className="text-base font-extrabold text-slate-900">
                    {lang === "hi" ? "अनुमानित कुल प्रतिकर अधिनिर्णय" : "Estimated Total Award"}
                  </CardTitle>
                </div>
                <span className="rounded-full bg-[#15803D] text-white text-[10px] font-mono font-bold px-2 py-0.5">
                  100% SOLATIUM
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Grand Total Hero Display */}
              <div className="rounded-2xl border border-[#BBF7D0] bg-white p-4 shadow-sm text-center space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === "hi" ? "कुल देय प्रतिकर राशि (PFMS DBT)" : "Net Payable Compensation (PFMS DBT)"}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#15803D] font-mono tracking-tight">
                  {formatINR(totalAward)}
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-[#DCFCE7] px-2.5 py-0.5 rounded-full mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {lang === "hi" ? "कर मुक्त (Tax Exempt under Section 96)" : "Tax Exempt under Section 96"}
                </div>
              </div>

              {/* Step-by-Step Breakdown Table */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">
                    A. {lang === "hi" ? "मूल भूमि मूल्यांकन (Base Land)" : "Base Land Valuation"}:
                  </span>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatINR(baseLandValue)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">
                    B. {lang === "hi" ? "दूरी गुणक प्रभाव (Multiplier" : "Multiplier Factor ("}{effectiveMultiplier.toFixed(2)}x):
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatINR(multipliedLandValue)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">
                    C. {lang === "hi" ? "संपत्ति व निर्माण (Attached Assets)" : "Attached Assets (Sec 29)"}:
                  </span>
                  <span className="font-mono font-semibold text-amber-800">
                    + {formatINR(assetsValue)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 rounded-xl bg-emerald-50 px-2.5 border border-emerald-200">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#15803D]" />
                    <span className="font-bold text-emerald-900">
                      D. {lang === "hi" ? "100% वैधानिक तोषण (Solatium Sec 30)" : "100% Solatium (Sec 30)"}:
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-[#15803D]">
                    + {formatINR(solatiumAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">
                    E. {lang === "hi" ? `12% वार्षिक अतिरिक्त ब्याज (${interestMonths} माह)` : `12% p.a. Interest (${interestMonths} mos)`}:
                  </span>
                  <span className="font-mono font-semibold text-[#0284C7]">
                    + {formatINR(additionalInterest)}
                  </span>
                </div>
              </div>

              {/* Statutory Guarantee Badge */}
              <div className="rounded-2xl border border-slate-200 bg-[#FAF8F5] p-3 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#15803D]" />
                  <span>Statutory Legal Protection under RFCTLARR Act:</span>
                </div>
                <p className="leading-relaxed">
                  Under <strong>Section 38</strong>, physical possession cannot be taken until this entire award is disbursed electronically into the landowner&apos;s PFMS bank account.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
