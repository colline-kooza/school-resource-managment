"use client";

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VoteButtonsProps {
  upVotes: number;
  downVotes: number;
  userVote?: "UP" | "DOWN" | null;
  onVote: (direction: "UP" | "DOWN") => void;
  isVertical?: boolean;
}

export const VoteButtons = ({
  upVotes,
  downVotes,
  userVote,
  onVote,
  isVertical = true
}: VoteButtonsProps) => {
  const netVotes = upVotes - downVotes;

  return (
    <div className={cn(
      "flex items-center gap-1",
      isVertical ? "flex-col" : "flex-row"
    )}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onVote("UP")}
        className={cn(
          "h-10 w-10 rounded-full transition-all active:scale-90",
          userVote === "UP" 
            ? "bg-blue-50 text-blue-600 hover:bg-blue-100" 
            : "text-slate-400 hover:bg-slate-100"
        )}
      >
        <ChevronUp className={cn("w-6 h-6", userVote === "UP" && "stroke-[3px]")} />
      </Button>
      
      <span className={cn(
        "text-sm font-bold min-w-[20px] text-center",
        netVotes > 0 ? "text-blue-600" : netVotes < 0 ? "text-rose-600" : "text-slate-400"
      )}>
        {netVotes}
      </span>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onVote("DOWN")}
        className={cn(
          "h-10 w-10 rounded-full transition-all active:scale-90",
          userVote === "DOWN" 
            ? "bg-rose-50 text-rose-600 hover:bg-rose-100" 
            : "text-slate-400 hover:bg-slate-100"
        )}
      >
        <ChevronDown className={cn("w-6 h-6", userVote === "DOWN" && "stroke-[3px]")} />
      </Button>
    </div>
  );
};
