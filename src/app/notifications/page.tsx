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
  MessageSquare,
} from "lucide-react";
import { MOCK_NOTIFICATIONS, MOCK_PROJECTS, MOCK_FAMILIES } from "@/lib/mock-data";
import { NotificationType } from "@/types";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SmsWhatsappPanel } from "@/components/notifications/sms-whatsapp-panel";

export default function NotificationsPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotif, setSelectedNotif] = useState<typeof MOCK_NOTIFICATIONS[0] | null>(
    MOCK_NOTIFICATIONS[0]
  );
  const [showCitizenDispatch, setShowCitizenDispatch] = useState(false);

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
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <BellRing className="h-6 w-6 text-[#0284C7]" />
            <span>Statutory Notifications & e-Gazette Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
            Publishing, tracking, and citizen objection management for Sections 4, 11, 15, 19, 21, and 23 of RFCTLARR Act 2013.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCitizenDispatch(true)}
            className="gap-1.5 border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 font-bold text-xs"
          >
            <MessageSquare className="h-4 w-4 text-emerald-600" />
            <span>Citizen Dispatch Simulator</span>
          </Button>
          <Button variant="default" size="sm" className="gap-1.5 bg-[#15803D] hover:bg-[#166534] text-white">
            <PlusCircle className="h-4 w-4" />
            <span>Draft New Gazette Notice</span>
          </Button>
        </div>
      </div>

      {/* Statutory Sunset Alerts Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#FDE68A] bg-[#FEF3C7]/40 p-4 text-xs shadow-xs">
          <div className="flex items-center justify-between font-bold text-[#B45309] mb-1">
            <span>Section 15 Objection Window</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] font-bold">60 Days</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
            Must accept and hear all landowner objections within 60 days of Section 11 preliminary notification.
          </p>
        </div>

        <div className="rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] p-4 text-xs shadow-xs">
          <div className="flex items-center justify-between font-bold text-[#0284C7] mb-1">
            <span>Sec 11 to Sec 19 Sunset</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] font-bold">12 Months</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
            Formal declaration (Section 19) must be published within 12 months or Section 11 lapses automatically.
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-[#FFF1F2] p-4 text-xs shadow-xs">
          <div className="flex items-center justify-between font-bold text-rose-700 mb-1">
            <span>Section 25 Award Sunset</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold">12 Months</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
            Collector must pass award within 12 months of Section 19 declaration or proceedings lapse entirely.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search gazette reference, title, or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-[#E5E0D6] bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:outline-none shadow-xs"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-64 rounded-2xl border border-[#E5E0D6] bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-[#0284C7] focus:outline-none cursor-pointer shadow-xs font-medium"
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
        <div className="lg:col-span-7 rounded-3xl border border-[#E5E0D6] bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-[#E5E0D6] bg-[#FAF8F5]">
                <TableHead className="text-slate-700 font-bold">Notification Details</TableHead>
                <TableHead className="text-slate-700 font-bold">Type</TableHead>
                <TableHead className="text-slate-700 font-bold">Date Issued</TableHead>
                <TableHead className="text-right text-slate-700 font-bold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifs.map((notif) => (
                <TableRow
                  key={notif.id}
                  onClick={() => setSelectedNotif(notif)}
                  className={`cursor-pointer transition-colors border-[#F2EFE8] ${
                    selectedNotif?.id === notif.id ? "bg-[#F0FDF4] border-l-4 border-l-[#15803D]" : "hover:bg-[#FAF8F5]"
                  }`}
                >
                  <TableCell className="text-xs py-3">
                    <div className="font-bold text-slate-900 line-clamp-1">{notif.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Gazette: {notif.gazetteRef || "Draft"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] capitalize border-[#E5E0D6] bg-[#FAF8F5] text-slate-700">
                      {notif.type.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-600 font-medium">
                    {formatDate(notif.issuedDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-[#0284C7] hover:bg-[#E0F2FE]">
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
            <Card className="border-[#E5E0D6] bg-[#FAF8F5] rounded-3xl shadow-sm sticky top-20 overflow-hidden">
              <CardHeader className="border-b border-[#E5E0D6] pb-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#15803D] font-bold uppercase bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                    Official Gazette Copy
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-600 hover:text-slate-900 hover:bg-[#FAF8F5]">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-600 hover:text-slate-900 hover:bg-[#FAF8F5]">
                      <Printer className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-base font-extrabold text-slate-900 mt-1">
                  {selectedNotif.title}
                </CardTitle>
                <CardDescription className="font-mono text-[10px] text-[#0284C7] font-semibold">
                  Gazette Ref: {selectedNotif.gazetteRef || "GZ/PROV/2026/001"}
                </CardDescription>
              </CardHeader>

              <CardContent className="py-4 space-y-4 text-xs text-slate-700 font-serif leading-relaxed">
                <div className="text-center pb-3 border-b border-[#E5E0D6] font-sans">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block">
                    The Gazette of India / राजपत्रात प्रसिद्ध
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    EXTRAORDINARY • PART II — SECTION 3
                  </span>
                </div>

                <p className="text-[11px] text-slate-700 font-normal">
                  {selectedNotif.description}
                </p>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D6] font-sans text-xs space-y-2 shadow-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Publication Date:</span>
                    <span className="font-mono font-bold text-slate-900">{formatDate(selectedNotif.issuedDate)}</span>
                  </div>
                  {selectedNotif.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Sunset / Objection Expiry:</span>
                      <span className="font-mono text-rose-600 font-bold">
                        {formatDate(selectedNotif.expiryDate)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Statutory Authority:</span>
                    <span className="font-bold text-slate-900">Collector & District Magistrate</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 italic">
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

      {/* Statutory WhatsApp & SMS Simulator Panel */}
      <SmsWhatsappPanel
        isOpen={showCitizenDispatch}
        onClose={() => setShowCitizenDispatch(false)}
        family={MOCK_FAMILIES[0]}
        projectName="NH-48 Greenfield Express Bypass"
        officerName="District Collector & CALA"
      />
    </div>
  );
}
