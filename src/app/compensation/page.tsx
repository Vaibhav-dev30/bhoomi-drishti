"use client";

import React, { useState } from "react";
import {
  Calculator,
  Coins,
  ShieldCheck,
  Printer,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  Building,
  Info,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { MOCK_FAMILIES } from "@/lib/mock-data";
import { calculateCompensation } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CompensationPage() {
  // Calculator state
  const [areaHectares, setAreaHectares] = useState<number>(2.5);
  const [marketRate, setMarketRate] = useState<number>(2000000); // 20 Lakhs / ha
  const [multiplier, setMultiplier] = useState<number>(1.5);
  const [structuresValue, setStructuresValue] = useState<number>(450000);
  const [treesCropsValue, setTreesCropsValue] = useState<number>(150000);
  const [interestMonths, setInterestMonths] = useState<number>(14); // 14 months between Sec 4 and Award

  // Calculation logic
  const assetsTotal = structuresValue + treesCropsValue;
  const baseLandValue = areaHectares * marketRate;
  const multipliedLandValue = baseLandValue * multiplier;
  const propertyTotal = multipliedLandValue + assetsTotal;
  const solatium = propertyTotal * 1.0; // 100% Solatium per Section 30(1)
  const statutoryInterest = (baseLandValue * (0.12 / 12)) * interestMonths; // 12% p.a. per Section 30(3)
  const totalAward = propertyTotal + solatium + statutoryInterest;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Coins className="h-6 w-6 text-amber-400" />
            <span>Valuation & Compensation Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Automated statutory determination and PFMS Direct Benefit Transfer (DBT) ledger under Sections 26 to 34 of RFCTLARR Act 2013.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-slate-800">
            <Printer className="h-3.5 w-3.5 text-amber-400" />
            <span>Export Award Schedule (PDF)</span>
          </Button>
        </div>
      </div>

      {/* Main Interactive Valuation Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Parameters (7 cols) */}
        <Card className="lg:col-span-7 border-slate-800 bg-slate-900/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="h-4 w-4 text-amber-400" />
              <span>Statutory Valuation Calculator (First Schedule)</span>
            </CardTitle>
            <CardDescription>
              Configure market value, rural multiplier factor, attached assets, and Section 30 solatium
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Land Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Acquired Area (Hectares)
                </label>
                <Input
                  type="number"
                  step="0.05"
                  value={areaHectares}
                  onChange={(e) => setAreaHectares(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Base Circle Rate / Market Value */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Base Market Value (₹ / Hectare) - Sec 26
                </label>
                <Input
                  type="number"
                  step="50000"
                  value={marketRate}
                  onChange={(e) => setMarketRate(parseFloat(e.target.value) || 0)}
                />
                <span className="text-[10px] text-slate-500">Highest of Circle rate or 3-yr deed avg</span>
              </div>

              {/* Rural Multiplier Factor */}
              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-300">
                    Multiplier Factor: <strong className="text-amber-400">{multiplier.toFixed(2)}x</strong>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {multiplier === 1 ? "Urban Area (1.00x)" : `Rural (Distance Multiplier: ${multiplier}x)`}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.05"
                  value={multiplier}
                  onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1.0x (Urban)</span>
                  <span>1.25x (0-10km)</span>
                  <span>1.50x (10-20km)</span>
                  <span>1.75x (20-30km)</span>
                  <span>2.00x (30km+)</span>
                </div>
              </div>

              {/* Attached Structures (PWD) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Structures & Wells Value (₹) - Sec 29
                </label>
                <Input
                  type="number"
                  step="10000"
                  value={structuresValue}
                  onChange={(e) => setStructuresValue(parseFloat(e.target.value) || 0)}
                />
                <span className="text-[10px] text-slate-500">Evaluated by PWD / Civil Engineer</span>
              </div>

              {/* Trees & Standing Crops */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Trees & Standing Crops (₹) - Sec 29
                </label>
                <Input
                  type="number"
                  step="10000"
                  value={treesCropsValue}
                  onChange={(e) => setTreesCropsValue(parseFloat(e.target.value) || 0)}
                />
                <span className="text-[10px] text-slate-500">Forest / Horticulture Dept evaluation</span>
              </div>

              {/* Additional Statutory Interest Months */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">
                  Months Elapsed since Section 4 Notification (Sec 30(3) 12% p.a. Interest)
                </label>
                <Input
                  type="number"
                  value={interestMonths}
                  onChange={(e) => setInterestMonths(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Itemized Statutory Award Breakdown (5 cols) */}
        <Card className="lg:col-span-5 border-amber-500/30 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-800">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
              Collector's Final Award (Form 11-C)
            </span>
            <CardTitle className="text-lg font-bold text-white">
              Compensation Breakdown
            </CardTitle>
            <CardDescription>
              Right to Fair Compensation Statutory Schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="py-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">1. Base Land Value (Sec 26):</span>
              <span className="text-slate-200">₹{baseLandValue.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">2. Multiplier Factor ({multiplier}x):</span>
              <span className="text-amber-400 font-bold">₹{multipliedLandValue.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">3. Assets Attached (Sec 29):</span>
              <span className="text-slate-200">₹{assetsTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800 bg-amber-500/5 px-2 rounded">
              <span className="text-amber-400 font-bold">4. Solatium @ 100% (Sec 30):</span>
              <span className="text-amber-400 font-bold">₹{solatium.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">5. Statutory Interest (12% p.a.):</span>
              <span className="text-slate-200">₹{Math.round(statutoryInterest).toLocaleString("en-IN")}</span>
            </div>

            {/* Total Award Highlight */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">
                Total Statutory Award Payable
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block mt-1">
                ₹{Math.round(totalAward).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1 font-sans">
                (Approx ₹{(totalAward / 100000).toFixed(2)} Lakhs / ₹{(totalAward / 10000000).toFixed(3)} Crore)
              </span>
            </div>
          </CardContent>

          <div className="p-4 border-t border-slate-800 flex gap-2">
            <Button variant="default" size="sm" className="w-full text-xs gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Generate Collector's Award Order</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Affected Families PFMS Disbursement Ledger */}
      <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Coins className="h-4 w-4 text-emerald-400" />
              <span>PFMS Direct Benefit Transfer (DBT) Disbursement Ledger</span>
            </CardTitle>
            <CardDescription>
              Direct transfer status from Requiring Body Escrow to Beneficiary Aadhaar-seeded accounts
            </CardDescription>
          </div>
          <Badge variant="success" className="text-xs">
            PFMS Gateway Online
          </Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claimant Name & Village</TableHead>
                <TableHead>Survey / Khasra No</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Total Award</TableHead>
                <TableHead>Disbursed</TableHead>
                <TableHead>PFMS Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_FAMILIES.map((fam) => (
                <TableRow key={fam.id}>
                  <TableCell className="text-xs font-semibold text-white">
                    <div>{fam.familyHeadName}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {fam.village}, Nashik
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-amber-400">
                    Gat No. 42 ({fam.landLost} ha)
                  </TableCell>
                  <TableCell className="text-xs uppercase font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {fam.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    ₹{fam.totalCompensation.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-emerald-400">
                    ₹{fam.compensationPaid.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        fam.compensationStatus === "fully_paid"
                          ? "success"
                          : fam.compensationStatus === "partially_paid"
                          ? "default"
                          : fam.compensationStatus === "disputed"
                          ? "destructive"
                          : "info"
                      }
                      className="text-[10px]"
                    >
                      {fam.compensationStatus === "fully_paid" ? "DBT Credited" : fam.compensationStatus.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs text-amber-400">
                      Transfer Receipt →
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
