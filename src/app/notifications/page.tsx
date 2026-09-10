"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BellRing,
  FileText,
  Download,
  Printer,
  Search,
  Filter,
  Calendar,
  Clock,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import { MOCK_NOTIFICATIONS, MOCK_PROJECTS } from "@/lib/mock-data";
import { NotificationType } from "@/types";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function NotificationsPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotif, setSelectedNotif] = useState<typeof MOCK_NOTIFICATIONS[0] | null>(
    MOCK_NOTIFICATIONS[0]
  );

  const filteredNotifs = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter((n) => {
      const matchType = filterType === "all" || n.type === filterType;
      const matchSearch =
        !searchTerm ||
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (n.gazetteRef && n.gazetteRef.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [filterType, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BellRing className="h-6 w-6 text-amber-400" />
            <span>Statutory Notifications & e-Gazette Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Publishing, tracking, and citizen objection management for Sections 4, 11, 15, 19, 21, and 23 of RFCTLARR Act 2013.
          </p>
        </div>
        <Button variant="default" size="sm" className="gap-1.5 self-start sm:self-auto">
          <PlusCircle className="h-4 w-4" />
          <span>Draft New Gazette Notice</span>
        </Button>
      </div>

      {/* Statutory Sunset Alerts Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-amber-500/20 bg-slate-900/60 p-3.5 text-xs">
          <div className="flex items-center justify-between font-semibold text-amber-400 mb-1">
            <span>Section 15 Objection Window</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/20">60 Days</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Must accept and hear all landowner objections within 60 days of Section 11 preliminary notification.
          </p>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-slate-900/60 p-3.5 text-xs">
          <div className="flex items-center justify-between font-semibold text-blue-400 mb-1">
            <span>Sec 11 to Sec 19 Sunset</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-500/20">12 Months</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Formal declaration (Section 19) must be published within 12 months or Section 11 lapses automatically.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/20 bg-slate-900/60 p-3.5 text-xs">
          <div className="flex items-center justify-between font-semibold text-red-400 mb-1">
            <span>Section 25 Award Sunset</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-red-500/20">12 Months</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Collector must pass award within 12 months of Section 19 declaration or proceedings lapse entirely.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search gazette reference, title, or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-60 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 focus:border-amber-500 focus:outline-none cursor-pointer"
        >
          <option value="all">All Statutory Types</option>
          <option value="sec11_preliminary">Section 11 (Preliminary Notification)</option>
          <option value="sec15_objection">Section 15 (Objections Window)</option>
          <option value="sec19_declaration">Section 19 (Formal Declaration)</option>
          <option value="sec23_award">Section 23 (Collector's Award)</option>
          <option value="sec38_possession">Section 38 (Taking Possession)</option>
        </select>
      </div>

      {/* Main Grid: Notifications List & Preview Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Table of Notifications (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Notification Details</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Issued</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifs.map((notif) => (
                <TableRow
                  key={notif.id}
                  onClick={() => setSelectedNotif(notif)}
                  className={`cursor-pointer transition-colors ${
                    selectedNotif?.id === notif.id ? "bg-slate-800/80" : ""
                  }`}
                >
                  <TableCell className="text-xs">
                    <div className="font-semibold text-white line-clamp-1">{notif.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Gazette: {notif.gazetteRef || "Draft"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {notif.type.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-300">
                    {formatDate(notif.issuedDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs text-amber-400 p-0">
                      View →
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Right: Gazette Document Visualizer (5 cols) */}
        <div className="lg:col-span-5">
          {selectedNotif ? (
            <Card className="border-slate-800 bg-slate-950 shadow-2xl sticky top-20">
              <CardHeader className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    Official Gazette Copy
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-300">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-300">
                      <Printer className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-base font-bold text-white mt-1">
                  {selectedNotif.title}
                </CardTitle>
                <CardDescription className="font-mono text-[10px] text-amber-400">
                  Gazette Ref: {selectedNotif.gazetteRef || "GZ/PROV/2026/001"}
                </CardDescription>
              </CardHeader>

              <CardContent className="py-4 space-y-4 text-xs text-slate-300 font-serif leading-relaxed">
                <div className="text-center pb-2 border-b border-slate-800 font-sans">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                    The Gazette of India / राजपत्रात प्रसिद्ध
                  </span>
                  <span className="text-xs font-semibold text-white">
                    EXTRAORDINARY • PART II — SECTION 3
                  </span>
                </div>

                <p className="text-[11px] text-slate-300">
                  {selectedNotif.description}
                </p>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-sans text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Publication Date:</span>
                    <span className="font-mono text-white">{formatDate(selectedNotif.issuedDate)}</span>
                  </div>
                  {selectedNotif.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sunset / Objection Expiry:</span>
                      <span className="font-mono text-red-400 font-bold">
                        {formatDate(selectedNotif.expiryDate)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Statutory Authority:</span>
                    <span className="text-white">Collector & District Magistrate</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 italic">
                  Note: Under Section 11(4), from the date of publication of this notification, no person shall make any transaction or cause any encumbrances on this land.
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-xs text-slate-500">
              Select a notification from the list to view the official gazette text.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
