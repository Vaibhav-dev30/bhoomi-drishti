"use client";

import React, { useState, useEffect, useId } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  FileCheck,
  Coins,
  Building2,
  Lock,
  Globe2,
  Download,
  CheckCircle2,
  Activity,
  Maximize2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Landmark,
  Radio,
  Eye,
  Info,
  Server,
  FileText,
  X,
  Send,
  UserCheck,
} from "lucide-react";

export default function LandingPage() {
  // Live simulated ping / latency
  const [pingMs, setPingMs] = useState(14);
  const [activeLayers, setActiveLayers] = useState({
    cadastral: true,
    rowBuffer: true,
    terrain: false,
    thermalMask: false,
  });

  // Selected plot preview popup in GIS window
  const [selectedPlot, setSelectedPlot] = useState<{
    khasra: string;
    ulpin: string;
    area: string;
    status: string;
    owner: string;
  } | null>(null);

  // Agency Onboarding Modal State
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardSubmitted, setOnboardSubmitted] = useState(false);
  const [agencyName, setAgencyName] = useState("National Highways Authority of India (NHAI)");
  const [officerName, setOfficerName] = useState("");
  const [officerEmail, setOfficerEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");

  // Statutory Lifecycle Tab
  const [activeTab, setActiveTab] = useState<number>(1);

  // Periodic latency simulation for live telemetry feel
  useEffect(() => {
    const timer = setInterval(() => {
      setPingMs((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 11 ? 12 : next > 19 ? 16 : next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  // Export Gazette CSV Functionality
  const handleExportGazetteCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Gazette ID,Project ID,Project Name,State,District,Village,Statutory Section,Parcels Acquired,Total Area (Ha),SLA Days Elapsed,Status\n" +
      "SO-2026-NH48-01,PRJ-001,NH-48 Greenfield Express Bypass Corridor,Maharashtra,Nashik,Musalgaon,Section 19 Declaration,12,18.42,142,In Progress\n" +
      "SO-2026-DFC-04,PRJ-002,Western Dedicated Freight Corridor P-3,Gujarat,Surat,Kim,Section 11 Preliminary,28,42.10,68,Under Objection Review\n" +
      "SO-2026-KAT-12,PRJ-003,Delhi-Amritsar-Katra Expressway,Punjab,Ludhiana,Doraha,Section 23 Final Award,45,68.90,290,PFMS DBT Disbursed\n" +
      "SO-2026-BCI-09,PRJ-004,Bengaluru-Chennai Industrial Expressway,Tamil Nadu,Vellore,Ranipet,Section 4 SIA,19,31.25,44,SIA Public Hearing";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "BhoomiDrishti_National_Gazette_Summary_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-slate-900 font-sans selection:bg-[#0284C7] selection:text-white flex flex-col">
      {/* ─────────────────────────────────────────────────────────────
          1. GOVTECH TOP NAVIGATION BAR
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E5E0D6] px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & GovTech Pill */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#15803D] text-white shadow-xs flex items-center justify-center">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-tight">
                  BhoomiDrishti
                </span>
                <span className="bg-[#0284C7] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  v4.2 GovTech
                </span>
              </div>
              <span className="text-[9.5px] font-semibold text-slate-500 tracking-wider uppercase block">
                NATIONAL LAND LIFECYCLE PORTAL
              </span>
            </div>
          </div>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#telemetry" className="hover:text-slate-900 transition-colors">
              National Telemetry
            </a>
            <a href="#lifecycle" className="hover:text-slate-900 transition-colors">
              Statutory Lifecycle
            </a>
            <a href="#techspecs" className="hover:text-slate-900 transition-colors">
              Enterprise Tech Specs
            </a>
            <a href="#corridors" className="hover:text-slate-900 transition-colors">
              Corridor Tracking
            </a>
          </nav>

          {/* Right Action: Citizen Portal Link + Sign In Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/public"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#15803D] transition-colors px-2 py-1"
            >
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              Citizen Portal
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (MATCHING SCREENSHOT VISUAL LAYOUT)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Ambient subtle glow */}
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-[#0284C7]/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#15803D]/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT COLUMN: Compliance Pill, Headline with Image Pill, Subtitle, CTAs, 3 KPIs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Compliance Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
              <span>Sovereign GovTech • RFCTLARR Act 2013 Statutory Compliance</span>
            </div>

            {/* Headline with 'Land,' Aerial Thumbnail Pill */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
              Empowering{" "}
              <span
                className="inline-flex items-center justify-center align-middle mx-1 px-3.5 py-0.5 rounded-2xl border border-emerald-700/30 text-white font-extrabold shadow-sm bg-cover bg-center"
                style={{
                  backgroundImage: "url('/drone_orthomosaic.jpg')",
                  backgroundPosition: "center 35%",
                  textShadow: "0 2px 4px rgba(0,0,0,0.85), 0 0 8px rgba(0,0,0,0.6)",
                }}
              >
                Land,
              </span>
              <br />
              Uniting National Growth
            </h1>

            {/* Paragraph Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
              Accelerating India&apos;s strategic infrastructure corridors through end-to-end digital land
              acquisition, drone-grade cadastral geo-tagging, transparent statutory award calculations, and
              automated DBT compensation disbursements across 742 districts.
            </p>

            {/* Three Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Primary Dark Button */}
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-300" />
                <span>Login to Portal</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </Link>

              {/* Green Onboarding Button */}
              <button
                type="button"
                onClick={() => {
                  setOnboardSubmitted(false);
                  setOnboardingOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Request Agency Onboarding</span>
              </button>

              {/* Light Public Telemetry Button */}
              <a
                href="#telemetry"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-[#CBD5E1] shadow-xs hover:border-slate-400 transition-all"
              >
                <Globe2 className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Explore Public Telemetry</span>
              </a>
            </div>

            {/* Bottom 3 Summary Metrics */}
            <div className="pt-6 border-t border-[#E5E0D6] grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  3,12,180 Ha
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  LAND ACQUIRED
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  ₹1,12,450 Cr
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  DBT DISBURSED
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-emerald-700">
                  14.2 Mo
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  AVG SLA CYCLE (VS 38 MO)
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE PLATFORM PREVIEW CARD (MATCHING SCREENSHOT) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl bg-[#0B132B] border border-slate-700/80 shadow-2xl overflow-hidden text-white flex flex-col">
              {/* Top Telemetry Header Bar */}
              <div className="p-3 sm:p-4 border-b border-slate-800 bg-[#070D1E] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-[10px] font-mono font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LIVE TELEMETRY • ISRO BHUVAN & DRONE ORTHOMOSAIC STREAM • {pingMs}ms</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    NICNet Backbone
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 pt-0.5">
                  <span className="text-amber-300">ULPIN: RJ-9482-1049-81</span>
                  <span className="text-cyan-400">4K Drone Mesh Active</span>
                  <span className="text-slate-400">EPSG: 4326 WGS84</span>
                </div>
              </div>

              {/* GIS Orthomosaic Map Viewport */}
              <div className="relative h-[340px] sm:h-[410px] w-full overflow-hidden select-none bg-slate-950">
                {/* Aerial Orthomosaic Base Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105 cursor-crosshair"
                  style={{
                    backgroundImage: "url('/drone_orthomosaic.jpg')",
                    filter: activeLayers.terrain
                      ? "contrast(1.2) saturate(1.1)"
                      : activeLayers.thermalMask
                      ? "hue-rotate(90deg) saturate(1.4)"
                      : "none",
                  }}
                  onClick={() =>
                    setSelectedPlot({
                      khasra: "Plot #482",
                      ulpin: "ULPIN-MH-NSK-2026-482",
                      area: "1.84 Ha (Irregated Agri)",
                      status: "Sec 19 Declared (CALA Verified)",
                      owner: "Rameshwar B. Patil & 2 Co-owners",
                    })
                  }
                />

                {/* Radar Sweep Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-40 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent animate-pulse" />

                {/* 60m RoW Buffer Corridor Ribbon (Angled Yellow/Amber Overlay) */}
                {activeLayers.rowBuffer && (
                  <div
                    className="absolute pointer-events-none -left-12 top-10 w-[140%] h-20 sm:h-24 bg-gradient-to-b from-amber-500/25 via-amber-400/35 to-amber-500/25 border-y-2 border-dashed border-amber-400 -rotate-16 flex items-center justify-center shadow-lg"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(245,158,11,0.15) 0, rgba(245,158,11,0.15) 10px, transparent 10px, transparent 20px)",
                    }}
                  >
                    <span className="font-mono text-[9px] sm:text-[10px] font-black text-amber-300 tracking-widest uppercase bg-black/60 px-3 py-0.5 rounded-full border border-amber-400/50">
                      SEC 19 ROW CORRIDOR BUFFER (60M) • NH-48 EXPRESS ALIGNMENT
                    </span>
                  </div>
                )}

                {/* Cadastral Khasra Polygons (Cyan/Green Vector Outlines) */}
                {activeLayers.cadastral && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 400">
                    {/* Plot #482 Polygon */}
                    <polygon
                      points="260,110 420,130 380,240 240,210"
                      fill="rgba(16, 185, 129, 0.22)"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-pulse"
                    />
                    {/* Neighbor Plot #483 */}
                    <polygon
                      points="420,130 540,150 510,250 380,240"
                      fill="rgba(2, 132, 199, 0.15)"
                      stroke="#0284C7"
                      strokeWidth="2"
                    />
                    {/* Neighbor Plot #484 */}
                    <polygon
                      points="240,210 380,240 350,330 210,300"
                      fill="rgba(245, 158, 11, 0.15)"
                      stroke="#F59E0B"
                      strokeWidth="2"
                    />
                  </svg>
                )}

                {/* Floating Telemetry Badges (Matching Screenshot Pins) */}
                {/* 1. Cadastral Plot #482 Pin */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlot({
                      khasra: "Plot #482",
                      ulpin: "ULPIN-MH-NSK-2026-482",
                      area: "1.84 Ha (Agri)",
                      status: "Sec 19 Declared (Direct DBT Eligible)",
                      owner: "Rameshwar B. Patil",
                    });
                  }}
                  className="absolute top-24 sm:top-28 right-8 sm:right-16 z-20 cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#070D1E]/90 border border-emerald-500 text-emerald-300 text-[11px] font-semibold shadow-xl backdrop-blur-md group-hover:scale-105 transition-all">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Cadastral Plot #482</span>
                    <span className="bg-emerald-950 text-emerald-400 text-[9px] font-mono px-1.5 py-0.5 rounded border border-emerald-700">
                      ULPIN Verified
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono">1.84 Ha</span>
                  </div>
                </div>

                {/* 2. NH-48 RoW Alignment Pin */}
                <div className="absolute top-52 sm:top-56 right-6 sm:right-10 z-20">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#070D1E]/90 border border-amber-500 text-amber-300 text-[10px] font-semibold shadow-xl backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>NH-48 RoW Alignment 60m</span>
                  </div>
                </div>

                {/* 3. MoEFCC Riverine Buffer Pin */}
                <div className="absolute bottom-16 left-6 sm:left-12 z-20">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#070D1E]/90 border border-cyan-500 text-cyan-300 text-[10px] font-semibold shadow-xl backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>MoEFCC Riverine Buffer (50m)</span>
                  </div>
                </div>

                {/* Interactive Click Popup Card */}
                {selectedPlot && (
                  <div className="absolute top-4 left-4 z-30 bg-[#0B132B]/95 border border-emerald-500/80 p-3 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs text-xs animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {selectedPlot.khasra}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedPlot(null)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div>
                        <span className="text-slate-400">ULPIN:</span>{" "}
                        <span className="font-mono text-amber-300">{selectedPlot.ulpin}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Area:</span> {selectedPlot.area}
                      </div>
                      <div>
                        <span className="text-slate-400">Owner:</span> {selectedPlot.owner}
                      </div>
                      <div>
                        <span className="text-slate-400">Stage:</span>{" "}
                        <span className="text-emerald-300 font-semibold">{selectedPlot.status}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Layer Switcher Bar (Matching Screenshot Controls) */}
              <div className="p-3 sm:p-4 bg-[#070D1E] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                {/* 4 Layer Toggle Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => toggleLayer("cadastral")}
                    className={`px-2.5 py-1 rounded-xl text-[10.5px] font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeLayers.cadastral
                        ? "bg-slate-800 text-emerald-400 border border-emerald-500/50 shadow-xs"
                        : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <span># Cadastral Khasra</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleLayer("rowBuffer")}
                    className={`px-2.5 py-1 rounded-xl text-[10.5px] font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeLayers.rowBuffer
                        ? "bg-slate-800 text-amber-400 border border-amber-500/50 shadow-xs"
                        : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <span>Y RoW Buffer 60m</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleLayer("terrain")}
                    className={`px-2.5 py-1 rounded-xl text-[10.5px] font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeLayers.terrain
                        ? "bg-slate-800 text-cyan-400 border border-cyan-500/50 shadow-xs"
                        : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <span>▲ 3D Terrain Relief</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleLayer("thermalMask")}
                    className={`px-2.5 py-1 rounded-xl text-[10.5px] font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeLayers.thermalMask
                        ? "bg-slate-800 text-purple-400 border border-purple-500/50 shadow-xs"
                        : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <span>◎ Thermal Soil Mask</span>
                  </button>
                </div>

                {/* Right GIS Feeds Indicator */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="uppercase tracking-wider font-bold">GIS FEEDS</span>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Globe2 className="w-3.5 h-3.5 hover:text-emerald-400 cursor-pointer" />
                    <Layers className="w-3.5 h-3.5 hover:text-cyan-400 cursor-pointer" />
                    <Landmark className="w-3.5 h-3.5 hover:text-amber-400 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. NATIONAL LAND ACQUISITION KPI COMMAND CENTER (DARK NAVY SECTION)
      ───────────────────────────────────────────────────────────── */}
      <section id="telemetry" className="w-full bg-[#080E21] border-y border-slate-800 py-12 px-4 sm:px-8 text-white">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Banner Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-600/40 text-cyan-300 text-[10.5px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>REAL-TIME DECISION SUPPORT TELEMETRY • NICNET BACKBONE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                National Land Acquisition KPI Command Center
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
                Aggregated statutory telemetry synchronized across 28 States, 8 UTs, 742 Districts &amp; 16 Central Infrastructure Ministries.
              </p>
            </div>

            {/* Right Telemetry Sync & CSV Export */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="text-left sm:text-right">
                <div className="text-[10px] font-mono text-slate-400">Telemetry Sync Timestamp</div>
                <div className="text-xs font-mono font-bold text-emerald-400">
                  Today, 06:00:00 IST (Sub-second DB sync)
                </div>
              </div>

              <button
                type="button"
                onClick={handleExportGazetteCSV}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Gazette CSV</span>
              </button>
            </div>
          </div>

          {/* 4 Live KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Corridors</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-white">16 Mega Corridors</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>NHAI, Railways &amp; Industrial Expressways</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>BhuNaksha WFS Match</span>
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-emerald-400">98.6%</div>
              <div className="text-[11px] text-slate-400 font-medium">
                Automated Cadastral Boundary Sync
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>PFMS DBT Clearance</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-amber-300">₹1,12,450 Cr</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Escrow Leakage Protocol</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Statutory Compliance</span>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-purple-300">100% Audit Trail</div>
              <div className="text-[11px] text-slate-400 font-medium">
                Dual-Key Digital Signature (CALA)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. STATUTORY RFCTLARR ACT 2013 4-STEP LIFECYCLE
      ───────────────────────────────────────────────────────────── */}
      <section id="lifecycle" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Statutory Transparency Standard
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            End-to-End RFCTLARR Act 2013 Statutory Lifecycle
          </h2>
          <p className="text-sm text-slate-600">
            Automating legal rigor, mandatory public consultations, digital land awards, and direct bank
            disbursements to protect landowners and fast-track national priorities.
          </p>
        </div>

        {/* 4-Step Interactive Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            {
              step: 1,
              title: "Section 4",
              sub: "Social Impact Assessment (SIA)",
              desc: "Gram Sabha hearings, public notices, and multi-crop land impact review.",
            },
            {
              step: 2,
              title: "Section 11",
              sub: "Preliminary Notification",
              desc: "Drone cadastral mapping, 14-digit ULPIN tagging, and transaction freeze.",
            },
            {
              step: 3,
              title: "Section 19",
              sub: "Declaration & R&R Scheme",
              desc: "MoEFCC environmental alignment, rehabilitation micro-plans & gazette.",
            },
            {
              step: 4,
              title: "Section 23 & 31",
              sub: "Final Award & DBT Payment",
              desc: "100% Solatium, statutory interest, and direct PFMS Aadhaar disbursement.",
            },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => setActiveTab(item.step)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                activeTab === item.step
                  ? "bg-white border-[#15803D] ring-2 ring-[#15803D]/20 shadow-md"
                  : "bg-[#F2EFE8]/70 border-[#E5E0D6] hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                  Step 0{item.step}
                </span>
                <span
                  className={`text-xs font-bold ${
                    activeTab === item.step ? "text-[#15803D]" : "text-slate-500"
                  }`}
                >
                  {item.title}
                </span>
              </div>
              <div className="font-extrabold text-sm text-slate-900 mb-1">{item.sub}</div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>

        {/* Dynamic Detail Card for Selected Step */}
        <div className="rounded-3xl border border-[#E5E0D6] bg-white p-6 sm:p-8 shadow-sm">
          {activeTab === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Statutory Phase: Preliminary Inquiry
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Section 4: Social Impact Assessment (SIA) &amp; Public Consultation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Before land acquisition begins, independent institutional assessors evaluate the affected
                  communities, livelihoods, and public infrastructure. BhoomiDrishti digitizes attendance,
                  records Gram Sabha objections, and enforces the mandatory 60-day statutory hearing timeline.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6]">
                    <span className="font-bold text-slate-900 block">Gram Sabha Records</span>
                    <span className="text-slate-500">100% Geo-tagged meetings</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6]">
                    <span className="font-bold text-slate-900 block">Food Security Review</span>
                    <span className="text-slate-500">Multi-crop land restriction checks</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-[#0B132B] p-6 text-white space-y-3 font-mono text-xs">
                <div className="text-emerald-400 font-bold border-b border-slate-700 pb-2">
                  // SIA COMPLIANCE CHECKLIST
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Gram Sabha Quorum Met:</span>
                  <span className="text-emerald-400">VERIFIED (82% Attendance)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Public Notice in Vernacular:</span>
                  <span className="text-emerald-400">PUBLISHED (Lokmat &amp; Sakal)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Expert Group Appraisal:</span>
                  <span className="text-emerald-400">RECOMMENDED WITHOUT MOD</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  Statutory Phase: Cadastral Geo-Tagging
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Section 11: Preliminary Notification &amp; 14-Digit ULPIN Assignment
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The preliminary notification notifies the public of the government&apos;s intent to acquire the land.
                  BhoomiDrishti automatically queries State BhuNaksha WFS servers, attaches 14-digit Unique Land Parcel
                  Identification Numbers (ULPIN), and places a legal transaction freeze to prevent fraudulent transfers.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6]">
                    <span className="font-bold text-slate-900 block">ULPIN Integration</span>
                    <span className="text-slate-500">Sub-meter cadastral centroid</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6]">
                    <span className="font-bold text-slate-900 block">Section 15 Objections</span>
                    <span className="text-slate-500">60-day digital hearing window</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-[#0B132B] p-6 text-white space-y-3 font-mono text-xs">
                <div className="text-cyan-400 font-bold border-b border-slate-700 pb-2">
                  // BhuNaksha WFS STREAM ENVELOPE
                </div>
                <div className="text-slate-300">
                  ULPIN: <span className="text-amber-300">MH-NSK-SIN-482</span>
                </div>
                <div className="text-slate-300">
                  Cadastral Vertices: <span className="text-cyan-400">8 Geo-points Recorded</span>
                </div>
                <div className="text-slate-300">
                  Encumbrance Registry: <span className="text-emerald-400">LOCKED (S.11 GAZETTE)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
                  Statutory Phase: Official Declaration
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Section 19: Statutory Declaration &amp; Rehabilitation (R&amp;R) Micro-Plan
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Following the completion of objection hearings under Section 15, the competent authority publishes
                  the definitive declaration of acquisition. Every Project Affected Family (PAF) is mapped to a
                  comprehensive Rehabilitation &amp; Resettlement entitlement package, verified by CALA and LRB tribunals.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6]">
                    <span className="font-bold text-slate-900 block">PAF Enumeration</span>
                    <span className="text-slate-500">100% Aadhaar vault verified</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6]">
                    <span className="font-bold text-slate-900 block">MoEFCC Clearance</span>
                    <span className="text-slate-500">Automated buffer clipping</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-[#0B132B] p-6 text-white space-y-3 font-mono text-xs">
                <div className="text-purple-400 font-bold border-b border-slate-700 pb-2">
                  // R&amp;R BENEFICIARY MATRIX
                </div>
                <div className="text-slate-300">
                  Project Affected Families: <span className="text-emerald-400">14 Verified</span>
                </div>
                <div className="text-slate-300">
                  Resettlement Colony Allotment: <span className="text-amber-300">Plot Area 150 sq.m</span>
                </div>
                <div className="text-slate-300">
                  Subsistence Grant: <span className="text-emerald-400">₹3,000/mo for 12 months</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Statutory Phase: Award &amp; Direct DBT
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Section 23 &amp; 31: Final Award Determination &amp; PFMS DBT Disbursement
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The CALA issues the statutory award calculation sheet adhering to the First Schedule: Circle rate
                  multiplied by rural factor (1.5x - 2.0x), plus 100% Solatium and 12% statutory interest. Funds are
                  disbursed via the Public Financial Management System directly into beneficiary bank accounts with zero
                  intermediaries.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6]">
                    <span className="font-bold text-slate-900 block">Solatium Guarantee</span>
                    <span className="text-slate-500">100% statutory mandate</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6]">
                    <span className="font-bold text-slate-900 block">PFMS Escrow Pipeline</span>
                    <span className="text-slate-500">Sub-second DBT confirmation</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-[#0B132B] p-6 text-white space-y-3 font-mono text-xs">
                <div className="text-emerald-400 font-bold border-b border-slate-700 pb-2">
                  // STATUTORY AWARD COMPUTATION
                </div>
                <div className="text-slate-300">
                  Basic Market Value: <span className="text-slate-100">₹45,00,000</span>
                </div>
                <div className="text-slate-300">
                  Rural Multiplier (1.5x): <span className="text-slate-100">₹67,50,000</span>
                </div>
                <div className="text-slate-300">
                  100% Solatium (S.30): <span className="text-amber-300">+ ₹67,50,000</span>
                </div>
                <div className="text-emerald-400 font-bold pt-1 border-t border-slate-700">
                  Total DBT Cleared: ₹1,35,00,000
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. CORRIDOR TRACKING SHOWCASE SECTION (#corridors)
      ───────────────────────────────────────────────────────────── */}
      <section id="corridors" className="py-16 px-4 sm:px-8 bg-[#F2EFE8]/60 border-y border-[#E5E0D6]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider block">
                Flagship Infrastructure Corridors
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Live National Project Acquisition Monitoring
              </h2>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:underline"
            >
              <span>Access Full Authority Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Corridor 1: Flagship Project */}
            <div className="p-6 rounded-3xl bg-white border border-[#15803D]/40 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#15803D] text-white text-[9px] font-mono px-3 py-1 rounded-bl-xl font-bold uppercase">
                Active Demonstration Project
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-slate-400">PRJ-001</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-[#15803D]">
                  Section 19 Declared
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">
                NH-48 Greenfield Express Bypass Corridor
              </h4>
              <p className="text-xs text-slate-600 mb-4">
                Musalgaon Village, Sinnar Tehsil, Nashik District, Maharashtra
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs border-t border-[#E5E0D6] pt-3">
                <div>
                  <span className="text-slate-400 text-[10.5px] block">Parcels</span>
                  <span className="font-bold text-slate-900">12 Plots</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10.5px] block">Footprint</span>
                  <span className="font-bold text-slate-900">18.42 Ha</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10.5px] block">DBT Cleared</span>
                  <span className="font-bold text-emerald-700">₹24.85 Cr</span>
                </div>
              </div>
            </div>

            {/* Corridor 2 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E0D6] shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-slate-400">PRJ-002</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-[#0284C7]">
                  Section 11 Preliminary
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">
                Western Dedicated Freight Corridor (DFC-W3)
              </h4>
              <p className="text-xs text-slate-600 mb-4">
                Kim &amp; Kosamba Industrial Nodes, Surat District, Gujarat
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs border-t border-[#E5E0D6] pt-3">
                <div>
                  <span className="text-slate-400 text-[10.5px] block">Parcels</span>
                  <span className="font-bold text-slate-900">28 Plots</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10.5px] block">Footprint</span>
                  <span className="font-bold text-slate-900">42.10 Ha</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10.5px] block">DBT Cleared</span>
                  <span className="font-bold text-slate-700">₹68.20 Cr</span>
                </div>
              </div>
            </div>

            {/* Corridor 3 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E0D6] shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-slate-400">PRJ-003</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
                  Section 23 Award Finalized
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">
                Delhi-Amritsar-Katra Expressway Phase II
              </h4>
              <p className="text-xs text-slate-600 mb-4">
                Doraha &amp; Khanna Tehsils, Ludhiana District, Punjab
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs border-t border-[#E5E0D6] pt-3">
                <div>
                  <span className="text-slate-400 text-[10.5px] block">Parcels</span>
                  <span className="font-bold text-slate-900">45 Plots</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10.5px] block">Footprint</span>
                  <span className="font-bold text-slate-900">68.90 Ha</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10.5px] block">DBT Cleared</span>
                  <span className="font-bold text-emerald-700">₹112.50 Cr</span>
                </div>
              </div>
            </div>

            {/* Corridor 4 */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E0D6] shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-slate-400">PRJ-004</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800">
                  Section 4 SIA Completed
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">
                Bengaluru-Chennai High-Speed Industrial Corridor
              </h4>
              <p className="text-xs text-slate-600 mb-4">
                Ranipet &amp; Walajah Tehsils, Vellore District, Tamil Nadu
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs border-t border-[#E5E0D6] pt-3">
                <div>
                  <span className="text-slate-400 text-[10.5px] block">Parcels</span>
                  <span className="font-bold text-slate-900">19 Plots</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10.5px] block">Footprint</span>
                  <span className="font-bold text-slate-900">31.25 Ha</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10.5px] block">DBT Cleared</span>
                  <span className="font-bold text-slate-700">₹39.10 Cr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. ENTERPRISE TECH SPECS & ARCHITECTURE (#techspecs)
      ───────────────────────────────────────────────────────────── */}
      <section id="techspecs" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0284C7] text-xs font-bold">
            <Server className="w-3.5 h-3.5" />
            Interoperability &amp; Standards
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Enterprise GovTech System Architecture
          </h2>
          <p className="text-sm text-slate-600">
            Engineered on open standards, cryptographic audit non-repudiation, and sub-second multi-tier
            interoperability between Central Ministries, State Revenue, and District CALAs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tech 1 */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E0D6] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#15803D] flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">BhuNaksha WMS / WFS</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standard OGC WFS geometry integration with State Cadastral databases, providing sub-meter boundary
              accuracy and real-time parcel splitting.
            </p>
          </div>

          {/* Tech 2 */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E0D6] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-[#0284C7] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">ULPIN 14-Digit Standard</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every parcel assigned a nationwide unique 14-digit alphanumeric code derived from latitude and longitude
              vertices as per national DoLR standards.
            </p>
          </div>

          {/* Tech 3 */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E0D6] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">PFMS Escrow Pipeline</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct Benefit Transfer (DBT) integration with Public Financial Management System, providing instant
              remittance into verified Aadhaar-seeded accounts.
            </p>
          </div>

          {/* Tech 4 */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E0D6] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Cryptographic Audit Trail</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Immutable logging with SHA-256 event chaining and dual-key digital signatures for CALA awards,
              preventing retroactive tampering.
            </p>
          </div>
        </div>

        {/* Security & Compliance Badges Banner */}
        <div className="mt-8 p-4 sm:p-6 rounded-3xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">
              Certified for Deployment on MeitY-Empanelled Cloud (MeghRaj) &amp; NICNet
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>STQC Certified</span>
            <span>•</span>
            <span>ISO/IEC 27001:2022</span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>Aadhaar Vault 2.0</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. AGENCY ONBOARDING MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {onboardingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E5E0D6] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-[#15803D]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Request Agency Onboarding</h3>
                    <span className="text-[11px] text-slate-500">
                      Central / State Infrastructure Authorities
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOnboardingOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!onboardSubmitted ? (
                <form onSubmit={handleOnboardingSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Infrastructure Body / Ministry</label>
                    <select
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#CBD5E1] rounded-xl text-xs"
                    >
                      <option value="NHAI">National Highways Authority of India (NHAI)</option>
                      <option value="DFCCIL">Dedicated Freight Corridor Corporation (DFCCIL)</option>
                      <option value="NTPC">National Thermal Power Corporation (NTPC)</option>
                      <option value="MORTH">Ministry of Road Transport &amp; Highways</option>
                      <option value="STATE_PWD">State Public Works Department (PWD)</option>
                      <option value="RAILWAYS">Ministry of Railways (MoR)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Authorized Nodal Officer Name</label>
                    <input
                      type="text"
                      required
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      placeholder="e.g. Smt. Vandana Sharma, Chief Project Manager"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#CBD5E1] rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Official Government Email (@nic.in / @gov.in)</label>
                    <input
                      type="email"
                      required
                      value={officerEmail}
                      onChange={(e) => setOfficerEmail(e.target.value)}
                      placeholder="e.g. v.sharma@nhai.gov.in"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#CBD5E1] rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Proposed Infrastructure Corridor Name</label>
                    <input
                      type="text"
                      required
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. Surat-Nashik Industrial Expressway Phase-II"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#CBD5E1] rounded-xl text-xs"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] leading-relaxed">
                    Upon submission, your credentials will be verified against the National Directorate of Land
                    Acquisition (DoLR) and a secure provisioning link will be issued within 4 hours.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Onboarding Request</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-lg text-slate-900">
                    Onboarding Application Registered
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Reference ID: <span className="font-mono font-bold text-slate-900">REQ-2026-MORTH-8842</span>.
                    Notification dispatched to <span className="font-semibold">{officerEmail || "your email"}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOnboardingOpen(false)}
                    className="px-6 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Return to Portal
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          8. OFFICIAL GOVERNMENT PORTAL FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="mt-auto bg-[#F2EFE8] border-t border-[#E5E0D6] py-12 px-4 sm:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Column 1: Brand & Ministry */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#15803D] text-white">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-slate-900">BhoomiDrishti</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                National Land Acquisition &amp; Resettlement Decision Support System. Developed under the aegis of the
                Department of Land Resources (DoLR), Ministry of Rural Development, Government of India.
              </p>
              <div className="text-[11px] font-semibold text-slate-700">
                Technical Architecture powered by National Informatics Centre (NIC).
              </div>
            </div>

            {/* Column 2: Legal & Statutory */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                Statutory Acts
              </span>
              <ul className="space-y-1.5 text-slate-600 text-xs">
                <li>RFCTLARR Act 2013</li>
                <li>National Highways Act 1956</li>
                <li>Railways Act 1989 (Chapter IVA)</li>
                <li>ULPIN (Bhudhar) Mandate</li>
              </ul>
            </div>

            {/* Column 3: Portals */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                Gov Portals
              </span>
              <ul className="space-y-1.5 text-slate-600 text-xs">
                <li>
                  <Link href="/public" className="hover:text-[#15803D]">
                    G2C Citizen Portal
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#15803D]">
                    CALA Officer Login
                  </Link>
                </li>
                <li>ISRO Bhuvan Geo-Portal</li>
                <li>BhuNaksha NIC Portal</li>
              </ul>
            </div>

            {/* Column 4: Compliance & Help */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                Support &amp; Trust
              </span>
              <ul className="space-y-1.5 text-slate-600 text-xs">
                <li>Terms of Service &amp; RTI</li>
                <li>Hyperlinking Policy</li>
                <li>Security &amp; Privacy Policy</li>
                <li>Helpdesk: 1800-11-2026</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E5E0D6] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 BhoomiDrishti • Department of Land Resources, Ministry of Rural Development. All Rights Reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>National Informatics Centre (NIC)</span>
              <span>•</span>
              <span>Digital India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
