"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Clock, 
  Target, 
  HelpCircle, 
  User, 
  ChevronRight, 
  History,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";

export const QuizDetailClient = ({ quizId }: { quizId: string }) => {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/api/quizzes/${quizId}`);
        setQuiz(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  if (loading) return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">
      <Skeleton className="h-12 w-3/4 rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-3xl" />
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );

  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Quiz Header */}
      <div className="mb-10 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
          <span className="px-4 py-1.5 rounded-full bg-[#1A3A6B]/5 text-[#1A3A6B] text-xs font-bold uppercase tracking-widest border border-[#1A3A6B]/10">
            {quiz.difficulty}
          </span>
          {quiz.courseUnit && (
            <span className="px-4 py-1.5 rounded-full bg-[#F4A800]/5 text-[#F4A800] text-xs font-bold uppercase tracking-widest border border-[#F4A800]/10">
              {quiz.courseUnit.title}
            </span>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1A3A6B] tracking-tight mb-4">
          {quiz.title}
        </h1>
        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
          {quiz.description || "Test your understanding of the course materials with this assessment."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-8">
          {/* Instructions Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#1A3A6B] mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F4A800] rounded-2xl flex items-center justify-center shadow-lg shadow-[#F4A800]/20 text-white">
                <Target className="w-5 h-5" />
              </div>
              Quiz Instructions
            </h3>
            <div className="space-y-4">
              {[
                `Total of ${quiz.questions.length || 0} questions testing key concepts.`,
                quiz.timeLimit ? `You have ${quiz.timeLimit} minutes to complete the quiz.` : "No time limit for this trial.",
                `A score of ${quiz.passMark}% or higher is required to pass.`,
                "Each question has only one correct answer.",
                "Once you submit, you cannot change your answers."
              ].map((text, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-6 h-6 rounded-lg bg-slate-50 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-[#1A3A6B] group-hover:bg-[#1A3A6B] group-hover:text-white transition-colors">
                    {i + 1}
                  </div>
                  <p className="text-slate-600 font-bold text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <Link href={`/quizzes/${quiz.id}/take`}>
              <Button className="w-full h-16 rounded-2xl bg-[#1A3A6B] hover:bg-[#1A3A6B]/90 text-white font-bold text-lg mt-10 shadow-xl shadow-[#1A3A6B]/20 transition-all hover:scale-[1.01] active:scale-[0.99]">
                Start Assessment Now
                <ChevronRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>

          {/* Past Attempt */}
          {quiz.lastAttempt && (
            <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <History className="w-4 h-4" />
                Previous Attempt Summary
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-[#1A3A6B]">
                      {Math.round(quiz.lastAttempt.score)}%
                    </span>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      quiz.lastAttempt.passed ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                    )}>
                      {quiz.lastAttempt.passed ? "Passed" : "Failed"}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 font-bold">
                    Attempted on {format(new Date(quiz.lastAttempt.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>
                <Link href={`/quizzes/${quiz.id}/take`}>
                  <Button variant="ghost" className="text-[#1A3A6B] font-bold hover:bg-slate-100 rounded-xl">
                    View Full Result
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lecturer Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Course Instructor</p>
            <div className="flex items-center gap-4">
              <UserAvatar 
                src={quiz.creator?.image} 
                name={`${quiz.creator?.firstName} ${quiz.creator?.lastName}`}
                size="lg"
              />
              <div>
                <p className="text-sm font-bold text-[#1A3A6B]">
                  {quiz.creator?.firstName} {quiz.creator?.lastName}
                </p>
                <p className="text-xs text-slate-400 font-bold">Lecturer</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#1A3A6B] rounded-[32px] p-6 text-white shadow-xl shadow-[#1A3A6B]/20">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#F4A800]" />
                  <span className="text-sm font-bold opacity-80">Duration</span>
                </div>
                <span className="text-sm font-bold">{quiz.timeLimit ? `${quiz.timeLimit} min` : "Open"}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-[#F4A800]" />
                  <span className="text-sm font-bold opacity-80">Questions</span>
                </div>
                <span className="text-sm font-bold">{quiz.questions.length} total</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#F4A800]" />
                  <span className="text-sm font-bold opacity-80">Students</span>
                </div>
                <span className="text-sm font-bold">{quiz._count.attempts} attempts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
