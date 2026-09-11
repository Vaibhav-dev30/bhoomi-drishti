"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  Building,
  Home,
  Briefcase,
  Coins,
  Truck,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ExternalLink,
  ListChecks,
} from "lucide-react";
import { MOCK_FAMILIES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// 25 Civic Amenities mandated by Third Schedule of RFCTLARR Act 2013
const CIVIC_AMENITIES_LIST = [
  { id: 1, name: "All-weather pukka approach & internal roads", completed: true },
  { id: 2, name: "Piped safe drinking water supply / borewells", completed: true },
  { id: 3, name: "Household electricity connections & street lighting", completed: true },
  { id: 4, name: "Primary school & playground facility", completed: true },
  { id: 5, name: "Primary Health Centre (PHC) / dispensary", completed: false },
  { id: 6, name: "Anganwadi & child-care centre", completed: true },
  { id: 7, name: "Community hall & recreation centre", completed: false },
  { id: 8, name: "Fair price shop & PDS outlet", completed: true },
  { id: 9, name: "Pucca storm-water & sanitation drains", completed: true },
  { id: 10, name: "Burial / cremation ground with water facility", completed: true },
  { id: 11, name: "Cattle pond & grazing land reservation", completed: false },
  { id: 12, name: "Post office / banking kiosk / ATM", completed: false },
];

export default function RRPage() {
  const [amenities, setAmenities] = useState(CIVIC_AMENITIES_LIST);

  const toggleAmenity = (id: number) => {
    setAmenities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const completedCount = amenities.filter((a) => a.completed).length;
  const amenitiesPercentage = Math.round((completedCount / amenities.length) * 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-purple-600" />
            <span>Rehabilitation & Resettlement (R&R) Monitoring</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
            Mandatory compliance monitoring for Second Schedule entitlements and Third Schedule 25 civic amenities under Sections 31 to 50.
          </p>
        </div>
        <Badge variant="purple" className="text-xs self-start sm:self-auto bg-purple-100 text-purple-800 border-purple-200 font-semibold">
          Section 38 Possession Gate Enforced
        </Badge>
      </div>

      {/* Statutory Section 38 Gate Notice */}
      <div className="rounded-2xl border border-purple-200 bg-[#FAF5FF] p-4 shadow-xs flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
        <div className="text-xs text-purple-900">
          <p className="font-bold text-purple-950">
            Section 38 Statutory Pre-condition:
          </p>
          <p className="mt-0.5 text-purple-800/90 leading-relaxed font-normal">
            The Collector cannot take physical possession of acquired land until full monetary compensation is disbursed (within 3 months of award) and Second Schedule R&R entitlements (housing, subsistence grant, employment/annuity) are secured.
          </p>
        </div>
      </div>

      {/* Second Schedule Statutory Entitlements Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500 flex items-center justify-between">
              <span>Housing Allotment</span>
              <Home className="h-4 w-4 text-[#D97706]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-extrabold text-slate-900">PMAY Rural / Urban</div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Min 50 sq.m. carpet area constructed house or equivalent cash grant
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500 flex items-center justify-between">
              <span>Livelihood Guarantee</span>
              <Briefcase className="h-4 w-4 text-[#15803D]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-extrabold text-slate-900">₹5 Lakhs OR Job</div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Choice of: 1) Job, 2) ₹5L lump sum, or 3) ₹2,000/mo annuity for 20 yrs
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500 flex items-center justify-between">
              <span>Subsistence Grant</span>
              <Coins className="h-4 w-4 text-[#0284C7]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-extrabold text-slate-900">₹3,000 / month</div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Paid for 12 months (+₹50,000 lump sum for SC/ST displaced families)
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500 flex items-center justify-between">
              <span>Shifting & Setup Grant</span>
              <Truck className="h-4 w-4 text-purple-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-extrabold text-slate-900">₹50,000 Transport</div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Plus ₹25,000 cattle shed / petty shop grant + stamp duty exemption
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Third Schedule 25 Civic Amenities Checklist */}
      <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#F2EFE8] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-[#0284C7]" />
                <span>Third Schedule: 25 Civic Infrastructure Amenities in Resettlement Township</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Statutory physical infrastructure required before family relocation (Interactive Progress Tracker)
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
                {completedCount} of {amenities.length} Completed ({amenitiesPercentage}%)
              </span>
            </div>
          </div>
          <Progress value={amenitiesPercentage} className="mt-3 bg-[#F5F2EB]" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {amenities.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleAmenity(item.id)}
                className={`flex items-start gap-2.5 p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                  item.completed
                    ? "bg-[#DCFCE7]/70 border-[#BBF7D0] text-[#15803D] font-medium"
                    : "bg-[#FAF8F5] border-[#E5E0D6] text-slate-600 hover:border-[#CBD5E1]"
                }`}
              >
                <div className={`mt-0.5 h-4 w-4 rounded-md flex items-center justify-center shrink-0 ${
                  item.completed ? "bg-[#15803D] text-white" : "border border-[#CBD5E1] bg-white"
                }`}>
                  {item.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                </div>
                <span className="leading-snug">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Family-wise R&R Status Table */}
      <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#F2EFE8] pb-4">
          <CardTitle className="text-base font-extrabold text-slate-900">
            Family-wise Rehabilitation Entitlement Ledger
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Individual tracking of housing allotment, subsistence grants, and livelihood rehabilitation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#E5E0D6] bg-[#FAF8F5]">
                <TableHead className="text-slate-700 font-bold">Family Head</TableHead>
                <TableHead className="text-slate-700 font-bold">Displacement</TableHead>
                <TableHead className="text-slate-700 font-bold">Housing Allotment</TableHead>
                <TableHead className="text-slate-700 font-bold">Livelihood Choice</TableHead>
                <TableHead className="text-slate-700 font-bold">Subsistence Grant</TableHead>
                <TableHead className="text-slate-700 font-bold">Overall R&R Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_FAMILIES.map((fam) => (
                <TableRow key={fam.id} className="border-[#F2EFE8] hover:bg-[#FAF8F5] transition-colors">
                  <TableCell className="text-xs font-bold text-slate-900 py-3">
                    <div>{fam.familyHeadName}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {fam.village} ({fam.category.toUpperCase()})
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {fam.isDisplaced ? (
                      <span className="text-rose-600 font-bold">Yes (Physically Displaced)</span>
                    ) : (
                      <span className="text-slate-500 font-medium">Land Loss Only</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-mono font-medium text-slate-700">
                    {fam.isDisplaced ? "Plot #42, NCR Resettlement Enclave" : "N/A"}
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 font-medium">
                    {fam.isDisplaced ? "₹5,00,000 Lump Sum" : "N/A"}
                  </TableCell>
                  <TableCell className="text-xs font-mono font-bold text-[#15803D]">
                    {fam.isDisplaced ? "₹36,000 (12 Mos)" : "N/A"}
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
                      className={`text-[10px] ${
                        fam.rrStatus === "completed"
                          ? "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]"
                          : fam.rrStatus === "monetary_paid"
                          ? "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]"
                          : "border-[#E5E0D6] text-slate-600 bg-[#FAF8F5]"
                      }`}
                    >
                      {fam.rrStatus.replace(/_/g, " ")}
                    </Badge>
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
