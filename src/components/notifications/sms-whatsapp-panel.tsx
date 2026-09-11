"use client";

import React, { useState } from "react";
import {
  X,
  Send,
  MessageSquare,
  Smartphone,
  CheckCheck,
  Clock,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  Building2,
  FileCheck,
} from "lucide-react";
import {
  STATUTORY_TEMPLATES,
  StatutoryTemplate,
  renderNotificationTemplate,
} from "@/lib/notification-templates";
import {
  AffectedFamily,
  NotificationChannel,
  CitizenNotificationLog,
} from "@/types";

interface SmsWhatsappPanelProps {
  isOpen: boolean;
  onClose: () => void;
  family: AffectedFamily | null;
  projectName?: string;
  officerName?: string;
  onNotificationSent?: (log: CitizenNotificationLog) => void;
}

export function SmsWhatsappPanel({
  isOpen,
  onClose,
  family,
  projectName = "NH-48 Greenfield Express Bypass",
  officerName = "District Collector & CALA",
  onNotificationSent,
}: SmsWhatsappPanelProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    STATUTORY_TEMPLATES[0].id
  );
  const [channel, setChannel] = useState<NotificationChannel>("whatsapp");
  const [language, setLanguage] = useState<"hi" | "en">("hi");
  const [customDate, setCustomDate] = useState("28 March 2026");

  // Dispatch simulation states
  const [isSending, setIsSending] = useState(false);
  const [sendStep, setSendStep] = useState<string>("");
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recentLogs, setRecentLogs] = useState<CitizenNotificationLog[]>([]);

  if (!isOpen || !family) return null;

  const currentTemplate =
    STATUTORY_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
    STATUTORY_TEMPLATES[0];

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(family.totalCompensation);

  // Variable values
  const templateVars = {
    name: family.familyHeadName.replace(/\s*\(Demo Landholder\)/, ""),
    khasra: family.parcelId ? family.parcelId.replace("PLT-", "Khasra ") : "DEMO-482",
    village: family.village,
    project: projectName,
    amount: formattedAmount,
    area: `${family.landLost} Ha`,
    date: customDate,
  };

  const renderedText = renderNotificationTemplate(
    currentTemplate,
    templateVars,
    language
  );

  const handleSend = () => {
    setIsSending(true);
    setSentSuccess(false);

    setSendStep("Securing cryptographic token & validating NIC telecom gateway...");

    setTimeout(() => {
      setSendStep(
        channel === "whatsapp"
          ? "Connecting to WhatsApp Business API (Gov.in Gateway)..."
          : channel === "sms"
          ? "Connecting to NIC SMS Gateway (CDAC e-Gov Engine)..."
          : "Disposing concurrent SMS & WhatsApp secure carrier pipes..."
      );
    }, 700);

    setTimeout(() => {
      setSendStep("Delivered to mobile network provider · Awaiting DLR ACK...");
    }, 1400);

    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setSendStep("");

      const newLog: CitizenNotificationLog = {
        id: `NTF-SIM-${Date.now().toString().slice(-5)}`,
        familyId: family.id,
        recipientName: family.familyHeadName,
        recipientPhone: family.phone || "+91 98110 48201",
        channel,
        templateId: currentTemplate.id,
        templateTitle:
          language === "hi" ? currentTemplate.titleHi : currentTemplate.titleEn,
        statutorySection: currentTemplate.section,
        messageText: renderedText,
        language,
        status: "delivered",
        sentAt: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        deliveredAt: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        sentByOfficerName: officerName,
        projectId: family.projectId,
        khasraNo: family.parcelId || "Khasra DEMO",
      };

      setRecentLogs((prev) => [newLog, ...prev]);
      if (onNotificationSent) {
        onNotificationSent(newLog);
      }
    }, 2100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  Citizen Statutory Dispatch Simulator
                </h2>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
                  LIVE NIC-GATEWAY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Landowner Alert Engine under RFCTLARR Act 2013 · Direct to Citizen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body: Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: Config Panel (7 cols) */}
          <div className="lg:col-span-7 p-6 space-y-5 border-r border-slate-100 bg-slate-50/50">
            {/* Recipient Snapshot */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Target Landowner
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3" />
                  RoR & Aadhaar Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {family.familyHeadName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    S/o {family.fatherHusbandName} · {family.village}, {family.district}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md inline-block">
                    {family.phone || "+91 98110 48201"}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {family.parcelId} · {family.landLost} Ha
                  </p>
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Select Statutory Notice Template</span>
                <span className="text-[11px] font-normal text-slate-500">
                  6 templates available
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STATUTORY_TEMPLATES.map((tmpl) => {
                  const isSelected = tmpl.id === selectedTemplateId;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(tmpl.id);
                        setSentSuccess(false);
                      }}
                      className={`text-left p-2.5 rounded-xl border transition-all text-xs ${
                        isSelected
                          ? "border-[#15803D] bg-emerald-50/60 shadow-xs ring-1 ring-[#15803D]"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-[10px] text-[#0284C7] bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                          {tmpl.section}
                        </span>
                        {tmpl.urgency === "high" && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-slate-800 line-clamp-1">
                        {language === "hi" ? tmpl.titleHi : tmpl.titleEn}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Controls: Channel & Language */}
            <div className="grid grid-cols-2 gap-4">
              {/* Channel Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Dispatch Channel
                </label>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-200/80 p-1">
                  <button
                    type="button"
                    onClick={() => setChannel("whatsapp")}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      channel === "whatsapp"
                        ? "bg-white text-emerald-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel("sms")}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      channel === "sms"
                        ? "bg-white text-sky-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    SMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel("both")}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      channel === "both"
                        ? "bg-white text-indigo-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Both
                  </button>
                </div>
              </div>

              {/* Language Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Communication Language
                </label>
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-200/80 p-1">
                  <button
                    type="button"
                    onClick={() => setLanguage("hi")}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      language === "hi"
                        ? "bg-white text-emerald-800 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    हिन्दी (Hindi)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      language === "en"
                        ? "bg-white text-emerald-800 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            {/* Hearing or Notice Date Customizer if applicable */}
            {currentTemplate.id === "TMPL-SEC15-HEARING" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 space-y-1">
                <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-700" />
                  Scheduled Hearing Date (Section 15)
                </label>
                <input
                  type="text"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="e.g., 28 March 2026"
                />
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                disabled={isSending}
                onClick={handleSend}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#15803D] to-[#166534] py-3 text-xs font-bold text-white shadow-md hover:from-[#166534] hover:to-[#14532D] disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Transmitting Official Dispatch via NIC Gateway...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>
                      Transmit {channel === "whatsapp" ? "WhatsApp Notice" : channel === "sms" ? "SMS Alert" : "Dual Dispatch (WA + SMS)"}
                    </span>
                  </>
                )}
              </button>

              {/* Real-time status update banner during sending */}
              {isSending && (
                <div className="rounded-xl bg-slate-900 p-3 text-slate-200 text-xs font-mono flex items-center gap-2.5 animate-pulse">
                  <RefreshCw className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
                  <span>{sendStep}</span>
                </div>
              )}

              {sentSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 flex items-start gap-2.5 animate-in fade-in duration-300">
                  <CheckCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold">
                      Official Dispatch Successfully Delivered to Citizen Handset!
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Statutory Delivery Receipt (ACK): <span className="font-mono font-bold">ACK-2026-DEL-{Date.now().toString().slice(-6)}</span> · Logged under Collectorate Audit Trail.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Phone Mockup Preview (5 cols) */}
          <div className="lg:col-span-5 p-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 border-t lg:border-t-0">
            <div className="w-full max-w-[340px] rounded-[36px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800">
              {/* Phone Camera Notch */}
              <div className="flex justify-center mb-2">
                <div className="h-4 w-28 rounded-full bg-slate-950 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-slate-800" />
                </div>
              </div>

              {/* Phone Screen Container */}
              <div className="overflow-hidden rounded-[26px] bg-[#EFEAE2] min-h-[440px] flex flex-col shadow-inner">
                {channel === "whatsapp" || channel === "both" ? (
                  /* WhatsApp UI Preview */
                  <>
                    {/* WhatsApp Header */}
                    <div className="bg-[#075E54] text-white px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#128C7E] text-white font-bold text-xs border border-white/20">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold leading-none">
                              BhoomiDrishti Gov
                            </span>
                            <span className="text-[10px] text-emerald-200">✓</span>
                          </div>
                          <span className="text-[10px] text-emerald-100 opacity-90 leading-none">
                            Official Gov.in Account
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-200 bg-[#128C7E] px-1.5 py-0.5 rounded">
                        SECURE
                      </span>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-3 flex flex-col justify-end space-y-2 bg-[#EFEAE2] bg-opacity-95">
                      {/* Security Notice Tag */}
                      <div className="mx-auto rounded-md bg-[#FFEECD] px-2.5 py-1 text-center text-[9px] text-[#78613A] shadow-xs max-w-[260px]">
                        🔒 Messages are end-to-end encrypted with NIC Digital Certificate.
                      </div>

                      {/* Message Bubble */}
                      <div className="relative ml-auto max-w-[92%] rounded-2xl rounded-tr-xs bg-[#E7FFDB] p-3 text-xs text-slate-800 shadow-sm border border-[#D0F0C0]">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#075E54] mb-1">
                          <FileCheck className="h-3 w-3" />
                          <span>{currentTemplate.statutoryRef}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-900 whitespace-pre-wrap">
                          {renderedText}
                        </p>
                        <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-slate-500">
                          <span>
                            {new Date().toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                          <CheckCheck className={`h-3 w-3 ${sentSuccess ? "text-sky-600" : "text-slate-400"}`} />
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Bottom Bar */}
                    <div className="bg-[#F0F0F0] px-3 py-2 flex items-center gap-2 border-t border-slate-200">
                      <div className="flex-1 rounded-full bg-white px-3 py-1 text-[10px] text-slate-400">
                        Reply disabled for statutory alerts...
                      </div>
                    </div>
                  </>
                ) : (
                  /* SMS UI Preview */
                  <>
                    {/* SMS Header */}
                    <div className="bg-slate-100 px-3 py-2.5 border-b border-slate-200 text-center">
                      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white font-bold text-xs">
                        GOV
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">
                        VK-BHOOMI-CALA
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Govt of India Land Registry Alert
                      </p>
                    </div>

                    {/* SMS Messages Area */}
                    <div className="flex-1 p-3 flex flex-col justify-end space-y-2 bg-white">
                      <div className="text-center text-[10px] text-slate-400">
                        Today · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>

                      <div className="ml-auto max-w-[92%] rounded-2xl rounded-br-xs bg-[#0284C7] p-3 text-white text-[11px] leading-relaxed shadow-xs">
                        <p className="whitespace-pre-wrap">{renderedText}</p>
                      </div>

                      <div className="text-right text-[10px] text-slate-400">
                        {sentSuccess ? "Delivered via NIC SMS Gateway" : "Ready for Transmission"}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions under Mockup */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-slate-500">
                {renderedText.length} chars · ~{Math.ceil(renderedText.length / 160)} SMS units
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Session Dispatch History */}
        {recentLogs.length > 0 && (
          <div className="border-t border-slate-100 bg-white p-4">
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Session Dispatch Log ({recentLogs.length})</span>
            </h4>
            <div className="max-h-24 overflow-y-auto space-y-1.5">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-700">{log.id}</span>
                    <span className="text-slate-500">→ {log.recipientName}</span>
                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                      {log.channel.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{log.statutorySection}</span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCheck className="h-3.5 w-3.5" /> Delivered at {log.deliveredAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
