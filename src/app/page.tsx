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
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Compass,
  CheckCircle2,
  MapPin,
  Fingerprint,
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
}

const DEMO_ROLES: DemoRoleOption[] = [
  {
    role: "district_collector",
    label: "Collector & CALA",
    name: "Shri Jalaj Sharma, IAS",
    dept: "Nashik Revenue Division",
    email: "collector.nashik@nic.in",
    badge: "Sec 11-23 Authority",
  },
  {
    role: "lrb",
    label: "NHAI / LRB Body",
    name: "Er. Manoj Kumar Sinha",
    dept: "National Highways Authority (NHAI)",
    email: "gm.land@nhai.gov.in",
    badge: "Requiring Body",
  },
  {
    role: "central_ministry",
    label: "Central Ministry",
    name: "Smt. Rashmi Verma, IAS",
    dept: "MoRTH Infrastructure Cell",
    email: "js.infra@morth.nic.in",
    badge: "National Oversight",
  },
  {
    role: "public",
    label: "Citizen Landowner",
    name: "Rameshwar Patil",
    dept: "Khasra #142/3A, Nashik",
    email: "rameshwar.patil@bhoomi.in",
    badge: "Bhu-Aadhaar ULPIN",
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
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6, x: 0.65 },
        colors: ["#15803d", "#0284c7", "#f59e0b", "#ffffff", "#10b981"],
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 90,
          origin: { y: 0.55, x: 0.65 },
          colors: ["#ff9933", "#ffffff", "#138808"],
        });
      }, 150);
    } catch {
      // Fallback
    }
  };

  // Handle Form Submission with multi-stage animations
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitPhase !== "idle") return;

    setSubmitPhase("validating");

    setTimeout(() => {
      setSubmitPhase("success");
      triggerConfetti();

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }, 1100);
  };

  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen w-full bg-[#FAF8F5] text-slate-900 overflow-y-auto lg:overflow-hidden flex flex-col justify-between selection:bg-[#E0F2FE] selection:text-[#0369A1]">
      
      {/* Light Ambient Pastel Mesh Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#E0F2FE]/60 via-[#DCFCE7]/40 to-transparent blur-3xl" />
        <div className="absolute -bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#FEF3C7]/40 via-[#DCFCE7]/30 to-transparent blur-3xl" />
        <div className="absolute top-[35%] left-[25%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-[#E0F2FE]/30 via-transparent to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#E5E0D6_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      </div>

      {/* ───── Top Header Bar ───── */}
      <header className="relative z-20 flex h-14 shrink-0 items-center justify-between px-6 border-b border-[#E5E0D6] bg-white/90 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] font-bold shadow-xs">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900">भूमिदृष्टि</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                GOI • MoRD
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-slate-500 font-semibold">
              National Land Acquisition & Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] animate-ping" />
            RFCTLARR Act 2013 Gateway
          </span>
          <span className="hidden sm:inline font-mono text-[11px] text-slate-500 font-semibold">v2.4 (Bhuvan 3D)</span>
        </div>
      </header>

      {/* ───── Main Viewport Container (Full Screen Fit) ───── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-3 max-w-7xl mx-auto w-full min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-center w-full">
          
          {/* ───── Left Column: 3D Spatial Hologram & Info ───── */}
          <motion.div
            className="lg:col-span-6 flex flex-col items-center justify-center text-center lg:text-left relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Title & Badge */}
            <div className="w-full max-w-lg mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E0D6] shadow-xs mb-2">
                <Sparkles className="h-3.5 w-3.5 text-[#15803D]" />
                <span className="text-[11px] font-bold text-slate-700">
                  Next-Gen Sovereign Geospatial Portal
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Real-Time National <br />
                <span className="bg-gradient-to-r from-[#15803D] via-[#0284C7] to-[#0369A1] bg-clip-text text-transparent">
                  Land Acquisition
                </span>{" "}
                Intelligence
              </h1>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed max-w-md mx-auto lg:mx-0 font-medium">
                3D Cadastral Spatial Visualizer, automated RFCTLARR statutory clock tracking, and Direct Benefit Transfer (DBT) valuation engine.
              </p>
            </div>

            {/* Scaled 3D Canvas Container */}
            <div className="relative w-full max-w-sm lg:max-w-md h-[210px] sm:h-[240px] xl:h-[270px] my-1">
              <SpatialGlobe3D mode={mode} isSubmitting={submitPhase !== "idle"} />
            </div>

            {/* Live Micro-Metrics strip */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-md pt-2 border-t border-[#E5E0D6]">
              <div className="p-2.5 rounded-2xl bg-white border border-[#E5E0D6] shadow-xs">
                <div className="text-[9px] text-slate-400 uppercase font-bold">States Active</div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">28 + 8 UTs</div>
                <div className="text-[9px] text-[#15803D] font-semibold">100% Online</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-white border border-[#E5E0D6] shadow-xs">
                <div className="text-[9px] text-slate-400 uppercase font-bold">Disbursed</div>
                <div className="text-sm sm:text-base font-extrabold text-[#15803D] mt-0.5">₹36,750 Cr</div>
                <div className="text-[9px] text-slate-500 font-medium">PFMS Direct</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-white border border-[#E5E0D6] shadow-xs">
                <div className="text-[9px] text-slate-400 uppercase font-bold">Resolution</div>
                <div className="text-sm sm:text-base font-extrabold text-[#0284C7] mt-0.5">±0.05 m</div>
                <div className="text-[9px] text-[#0284C7] font-semibold">NavIC / CORS</div>
              </div>
            </div>
          </motion.div>

          {/* ───── Right Column: Light Auth Card ───── */}
          <motion.div
            className="lg:col-span-6 flex justify-center w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative w-full max-w-md rounded-3xl border border-[#E5E0D6] bg-white p-5 sm:p-6 shadow-xl">
              
              {/* Mode Toggle Pills (Login vs Signup) */}
              <div className="relative flex p-1 rounded-2xl bg-[#F5F2EB] border border-[#E5E0D6] mb-4">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`relative flex-1 py-1.5 text-xs font-bold rounded-xl transition-all z-10 cursor-pointer ${
                    mode === "login" ? "text-[#15803D]" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {mode === "login" && (
                    <motion.div
                      layoutId="auth-pill-active"
                      className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span>Portal Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`relative flex-1 py-1.5 text-xs font-bold rounded-xl transition-all z-10 cursor-pointer ${
                    mode === "signup" ? "text-[#0284C7]" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {mode === "signup" && (
                    <motion.div
                      layoutId="auth-pill-active"
                      className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span>New Registration</span>
                </button>
              </div>

              {/* Card Heading */}
              <div className="mb-3">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>{mode === "login" ? "Authorized Officer Login" : "Entity Registration"}</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {mode === "login"
                    ? "Access statutory dossiers, award calculations & GIS spatial layers."
                    : "Register requisition body, survey agency or citizen Bhu-Aadhaar key."}
                </p>
              </div>

              {/* Quick Demo Role Switcher (For Evaluators) */}
              {mode === "login" && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Fingerprint className="h-3 w-3 text-[#15803D]" />
                      <span>Quick Demo Roles:</span>
                    </span>
                    <span className="text-[10px] text-[#15803D] font-mono font-bold">1-Click Auto-Fill</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {DEMO_ROLES.map((demo) => {
                      const isSelected = selectedDemoRole === demo.role;
                      return (
                        <button
                          key={demo.role}
                          type="button"
                          onClick={() => handleSelectRole(demo)}
                          className={`text-left p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-[#E8F5E9] border-[#16A34A] shadow-xs"
                              : "bg-[#FAF8F5] border-[#E5E0D6] hover:bg-[#F2EFE8]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-slate-900 truncate">
                              {demo.label}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="h-3 w-3 text-[#15803D] shrink-0" />
                            )}
                          </div>
                          <span className="text-[9px] text-slate-500 truncate mt-0.5 font-medium">
                            {demo.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <AnimatePresence mode="wait">
                  {mode === "signup" && (
                    <motion.div
                      key="signup-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-2.5 overflow-hidden"
                    >
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 mb-1 block">
                          Full Name / Official Designation
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Er. Rajiv Mehta"
                            className="w-full bg-[#FAF8F5] border border-[#E5E0D6] rounded-xl h-9 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 mb-1 block">
                          Department / Requiring Body
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="e.g. Dedicated Freight Corridor"
                            className="w-full bg-[#FAF8F5] border border-[#E5E0D6] rounded-xl h-9 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email / Officer ID */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 mb-1 block">
                    Official Email / Gov NIC ID
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@nic.in"
                      className="w-full bg-[#FAF8F5] border border-[#E5E0D6] rounded-xl h-9 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#15803D] transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      {mode === "login" ? "Security Key / Password" : "Create Password"}
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        className="text-[10px] text-[#0284C7] hover:underline font-semibold"
                      >
                        OTP Login?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#FAF8F5] border border-[#E5E0D6] rounded-xl h-9 pl-9 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#15803D] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={submitPhase !== "idle"}
                  whileHover={submitPhase === "idle" ? { scale: 1.01 } : {}}
                  whileTap={submitPhase === "idle" ? { scale: 0.98 } : {}}
                  className={`relative w-full h-11 mt-2.5 rounded-xl font-bold text-xs overflow-hidden transition-all shadow-md cursor-pointer ${
                    submitPhase === "success"
                      ? "bg-[#15803D] text-white"
                      : submitPhase === "validating"
                      ? "bg-[#0284C7] text-white"
                      : mode === "login"
                      ? "bg-[#15803D] hover:bg-[#16A34A] text-white"
                      : "bg-[#0284C7] hover:bg-[#0369A1] text-white"
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {submitPhase === "validating" ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Validating NIC Token & ULPIN...</span>
                      </>
                    ) : submitPhase === "success" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-white" />
                        <span>Clearance Granted • Launching...</span>
                      </>
                    ) : (
                      <>
                        <span>{mode === "login" ? "Enter Sovereign Portal" : "Complete Registration"}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </div>
                </motion.button>
              </form>

              {/* Social / National SSO Authentication */}
              <div className="mt-3.5 pt-3 border-t border-[#E5E0D6]">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectRole(DEMO_ROLES[0]);
                      handleSubmit({ preventDefault: () => {} } as any);
                    }}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] hover:bg-[#F2EFE8] text-[11px] font-bold text-slate-700 transition-all cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-[#15803D]" />
                    <span>e-Pramaan SSO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectRole(DEMO_ROLES[3]);
                      handleSubmit({ preventDefault: () => {} } as any);
                    }}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] hover:bg-[#F2EFE8] text-[11px] font-bold text-slate-700 transition-all cursor-pointer shadow-xs"
                  >
                    <Fingerprint className="h-3.5 w-3.5 text-[#0284C7]" />
                    <span>DigiLocker</span>
                  </button>
                </div>
              </div>

              {/* Bottom Disclaimer */}
              <div className="mt-2.5 text-center">
                <p className="text-[9px] text-slate-400 font-medium">
                  Protected by MeghRaj Cloud Infrastructure & CERT-In Compliance.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ───── Bottom Sovereign Tricolor Line ───── */}
      <div className="relative z-20 tricolor-stripe shrink-0" />
    </div>
  );
}
