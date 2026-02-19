"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Eye, CheckCircle2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { formatDistanceToNow } from "date-fns";

interface QuestionAsker {
  name: string;
  firstName: string;
  lastName: string;
  image?: string | null;
}

interface QuestionCardProps {
  id: string;
  title: string;
  content: string;
  tags: string[];
  upVotes: number;
  downVotes: number;
  answerCount: number;
  views: number;
  isResolved: boolean;
  asker: QuestionAsker;
  createdAt: string;
  courseUnit?: string;
  className?: string;
}

export const QuestionCard = ({
  id,
  title,
  content,
  tags,
  upVotes,
  downVotes,
  answerCount,
  views,
  isResolved,
  asker,
  createdAt,
  courseUnit,
  className
}: QuestionCardProps) => {
  const netVotes = upVotes - downVotes;

  return (
    <div className={cn(
      "group bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-10 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]",
      className
    )}>
      {/* 1. Stats Column (SO Style) */}
      <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-start sm:w-20 gap-4 sm:gap-6 flex-shrink-0">
        <div className="flex flex-col items-center">
           <span className={cn(
             "text-lg font-bold",
             netVotes > 0 ? "text-blue-600" : netVotes < 0 ? "text-rose-600" : "text-slate-600"
           )}>
             {netVotes}
           </span>
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Votes</span>
        </div>

        <div className={cn(
          "flex flex-col items-center px-4 py-2 sm:px-0 sm:py-0 rounded-xl sm:rounded-none",
          answerCount > 0 && !isResolved ? "bg-blue-50 text-blue-600" : 
          isResolved ? "bg-emerald-50 text-emerald-600" : "text-slate-400"
        )}>
           <span className="text-lg font-bold">{answerCount}</span>
           <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Answers</span>
        </div>

        <div className="flex flex-col items-center text-slate-400">
           <span className="text-sm font-bold">{views}</span>
           <span className="text-[10px] font-bold uppercase tracking-widest">Views</span>
        </div>
      </div>

      {/* 2. Content Column */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-3">
           <div className="flex items-center gap-2">
              {courseUnit && (
                <span className="text-[10px] font-bold text-white bg-[#1A3A6B] px-2 py-1 rounded-md uppercase tracking-tighter">
                   {courseUnit}
                </span>
              )}
              {isResolved && (
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md border border-emerald-100">
                   <CheckCircle2 className="w-3 h-3" />
                   <span className="text-[10px] font-bold uppercase tracking-tighter">Resolved</span>
                </div>
              )}
           </div>
        </div>

        <Link href={`/qa/${id}`}>
          <h3 className="text-xl font-bold text-[#1A3A6B] group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-tight">
            {title}
          </h3>
        </Link>

        <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">
          {content.replace(/[#*`]/g, "")}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-6">
           {/* Tags */}
           <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all cursor-pointer"
                >
                  {tag}
                </span>
              ))}
           </div>

           {/* Asker Meta */}
           <div className="flex items-center gap-2 ml-auto">
              <div className="text-right flex flex-col items-end">
                 <span className="text-xs font-bold text-[#1A3A6B]">{asker.firstName} {asker.lastName}</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                   {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                 </span>
              </div>
              <UserAvatar 
                name={asker.name} 
                src={asker.image} 
                className="w-8 h-8 rounded-xl ring-2 ring-white"
              />
           </div>
        </div>
      </div>
    </div>
  );
};
