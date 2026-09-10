"use client";

import React, { useState } from "react";
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  TrendingUp,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { STATE_METRICS, NATIONAL_METRICS } from "@/lib/mock-data";
import { formatArea, formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("statutory_audit");

  const reportTemplates = [
    {
      id: "statutory_audit",
      name: "CAG Statutory Compliance & Sunset Audit",
      desc: "Lapse risk assessment under Sections 14 & 25 of RFCTLARR Act 2013",
      category: "Statutory",
    },
    {
      id: "financial_reconciliation",
      name: "PFMS Compensation & Escrow Reconciliation",
      desc: "Itemized treasury disbursement vs award commitments across states",
      category: "Financial",
    },
    {
      id: "rr_audit",
      name: "Second & Third Schedule R&R Compliance Audit",
      desc: "Housing, livelihood annuity, and 25 civic amenities execution report",
      category: "Social",
    },
    {
      id: "land_inventory",
      name: "National Infrastructure Land Bank Inventory",
      desc: "Physical hectare-level possession status across sectors",
      category: "Spatial",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileBarChart className="h-6 w-6 text-amber-400" />
            <span>Executive MIS & Statutory Compliance Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Automated analytical dossiers for Central Ministries, PM PRAGATI review, NITI Aayog, and CAG Parliamentary Audits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            <span>Download Selected Report (PDF)</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 border-slate-800">
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Export Raw Data (XLSX)</span>
          </Button>
        </div>
      </div>

      {/* Report Template Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTemplates.map((rep) => (
          <div
            key={rep.id}
            onClick={() => setSelectedReport(rep.id)}
            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
              selectedReport === rep.id
                ? "bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                  {rep.category}
                </span>
                {selectedReport === rep.id && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                )}
              </div>
              <h4 className="font-bold text-white text-xs">{rep.name}</h4>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">{rep.desc}</p>
            </div>
            <span className="mt-3 text-[10px] font-semibold text-amber-400">
              Generate Active Dossier →
            </span>
          </div>
        ))}
      </div>

      {/* Comparative State Land Acquisition Chart */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-white">
                State-wise Land Acquisition: Notified vs Possessed (Hectares)
              </CardTitle>
              <CardDescription>
                Comparison of statutory progress across top reporting States
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              FY 2025-26
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={STATE_METRICS.slice(0, 8)}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="stateCode" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0c152d",
                    borderColor: "#1e293b",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="areaNotified" name="Area Notified (ha)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="areaAcquired" name="Area Acquired (ha)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Active Report Table View */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-white">
                Statutory Audit Schedule: Active Projects
              </CardTitle>
              <CardDescription>
                Compliance status of mandatory Section 14 (SIA) & Section 25 (Award) statutory clocks
              </CardDescription>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              Audit Standard: CAG / RFCTLARR Sec 101
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Code</TableHead>
                <TableHead>State / Agency</TableHead>
                <TableHead>Sec 11 Preliminary Date</TableHead>
                <TableHead>Sec 19 Declaration Date</TableHead>
                <TableHead>Award Status (Sec 23)</TableHead>
                <TableHead>Sunset Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs font-bold text-amber-400">
                  MH-HWY-2024-001
                </TableCell>
                <TableCell className="text-xs">Maharashtra (MSRDC)</TableCell>
                <TableCell className="text-xs font-mono">10 Feb 2024</TableCell>
                <TableCell className="text-xs font-mono">15 Aug 2024</TableCell>
                <TableCell className="text-xs text-emerald-400 font-semibold">Award Declared (01 Mar 2025)</TableCell>
                <TableCell>
                  <Badge variant="success" className="text-[10px]">Complied (No Lapse)</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs font-bold text-amber-400">
                  UP-RLY-2024-002
                </TableCell>
                <TableCell className="text-xs">Uttar Pradesh (NHSRCL)</TableCell>
                <TableCell className="text-xs font-mono">15 Jan 2024</TableCell>
                <TableCell className="text-xs font-mono">10 Jan 2025</TableCell>
                <TableCell className="text-xs text-amber-400 font-semibold">Enquiry Pending</TableCell>
                <TableCell>
                  <Badge variant="default" className="text-[10px]">Action Required (214d left)</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs font-bold text-amber-400">
                  MP-IRR-2024-003
                </TableCell>
                <TableCell className="text-xs">Madhya Pradesh (KBLPA)</TableCell>
                <TableCell className="text-xs font-mono">15 Jun 2025</TableCell>
                <TableCell className="text-xs text-slate-500 font-mono">Pending Sec 15</TableCell>
                <TableCell className="text-xs text-slate-400">Objection Window Open</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">On Schedule</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs font-bold text-amber-400">
                  GJ-IND-2024-004
                </TableCell>
                <TableCell className="text-xs">Gujarat (DICDL)</TableCell>
                <TableCell className="text-xs font-mono">01 Jun 2023</TableCell>
                <TableCell className="text-xs font-mono">15 Dec 2023</TableCell>
                <TableCell className="text-xs text-emerald-400 font-semibold">Award Passed (30 Sep 2024)</TableCell>
                <TableCell>
                  <Badge variant="success" className="text-[10px]">Complied</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
