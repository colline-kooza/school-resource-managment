"use client";

import React from "react";
import Link from "next/link";
import { 
  FileText, 
  BookOpen, 
  Video, 
  ClipboardCheck, 
  File, 
  Download, 
  Heart,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";

export type ResourceType = "PAST_PAPER" | "NOTES" | "VIDEO" | "ASSIGNMENT" | "OTHER";

interface ResourceCardProps {
  id: string;
  title: string;
  type: ResourceType;
  courseUnitTitle: string;
  year?: number;
  semester?: string;
  downloads: number;
  isBookmarked?: boolean;
  onBookmarkToggle?: (e: React.MouseEvent) => void;
  className?: string;
}

const typeConfigs: Record<ResourceType, { icon: any, color: string, bgColor: string, label: string }> = {
  PAST_PAPER: { 
    icon: FileText, 
    color: "text-rose-600", 
    bgColor: "bg-rose-50",
    label: "Past Paper"
  },
  NOTES: { 
    icon: BookOpen, 
    color: "text-blue-600", 
    bgColor: "bg-blue-50",
    label: "Lecture Notes"
  },
  VIDEO: { 
    icon: Video, 
    color: "text-emerald-600", 
    bgColor: "bg-emerald-50",
    label: "Video Lesson"
  },
  ASSIGNMENT: { 
    icon: ClipboardCheck, 
    color: "text-orange-600", 
    bgColor: "bg-orange-50",
    label: "Assignment"
  },
  OTHER: { 
    icon: File, 
    color: "text-slate-600", 
    bgColor: "bg-slate-50",
    label: "Reference"
  },
};

export function ResourceCard({
  id,
  title,
  type,
  courseUnitTitle,
  year,
  semester,
  downloads,
  isBookmarked,
  onBookmarkToggle,
  className
}: ResourceCardProps) {
  const config = typeConfigs[type] || typeConfigs.OTHER;
  const Icon = config.icon;

  return (
    <div className={cn(
      "group bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col h-full",
      className
    )}>
      <Link href={`/resources/${id}`} className="flex-1">
        {/* Top: Icon Background */}
        <div className={cn("h-32 flex items-center justify-center relative", config.bgColor)}>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm transform group-hover:scale-110 transition-transform duration-300">
            <Icon className={cn("w-8 h-8", config.color)} />
          </div>
          
          {/* Top-right corner tag */}
          <div className="absolute top-4 right-4">
             <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/50 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F4A800]" />
                <span className="text-[10px] font-bold text-[#1A3A6B] uppercase tracking-tighter">Academic</span>
             </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-3">
               <StatusBadge status={type} className={cn("border-none px-2", config.bgColor, config.color)} />
               {year && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{year}</span>}
             </div>
             
             <h3 className="text-lg font-bold text-[#1A3A6B] leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
               {title}
             </h3>
             
             <p className="text-slate-400 text-xs font-bold uppercase tracking-tight mb-4">
               {courseUnitTitle}
             </p>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Download className="w-4 h-4" />
            <span className="text-xs font-bold">{downloads}</span>
          </div>
          {semester && (
            <div className="hidden xs:flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              {semester}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={(e) => {
               e.preventDefault();
               if (onBookmarkToggle) onBookmarkToggle(e);
             }}
             className={cn(
               "p-2 rounded-xl border transition-all active:scale-95",
               isBookmarked 
                ? "bg-orange-50 border-orange-100 text-[#F4A800]" 
                : "bg-white border-slate-100 text-slate-300 hover:text-[#1A3A6B] hover:border-blue-100"
             )}
           >
             <Heart className={cn("w-4 h-4", isBookmarked && "fill-[#F4A800]")} />
           </button>
           
           <Link href={`/resources/${id}`}>
              <div className="p-2 rounded-xl bg-[#1A3A6B] text-white shadow-lg shadow-[#1A3A6B]/20 group-hover:bg-[#F4A800] group-hover:text-[#1A3A6B] group-hover:shadow-[#F4A800]/20 transition-all duration-300">
                <ChevronRight className="w-4 h-4" />
              </div>
           </Link>
        </div>
      </div>
    </div>
  );
}
