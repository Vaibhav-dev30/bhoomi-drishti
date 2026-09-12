"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  Layers,
  MapPin,
  FileText,
  CreditCard,
  Building,
  Check,
  ChevronRight,
  Compass,
  Scale,
  Users,
  Database,
  BarChart3,
  X,
  Menu,
  FileCheck,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Agency Onboarding Modal State
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardSubmitted, setOnboardSubmitted] = useState(false);
  const [agencyName, setAgencyName] = useState("National Highways Authority of India (NHAI)");
  const [officerName, setOfficerName] = useState("");
  const [officerEmail, setOfficerEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");

  const navItems = [
    { id: "about", label: "About the Platform" },
    { id: "acquisition", label: "Land Acquisition" },
    { id: "cadastral", label: "Cadastral Intelligence" },
    { id: "corridors", label: "Corridor Monitoring" },
    { id: "governance", label: "Governance & Security" },
  ];

  // Scroll spy to update active navbar item and sticky navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 130;
      setIsScrolled(window.scrollY > 20);

      if (window.scrollY < 250) {
        setActiveSection("");
        return;
      }

      const sectionIds = ["about", "acquisition", "cadastral", "corridors", "governance"];
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler with offset for sticky navbar
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 76;
      const elementPosition = element.getBoundingClientRect().top;
      const targetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    setMobileMenuOpen(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] text-slate-900 font-sans selection:bg-[#0F2942] selection:text-white flex flex-col">
      {/* ─────────────────────────────────────────────────────────────
          1. STICKY MAIN NAVBAR (BEGINS DIRECTLY AT TOP OF PAGE)
      ───────────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200 py-3"
            : "bg-white/80 backdrop-blur-sm border-b border-slate-200/80 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Brand - Click to smooth scroll top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center overflow-hidden p-0.5 shrink-0">
              <img src="/logo.png" alt="BhoomiDrishti Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 tracking-tight leading-none group-hover:text-[#0F2942] transition-colors">
                BhoomiDrishti
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-medium text-slate-500 tracking-wide">
                  National Land Lifecycle Portal
                </span>
                <span className="hidden md:inline text-slate-300 text-[10px]">·</span>
                <span className="hidden md:inline text-[9.5px] text-slate-400 font-normal">
                  Government of India
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Center Navigation Links with Scroll-Spy Active Indicator */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`relative py-1.5 text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                    isActive ? "text-[#0F2942]" : "text-slate-600 hover:text-[#0F2942]"
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Subtle, non-flashy green/teal bottom line indicator */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#15803D] rounded-full transition-all duration-250 ${
                      isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right Action: Sign In & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/public"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#15803D]/40 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#15803D] text-xs font-bold transition-all shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
              <span>Citizen Portal</span>
            </Link>

            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#0F2942] hover:bg-[#16385C] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Sign In
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-md animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left py-2 px-3 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                  activeSection === item.id
                    ? "bg-slate-50 text-[#0F2942] border-l-2 border-[#15803D]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0F2942]"
                }`}
              >
                <span>{item.label}</span>
                {activeSection === item.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                )}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#0F2942] text-white text-xs font-semibold shadow-xs"
              >
                Sign In to Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Focused Visual Hierarchy */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-slate-900 tracking-tight leading-[1.18]">
              Empowering Land. <br />
              <span className="text-[#0F2942]">Enabling National Growth.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              BhoomiDrishti brings land acquisition, cadastral intelligence, statutory processes,
              and compensation management together on a unified digital platform for India&apos;s
              infrastructure ecosystem.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F2942] hover:bg-[#16385C] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
              >
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/public"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] text-xs sm:text-sm font-bold shadow-xs transition-colors"
              >
                <span>Citizen Portal (अपनी भूमि जानें)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => scrollToSection("about")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-300 shadow-xs transition-colors cursor-pointer"
              >
                <span>Explore the Platform</span>
              </button>
            </div>

            {/* Credible Statistics Row */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-6">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">3,12,180 Ha</div>
                <div className="text-xs text-slate-500 mt-0.5">Land Acquired</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">₹1,12,450 Cr</div>
                <div className="text-xs text-slate-500 mt-0.5">Compensation Disbursed</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#15803D]">742</div>
                <div className="text-xs text-slate-500 mt-0.5">Districts Integrated</div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean GIS Product Preview Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-md p-3 sm:p-4 space-y-3">
              {/* Product Preview Header Bar */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="font-semibold text-slate-700 ml-2">
                    Cadastral Overlay View · Alipur & Narela, Delhi
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Delhi Infrastructure Corridor
                </span>
              </div>

              {/* GIS Map Image Preview with Clean Vector Overlays */}
              <div className="relative h-[320px] sm:h-[380px] rounded-lg overflow-hidden border border-slate-200">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/drone_orthomosaic.jpg')" }}
                />

                {/* Subtle Corridor Band */}
                <div
                  className="absolute inset-x-0 top-1/4 h-20 -rotate-12 bg-amber-500/20 border-y border-amber-600/50 flex items-center justify-center pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(217,119,6,0.15) 0, rgba(217,119,6,0.15) 8px, transparent 8px, transparent 16px)",
                  }}
                >
                  <span className="bg-white/95 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wide">
                    60m Proposed RoW Corridor
                  </span>
                </div>

                {/* Clean Cadastral Polygon Vectors */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 400">
                  <polygon
                    points="260,110 420,130 380,240 240,210"
                    fill="rgba(16, 185, 129, 0.2)"
                    stroke="#047857"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="420,130 530,150 500,250 380,240"
                    fill="rgba(15, 41, 66, 0.12)"
                    stroke="#0F2942"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Clean Information Pins */}
                <div className="absolute top-24 right-12 bg-white/95 border border-slate-300 shadow-sm rounded-md px-2.5 py-1.5 text-xs pointer-events-none">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Survey No. 482 · 1.84 Ha
                  </div>
                  <div className="text-[10px] text-slate-500">Statutory Award Determined</div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white/95 border border-slate-300 shadow-sm rounded-md px-2.5 py-1 text-[11px] text-slate-700 pointer-events-none">
                  <span>Alignment Chainage: km 142.200 to km 148.600</span>
                </div>
              </div>

              {/* Sober Map Legend */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600/30 border border-emerald-700" />
                    Identified Parcel
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-500/30 border border-amber-600" />
                    Corridor Buffer
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#0F2942]/20 border border-[#0F2942]" />
                    Adjacent Lands
                  </span>
                </div>
                <span className="text-slate-400">NIC BhuNaksha WFS Layer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SECTION: ABOUT THE PLATFORM (scroll-mt-20 for sticky nav)
      ───────────────────────────────────────────────────────────── */}
      <section id="about" className="scroll-mt-20 py-14 px-4 sm:px-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              A unified digital platform for transparent and efficient land lifecycle management
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Connecting central ministries, state revenue departments, and district administrations on a single
              source of truth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1 */}
            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-md bg-emerald-100 text-[#15803D] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Land Records</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrated cadastral maps and ownership records synchronized with State land registers.
              </p>
            </div>

            {/* 2 */}
            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-md bg-blue-100 text-[#0284C7] flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Statutory Processes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured compliance and regulatory approvals aligned with the RFCTLARR Act 2013 framework.
              </p>
            </div>

            {/* 3 */}
            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Compensation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transparent calculation and automated disbursement workflows directly into beneficiary accounts.
              </p>
            </div>

            {/* 4 */}
            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Infrastructure Corridors</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Data-driven acquisition, milestone tracking, and progress monitoring for national corridors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION: LAND ACQUISITION (PROCESS ARCHITECTURE)
      ───────────────────────────────────────────────────────────── */}
      <section id="acquisition" className="scroll-mt-20 py-14 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
            Process Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            One platform. The complete land lifecycle.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            From initial identification to post-possession monitoring, every phase is handled digitally.
          </p>
        </div>

        {/* 5-Step Horizontal Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            {
              step: "01",
              title: "Identify",
              desc: "Corridor overlay on cadastral records to define exact project footprints.",
            },
            {
              step: "02",
              title: "Verify",
              desc: "Field-level ground truthing, ownership verification, and joint measurement surveys.",
            },
            {
              step: "03",
              title: "Acquire",
              desc: "Statutory notifications, public objection hearings, and declaration under the Act.",
            },
            {
              step: "04",
              title: "Compensate",
              desc: "Automated award calculations, solatium rules, and direct benefit transfer (DBT).",
            },
            {
              step: "05",
              title: "Monitor",
              desc: "Possession handover tracking, R&R rehabilitation packages, and audit accountability.",
            },
          ].map((w, idx) => (
            <div
              key={w.step}
              className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2 relative"
            >
              <div className="text-[11px] font-mono font-bold text-slate-400">{w.step}</div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>{w.title}</span>
                {idx < 4 && <ChevronRight className="w-4 h-4 text-slate-400 hidden md:inline" />}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SECTION: CADASTRAL INTELLIGENCE (CAPABILITIES)
      ───────────────────────────────────────────────────────────── */}
      <section id="cadastral" className="scroll-mt-20 py-14 sm:py-16 px-4 sm:px-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
              System Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Enterprise-Grade Land Management Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Designed to meet the stringent technical, legal, and operational standards of Indian public administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#FAF9F6] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Digital Land Acquisition</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Centralized workflows for land identification, verification, and acquisition under applicable
                central and state acquisition statutes.
              </p>
            </div>

            {/* 2 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#FAF9F6] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-[#0F2942] text-white flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Cadastral Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                GIS-enabled parcel visualization, boundary reconciliation, and spatial data integration
                with state BhuNaksha servers.
              </p>
            </div>

            {/* 3 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#FAF9F6] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-[#15803D] text-white flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Statutory Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured processes supporting transparent statutory notifications, gazette publications,
                and objection hearing records.
              </p>
            </div>

            {/* 4 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#FAF9F6] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-800 text-white flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Compensation Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consistent valuation calculation, CALA approvals, and direct benefit transfer (DBT)
                disbursement workflows with zero escrow leakage.
              </p>
            </div>

            {/* 5 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#FAF9F6] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-900 text-white flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Infrastructure Corridors</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrated corridor planning and land requirement monitoring for highways, railways,
                industrial parks, and energy utilities.
              </p>
            </div>

            {/* 6 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#FAF9F6] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-slate-700 text-white flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Analytics &amp; Reporting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Decision-ready executive summaries, statutory compliance dashboards, and official reports
                for administrative reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SECTION: CORRIDOR MONITORING & IMPACT METRICS
      ───────────────────────────────────────────────────────────── */}
      <section id="corridors" className="scroll-mt-20 py-14 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
              Project Execution
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              National Infrastructure Corridors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Sample of central and state infrastructure alignments managed on the platform.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2942] hover:underline"
          >
            <span>Authorized Officer Access</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Corridor 1 */}
          <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500">DL-INFRA-001</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#15803D] text-[11px] font-semibold border border-emerald-200">
                Section 19 Declared
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Delhi Land & Infrastructure Development Project
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Alipur & Narela Localities, North Delhi, NCT of Delhi
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10.5px]">Parcels</span>
                <span className="font-semibold text-slate-900">12 Plots</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">Acquired Area</span>
                <span className="font-semibold text-slate-900">18.42 Ha</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">Disbursed</span>
                <span className="font-semibold text-emerald-700">₹24.85 Cr</span>
              </div>
            </div>
          </div>

          {/* Corridor 2 */}
          <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500">DL-GZB-002</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0284C7] text-[11px] font-semibold border border-blue-200">
                Stage 2 — Land Identification
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Delhi–Ghaziabad Regional Connectivity Project
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Sahibabad, Arthala, Morta &amp; Duhai, Ghaziabad, UP
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10.5px]">Parcels</span>
                <span className="font-semibold text-slate-900">18 Plots</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">Acquired Area</span>
                <span className="font-semibold text-slate-900">26.80 Ha</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">Disbursed</span>
                <span className="font-semibold text-slate-700">₹36.40 Cr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sober Government Statistics Strip */}
        <div className="mt-8 p-6 rounded-xl bg-[#0F2942] text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-white">3,12,180 Ha</div>
              <div className="text-xs text-slate-300 font-medium">Land Acquired</div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">₹1,12,450 Cr</div>
              <div className="text-xs text-slate-300 font-medium">Compensation Disbursed</div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-white">742</div>
              <div className="text-xs text-slate-300 font-medium">Districts Covered</div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-white">28</div>
              <div className="text-xs text-slate-300 font-medium">States &amp; UTs</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SECTION: GOVERNANCE & SECURITY
      ───────────────────────────────────────────────────────────── */}
      <section id="governance" className="scroll-mt-20 py-14 sm:py-16 px-4 sm:px-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
              Enterprise Security
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Built for transparency, security and accountability
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Engineered to adhere to national data protection and sovereign governance standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Shield className="w-4 h-4 text-[#15803D]" />
                <span>Role-Based Access Control</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hierarchical access models spanning Central Ministry, State Revenue, District Collectorates,
                and Competent Authorities (CALA).
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Lock className="w-4 h-4 text-[#15803D]" />
                <span>Secure Authentication</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official email verification, dual-factor security credentials, and integration with
                government identity infrastructure.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <FileText className="w-4 h-4 text-[#15803D]" />
                <span>Cryptographic Audit Trails</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every status change, valuation determination, and payment approval is logged with immutable
                timestamps and digital sign-offs.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Database className="w-4 h-4 text-[#15803D]" />
                <span>Data Integrity &amp; Sync</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct API integration with State land records ensures no divergent parcel records or
                duplicate compensation claims.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Scale className="w-4 h-4 text-[#15803D]" />
                <span>Statutory Compliance</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict enforcement of legal timelines, public consultation rules, and solatium calculations
                stipulated by law.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Users className="w-4 h-4 text-[#15803D]" />
                <span>Controlled Departmental Access</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inter-departmental request routing ensures executing agencies view only authorized
                jurisdictional data footprints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FINAL CTA SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-16 px-4 sm:px-8 bg-[#FAF9F6] border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Transforming India&apos;s land lifecycle through digital governance.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Access BhoomiDrishti to manage land acquisition, records, compensation and infrastructure
            workflows through one secure platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F2942] hover:bg-[#16385C] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <span>Sign In to BhoomiDrishti</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setOnboardSubmitted(false);
                setOnboardingOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-300 shadow-xs transition-colors cursor-pointer"
            >
              <span>Request Agency Access</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. AGENCY ONBOARDING MODAL
      ───────────────────────────────────────────────────────────── */}
      {onboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Request Agency Access</h3>
                <span className="text-xs text-slate-500">Government Infrastructure Authorities</span>
              </div>
              <button
                type="button"
                onClick={() => setOnboardingOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!onboardSubmitted ? (
              <form onSubmit={handleOnboardingSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Infrastructure Agency / Ministry</label>
                  <select
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs"
                  >
                    <option value="NHAI">National Highways Authority of India (NHAI)</option>
                    <option value="DFCCIL">Dedicated Freight Corridor Corporation (DFCCIL)</option>
                    <option value="RAILWAYS">Ministry of Railways (MoR)</option>
                    <option value="NTPC">National Thermal Power Corporation (NTPC)</option>
                    <option value="STATE_PWD">State Public Works Department (PWD)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Authorized Nodal Officer</label>
                  <input
                    type="text"
                    required
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    placeholder="Full Name and Official Designation"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Official Government Email</label>
                  <input
                    type="email"
                    required
                    value={officerEmail}
                    onChange={(e) => setOfficerEmail(e.target.value)}
                    placeholder="e.g. officer@nhai.gov.in"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Corridor / Project Scope</label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Delhi Land & Infrastructure Development Project"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs"
                  />
                </div>

                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                  Upon submission, your credentials will be verified by the Department of Land Resources (DoLR).
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-md bg-[#0F2942] hover:bg-[#16385C] text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Submit Official Request
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Request Submitted Successfully</h4>
                <p className="text-xs text-slate-600">
                  Reference: <span className="font-mono font-bold">REQ-2026-MORTH-8842</span>.
                  An onboarding packet has been routed to {officerEmail || "your official email"}.
                </p>
                <button
                  type="button"
                  onClick={() => setOnboardingOpen(false)}
                  className="px-4 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          10. SOFT TRANSITION TO DARK PANORAMIC FOOTER
      ───────────────────────────────────────────────────────────── */}
      <div className="h-12 sm:h-16 w-full bg-gradient-to-b from-[#FAF9F6] via-[#E8EEF5] to-[#0B2740] pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────────
          11. OFFICIAL GOVERNMENT FOOTER (PANORAMIC BACKDROP)
      ───────────────────────────────────────────────────────────── */}
      <footer className="relative mt-auto overflow-hidden text-xs text-slate-300">
        {/* Full-width Panoramic Aerial Land & Corridor Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/footer_panoramic_land.jpg')",
            backgroundPosition: "center 45%",
          }}
        />

        {/* Strong & Elegant Dark Navy Overlay (#0B2740 at ~82-88% Opacity) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2740]/85 via-[#0B2740]/88 to-[#061828]/95" />

        {/* Subtle Transparent Geospatial / Cadastral Linework Layer (~6% opacity) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="footer-cadastral-grid" width="140" height="140" patternUnits="userSpaceOnUse">
              <path d="M 140 0 L 0 0 0 140" fill="none" stroke="#FFFFFF" strokeWidth="0.7" />
              <line x1="35" y1="0" x2="35" y2="140" stroke="#FFFFFF" strokeWidth="0.3" strokeDasharray="3 3" />
              <line x1="105" y1="0" x2="105" y2="140" stroke="#FFFFFF" strokeWidth="0.3" strokeDasharray="3 3" />
              <line x1="0" y1="45" x2="140" y2="45" stroke="#FFFFFF" strokeWidth="0.3" strokeDasharray="3 3" />
              <line x1="0" y1="95" x2="140" y2="95" stroke="#FFFFFF" strokeWidth="0.3" strokeDasharray="3 3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-cadastral-grid)" />
          {/* Faint cadastral corridor curves */}
          <path
            d="M -60 70 Q 250 30 550 110 T 1150 70 T 1750 120"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.8"
          />
          <path
            d="M -60 140 Q 350 110 750 170 T 1350 130 T 1950 180"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.5"
            strokeDasharray="5 3"
          />
        </svg>

        {/* Foreground Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-10 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Brand & Ministry Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                  <img src="/logo.png" alt="BhoomiDrishti Logo" className="w-full h-full object-contain" />
                </div>
                <div className="font-bold text-white text-base tracking-tight leading-none">
                  BhoomiDrishti
                </div>
              </div>
              <div className="text-[11px] font-medium text-emerald-400">
                National Land Lifecycle Portal
              </div>
              <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
                An initiative of the Government of India. Developed under the Department of Land Resources (DoLR),
                Ministry of Rural Development.
              </p>
            </div>

            {/* Column 2: Portal Sections */}
            <div className="space-y-2.5">
              <div className="font-bold text-white text-xs uppercase tracking-wider">
                Portal Sections
              </div>
              <ul className="space-y-1.5 text-slate-300 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("about")}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    About the Platform
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("acquisition")}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Land Acquisition Workflow
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("cadastral")}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Cadastral Intelligence
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("corridors")}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Corridor Monitoring
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Policy */}
            <div className="space-y-2.5">
              <div className="font-bold text-white text-xs uppercase tracking-wider">
                Legal &amp; Policy
              </div>
              <ul className="space-y-1.5 text-slate-300 text-xs">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Accessibility Statement
                </li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Privacy Policy
                </li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Terms of Use
                </li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Hyperlinking Policy
                </li>
              </ul>
            </div>

            {/* Column 4: Support & Contact */}
            <div className="space-y-2.5">
              <div className="font-bold text-white text-xs uppercase tracking-wider">
                Support &amp; Contact
              </div>
              <ul className="space-y-1.5 text-slate-300 text-xs">
                <li className="text-slate-300">National Informatics Centre Helpdesk</li>
                <li className="text-slate-300">Toll Free: 1800-11-2026</li>
                <li className="text-slate-300">Email: support-bhoomi@nic.in</li>
                <li>
                  <Link
                    href="/public"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-2 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Public Citizen Inquiry</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Area with 1px low-opacity divider */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              © 2026 BhoomiDrishti. An initiative of the Government of India. All rights reserved.
            </div>
            <div>
              Designed &amp; Hosted by National Informatics Centre (NIC)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
