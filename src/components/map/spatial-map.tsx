"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  Layers,
  MapPin,
  Compass,
  Maximize2,
  Info,
  CheckCircle,
  AlertCircle,
  Eye,
  Search,
  Building2,
  FileText,
} from "lucide-react";
import { MOCK_PROJECTS, INDIAN_STATES } from "@/lib/mock-data";
import { Project, LandParcel } from "@/types";
import { formatArea, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Fix for default Leaflet icon paths in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom colored SVG pin markers for sectors
function createCustomPin(color: string) {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

// Sample cadastral parcel polygons in Maharashtra (Nashik - Sinnar area)
const SAMPLE_CADASTRAL_PARCELS: (LandParcel & {
  ulpin: string;
  polygon: [number, number][];
})[] = [
  {
    id: "PRC-001",
    projectId: "PRJ-001",
    surveyNumber: "42/1",
    khasraNumber: "KH-892",
    ulpin: "MH240019284712",
    village: "Sinnar",
    tehsil: "Sinnar",
    district: "Nashik",
    state: "Maharashtra",
    areaHectares: 2.5,
    landType: "agricultural",
    ownershipType: "private",
    status: "acquired",
    ownerName: "Ramesh Patil & Sons",
    marketValue: 1800000,
    coordinates: [19.845, 73.995],
    polygon: [
      [19.843, 73.992],
      [19.847, 73.992],
      [19.848, 73.997],
      [19.844, 73.998],
    ],
  },
  {
    id: "PRC-002",
    projectId: "PRJ-001",
    surveyNumber: "42/2",
    khasraNumber: "KH-893",
    ulpin: "MH240019284713",
    village: "Sinnar",
    tehsil: "Sinnar",
    district: "Nashik",
    state: "Maharashtra",
    areaHectares: 1.8,
    landType: "agricultural",
    ownershipType: "private",
    status: "possessed",
    ownerName: "Suresh Gaikwad",
    marketValue: 1800000,
    coordinates: [19.849, 73.996],
    polygon: [
      [19.848, 73.997],
      [19.852, 73.998],
      [19.853, 74.002],
      [19.849, 74.001],
    ],
  },
  {
    id: "PRC-003",
    projectId: "PRJ-001",
    surveyNumber: "43",
    khasraNumber: "KH-901",
    ulpin: "MH240019284714",
    village: "Sinnar",
    tehsil: "Sinnar",
    district: "Nashik",
    state: "Maharashtra",
    areaHectares: 3.2,
    landType: "commercial",
    ownershipType: "private",
    status: "notified",
    ownerName: "Priya Deshmukh",
    marketValue: 2400000,
    coordinates: [19.854, 74.004],
    polygon: [
      [19.853, 74.002],
      [19.857, 74.003],
      [19.858, 74.008],
      [19.854, 74.007],
    ],
  },
  {
    id: "PRC-004",
    projectId: "PRJ-001",
    surveyNumber: "44/A",
    khasraNumber: "KH-910",
    ulpin: "MH240019284715",
    village: "Sinnar",
    tehsil: "Sinnar",
    district: "Nashik",
    state: "Maharashtra",
    areaHectares: 4.1,
    landType: "forest",
    ownershipType: "government",
    status: "surveyed",
    ownerName: "State Forest Dept (Gram Van)",
    marketValue: 1200000,
    coordinates: [19.859, 74.009],
    polygon: [
      [19.858, 74.008],
      [19.862, 74.009],
      [19.863, 74.015],
      [19.859, 74.014],
    ],
  },
];

// Helper component to center map on state or project selection
function MapViewController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export function SpatialMapViewer() {
  const [selectedBaseMap, setSelectedBaseMap] = useState<"dark" | "osm" | "satellite">("dark");
  const [showProjects, setShowProjects] = useState(true);
  const [showCadastral, setShowCadastral] = useState(true);
  const [showStates, setShowStates] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(MOCK_PROJECTS[0]);
  const [selectedParcel, setSelectedParcel] = useState<typeof SAMPLE_CADASTRAL_PARCELS[0] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);

  const baseMapTiles = {
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  const getParcelColor = (status: string) => {
    switch (status) {
      case "possessed":
        return "#10b981"; // Emerald
      case "acquired":
        return "#06b6d4"; // Cyan
      case "notified":
        return "#f59e0b"; // Amber
      case "surveyed":
        return "#8b5cf6"; // Purple
      default:
        return "#3b82f6"; // Blue
    }
  };

  const getSectorPinColor = (type: string) => {
    switch (type) {
      case "highway":
        return "#f59e0b";
      case "railway":
        return "#3b82f6";
      case "irrigation":
        return "#06b6d4";
      case "industrial":
        return "#8b5cf6";
      case "renewable_energy":
        return "#22c55e";
      default:
        return "#ec4899";
    }
  };

  return (
    <div className="relative h-[calc(100vh-140px)] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* Floating Map Controls & Telemetry Header */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-2">
        {/* Base Layer Switcher */}
        <div className="flex items-center rounded-lg bg-slate-950/90 border border-slate-800 p-1 backdrop-blur-md shadow-xl text-xs">
          <button
            onClick={() => setSelectedBaseMap("dark")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedBaseMap === "dark"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Sovereign Dark
          </button>
          <button
            onClick={() => setSelectedBaseMap("osm")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedBaseMap === "osm"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Cadastral (OSM)
          </button>
          <button
            onClick={() => setSelectedBaseMap("satellite")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              selectedBaseMap === "satellite"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            ISRO Satellite
          </button>
        </div>

        {/* Layer Filters */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-950/90 border border-slate-800 px-3 py-1.5 backdrop-blur-md text-xs text-slate-300">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showProjects}
              onChange={(e) => setShowProjects(e.target.checked)}
              className="accent-amber-500"
            />
            <span>Projects ({MOCK_PROJECTS.length})</span>
          </label>
          <span className="text-slate-700">|</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showCadastral}
              onChange={(e) => setShowCadastral(e.target.checked)}
              className="accent-amber-500"
            />
            <span className="text-cyan-400 font-semibold">Parcels (Khasra)</span>
          </label>
          <span className="text-slate-700">|</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showStates}
              onChange={(e) => setShowStates(e.target.checked)}
              className="accent-amber-500"
            />
            <span>States</span>
          </label>
        </div>

        {/* Fast Focus Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setMapCenter([19.9975, 73.7898]);
            setMapZoom(12);
          }}
          className="text-xs gap-1 bg-slate-950/90 border-slate-800"
        >
          <Compass className="h-3.5 w-3.5 text-amber-400" />
          <span>Focus Cadastral Demo</span>
        </Button>
      </div>

      {/* Main Leaflet Map Engine */}
      <div className="flex-1 w-full h-full">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <MapViewController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
            url={baseMapTiles[selectedBaseMap]}
          />

          {/* Project Markers */}
          {showProjects &&
            MOCK_PROJECTS.map((proj) => (
              <Marker
                key={proj.id}
                position={[proj.centerLat, proj.centerLng]}
                icon={createCustomPin(getSectorPinColor(proj.type))}
                eventHandlers={{
                  click: () => {
                    setSelectedProject(proj);
                    setSelectedParcel(null);
                  },
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 space-y-1.5 min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-amber-400 uppercase">
                        {proj.projectCode}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {proj.state}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-white leading-tight">
                      {proj.name}
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Acquired: <strong>{formatArea(proj.areaAcquired)}</strong> / {formatArea(proj.totalAreaRequired)}
                    </p>
                    <p className="text-[11px] text-emerald-400 font-mono">
                      Disbursed: ₹{proj.compensationDisbursed} Lakhs
                    </p>
                    <a
                      href={`/projects/${proj.id}`}
                      className="inline-block mt-1 text-[10px] font-bold text-amber-400 hover:underline"
                    >
                      View Statutory Dossier →
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Cadastral Land Parcel Boundary Polygons */}
          {showCadastral &&
            SAMPLE_CADASTRAL_PARCELS.map((parcel) => (
              <Polygon
                key={parcel.id}
                positions={parcel.polygon}
                pathOptions={{
                  color: getParcelColor(parcel.status),
                  fillColor: getParcelColor(parcel.status),
                  fillOpacity: 0.45,
                  weight: 2,
                  dashArray: parcel.status === "notified" ? "4" : undefined,
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedParcel(parcel);
                  },
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 min-w-[180px]">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">
                      ULPIN: {parcel.ulpin}
                    </span>
                    <h4 className="font-bold text-xs text-white">
                      Survey / Gat No: {parcel.surveyNumber}
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Khasra: {parcel.khasraNumber} • {parcel.village}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Owner: <strong>{parcel.ownerName}</strong>
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Area: <strong>{parcel.areaHectares} ha</strong> ({parcel.landType})
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] font-mono capitalize px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                        {parcel.status}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            ))}

          {/* State Center Markers */}
          {showStates &&
            INDIAN_STATES.map((st) => (
              <CircleMarker
                key={st.code}
                center={[st.lat, st.lng]}
                radius={4}
                pathOptions={{
                  color: "#64748b",
                  fillColor: "#334155",
                  fillOpacity: 0.7,
                  weight: 1,
                }}
              >
                <Popup>
                  <div className="text-xs p-1">
                    <p className="font-bold text-white">{st.name}</p>
                    <p className="text-[10px] text-slate-400">State Code: {st.code}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>
      </div>

      {/* Floating Inspection Drawer (Bottom or Right) */}
      <div className="absolute bottom-4 right-4 z-[1000] w-80 sm:w-96 rounded-xl border border-slate-800 bg-slate-950/95 p-4 backdrop-blur-md shadow-2xl space-y-3">
        {selectedParcel ? (
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  Cadastral Parcel Selected
                </span>
                <h4 className="text-sm font-bold text-white">
                  Gat / Survey: {selectedParcel.surveyNumber}
                </h4>
              </div>
              <Badge variant="default" className="text-[10px] uppercase">
                {selectedParcel.status}
              </Badge>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">ULPIN (Bhu-Aadhaar):</span>
                <span className="font-mono font-bold text-amber-400">
                  {selectedParcel.ulpin}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Owner of Record:</span>
                <span className="font-semibold text-white">
                  {selectedParcel.ownerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Khasra / Plot:</span>
                <span>{selectedParcel.khasraNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Area & Land Class:</span>
                <span>{selectedParcel.areaHectares} ha ({selectedParcel.landType})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Market Rate:</span>
                <span className="font-mono text-emerald-400">
                  ₹{selectedParcel.marketValue.toLocaleString("en-IN")}/ha
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex gap-2">
              <Link href={`/compensation?khasra=${selectedParcel.khasraNumber}`} className="w-full">
                <Button variant="default" size="sm" className="w-full text-xs">
                  Calculate Sec 26-30 Award →
                </Button>
              </Link>
            </div>
          </div>
        ) : selectedProject ? (
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase">
                  {selectedProject.projectCode}
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {selectedProject.name}
                </h4>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {selectedProject.type}
              </Badge>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Requiring Body (LRB):</span>
                <span className="font-medium text-white truncate max-w-[170px]">
                  {selectedProject.lrbName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span>
                  {selectedProject.district}, {selectedProject.state}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Acquisition:</span>
                <span className="font-mono">
                  {formatArea(selectedProject.areaAcquired)} / {formatArea(selectedProject.totalAreaRequired)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Disbursed:</span>
                <span className="font-mono text-emerald-400">
                  ₹{selectedProject.compensationDisbursed} Lakhs
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex gap-2">
              <Link href={`/projects/${selectedProject.id}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Open Project Dossier →
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-slate-500">
            Click on any project marker or parcel polygon to inspect geospatial telemetry.
          </div>
        )}
      </div>
    </div>
  );
}
