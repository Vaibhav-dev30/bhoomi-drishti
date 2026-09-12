"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Building,
  Landmark,
  FileCheck,
  Stamp,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatutoryAwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  landownerName: string;
  fatherName: string;
  khasraNo: string;
  ulpin: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  areaHa: number;
  marketValue: number;
  solatium: number;
  assetsValue?: number;
  additionalInterest?: number;
  totalAward: number;
  projectName: string;
}

export function StatutoryAwardModal({
  isOpen,
  onClose,
  landownerName,
  fatherName,
  khasraNo,
  ulpin,
  village,
  tehsil,
  district,
  state,
  areaHa,
  marketValue,
  solatium,
  assetsValue = 1250000,
  additionalInterest = 1545600,
  totalAward,
  projectName,
}: StatutoryAwardModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const awardDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* Top Floating Action Bar (Not printed) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3 text-slate-700 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <FileCheck className="h-4 w-4 text-[#15803D]" />
            <span>Form 11 — Official Statutory Award Decree (Print / PDF Preview)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold gap-1.5 shadow-sm h-8"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Official Decree / PDF</span>
            </Button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div
          ref={printRef}
          className="flex-1 overflow-y-auto p-6 sm:p-10 font-serif text-slate-900 space-y-6 bg-white print:p-0 print:overflow-visible"
        >
          {/* Government Formal Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <div className="flex items-center justify-center gap-2 mb-1">
              <img src="/logo.png" alt="BhoomiDrishti Official Insignia" className="h-14 w-14 object-contain" />
            </div>
            <h2 className="text-sm font-bold tracking-wider uppercase">
              Government of India · Ministry of Rural Development
            </h2>
            <h3 className="text-xs font-semibold tracking-wide text-slate-700 uppercase">
              Office of the Competent Authority for Land Acquisition (CALA) & District Collectorate
            </h3>
            <p className="text-[11px] font-sans font-medium text-slate-500">
              District {district}, State of {state} · RFCTLARR Act 2013 Statutory Directorate
            </p>
          </div>

          {/* Title of Decree */}
          <div className="text-center space-y-1 my-4">
            <span className="font-sans font-bold text-[10px] tracking-widest text-[#15803D] uppercase bg-[#DCFCE7] px-3 py-0.5 rounded-full border border-[#BBF7D0]">
              STATUTORY AWARD DECREE (FORM 11)
            </span>
            <h1 className="text-base font-bold uppercase tracking-tight text-slate-900">
              Award of Compensation under Sections 23, 26, 29 & 30 of Act 30 of 2013
            </h1>
            <p className="text-xs font-sans text-slate-500">
              Award Case File Ref: <strong className="font-mono text-slate-900">AWD/CALA/2026/K-{khasraNo}</strong> · Gazette Reg: <strong className="font-mono text-slate-900">GZ/DL/DEL/2026/0401</strong>
            </p>
          </div>

          {/* Legal Recital */}
          <p className="text-xs leading-relaxed text-justify font-sans text-slate-700">
            Whereas, the land described in the schedule hereinbelow has been formally notified and declared for public purpose acquisition under Section 11(1) and Section 19(1) of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 for the project entitled <strong>&quot;{projectName}&quot;</strong>. And whereas, having heard all claims and objections under Section 15, the undersigned Competent Authority hereby passes this formal conclusive Award:
          </p>

          {/* Landowner & Cadastral Dossier Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden font-sans text-xs">
            <div className="bg-slate-100 p-2 font-bold text-slate-800 border-b border-slate-300 uppercase tracking-wide text-[11px]">
              Schedule A: Cadastral Particulars & Beneficiary Landholder
            </div>
            <div className="grid grid-cols-2 p-3 gap-y-2 gap-x-4">
              <div>
                <span className="text-slate-500">Beneficiary Landowner:</span>
                <p className="font-bold text-slate-900">{landownerName}</p>
              </div>
              <div>
                <span className="text-slate-500">Father&apos;s / Husband&apos;s Name:</span>
                <p className="font-semibold text-slate-800">S/o {fatherName}</p>
              </div>
              <div>
                <span className="text-slate-500">Khasra / Survey Number:</span>
                <p className="font-mono font-bold text-slate-900">{khasraNo}</p>
              </div>
              <div>
                <span className="text-slate-500">Unique Land Parcel ID (ULPIN):</span>
                <p className="font-mono font-bold text-[#0284C7]">{ulpin}</p>
              </div>
              <div>
                <span className="text-slate-500">Revenue Village & Tehsil:</span>
                <p className="font-semibold text-slate-800">{village}, {tehsil} Tehsil</p>
              </div>
              <div>
                <span className="text-slate-500">Acquired Acreage:</span>
                <p className="font-mono font-bold text-slate-900">{areaHa} Hectares ({Math.round(areaHa * 10000).toLocaleString("en-IN")} sq.m)</p>
              </div>
            </div>
          </div>

          {/* Financial Compensation Schedule */}
          <div className="border border-slate-300 rounded-lg overflow-hidden font-sans text-xs">
            <div className="bg-slate-100 p-2 font-bold text-slate-800 border-b border-slate-300 uppercase tracking-wide text-[11px]">
              Schedule B: Itemized Statutory Valuation & Solatium
            </div>
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 text-slate-600">1. Base Market Value assessed under Section 26(1)</td>
                  <td className="p-2.5 text-right font-mono font-semibold text-slate-900">{formatINR(marketValue)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 text-slate-600">2. Valuation of Attached Assets / Structures / Trees (Section 29)</td>
                  <td className="p-2.5 text-right font-mono font-semibold text-slate-900">{formatINR(assetsValue)}</td>
                </tr>
                <tr className="border-b border-slate-200 bg-emerald-50/50">
                  <td className="p-2.5 font-bold text-emerald-900">
                    3. Statutory 100% Solatium (Mandatory under Section 30(1))
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold text-[#15803D]">{formatINR(solatium)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 text-slate-600">
                    4. 12% p.a. Additional Interest from Gazette Publication (Section 30(3))
                  </td>
                  <td className="p-2.5 text-right font-mono font-semibold text-[#0284C7]">{formatINR(additionalInterest)}</td>
                </tr>
                <tr className="bg-slate-900 text-white">
                  <td className="p-3 font-bold text-sm">
                    TOTAL STATUTORY AWARD (Payable via PFMS Direct Electronic Credit)
                  </td>
                  <td className="p-3 text-right font-mono font-extrabold text-base text-emerald-400">
                    {formatINR(totalAward)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Statutory Affirmation & Signatures */}
          <div className="pt-6 font-sans text-xs border-t border-slate-200 grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mb-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                PFMS Electronic Treasury Verified
              </div>
              <p className="text-[11px] text-slate-500">
                Payment Channel: Direct Benefit Transfer (DBT) to Verified Bank Account via Reserve Bank of India e-Kuber Protocol.
              </p>
              <div className="font-mono text-[10px] text-slate-400 mt-2">
                Digital Hash: e6f8a92b3c4d5e1a7f0c9b · Timestamp: {awardDate}
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="h-10 flex items-center justify-end">
                <span className="font-serif italic font-bold text-slate-700 text-sm border-b border-slate-400 pb-1">
                  Ashwini Kumar, IAS
                </span>
              </div>
              <p className="font-bold text-slate-900 text-xs">
                Competent Authority for Land Acquisition (CALA)
              </p>
              <p className="text-[11px] text-slate-500">
                District Collector & District Magistrate · {district}
              </p>
              <p className="text-[10px] text-slate-400">
                Government of National Capital Territory of Delhi / UP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
