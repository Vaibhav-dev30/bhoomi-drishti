"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Download,
  Printer,
  Home,
  Coins,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { MOCK_FAMILIES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function FamiliesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [displacementFilter, setDisplacementFilter] = useState("all");

  const filteredFamilies = useMemo(() => {
    return MOCK_FAMILIES.filter((fam) => {
      const matchSearch =
        !searchTerm ||
        fam.familyHeadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fam.fatherHusbandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fam.village.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === "all" || fam.category === categoryFilter;
      const matchDisplacement =
        displacementFilter === "all" ||
        (displacementFilter === "displaced" && fam.isDisplaced) ||
        (displacementFilter === "non_displaced" && !fam.isDisplaced);
      return matchSearch && matchCategory && matchDisplacement;
    });
  }, [searchTerm, categoryFilter, displacementFilter]);

  const totalFamilies = MOCK_FAMILIES.length;
  const displacedCount = MOCK_FAMILIES.filter((f) => f.isDisplaced).length;
  const bplCount = MOCK_FAMILIES.filter((f) => f.isBPL).length;
  const totalPaid = MOCK_FAMILIES.reduce((acc, f) => acc + f.compensationPaid, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-400" />
            <span>Affected & Displaced Families Register</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Comprehensive census of titleholders, tenants, and agricultural workers entitled to compensation and R&R.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-slate-800">
            <Download className="h-3.5 w-3.5" />
            <span>Export Census CSV</span>
          </Button>
        </div>
      </div>

      {/* Metric summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Sampled Families</span>
          <span className="text-xl font-bold text-white font-mono">{totalFamilies}</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Physically Displaced</span>
          <span className="text-xl font-bold text-red-400 font-mono">{displacedCount}</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">BPL Card Holders</span>
          <span className="text-xl font-bold text-amber-400 font-mono">{bplCount}</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Compensation Paid</span>
          <span className="text-xl font-bold text-emerald-400 font-mono">
            ₹{(totalPaid / 10000000).toFixed(2)} Cr
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by family head name, father's name, or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-44 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 focus:border-amber-500 focus:outline-none cursor-pointer"
        >
          <option value="all">All Social Categories</option>
          <option value="general">General</option>
          <option value="obc">OBC</option>
          <option value="sc">SC</option>
          <option value="st">ST</option>
        </select>

        <select
          value={displacementFilter}
          onChange={(e) => setDisplacementFilter(e.target.value)}
          className="w-full sm:w-48 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 focus:border-amber-500 focus:outline-none cursor-pointer"
        >
          <option value="all">All Displacements</option>
          <option value="displaced">Physically Displaced</option>
          <option value="non_displaced">Land Loss Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Family Head / Relative</TableHead>
              <TableHead>Village / District</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Land Lost</TableHead>
              <TableHead>Structure Lost</TableHead>
              <TableHead>Compensation Status</TableHead>
              <TableHead>R&R Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFamilies.map((fam) => (
              <TableRow key={fam.id}>
                <TableCell className="text-xs font-semibold text-white">
                  <div>{fam.familyHeadName}</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    Father/Husband: {fam.fatherHusbandName} ({fam.familyMembers} Persons)
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-300">
                  {fam.village}, {fam.district}
                </TableCell>
                <TableCell className="text-xs uppercase font-mono">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    fam.isBPL ? "bg-red-500/20 text-red-300 font-bold" : "bg-slate-800 text-slate-300"
                  }`}>
                    {fam.category} {fam.isBPL ? "• BPL" : ""}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-mono">{fam.landLost} ha</TableCell>
                <TableCell className="text-xs">
                  {fam.structureLost ? (
                    <span className="text-red-400 font-semibold">Pucca House</span>
                  ) : (
                    <span className="text-slate-500">None</span>
                  )}
                </TableCell>
                <TableCell className="text-xs font-mono">
                  <div className="text-emerald-400">
                    ₹{(fam.compensationPaid / 100000).toFixed(1)} L paid
                  </div>
                  <div className="text-[10px] text-slate-500">
                    of ₹{(fam.totalCompensation / 100000).toFixed(1)} L
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      fam.rrStatus === "completed"
                        ? "success"
                        : fam.rrStatus === "monetary_paid"
                        ? "default"
                        : "outline"
                    }
                    className="text-[10px]"
                  >
                    {fam.rrStatus.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href="/compensation">
                    <Button variant="ghost" size="sm" className="text-xs text-amber-400">
                      Ledger →
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
