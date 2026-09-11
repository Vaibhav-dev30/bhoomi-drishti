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
import { STATE_METRICS, NATIONAL_METRICS, MOCK_PROJECTS } from "@/lib/mock-data";
import { formatArea, formatCurrency } from "@/lib/utils";
import { useApp } from "@/context/app-context";
import { filterProjectsForUser } from "@/lib/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ReportsPage() {
  const { currentUser, scopedGrants } = useApp();
  const [selectedReport, setSelectedReport] = useState("statutory_audit");
  const authorizedProjects = filterProjectsForUser(currentUser, scopedGrants, MOCK_PROJECTS);

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
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <FileBarChart className="h-6 w-6 text-[#0284C7]" />
            <span>Executive MIS & Statutory Compliance Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
            Automated analytical dossiers for Central Ministries, PM PRAGATI review, NITI Aayog, and CAG Parliamentary Audits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" className="gap-1.5 bg-[#15803D] hover:bg-[#166534] text-white">
            <Download className="h-4 w-4" />
            <span>Download Selected Report (PDF)</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 border-[#E5E0D6] bg-white hover:bg-[#FAF8F5] text-slate-700">
            <FileSpreadsheet className="h-4 w-4 text-[#15803D]" />
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
            className={`p-4 rounded-3xl border text-xs cursor-pointer transition-all flex flex-col justify-between shadow-xs ${
              selectedReport === rep.id
                ? "bg-[#F0FDF4] border-[#86EFAC] ring-2 ring-[#BBF7D0]"
                : "bg-white border-[#E5E0D6] hover:border-[#CBD5E1] text-slate-600"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#FAF8F5] text-[#0284C7] font-bold border border-[#E5E0D6]">
                  {rep.category}
                </span>
                {selectedReport === rep.id && (
                  <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-xs">{rep.name}</h4>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed font-normal">{rep.desc}</p>
            </div>
            <span className="mt-3 text-[10px] font-bold text-[#0284C7]">
              Generate Active Dossier →
            </span>
          </div>
        ))}
      </div>

      {/* Comparative State Land Acquisition Chart */}
      <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#F2EFE8] pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold text-slate-900">
                State-wise Land Acquisition: Notified vs Possessed (Hectares)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Comparison of statutory progress across top reporting States
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono border-[#E5E0D6] bg-[#FAF8F5] text-slate-700">
              FY 2025-26
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={STATE_METRICS.slice(0, 8)}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F2EFE8" />
                <XAxis dataKey="stateCode" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E5E0D6",
                    borderRadius: "12px",
                    color: "#0F172A",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="areaNotified" name="Area Notified (ha)" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="areaAcquired" name="Area Acquired (ha)" fill="#15803D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Active Report Table View */}
      <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#F2EFE8] pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold text-slate-900">
                Statutory Audit Schedule: Active Projects
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Compliance status of mandatory Section 14 (SIA) & Section 25 (Award) statutory clocks
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
              Audit Standard: CAG / RFCTLARR Sec 101
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#E5E0D6] bg-[#FAF8F5]">
                <TableHead className="text-slate-700 font-bold">Project Code</TableHead>
                <TableHead className="text-slate-700 font-bold">State / Agency</TableHead>
                <TableHead className="text-slate-700 font-bold">Sec 11 Preliminary Date</TableHead>
                <TableHead className="text-slate-700 font-bold">Sec 19 Declaration Date</TableHead>
                <TableHead className="text-slate-700 font-bold">Award Status (Sec 23)</TableHead>
                <TableHead className="text-slate-700 font-bold">Sunset Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authorizedProjects.length === 0 ? (
                <TableRow className="border-[#F2EFE8]">
                  <TableCell colSpan={6} className="text-center py-6 text-xs text-slate-500">
                    No statutory land acquisition projects within your assigned jurisdiction ({currentUser?.jurisdiction.displayText || "Unassigned"}).
                  </TableCell>
                </TableRow>
              ) : (
                authorizedProjects.map((p) => {
                  const isDelhi = p.id === "DL-INFRA-001";
                  return (
                    <TableRow key={p.id} className="border-[#F2EFE8] hover:bg-[#FAF8F5] transition-colors">
                      <TableCell className="font-mono text-xs font-bold text-[#0284C7] py-3">
                        {p.id}
                      </TableCell>
                      <TableCell className="text-xs text-slate-900 font-medium">
                        {p.state} ({p.lrbType})
                      </TableCell>
                      <TableCell className="text-xs font-mono text-slate-600">
                        {p.sec11Date || "28 Feb 2026"}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-slate-600">
                        {p.sec19Date || "10 Apr 2026"}
                      </TableCell>
                      <TableCell className="text-xs text-[#15803D] font-bold">
                        {p.awardDate ? `Award Target (${p.awardDate})` : "Sec 23 In Progress"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="success" className="text-[10px] bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]">
                          {isDelhi ? "Complied (Sec 14 & 25)" : "Corridor On Schedule"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
