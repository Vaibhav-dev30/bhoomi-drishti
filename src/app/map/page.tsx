"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Compass, Layers, ShieldCheck, MapPin } from "lucide-react";

// Dynamically import Leaflet component with SSR disabled
const SpatialMapViewer = dynamic(
  () =>
    import("@/components/map/spatial-map").then((mod) => mod.SpatialMapViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-140px)] w-full rounded-3xl border border-[#E5E0D6] bg-[#FAF8F5] flex flex-col items-center justify-center text-slate-500 gap-3 shadow-xl">
        <div className="h-10 w-10 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-800">
          Loading National Cadastral & GIS Spatial Engine...
        </p>
        <span className="text-xs text-slate-400">
          Connecting to NavIC, Bhuvan & ULPIN cadastral vector layers
        </span>
      </div>
    ),
  }
);

export default function MapPage() {
  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#E5E0D6] shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#0284C7]" />
            <span>GIS Spatial Visualizer & Cadastral Mapping</span>
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Interactive map visualizing national infrastructure corridors, notified land parcels, and 14-digit ULPIN (Bhu-Aadhaar) geofences.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#15803D] font-semibold bg-[#DCFCE7] border border-[#BBF7D0] rounded-xl px-3 py-1.5 shadow-xs">
            <ShieldCheck className="h-4 w-4 text-[#15803D]" />
            <span>Survey of India Compliant</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#0284C7] font-semibold bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl px-3 py-1.5 shadow-xs">
            <Layers className="h-4 w-4 text-[#0284C7]" />
            <span>EPSG:4326 (WGS 84)</span>
          </div>
        </div>
      </div>

      {/* Fully Functional Map Container */}
      <SpatialMapViewer />
    </div>
  );
}
