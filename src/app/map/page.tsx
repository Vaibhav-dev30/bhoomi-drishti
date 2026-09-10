"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Compass, Layers, Info } from "lucide-react";

// Dynamically import Leaflet component with SSR disabled
const SpatialMapViewer = dynamic(
  () =>
    import("@/components/map/spatial-map").then((mod) => mod.SpatialMapViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-140px)] w-full rounded-2xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-300">
          Loading National Cadastral & GIS Spatial Engine...
        </p>
        <span className="text-xs text-slate-500">
          Fetching CartoDB / Bhuvan tile layers & parcel geometries
        </span>
      </div>
    ),
  }
);

export default function MapPage() {
  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Compass className="h-5 w-5 text-amber-400" />
            <span>GIS Spatial Visualizer & Cadastral Mapping</span>
          </h1>
          <p className="text-xs text-slate-400">
            Interactive map visualizing national infrastructure corridors, notified land parcels, and 14-digit ULPIN (Bhu-Aadhaar) geofences.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 self-start sm:self-auto">
          <Layers className="h-3.5 w-3.5 text-emerald-400" />
          <span>WGS 84 (EPSG:4326) / OGC MVT Standards</span>
        </div>
      </div>

      {/* Map Container */}
      <SpatialMapViewer />
    </div>
  );
}
