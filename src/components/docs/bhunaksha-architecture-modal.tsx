"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Server,
  Layers,
  ShieldCheck,
  Code2,
  AlertTriangle,
  Database,
  ArrowRight,
  ExternalLink,
  FileCheck2,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BhuNakshaArchitectureModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white border border-[#E5E0D6] rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-3 pb-4 border-b border-[#E5E0D6]">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
              NIC Enterprise Cadastre Standard
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
              OGC WFS 2.0 / WMS 1.3
            </span>
          </div>
          <DialogTitle className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Server className="h-6 w-6 text-[#15803D]" />
            <span>BhuNaksha Cadastral Integration Architecture & Technical Evaluation</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Technical feasibility analysis, API integration mechanisms, data scope, and state-specific operational
            dependencies for deploying BhuNaksha in National Land Acquisition Systems.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2 text-xs sm:text-sm text-slate-700">
          {/* Section 1: Overview & Stack */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#0284C7]" />
              <span>1. What is BhuNaksha & Core System Architecture</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs">
              <strong>BhuNaksha</strong> is the flagship Cadastral Mapping Solution developed by the{" "}
              <strong>National Informatics Centre (NIC)</strong> under the Digital India Land Records
              Modernization Programme (DILRMP). Its primary purpose is to digitize traditional village revenue
              maps (<em>Sajra / Shajra / Village Cadastral Sheets</em>) and link spatial parcel geometry with
              textual land ownership databases (<em>Bhulekh / RoR / 7-12 / Khatauni</em>).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E5E0D6]">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">GIS Engine</span>
                <span className="font-bold text-slate-900 text-xs">GeoServer / MapServer</span>
                <p className="text-[10px] text-slate-500 mt-1">OGC compliant WMS/WFS map rendering engine</p>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E5E0D6]">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Spatial Database</span>
                <span className="font-bold text-slate-900 text-xs">PostgreSQL + PostGIS</span>
                <p className="text-[10px] text-slate-500 mt-1">Vector polygons stored in EPSG:4326 or UTM state projections</p>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E5E0D6]">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Identifiers</span>
                <span className="font-bold text-slate-900 text-xs">14-Digit ULPIN (Bhu-Aadhaar)</span>
                <p className="text-[10px] text-slate-500 mt-1">Geo-coded alphanumeric hash from polygon coordinates</p>
              </div>
            </div>
          </div>

          {/* Section 2: Data Matrix: BhuNaksha vs Bhulekh */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Database className="h-4 w-4 text-[#15803D]" />
              <span>2. Data Breakdown: BhuNaksha (Map) vs. Bhulekh (RoR)</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs">
              A key finding of our evaluation is that in the Government of India revenue architecture,{" "}
              <strong>BhuNaksha does not store personal ownership details directly in the shapefile/geometry layer</strong>.
              Instead, ownership is retrieved by cross-referencing the unique Khasra Number with the State’s
              Bhulekh RoR database:
            </p>
            <div className="overflow-x-auto rounded-2xl border border-[#E5E0D6]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F2EB] text-slate-800 font-bold border-b border-[#E5E0D6]">
                    <th className="p-2.5">Data Attribute</th>
                    <th className="p-2.5">Primary Source</th>
                    <th className="p-2.5">Access Mechanism</th>
                    <th className="p-2.5">Acquisition Utility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D6] bg-white text-slate-600">
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Parcel Polygon Boundaries</td>
                    <td className="p-2.5"><Badge className="bg-[#DCFCE7] text-[#15803D]">BhuNaksha WFS</Badge></td>
                    <td className="p-2.5 font-mono text-[11px]">GetFeature / GeoJSON</td>
                    <td className="p-2.5">Intersection with project corridor & buffer analysis</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Khasra / Gat / Survey Number</td>
                    <td className="p-2.5"><Badge className="bg-[#DCFCE7] text-[#15803D]">BhuNaksha Core</Badge></td>
                    <td className="p-2.5 font-mono text-[11px]">Feature Attributes</td>
                    <td className="p-2.5">Official statutory identifier for Sec 11 Gazette</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">GIS Calculated Area</td>
                    <td className="p-2.5"><Badge className="bg-[#DCFCE7] text-[#15803D]">BhuNaksha Vector</Badge></td>
                    <td className="p-2.5 font-mono text-[11px]">ST_Area(geom)</td>
                    <td className="p-2.5">Ground-truthing against recorded area for discrepancies</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Landowner Name & Shares</td>
                    <td className="p-2.5"><Badge className="bg-[#E0F2FE] text-[#0284C7]">Bhulekh RoR</Badge></td>
                    <td className="p-2.5 font-mono text-[11px]">RoR Web Service API</td>
                    <td className="p-2.5">Direct compensation disbursement, award list generation</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Land Classification (Jirayat/Bagayat)</td>
                    <td className="p-2.5"><Badge className="bg-[#FEF3C7] text-[#B45309]">RoR + BhuNaksha</Badge></td>
                    <td className="p-2.5 font-mono text-[11px]">Khatauni Record</td>
                    <td className="p-2.5">Determining circle rate & agricultural compensation</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Encumbrance & Bank Charges</td>
                    <td className="p-2.5"><Badge className="bg-[#F3E8FF] text-[#7E22CE]">Sub-Registrar / CERSAI</Badge></td>
                    <td className="p-2.5 font-mono text-[11px]">e-Sub-Registrar API</td>
                    <td className="p-2.5">Apportionment of compensation to lending institutions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Technical APIs & Integration */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#7C3AED]" />
              <span>3. Available APIs and Integration Protocols</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E5E0D6] space-y-1.5">
                <span className="font-bold text-slate-900 block">1. OGC Web Feature Service (WFS 2.0)</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Endpoint: <code className="bg-white px-1 py-0.5 rounded text-[10px] text-slate-800">/geoserver/bhunaksha/wfs?service=WFS&request=GetFeature</code>
                  <br />Returns GML or GeoJSON containing raw vector polygon coordinates of all village khasras. Used
                  for geometric corridor clipping and partial acquisition calculations.
                </p>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E5E0D6] space-y-1.5">
                <span className="font-bold text-slate-900 block">2. NIC BhuNaksha Plot Geometry REST</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Endpoint: <code className="bg-white px-1 py-0.5 rounded text-[10px] text-slate-800">/GetPlotGeom.do?village_code=XXX&khasra_no=YYY</code>
                  <br />Returns individual parcel boundary coordinates, centroid, adjacent survey plots (Chauhaddi),
                  and current mutation lock status.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Real-World Limitations & Operational Constraints */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>4. Real-World Limitations & Operational Dependencies</span>
            </h3>
            <div className="bg-[#FEF9C3]/70 border border-amber-300 rounded-2xl p-4 text-xs space-y-2 text-amber-950">
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-900 shrink-0">• State-Level Fragmentation:</span>
                <span>
                  Land is a State subject under the Constitution of India (Seventh Schedule). Each state hosts
                  an independent instance (e.g. <em>mahabhunaksha.mahabhumi.gov.in</em> in Maharashtra,{" "}
                  <em>bhunaksha.mp.gov.in</em> in MP, <em>upbhunaksha.gov.in</em> in UP). Schema definitions differ
                  across states.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-900 shrink-0">• Intranet Firewalls & CORS Policies:</span>
                <span>
                  Most state NIC BhuNaksha servers disallow public browser-side JavaScript requests (CORS).
                  Production systems must route requests through a <strong>Government Enterprise Service Bus (ESB)</strong> or backend proxy microservice.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-900 shrink-0">• CAPTCHAs & Rate Limits:</span>
                <span>
                  Public portals enforce CAPTCHAs to prevent automated scraping. Direct B2B/G2G programmatic
                  integration requires authorized departmental API keys issued by the State Revenue Commissionerate.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-900 shrink-0">• Legacy Coordinate Alignment:</span>
                <span>
                  Older paper cadastral sheets digitized without DGPS control points may have spatial skew
                  (1–3 meters) when overlaid on WGS84 satellite imagery. SVAMITVA drone surveys are currently
                  rectifying this nationally.
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: How this Prototype Bridges the Gap */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-[#15803D]">
              <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
              <span>5. How this Prototype Implements the Complete Integration</span>
            </h3>
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-4 text-xs space-y-2 text-slate-800">
              <p>
                This prototype provides a <strong>complete, fully functional simulation and live adapter architecture</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>
                  <strong>BhuNaksha Cadastral Engine (`/api/bhunaksha/wfs`)</strong> returns authentic GeoJSON
                  cadastral village sheets with precise khasra geometries.
                </li>
                <li>
                  <strong>Dual Map Rendering</strong>: Switch between authentic <em>Cadastral Sheet Mode</em> (Sajra style)
                  and <em>Satellite Hybrid Mode</em> for ground verification.
                </li>
                <li>
                  <strong>Spatial Affected Land Analysis</strong>: Automatically computes the intersecting right-of-way corridor,
                  calculating full vs. partial acquisitions and residual unacquired farmland.
                </li>
                <li>
                  <strong>Live Cadastral API Inspector</strong>: Real-time inspection drawer demonstrating curl requests,
                  headers, and raw payloads as expected in production.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#E5E0D6]">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[#15803D] hover:bg-[#166534] text-white font-bold"
          >
            Close Architecture Dossier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
