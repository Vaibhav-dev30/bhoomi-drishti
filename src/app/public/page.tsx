"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  Upload,
  Coins,
  ShieldCheck,
  Send,
  Building,
  Landmark,
  FileText,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Scale,
  BadgeAlert,
  HelpCircle,
  Layers,
  ChevronDown,
  Printer,
  Calculator,
} from "lucide-react";
import { MOCK_PLOTS, MOCK_FAMILIES, MOCK_PROJECTS, INDIAN_STATES } from "@/lib/mock-data";
import { LAMS_12_STAGES } from "@/lib/bhunaksha-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getStoredGrievances,
  saveGrievance,
  INITIAL_MOCK_GRIEVANCES,
} from "@/lib/grievance-store";
import { CitizenGrievance, GrievanceCategory } from "@/types";
import { CompensationCalculator } from "@/components/calculator/compensation-calculator";
import { StatutoryAwardModal } from "@/components/documents/statutory-award-modal";

export default function CitizenPublicPortalPage() {
  const [language, setLanguage] = useState<"hi" | "en">("hi");

  // Search state
  const [searchKhasra, setSearchKhasra] = useState("DEMO-482");
  const [searchAadhaar, setSearchAadhaar] = useState("");
  const [searchVillage, setSearchVillage] = useState("Alipur");
  const [hasSearched, setHasSearched] = useState(true);

  // Active view tab: "status" | "objection" | "track_objection" | "calculator"
  const [activeTab, setActiveTab] = useState<"status" | "objection" | "track_objection" | "calculator">("status");
  const [showAwardModal, setShowAwardModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "calculator") {
        setActiveTab("calculator");
      }
    }
  }, []);

  // Objection form state
  const [claimantName, setClaimantName] = useState("Shri Ramesh Chand");
  const [claimantPhone, setClaimantPhone] = useState("+91 98110 48201");
  const [objectionGround, setObjectionGround] = useState<GrievanceCategory>("valuation_inadequate");
  const [objectionDetails, setObjectionDetails] = useState("");
  const [attachedFileName, setAttachedFileName] = useState("Sale_Deed_Registry_Sample_2025.pdf");
  const [isSubmittingObjection, setIsSubmittingObjection] = useState(false);
  const [submittedGrievance, setSubmittedGrievance] = useState<CitizenGrievance | null>(null);

  // Grievance storage
  const [grievances, setGrievances] = useState<CitizenGrievance[]>(() => getStoredGrievances());

  // Search logic
  const matchedPlot = useMemo(() => {
    if (!hasSearched) return null;
    const cleanQuery = searchKhasra.trim().toUpperCase().replace("KHASRA", "").trim();
    return (
      MOCK_PLOTS.find((p) => {
        const plotKhasra = p.khasraNumber.toUpperCase();
        const plotSurvey = p.surveyNumber.toUpperCase();
        const plotNumber = p.plotNumber.toUpperCase();
        return (
          plotKhasra.includes(cleanQuery) ||
          plotSurvey.includes(cleanQuery) ||
          plotNumber.includes(cleanQuery) ||
          p.ulpin.toUpperCase().includes(cleanQuery)
        );
      }) || MOCK_PLOTS[0]
    );
  }, [searchKhasra, hasSearched]);

  const matchedFamily = useMemo(() => {
    if (!matchedPlot) return null;
    return (
      MOCK_FAMILIES.find((f) => f.parcelId === matchedPlot.id) ||
      MOCK_FAMILIES.find((f) => f.village.toLowerCase() === matchedPlot.village.toLowerCase()) ||
      MOCK_FAMILIES[0]
    );
  }, [matchedPlot]);

  const matchedProject = useMemo(() => {
    if (!matchedPlot) return MOCK_PROJECTS[0];
    return MOCK_PROJECTS.find((p) => p.id === matchedPlot.projectId) || MOCK_PROJECTS[0];
  }, [matchedPlot]);

  const matchedGrievances = useMemo(() => {
    if (!matchedPlot) return grievances;
    return grievances.filter(
      (g) =>
        g.khasraNo.toLowerCase().includes(matchedPlot.khasraNumber.toLowerCase()) ||
        g.village.toLowerCase() === matchedPlot.village.toLowerCase()
    );
  }, [grievances, matchedPlot]);

  // Demo shortcut handler
  const loadDemoParcel = (khasra: string, village: string, name: string, phone: string) => {
    setSearchKhasra(khasra);
    setSearchVillage(village);
    setClaimantName(name);
    setClaimantPhone(phone);
    setHasSearched(true);
    setActiveTab("status");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (matchedFamily) {
      setClaimantName(matchedFamily.familyHeadName.replace(/\s*\(Demo Landholder\)/, ""));
      if (matchedFamily.phone) setClaimantPhone(matchedFamily.phone);
    }
  };

  const handleObjectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingObjection(true);

    setTimeout(() => {
      const newGrievance: CitizenGrievance = {
        id: `OBJ-2026-${matchedPlot?.state === "Delhi" ? "DL" : "UP"}-${Math.floor(
          10000 + Math.random() * 90000
        )}`,
        khasraNo: matchedPlot?.khasraNumber || searchKhasra,
        village: matchedPlot?.village || searchVillage,
        district: matchedPlot?.district || "North Delhi",
        state: matchedPlot?.state || "Delhi",
        claimantName,
        claimantPhone,
        aadhaarLast4: searchAadhaar || matchedFamily?.aadhaarRef?.slice(-4) || "3829",
        category: objectionGround,
        statutorySection: "Section 15",
        groundsDescription: objectionDetails || "Objection regarding fair compensation reassessment under RFCTLARR Act.",
        supportingDocName: attachedFileName,
        status: "under_scrutiny",
        hearingOfficer: "District Collector & CALA",
        hearingVenue: "Collectorate Court Room, Land Acquisition Cell",
        filedAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        officialRemarks: "Objection registered electronically. Notice for personal hearing will issue within 30 days under Section 15(2).",
      };

      const updated = saveGrievance(newGrievance);
      setGrievances(updated);
      setSubmittedGrievance(newGrievance);
      setIsSubmittingObjection(false);
      setActiveTab("track_objection");
    }, 1200);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-16">
      {/* ───── 1. Official Government Header ───── */}
      <header className="sticky top-0 z-40 border-b border-[#E5E0D6] bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Gov Identity */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15803D] text-white shadow-sm font-bold text-sm">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                    BhoomiDrishti
                  </span>
                  <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-bold text-[#15803D] border border-[#BBF7D0]">
                    G2C Citizen Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {language === "hi"
                    ? "राष्ट्रीय भूमि अधिग्रहण एवं पुनर्वास नागरिक सुविधा केंद्र"
                    : "National Land Acquisition & R&R Citizen Facilitation Center"}
                </p>
              </div>
            </div>

            {/* Right Header Navigation & Bilingual Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <div className="flex items-center rounded-xl bg-[#FAF8F5] border border-[#E5E0D6] p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    language === "hi"
                      ? "bg-[#15803D] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    language === "en"
                      ? "bg-[#15803D] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  English
                </button>
              </div>

              {/* Portal Links */}
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
                  {language === "hi" ? "मुख्य पृष्ठ" : "Home"}
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="sm"
                  className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs rounded-xl"
                >
                  {language === "hi" ? "अधिकारी लॉगिन →" : "Officer Login →"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ───── 2. Hero Search Banner ───── */}
      <div className="bg-gradient-to-b from-white to-[#FAF8F5] border-b border-[#E5E0D6] py-8 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0F2FE] px-3 py-1 text-xs font-bold text-[#0284C7] border border-[#BAE6FD] mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              RFCTLARR Act 2013 · Statutory Transparency
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === "hi"
                ? "अपनी भूमि अधिग्रहण स्थिति एवं प्रतिकर जानें"
                : "Track Your Land Acquisition Notice & Compensation Award"}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === "hi"
                ? "खसरा / गाटा संख्या अथवा आधार संदर्भ दर्ज कर अपनी भूमि की गजट अधिसूचना, 12-चरणीय अधिग्रहण प्रगति, एवं PFMS बैंक भुगतान की सीधी पुष्टि करें।"
                : "Verify preliminary notification, track 12-stage statutory lifecycle, check DBT bank credit, and file Section 15 objections online."}
            </p>
          </div>

          {/* Search Card */}
          <div className="rounded-3xl border border-[#E5E0D6] bg-white p-5 sm:p-6 shadow-md">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#15803D]" />
                    <span>{language === "hi" ? "खसरा / गाटा / सर्वे संख्या *" : "Khasra / Gat / Survey No *"}</span>
                  </label>
                  <Input
                    placeholder="e.g. DEMO-482, 101, 501"
                    value={searchKhasra}
                    onChange={(e) => setSearchKhasra(e.target.value)}
                    required
                    className="font-mono font-bold bg-[#FAF8F5] border-[#E5E0D6] text-slate-900 focus:border-[#15803D]"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-[#0284C7]" />
                    <span>{language === "hi" ? "राजस्व ग्राम / कस्बा" : "Revenue Village / Locality"}</span>
                  </label>
                  <select
                    value={searchVillage}
                    onChange={(e) => setSearchVillage(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#15803D] focus:outline-none cursor-pointer"
                  >
                    <option value="Alipur">Alipur (North Delhi)</option>
                    <option value="Narela">Narela (North Delhi)</option>
                    <option value="Hamidpur">Hamidpur (North Delhi)</option>
                    <option value="Sahibabad">Sahibabad (Ghaziabad)</option>
                    <option value="Arthala">Arthala (Ghaziabad)</option>
                    <option value="Morta">Morta (Ghaziabad)</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex items-end">
                  <Button
                    type="submit"
                    className="w-full h-10 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs shadow-sm"
                  >
                    <Search className="h-4 w-4 mr-1.5" />
                    <span>{language === "hi" ? "सत्यापित करें →" : "Verify Land →"}</span>
                  </Button>
                </div>
              </div>

              {/* ⚡ One-Click Demo Shortcuts for Hackathon Screening */}
              <div className="pt-2 border-t border-[#F2EFE8] flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-500 text-[11px] flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  {language === "hi" ? "त्वरित डेमो परीक्षण:" : "Quick Demo Records:"}
                </span>
                <button
                  type="button"
                  onClick={() => loadDemoParcel("DEMO-482", "Alipur", "Shri Ramesh Chand", "+91 98110 48201")}
                  className="rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  📍 DEMO-482: Alipur (Ramesh Chand · Fully Paid)
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoParcel("DEMO-501", "Sahibabad", "Shri Virender Singh", "+91 98120 71401")}
                  className="rounded-lg border border-sky-300 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-800 hover:bg-sky-100 transition-colors"
                >
                  📍 DEMO-501: Sahibabad (Virender Singh · Displaced)
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoParcel("DEMO-506", "Morta", "Shri Jagdish Tyagi", "+91 98120 99342")}
                  className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                >
                  📍 DEMO-506: Morta (Jagdish Tyagi · Hearing Listed)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ───── 3. Navigation Tabs (Status / Objection / Track) ───── */}
      {matchedPlot && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
          <div className="flex border-b border-[#E5E0D6] space-x-4 sm:space-x-8">
            <button
              onClick={() => setActiveTab("status")}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "status"
                  ? "border-[#15803D] text-[#15803D]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileCheck className="h-4 w-4" />
              <span>{language === "hi" ? "अधिग्रहण स्थिति एवं प्रतिकर विवरण" : "Acquisition Status & Award"}</span>
            </button>

            <button
              onClick={() => setActiveTab("objection")}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "objection"
                  ? "border-[#0284C7] text-[#0284C7]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Scale className="h-4 w-4" />
              <span>{language === "hi" ? "धारा 15 आपत्ति दर्ज करें" : "File Section 15 Objection"}</span>
            </button>

            <button
              onClick={() => setActiveTab("track_objection")}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "track_objection"
                  ? "border-amber-600 text-amber-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>
                {language === "hi"
                  ? `आपत्ति सुनवाई स्थिति (${matchedGrievances.length})`
                  : `Hearing Status & Objections (${matchedGrievances.length})`}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("calculator")}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "calculator"
                  ? "border-[#15803D] text-[#15803D]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>{language === "hi" ? "🧮 मुआवजा सिमुलेटर" : "🧮 What-If Calculator"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ───── 4. Tab 1: Acquisition Status & Dossier ───── */}
      {activeTab === "status" && matchedPlot && (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6 animate-in fade-in duration-200">
          {/* Top Land Record Badge */}
          <div className="rounded-3xl border border-[#BBF7D0] bg-[#F0FDF4] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-base text-slate-900">
                    {matchedPlot.plotNumber}
                  </span>
                  <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-[#BBF7D0] text-[#15803D] font-bold">
                    ULPIN: {matchedPlot.ulpin}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {matchedPlot.village}, {matchedPlot.tehsil} Tehsil · {matchedPlot.district}, {matchedPlot.state}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-2">
              <div className="flex items-center gap-2 justify-start sm:justify-end">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-extrabold text-[#15803D] border border-[#BBF7D0]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {language === "hi" ? "गजट अधिसूचना में सम्मिलित" : "Gazette Notified"}
                </span>
                <Button
                  size="sm"
                  onClick={() => setShowAwardModal(true)}
                  className="h-7 px-2.5 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-[11px] font-bold gap-1 shadow-xs"
                >
                  <Printer className="h-3 w-3" />
                  <span>{language === "hi" ? "आदेश (Form 11)" : "Award Order"}</span>
                </Button>
              </div>
              <p className="text-[11px] text-slate-500">
                Project: <strong className="text-slate-800">{matchedProject.name}</strong>
              </p>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[#E5E0D6] bg-white p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === "hi" ? "अधिसूचित भू-क्षेत्र" : "Notified Area"}
              </span>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                {matchedPlot.areaHectares} Ha
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                ≈ {matchedPlot.areaSqMeters.toLocaleString("en-IN")} sq meters
              </span>
            </div>

            <div className="rounded-2xl border border-[#E5E0D6] bg-white p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === "hi" ? "पंजीकृत भूस्वामी" : "Recorded Owner"}
              </span>
              <div className="text-sm font-extrabold text-slate-900 mt-1 truncate">
                {matchedFamily?.familyHeadName || matchedPlot.ownerName}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                S/o {matchedFamily?.fatherHusbandName || "Recorded Landholder"}
              </span>
            </div>

            <div className="rounded-2xl border border-[#E5E0D6] bg-white p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === "hi" ? "कुल प्रतिकर अधिनिर्णय" : "Total Statutory Award"}
              </span>
              <div className="text-xl font-extrabold text-[#15803D] font-mono mt-1">
                {formatCurrency(matchedPlot.marketValue + (matchedPlot.solatiumAmount || 0))}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">
                100% Solatium included
              </span>
            </div>

            <div className="rounded-2xl border border-[#E5E0D6] bg-white p-4 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === "hi" ? "PFMS भुगतान स्थिति" : "PFMS Payment Status"}
              </span>
              <div className="text-sm font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
                {matchedFamily?.compensationStatus === "fully_paid" ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {language === "hi" ? "पूर्ण भुगतान क्रेडिटेड" : "Credited via PFMS"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                    <Clock className="h-4 w-4 text-amber-600" />
                    {language === "hi" ? "प्रक्रियाधीन" : "Disbursement In Progress"}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Ref: PFMS-2026-{matchedPlot.khasraNumber}
              </span>
            </div>
          </div>

          {/* 12-Stage Statutory Lifecycle Stepper */}
          <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
            <CardHeader className="border-b border-[#F2EFE8] pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#0284C7]" />
                    <span>
                      {language === "hi"
                        ? "12-चरणीय वैधानिक अधिग्रहण प्रगति चक्र (RFCTLARR 2013)"
                        : "12-Stage RFCTLARR Statutory Lifecycle Status"}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    {language === "hi"
                      ? "धारा 4 (SIA) से लेकर धारा 38 (कब्जा व R&R) तक की पारदर्शी वास्तविक स्थिति"
                      : "Transparent end-to-end statutory status from Section 4 SIA through Section 38 Possession"}
                  </CardDescription>
                </div>
                <span className="font-mono text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-full border border-[#BBF7D0]">
                  Stage 7 of 12 (Section 19 Declaration)
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Horizontal / Grid Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {LAMS_12_STAGES.map((stg, idx) => {
                  const stageNum = idx + 1;
                  const isCompleted = stageNum < 7;
                  const isCurrent = stageNum === 7;
                  const isUpcoming = stageNum > 7;

                  return (
                    <div
                      key={stg.code}
                      className={`p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? "border-[#0284C7] bg-[#F0F9FF] shadow-xs ring-2 ring-[#0284C7]/20"
                          : isCompleted
                          ? "border-[#BBF7D0] bg-[#F0FDF4]"
                          : "border-[#E5E0D6] bg-[#FAF8F5] opacity-70"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-500">
                          0{stageNum}
                        </span>
                        {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D]" />}
                        {isCurrent && <span className="h-2 w-2 rounded-full bg-[#0284C7] animate-ping" />}
                      </div>
                      <span className="font-mono font-bold text-[11px] text-slate-900 block truncate">
                        {stg.actRef}
                      </span>
                      <p className="text-[11px] font-medium text-slate-600 line-clamp-2 mt-0.5">
                        {stg.title}
                      </p>
                      <span
                        className={`mt-2 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isCompleted
                            ? "text-[#15803D] bg-white border border-[#BBF7D0]"
                            : isCurrent
                            ? "text-[#0284C7] bg-white border border-[#BAE6FD]"
                            : "text-slate-400 bg-white"
                        }`}
                      >
                        {isCompleted ? "Complete" : isCurrent ? "In Progress" : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Statutory Compensation Breakdown Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Financial Formula Breakdown (7 cols) */}
            <div className="lg:col-span-7">
              <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
                <CardHeader className="border-b border-[#F2EFE8] pb-4">
                  <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Coins className="h-4 w-4 text-[#15803D]" />
                    <span>{language === "hi" ? "वैधानिक प्रतिकर गणना तालिका (प्रथम अनुसूची)" : "Statutory Award Breakdown (First Schedule)"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F2EFE8]">
                    <span className="text-slate-600">
                      {language === "hi" ? "सर्कल दर अनुसार मूल बाजार मूल्य (Sec 26)" : "Base Market Value (Section 26)"}:
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(matchedPlot.marketValue)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#F2EFE8]">
                    <span className="text-slate-600">
                      {language === "hi" ? "ग्रामीण गुणक गुणांक (Multiplier Factor)" : "Rural Multiplier Factor"}:
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      1.00x (National Highway Corridor)
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#F2EFE8]">
                    <span className="text-slate-600">
                      {language === "hi" ? "100% वैधानिक तोषण / Solatium (Sec 30)" : "100% Statutory Solatium (Section 30)"}:
                    </span>
                    <span className="font-mono font-bold text-[#15803D]">
                      + {formatCurrency(matchedPlot.solatiumAmount || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#F2EFE8]">
                    <span className="text-slate-600">
                      {language === "hi" ? "12% प्रतिवर्ष अतिरिक्त बाजार मूल्य ब्याज (Sec 30(3))" : "12% p.a. Additional Interest (Section 30(3))"}:
                    </span>
                    <span className="font-mono font-bold text-[#15803D]">
                      + {formatCurrency(Math.round(matchedPlot.marketValue * 0.12))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 rounded-xl bg-[#DCFCE7]/50 px-3 border border-[#BBF7D0]">
                    <span className="font-bold text-slate-900">
                      {language === "hi" ? "कुल देय अधिनिर्णय प्रतिकर राशि" : "Total Net Compensation Award"}:
                    </span>
                    <span className="font-mono font-extrabold text-sm text-[#15803D]">
                      {formatCurrency(matchedPlot.marketValue + (matchedPlot.solatiumAmount || 0) + Math.round(matchedPlot.marketValue * 0.12))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: R&R Second Schedule Entitlements (5 cols) */}
            <div className="lg:col-span-5">
              <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-sm">
                <CardHeader className="border-b border-[#F2EFE8] pb-4">
                  <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#0284C7]" />
                    <span>{language === "hi" ? "पुनर्वास (R&R) द्वितीय अनुसूची लाभ" : "Rehabilitation & Resettlement Rights"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-[#FAF8F5]">
                    <span className="font-bold text-slate-800 block">
                      {language === "hi" ? "पुनर्वास अनुदान (Resettlement Allowance)" : "One-Time Resettlement Allowance"}
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      ₹50,000 one-time statutory cash grant per affected family under Para 5 of Second Schedule.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-100 bg-[#FAF8F5]">
                    <span className="font-bold text-slate-800 block">
                      {language === "hi" ? "आजीविका संवर्धन सहायता" : "Subsistence Allowance"}
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      ₹3,000 per month for 12 months for families displaced from agriculture.
                    </p>
                  </div>

                  {matchedFamily?.isDisplaced && (
                    <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60">
                      <span className="font-bold text-amber-900 block">
                        {language === "hi" ? "आवासीय भवन आवंटन (DDA Housing)" : "Constructed House Allotment"}
                      </span>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Free constructed pucca flat or ₹1.5 Lakh building assistance for physically displaced families.
                      </p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("objection")}
                    className="w-full text-xs font-bold border-[#0284C7] text-[#0284C7] hover:bg-[#F0F9FF] mt-2"
                  >
                    {language === "hi" ? "मुआवजे अथवा R&R पर आपत्ति दर्ज करें →" : "File Objection on Award or R&R →"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      )}

      {/* ───── 5. Tab 2: File Section 15 Objection ───── */}
      {activeTab === "objection" && matchedPlot && (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 animate-in fade-in duration-200">
          <Card className="border-[#E5E0D6] bg-white rounded-3xl shadow-md">
            <CardHeader className="border-b border-[#F2EFE8] pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Scale className="h-5 w-5 text-[#0284C7]" />
                    <span>{language === "hi" ? "धारा 15 के तहत ऑनलाइन वैधानिक आपत्ति" : "Online Statutory Objection Filing under Section 15"}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    {language === "hi"
                      ? "जिला कलेक्टर / सक्षम प्राधिकारी (CALA) के समक्ष 60-दिवसीय वैधानिक समयसीमा में आपत्ति प्रस्तुत करें"
                      : "Submit formal objection directly to District Collector & CALA within the statutory 60-day window"}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-amber-300 bg-amber-50 text-amber-800 font-bold">
                  60-Day Legal Gate
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleObjectionSubmit} className="space-y-4 text-xs">
                {/* Auto-filled Target Parcel Preview */}
                <div className="rounded-2xl border border-slate-200 bg-[#FAF8F5] p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Target Parcel
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {matchedPlot.plotNumber} · {matchedPlot.village}, {matchedPlot.district}
                    </span>
                  </div>
                  <div className="text-right font-mono text-[11px] text-slate-500">
                    ULPIN: {matchedPlot.ulpin}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">
                      {language === "hi" ? "भूस्वामी / दावेदार का नाम *" : "Claimant / Landowner Full Name *"}
                    </label>
                    <Input
                      value={claimantName}
                      onChange={(e) => setClaimantName(e.target.value)}
                      required
                      className="bg-[#FAF8F5] border-[#E5E0D6] text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">
                      {language === "hi" ? "मोबाइल नंबर (SMS/WhatsApp अलर्ट हेतु) *" : "Mobile Number (for SMS/WhatsApp Alerts) *"}
                    </label>
                    <Input
                      type="tel"
                      value={claimantPhone}
                      onChange={(e) => setClaimantPhone(e.target.value)}
                      required
                      className="bg-[#FAF8F5] border-[#E5E0D6] text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">
                    {language === "hi" ? "आपत्ति का वैधानिक आधार (Ground of Objection) *" : "Statutory Grounds of Objection *"}
                  </label>
                  <select
                    value={objectionGround}
                    onChange={(e) => setObjectionGround(e.target.value as GrievanceCategory)}
                    className="w-full rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] p-2.5 text-xs font-semibold text-slate-800 focus:border-[#0284C7] focus:outline-none cursor-pointer"
                  >
                    <option value="valuation_inadequate">
                      Circle Rate & Market Valuation Inadequate (Section 26 Challenge)
                    </option>
                    <option value="measurement_boundary_dispute">
                      Measurement, Area & Boundary Demarcation Error in Sajra
                    </option>
                    <option value="multi_crop_food_security">
                      Multi-Crop Irrigated Land (Food Security Exemption under Section 10)
                    </option>
                    <option value="omission_of_claimant">
                      Omission of Legal Co-sharer, Tenant or Title Shareholder
                    </option>
                    <option value="rr_entitlement_dispute">
                      Rehabilitation & Resettlement (R&R) Housing/Grant Omission
                    </option>
                    <option value="public_purpose_challenge">
                      Challenge to Public Purpose & Alignment Feasibility (Section 15(1))
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">
                    {language === "hi" ? "विस्तृत आपत्ति विवरण एवं साक्ष्य *" : "Statement of Grounds & Facts *"}
                  </label>
                  <textarea
                    rows={4}
                    value={objectionDetails}
                    onChange={(e) => setObjectionDetails(e.target.value)}
                    placeholder={
                      language === "hi"
                        ? "कलेक्टर महोदय के व्यक्तिगत सुनवाई हेतु अपनी आपत्ति के मुख्य बिंदु एवं साक्ष्य यहाँ स्पष्ट करें..."
                        : "Detail the specific grounds for Collector's personal hearing, citing registered circle rates or demarcation issues..."
                    }
                    required
                    className="w-full rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                {/* Upload Zone */}
                <div className="rounded-2xl border border-dashed border-[#BAE6FD] bg-[#F0F9FF] p-4 text-center">
                  <Upload className="mx-auto h-6 w-6 text-[#0284C7] mb-1.5" />
                  <span className="text-xs font-bold text-slate-900 block">
                    {language === "hi" ? "राजस्व खतौनी / बैनामा / साक्ष्य दस्तावेज संलग्न करें" : "Attach Supporting Documents (Khatauni / Sale Deed / Map)"}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {attachedFileName ? `Attached: ${attachedFileName}` : "PDF, JPG up to 15MB"}
                  </span>
                  <input
                    type="file"
                    id="obj-file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setAttachedFileName(e.target.files[0].name);
                    }}
                  />
                  <label
                    htmlFor="obj-file"
                    className="mt-2 inline-block px-3 py-1 rounded-xl bg-white border border-[#BAE6FD] text-xs font-bold text-[#0284C7] hover:bg-sky-50 cursor-pointer shadow-xs"
                  >
                    {language === "hi" ? "दस्तावेज चुनें" : "Select Document"}
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmittingObjection}
                  className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {isSubmittingObjection ? (
                    <span>{language === "hi" ? "आपत्ति दर्ज की जा रही है..." : "Registering Objection with CALA..."}</span>
                  ) : (
                    <span>{language === "hi" ? "धारा 15 के तहत वैधानिक आपत्ति प्रस्तुत करें →" : "Submit Statutory Objection under Section 15 →"}</span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      )}

      {/* ───── 6. Tab 3: Track Filed Objections & Hearings ───── */}
      {activeTab === "track_objection" && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 animate-in fade-in duration-200 space-y-4">
          {submittedGrievance && (
            <div className="rounded-2xl border border-[#BBF7D0] bg-[#DCFCE7]/60 p-4 text-xs text-emerald-900 flex items-start gap-3 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-[#15803D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm">
                  {language === "hi" ? "आपत्ति सफलतापूर्वक दर्ज कर ली गई है!" : "Objection Registered Successfully!"}
                </h4>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Reference ID: <strong className="font-mono text-slate-900">{submittedGrievance.id}</strong> · Hearing notice has been issued to the District Collectorate Camp Office. SMS alert sent to {submittedGrievance.claimantPhone}.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              {language === "hi" ? "दर्ज की गई वैधानिक आपत्तियों की स्थिति" : "Registered Statutory Objections & Hearing Calendar"}
            </h3>
            <span className="text-xs text-slate-500">
              Showing {matchedGrievances.length} filings for this locality
            </span>
          </div>

          <div className="space-y-3">
            {matchedGrievances.map((g) => (
              <Card key={g.id} className="border-[#E5E0D6] bg-white rounded-2xl shadow-xs overflow-hidden">
                <CardHeader className="py-3 px-4 border-b border-[#F2EFE8] bg-[#FAF8F5] flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-[#0284C7]" />
                    <span className="font-mono font-bold text-xs text-[#0284C7]">{g.id}</span>
                    <span className="font-semibold text-xs text-slate-800">· Khasra {g.khasraNo} ({g.village})</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold uppercase ${
                      g.status === "hearing_scheduled"
                        ? "border-amber-300 bg-amber-50 text-amber-800"
                        : g.status === "under_scrutiny"
                        ? "border-sky-300 bg-sky-50 text-sky-800"
                        : "border-emerald-300 bg-emerald-50 text-emerald-800"
                    }`}
                  >
                    {g.status.replace(/_/g, " ")}
                  </Badge>
                </CardHeader>

                <CardContent className="p-4 text-xs space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <strong className="text-slate-800">Claimant:</strong> {g.claimantName} ({g.claimantPhone})
                    </div>
                    <div>
                      <strong className="text-slate-800">Filed On:</strong> {g.filedAt}
                    </div>
                  </div>

                  <p className="text-slate-700 bg-[#FAF8F5] p-2.5 rounded-xl border border-slate-100 italic">
                    "{g.groundsDescription}"
                  </p>

                  {g.hearingDate && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-amber-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Clock className="h-3.5 w-3.5 text-amber-700" />
                        <span>Scheduled Hearing: {g.hearingDate}</span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        <strong>Presiding Authority:</strong> {g.hearingOfficer}
                      </p>
                      <p className="text-[11px] text-amber-800">
                        <strong>Venue:</strong> {g.hearingVenue}
                      </p>
                    </div>
                  )}

                  {g.officialRemarks && (
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-[#F2EFE8]">
                      <strong>Official Scrutiny Remarks:</strong> {g.officialRemarks}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      )}

      {/* ───── Tab 4: What-If Statutory Compensation Calculator ───── */}
      {activeTab === "calculator" && (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 animate-in fade-in duration-200">
          <CompensationCalculator
            initialArea={matchedPlot?.areaHectares || 1.84}
            initialCircleRate={matchedPlot?.marketRatePerHa || 7000000}
            initialMultiplier={1.5}
            initialAssets={1250000}
            lang={language}
          />
        </main>
      )}

      {/* ───── 7. Statutory Rights Legal Explainer Footer ───── */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pt-12">
        <div className="rounded-3xl border border-[#E5E0D6] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#15803D] font-bold text-sm">
            <ShieldCheck className="h-5 w-5" />
            <span>
              {language === "hi"
                ? "RFCTLARR अधिनियम 2013 के अंतर्गत नागरिक अधिकार"
                : "Your Statutory Rights Under RFCTLARR Act 2013"}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#F2EFE8]">
              <strong className="text-slate-900 block mb-1">
                {language === "hi" ? "1. उचित मुआवजा गारंटी" : "1. Fair Compensation Guarantee"}
              </strong>
              {language === "hi"
                ? "ग्रामीण क्षेत्रों में बाजार मूल्य का 2x से 4x तक गुणक, साथ ही 100% तोषण (Solatium) व 12% वार्षिक अतिरिक्त ब्याज अनिवार्य है।"
                : "Mandatory 2x to 4x market value multiplier in rural areas, plus 100% Solatium and 12% annual interest."}
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#F2EFE8]">
              <strong className="text-slate-900 block mb-1">
                {language === "hi" ? "2. धारा 15 आपत्ति का अधिकार" : "2. Section 15 Hearing Right"}
              </strong>
              {language === "hi"
                ? "धारा 11 प्रारंभिक अधिसूचना के 60 दिनों के भीतर सीमांकन त्रुटि अथवा अपर्याप्त सर्कल दर के विरुद्ध कलेक्टर समक्ष व्यक्तिगत सुनवाई का कानूनी अधिकार।"
                : "Legal right to be personally heard by the Collector within 60 days of preliminary notification regarding demarcation or circle rates."}
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#F2EFE8]">
              <strong className="text-slate-900 block mb-1">
                {language === "hi" ? "3. बिना भुगतान कब्जा निषेध (Sec 38)" : "3. No Possession Without Full Pay (Sec 38)"}
              </strong>
              {language === "hi"
                ? "धारा 38 के अंतर्गत जब तक पूर्ण प्रतिकर एवं पुनर्वास भत्ता आपके बैंक खाते में जमा नहीं हो जाता, तब तक भूमि का भौतिक कब्जा नहीं लिया जा सकता।"
                : "Possession cannot legally be taken until all compensation and resettlement grants are deposited in the landowner bank account."}
            </div>
          </div>
        </div>
      </footer>

      {/* Official Form 11 Award Decree Print/PDF Modal */}
      {matchedPlot && (
        <StatutoryAwardModal
          isOpen={showAwardModal}
          onClose={() => setShowAwardModal(false)}
          landownerName={matchedFamily?.familyHeadName || matchedPlot.ownerName}
          fatherName={matchedFamily?.fatherHusbandName || "Recorded Landholder"}
          khasraNo={matchedPlot.khasraNumber}
          ulpin={matchedPlot.ulpin}
          village={matchedPlot.village}
          tehsil={matchedPlot.tehsil}
          district={matchedPlot.district}
          state={matchedPlot.state}
          areaHa={matchedPlot.areaHectares}
          marketValue={matchedPlot.marketValue}
          solatium={matchedPlot.solatiumAmount || matchedPlot.marketValue}
          totalAward={
            matchedPlot.marketValue +
            (matchedPlot.solatiumAmount || matchedPlot.marketValue) +
            Math.round(matchedPlot.marketValue * 0.12)
          }
          projectName={matchedProject.name}
        />
      )}
    </div>
  );
}
