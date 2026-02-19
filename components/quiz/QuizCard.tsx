"use client";

import React from "react";
import Link from "next/link";
import { 
  Clock, 
  HelpCircle, 
  Target, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    description?: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    timeLimit?: number;
    passMark: number;
    courseUnit?: { title: string };
    _count: { questions: number };
    attempts?: Array<{ score: number, passed: boolean }>;
  };
}

const difficultyStyles = {
  EASY: "bg-emerald-50 text-emerald-600 border-emerald-100",
  MEDIUM: "bg-amber-50 text-amber-600 border-amber-100",
  HARD: "bg-rose-50 text-rose-600 border-rose-100",
};

export const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const lastAttempt = quiz.attempts?.[0];
  const hasAttempted = !!lastAttempt;

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-2xl hover:shadow-[#1A3A6B]/5 transition-all duration-300 transform hover:-translate-y-1">
      {/* Category & Difficulty */}
      <div className="flex items-center justify-between mb-4">
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          difficultyStyles[quiz.difficulty]
        )}>
          {quiz.difficulty}
        </span>
        {hasAttempted && (
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border",
            lastAttempt.passed ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
          )}>
            {lastAttempt.passed ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            Last: {Math.round(lastAttempt.score)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#1A3A6B] leading-tight mb-2 line-clamp-2">
          {quiz.title}
        </h3>
        {quiz.courseUnit && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {quiz.courseUnit.title}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-8 p-3 bg-slate-50 rounded-2xl">
        <div className="flex flex-col items-center justify-center border-r border-slate-200">
          <Clock className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-[10px] font-bold text-slate-600">
            {quiz.timeLimit ? `${quiz.timeLimit}m` : "No limit"}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-slate-200">
          <HelpCircle className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-[10px] font-bold text-slate-600">
            {quiz._count.questions} Qs
          </span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Target className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-[10px] font-bold text-slate-600">
            {quiz.passMark}% Pass
          </span>
        </div>
      </div>

      {/* Action */}
      <Link href={`/quizzes/${quiz.id}`}>
        <Button 
          className={cn(
            "w-full h-12 rounded-2xl font-bold text-sm transition-all group-hover:scale-[1.02]",
            hasAttempted 
              ? "bg-white border-2 border-[#1A3A6B] text-[#1A3A6B] hover:bg-slate-50" 
              : "bg-[#1A3A6B] text-white hover:bg-[#1A3A6B]/90 shadow-lg shadow-[#1A3A6B]/20"
          )}
        >
          {hasAttempted ? "Retake Quiz" : "Start Quiz"}
          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
};
