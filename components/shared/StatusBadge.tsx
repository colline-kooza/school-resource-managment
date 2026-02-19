import React from "react";
import { cn } from "@/lib/utils";

export type StatusType = "PENDING" | "APPROVED" | "REJECTED" | "RESOLVED" | "PUBLISHED";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  // Statuses
  PENDING: "bg-amber-50 text-amber-600 border-amber-100",
  APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  PUBLISHED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  REJECTED: "bg-rose-50 text-rose-600 border-rose-100",
  RESOLVED: "bg-blue-50 text-blue-600 border-blue-100",
  
  // Resource Types
  PAST_PAPER: "bg-rose-50 text-rose-600 border-rose-100",
  NOTES: "bg-blue-50 text-blue-600 border-blue-100",
  VIDEO: "bg-emerald-50 text-emerald-600 border-emerald-100",
  ASSIGNMENT: "bg-orange-50 text-orange-600 border-orange-100",
  OTHER: "bg-slate-50 text-slate-600 border-slate-100",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();
  const style = statusStyles[normalizedStatus] || "bg-slate-50 text-slate-600 border-slate-100";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
        style,
        className
      )}
    >
      {normalizedStatus}
    </span>
  );
}
