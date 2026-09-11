"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Compass,
  CheckCircle2,
  AlertCircle,
  Building,
  UserCheck,
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { UserRole, JurisdictionLevel } from "@/types";
import { PRESEEDED_USERS } from "@/lib/auth-store";
import { INDIAN_STATES } from "@/lib/mock-data";

type AuthMode = "login" | "signup";
type SubmitPhase = "idle" | "validating" | "success";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login, signup } = useApp();

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // If already logged in, redirect directly to dashboard
  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  // Login Form Fields
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("USR-DIS-NSK");
  const [email, setEmail] = useState("collector.nsk@nic.in");
  const [password, setPassword] = useState("collector123");

  // Signup Form Fields
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupDesignation, setSignupDesignation] = useState("");
  const [signupDept, setSignupDept] = useState("");
  const [signupLevel, setSignupLevel] = useState<JurisdictionLevel>("district");
  const [signupState, setSignupState] = useState("Maharashtra");
  const [signupStateCode, setSignupStateCode] = useState("MH");
  const [signupDistrict, setSignupDistrict] = useState("Nashik");
  const [signupDistrictCode, setSignupDistrictCode] = useState("NSK");
  const [signupProjectId, setSignupProjectId] = useState("PRJ-001");
  const [signupProjectName, setSignupProjectName] = useState("NH-48 Greenfield Express Bypass Corridor");

  // 1-Click quick persona select for evaluation
  const handleSelectPersona = (id: string) => {
    setSelectedPersonaId(id);
    const persona = PRESEEDED_USERS.find((p) => p.id === id);
    if (persona) {
      setEmail(persona.email);
      setPassword("collector123");
      setErrorMessage("");
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitPhase("validating");

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || "Invalid officer credentials.");
        setSubmitPhase("idle");
        return;
      }

      setSubmitPhase("success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch {
      setErrorMessage("Authentication server error. Please try again.");
      setSubmitPhase("idle");
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitPhase("validating");

    let role: UserRole = "district_collector";
    if (signupLevel === "national") role = "central_ministry";
    else if (signupLevel === "state") role = "state_government";
    else if (signupLevel === "district") role = "district_collector";
    else role = "lrb";

    try {
      const res = await signup({
        name: signupName.trim(),
        email: signupEmail.trim(),
        role,
        designation: signupDesignation.trim() || "Administrative Officer",
        department: signupDept.trim() || "Land Acquisition Cell",
        jurisdictionLevel: signupLevel,
        state: signupLevel !== "national" ? signupState : undefined,
        stateCode: signupLevel !== "national" ? signupStateCode : undefined,
        district: signupLevel === "district" || signupLevel === "project" ? signupDistrict : undefined,
        districtCode: signupLevel === "district" || signupLevel === "project" ? signupDistrictCode : undefined,
        projectId: signupLevel === "project" ? signupProjectId : undefined,
        projectName: signupLevel === "project" ? signupProjectName : undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to create account.");
        setSubmitPhase("idle");
        return;
      }

      setSubmitPhase("success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch {
      setErrorMessage("Error during onboarding. Please try again.");
      setSubmitPhase("idle");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#FAF9F6] text-slate-900 font-sans selection:bg-[#0F2942] selection:text-white">
      {/* Top Strip */}
      <div className="bg-[#0F2942] text-white py-1.5 px-4 sm:px-8 text-[11px] font-medium border-b border-[#1E3A5F]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span>Government of India · Ministry of Rural Development · Department of Land Resources</span>
          </div>
          <Link href="/" className="text-slate-300 hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Left Column: Government Information */}
          <div className="md:col-span-5 bg-[#0F2942] text-white p-6 sm:p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-base leading-tight">BhoomiDrishti</div>
                  <div className="text-[10px] text-slate-300">National Land Lifecycle Portal</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <h3 className="font-semibold text-sm text-white">Official Portal Access</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Restricted to authorized officials of Central Ministries, State Revenue Departments,
                  District Collectorates, and Competent Authorities for Land Acquisition (CALA).
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Role-based jurisdictional access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Encrypted departmental audit logging</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-white/10 pt-4">
              For technical support or credentials verification, contact the NIC Nodal Desk at 1800-11-2026.
            </div>
          </div>

          {/* Right Column: Clean Form */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Welcome to BhoomiDrishti
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Official Portal Access · Authenticate with registered government credentials.
              </p>
            </div>

            {/* 1-Click Evaluation Personas for Judges & Testing */}
            <div className="p-3 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#15803D]" />
                  Demo Evaluation Personas
                </span>
                <span className="text-slate-400 font-normal">1-Click Selection</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectPersona("USR-DIS-NSK")}
                  className={`p-2 rounded border text-left transition-colors cursor-pointer ${
                    selectedPersonaId === "USR-DIS-NSK"
                      ? "bg-white border-[#0F2942] ring-1 ring-[#0F2942] font-semibold text-slate-900"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs font-semibold">District Collector &amp; CALA</div>
                  <div className="text-[10px] text-slate-500">Nashik District (12 Parcels)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPersona("USR-NAT-01")}
                  className={`p-2 rounded border text-left transition-colors cursor-pointer ${
                    selectedPersonaId === "USR-NAT-01"
                      ? "bg-white border-[#0F2942] ring-1 ring-[#0F2942] font-semibold text-slate-900"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs font-semibold">Central Ministry (MoRTH)</div>
                  <div className="text-[10px] text-slate-500">Apex National Administration</div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-2.5 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">User ID / Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. collector.nsk@nic.in"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[#0F2942] focus:border-[#0F2942]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Password</label>
                  <span className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[#0F2942] focus:border-[#0F2942]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-slate-300 text-[#0F2942] focus:ring-[#0F2942]"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitPhase !== "idle"}
                className="w-full py-2.5 px-4 rounded-md bg-[#0F2942] hover:bg-[#16385C] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-xs"
              >
                {submitPhase === "validating" ? (
                  <span>Authenticating Credentials...</span>
                ) : submitPhase === "success" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Authorized. Loading Dashboard...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In Securely</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
