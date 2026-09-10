import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, unit: "lakhs" | "crore" = "crore"): string {
  if (unit === "crore") {
    if (amount >= 100) {
      return `₹${(amount).toFixed(1)} Cr`;
    }
    return `₹${amount.toFixed(2)} Cr`;
  }
  return `₹${amount.toFixed(2)} L`;
}

export function formatArea(hectares: number): string {
  if (hectares >= 1000) {
    return `${(hectares / 1000).toFixed(1)}K ha`;
  }
  return `${hectares.toFixed(1)} ha`;
}

export function formatNumber(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)} Cr`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(1)} L`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString("en-IN");
}

export function formatIndianNumber(num: number): string {
  return num.toLocaleString("en-IN");
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: "text-green-400 bg-green-400/10 border-green-400/20",
    on_track: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    in_progress: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    delayed: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    overdue: "text-red-400 bg-red-400/10 border-red-400/20",
    pending: "text-slate-400 bg-slate-400/10 border-slate-400/20",
    acquired: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    notified: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    proposed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    possessed: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    fully_paid: "text-green-400 bg-green-400/10 border-green-400/20",
    partially_paid: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    assessed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    disputed: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  return colors[status] || "text-slate-400 bg-slate-400/10 border-slate-400/20";
}

export function calculateCompensation(
  marketValuePerHectare: number,
  areaHectares: number,
  multiplierFactor: number,
  assetsValue: number
): {
  baseMarketValue: number;
  adjustedMarketValue: number;
  assetsTotal: number;
  solatium: number;
  totalCompensation: number;
} {
  const baseMarketValue = marketValuePerHectare * areaHectares;
  const adjustedMarketValue = baseMarketValue * multiplierFactor;
  const propertyValue = adjustedMarketValue + assetsValue;
  const solatium = propertyValue * 1.0; // 100% solatium per Section 30
  const totalCompensation = propertyValue + solatium;

  return {
    baseMarketValue,
    adjustedMarketValue,
    assetsTotal: assetsValue,
    solatium,
    totalCompensation,
  };
}

export function getDaysRemaining(deadline: string): number {
  const now = new Date();
  const target = new Date(deadline);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getTimelineStatus(
  startDate: string,
  deadline: string,
  completedDate?: string
): "completed" | "on_track" | "at_risk" | "overdue" {
  if (completedDate) return "completed";
  const remaining = getDaysRemaining(deadline);
  const total = getDaysRemaining(deadline) + Math.abs(getDaysRemaining(startDate));
  const progress = total > 0 ? (total - remaining) / total : 1;

  if (remaining < 0) return "overdue";
  if (progress > 0.8 && remaining < 30) return "at_risk";
  return "on_track";
}
