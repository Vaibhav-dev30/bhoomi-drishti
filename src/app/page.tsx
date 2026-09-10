"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Compass,
  CheckCircle2,
  FileCheck2,
  Globe2,
  MapPin,
  Fingerprint,
  Layers,
} from "lucide-react";
import confetti from "canvas-confetti";
import { SpatialGlobe3D } from "@/components/auth/spatial-globe-3d";
import { useApp } from "@/context/app-context";
import { UserRole } from "@/types";

type AuthMode = "login" | "signup";
type SubmitPhase = "idle" | "validating" | "success";

interface DemoRoleOption {
  role: UserRole;
  label: string;
  name: string;
  dept: string;
  email: string;
  badge: string;
  color: string;
}

const DEMO_ROLES: DemoRoleOption[] = [
  {
    role: "district_collector",
    label: "Collector & CALA",
    name: "Shri Jalaj Sharma, IAS",
    dept: "Nashik Revenue Division",
    email: "collector.nashik@nic.in",
    badge: "Sec 11-23 Authority",
    color: "from-amber-500 to-amber-700",
  },
  {
    role: "lrb",
    label: "NHAI / LRB Body",
    name: "Er. Manoj Kumar Sinha",
    dept: "National Highways Authority (NHAI)",
    email: "gm.land@nhai.gov.in",
    badge: "Requiring Body",
    color: "from-cyan-500 to-blue-600",
  },
  {
    role: "central_ministry",
    label: "Central Ministry",
    name: "Smt. Rashmi Verma, IAS",
    dept: "MoRTH Infrastructure Cell",
    email: "js.infra@morth.nic.in",
    badge: "National Oversight",
    color: "from-emerald-500 to-teal-700",
  },
  {
    role: "public",
    label: "Citizen Landowner",
    name: "Rameshwar Patil",
    dept: "Khasra #142/3A, Nashik",
    email: "rameshwar.patil@bhoomi.in",
    badge: "Bhu-Aadhaar ULPIN",
    color: "from-purple-500 to-indigo-600",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useApp();

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>("idle");
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>("district_collector");

  // Form Fields
  const [email, setEmail] = useState("collector.nashik@nic.in");
  const [password, setPassword] = useState("Bhoomi#Gov2026");
  const [fullName, setFullName] = useState("Shri Jalaj Sharma, IAS");
  const [department, setDepartment] = useState("District Revenue Administration");
  const [ulpinId, setUlpinId] = useState("MH-NSK-2026-889104");

  // Quick select preset
  const handleSelectRole = (option: DemoRoleOption) => {
    setSelectedDemoRole(option.role);
    setRole(option.role);
    setEmail(option.email);
    setFullName(option.name);
    setDepartment(option.dept);
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      // 1st burst: Saffron & Gold
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.65, x: 0.65 },
        colors: ["#f59e0b", "#fbbf24", "#d97706", "#ffffff"],
      });

      // 2nd burst: Emerald & Cyan
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 90,
          origin: { y: 0.6, x: 0.7 },
          colors: ["#10b981", "#06b6d4", "#38bdf8", "#ffffff"],
        });
      }, 150);

      // 3rd burst: Sovereign Tricolor
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 120,
          origin: { y: 0.55, x: 0.6 },
          colors: ["#ff9933", "#ffffff", "#138808"],
        });
      }, 300);
    } catch {
      // Fallback if canvas context fails
    }
  };

  // Handle Form Submission with multi-stage animations
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitPhase !== "idle") return;

    // Stage 1: Validating
    setSubmitPhase("validating");

    // Stage 2: Success & Confetti
    setTimeout(() => {
      setSubmitPhase("success");
      triggerConfetti();

      // Stage 3: Smooth Navigation to Dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1100);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050814] text-slate-100 overflow-hidden flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Background Animated Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[25%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent blur-3xl animate-pulse duration-[8000ms]" />
        <div className="absolute -bottom-[20%] right-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tl from-cyan-500/10 via-indigo-600/10 to-transparent blur-3xl animate-pulse duration-[10000ms]" />
        <div className="absolute top-[35%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-emerald-500/5 via-violet-600/5 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-25" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">भूमिदृष्टि</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                GOI • MoRD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              National Land Acquisition & Management System
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            RFCTLARR Act 2013 Statutory Gateway
          </span>
          <span className="font-mono text-[11px] text-slate-500">v2.4 (Bhuvan 3D)</span>
        </div>
      </header>

      {/* Main Dual-Column Content */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-8 lg:px-12 py-6 items-center max-w-7xl mx-auto w-full">
        
        {/* ───── Left Column: 3D Spatial Hologram & Gov Tech Showcase ───── */}
        <motion.div
          className="lg:col-span-6 flex flex-col items-center justify-center text-center lg:text-left relative"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge & Title */}
          <div className="w-full max-w-lg mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-cyan-500/15 to-emerald-500/15 border border-slate-700/80 backdrop-blur-md mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">
                Next-Gen Geospatial Decision Support
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Real-Time Sovereign <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-emerald-400 bg-clip-text text-transparent">
                Land Acquisition
              </span>{" "}
              Intelligence
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto lg:mx-0">
              Interactive 3D Cadastral Spatial Visualizer, automated RFCTLARR statutory clock tracking, and Direct Benefit Transfer (DBT) valuation engine.
            </p>
          </div>

          {/* Interactive 3D Canvas Object */}
          <div className="relative w-full max-w-md h-[340px] sm:h-[400px] my-2">
            <SpatialGlobe3D mode={mode} isSubmitting={submitPhase !== "idle"} />
          </div>

          {/* Live Micro-Metrics strip */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-lg mt-2 pt-4 border-t border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-[10px] text-slate-400 uppercase font-mono">States Active</div>
              <div className="text-lg font-bold text-white mt-0.5">28 + 8 UTs</div>
              <div className="text-[9px] text-emerald-400">100% Online</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Disbursed</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">₹36,750 Cr</div>
              <div className="text-[9px] text-slate-400">PFMS Direct</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Resolution</div>
              <div className="text-lg font-bold text-cyan-400 mt-0.5">±0.05 m</div>
              <div className="text-[9px] text-cyan-300">NavIC / CORS</div>
            </div>
          </div>
        </motion.div>

        {/* ───── Right Column: Interactive Animated Auth Card ───── */}
        <motion.div
          className="lg:col-span-6 flex justify-center w-full"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          <div className="relative w-full max-w-md rounded-3xl border border-slate-800/90 bg-slate-950/70 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-slate-950/80">
            
            {/* Glowing Card Border Accent */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-amber-500/20 via-cyan-500/10 to-transparent pointer-events-none -z-10" />

            {/* Mode Toggle Pills (Login vs Signup) */}
            <div className="relative flex p-1 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`relative flex-1 py-2 text-xs font-semibold rounded-xl transition-all z-10 cursor-pointer ${
                  mode === "login" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {mode === "login" && (
                  <motion.div
                    layoutId="auth-pill-active"
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-md -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span>Portal Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`relative flex-1 py-2 text-xs font-semibold rounded-xl transition-all z-10 cursor-pointer ${
                  mode === "signup" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {mode === "signup" && (
                  <motion.div
                    layoutId="auth-pill-active"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl shadow-md -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span>New Registration</span>
              </button>
            </div>

            {/* Card Heading */}
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>{mode === "login" ? "Authorized Officer Login" : "Entity / Citizen Onboarding"}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {mode === "login"
                  ? "Access statutory dossiers, award calculations & GIS spatial layers."
                  : "Register requisition body, survey agency or citizen Bhu-Aadhaar key."}
              </p>
            </div>

            {/* Quick Demo Role Switcher (For Evaluators & Testing) */}
            {mode === "login" && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Fingerprint className="h-3.5 w-3.5 text-amber-400" />
                    <span>Quick Demo Role Presets:</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">1-Click Auto-Fill</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ROLES.map((demo) => {
                    const isSelected = selectedDemoRole === demo.role;
                    return (
                      <button
                        key={demo.role}
                        type="button"
                        onClick={() => handleSelectRole(demo)}
                        className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-slate-800/90 border-amber-500/60 shadow-md shadow-amber-500/10"
                            : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-white truncate">
                            {demo.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 truncate mt-0.5">
                          {demo.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Form Fields with AnimatePresence */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                        Full Name / Official Designation
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Er. Rajiv Mehta"
                          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl h-11 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                        Department / Requiring Body
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="e.g. Dedicated Freight Corridor (DFCCIL)"
                          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl h-11 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                        ULPIN / Bhu-Aadhaar Parcel ID (Optional)
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={ulpinId}
                          onChange={(e) => setUlpinId(e.target.value)}
                          placeholder="e.g. MH-NSK-2026-889104"
                          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl h-11 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email / Officer ID */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Official Email / Gov NIC ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@nic.in"
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl h-11 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300 block">
                    {mode === "login" ? "Security Key / Password" : "Create Password"}
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline"
                    >
                      OTP Login?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl h-11 pl-10 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* ───── Interactive Submit Button with Multi-Phase Animation ───── */}
              <motion.button
                type="submit"
                disabled={submitPhase !== "idle"}
                whileHover={submitPhase === "idle" ? { scale: 1.015 } : {}}
                whileTap={submitPhase === "idle" ? { scale: 0.975 } : {}}
                className={`relative w-full h-13 mt-4 rounded-xl font-bold text-sm overflow-hidden transition-all shadow-xl cursor-pointer ${
                  submitPhase === "success"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30"
                    : submitPhase === "validating"
                    ? "bg-gradient-to-r from-indigo-600 via-amber-600 to-cyan-600 text-white shadow-amber-500/20"
                    : mode === "login"
                    ? "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 hover:from-amber-400 hover:to-amber-600 shadow-amber-500/25"
                    : "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25"
                }`}
              >
                {/* Background Shimmer Wave */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

                <div className="relative z-10 flex items-center justify-center gap-2">
                  {submitPhase === "validating" ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Validating NIC Token & ULPIN Access...</span>
                    </>
                  ) : submitPhase === "success" ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-white animate-bounce" />
                      <span>Clearance Granted • Launching Portal...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === "login" ? "Enter Sovereign Portal" : "Complete Registration"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            {/* Social / National SSO Authentication */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-3">
                <span>Or authenticate via Government SSO</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectRole(DEMO_ROLES[0]);
                    handleSubmit({ preventDefault: () => {} } as any);
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 text-xs font-medium text-slate-300 transition-all cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>e-Pramaan SSO</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectRole(DEMO_ROLES[3]);
                    handleSubmit({ preventDefault: () => {} } as any);
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 text-xs font-medium text-slate-300 transition-all cursor-pointer"
                >
                  <Fingerprint className="h-4 w-4 text-cyan-400" />
                  <span>DigiLocker</span>
                </button>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="mt-4 text-center">
              <p className="text-[10px] text-slate-500">
                Protected by MeghRaj Cloud Infrastructure & CERT-In Compliance Guidelines.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tricolor Bottom Accent Strip */}
      <div className="relative z-20 tricolor-stripe" />
    </div>
  );
}
