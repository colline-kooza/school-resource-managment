import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: "blue" | "gold" | "green" | "red";
  className?: string;
}

const colorMap = {
  blue: "text-[#1A3A6B] bg-blue-50/50",
  gold: "text-[#F4A800] bg-orange-50/50",
  green: "text-emerald-600 bg-emerald-50/50",
  red: "text-rose-600 bg-rose-50/50",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color = "blue",
  className,
}: StatCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-3xl shadow-sm border border-slate-100/60 hover:shadow-md transition-all group", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          <h3 className="text-3xl font-bold text-[#1A3A6B] tracking-tight">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1.5 pt-2">
              <div className={cn(
                "flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[10px] font-bold",
                trend.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {trend.isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {trend.value}%
              </div>
              <span className="text-[10px] text-slate-400 font-medium">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={cn("p-4 rounded-2xl transform group-hover:scale-110 transition-transform", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
