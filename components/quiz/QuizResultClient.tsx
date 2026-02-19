"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trophy, 
  Hash,
  Home,
  RotateCcw,
  Info,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const QuizResultClient = ({ quizId, attemptId }: { quizId: string, attemptId: string }) => {
  const router = useRouter();
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/api/quizzes/${quizId}/attempt/${attemptId}`);
        setAttempt(res.data);
      } catch (error: any) {
        if (error.response?.status === 403) {
          toast.error("You are not authorized to view this result");
          router.push("/quizzes");
        } else {
          toast.error("Failed to load result");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [quizId, attemptId, router]);

  if (loading) return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-12">
      <Skeleton className="h-64 w-full rounded-[40px]" />
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-3xl" />)}
      </div>
    </div>
  );

  if (!attempt) return <div className="p-20 text-center">Result not found</div>;

  const { quiz, score, passed, timeTaken, answers } = attempt;
  const correctCount = quiz.questions.filter((q: any) => answers[q.id] === q.correctAnswer).length;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 font-Inter">
      {/* Hero Result Card */}
      <div className={cn(
        "rounded-[48px] p-8 md:p-12 text-center relative overflow-hidden mb-12",
        passed ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"
      )}>
        {/* Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/30 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-xl mb-8">
            {passed ? (
              <Trophy className="w-12 h-12 text-[#F4A800]" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-rose-500" />
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {passed ? "Assessment Passed! 🎉" : "Keep Improving! 💪"}
          </h1>
          <p className="text-lg font-bold opacity-70 mb-10 max-w-lg mx-auto leading-relaxed">
            {passed 
              ? `Congratulations! You've successfully demonstrated your mastery of ${quiz.title}.`
              : "Don't be discouraged. Review the answers below and try again to master this topic."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <div className="bg-white rounded-[32px] px-8 py-6 shadow-sm border border-black/5 min-w-[140px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Score</span>
              <span className="text-3xl font-bold text-[#1A3A6B]">{Math.round(score)}%</span>
            </div>
            <div className="bg-white rounded-[32px] px-8 py-6 shadow-sm border border-black/5 min-w-[140px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time Taken</span>
              <span className="text-3xl font-bold text-[#1A3A6B]">
                {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
              </span>
            </div>
            <div className="bg-white rounded-[32px] px-8 py-6 shadow-sm border border-black/5 min-w-[140px]">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Correct</span>
              <span className="text-3xl font-bold text-[#1A3A6B]">{correctCount}/{quiz.questions.length}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/quizzes">
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-slate-200 text-slate-600 font-extrabold hover:bg-slate-50">
                <Home className="mr-2 w-5 h-5" />
                Back to Portal
              </Button>
            </Link>
            <Link href={`/quizzes/${quiz.id}`}>
              <Button className="h-14 px-8 rounded-2xl bg-[#1A3A6B] hover:bg-[#1A3A6B]/90 text-white font-extrabold shadow-lg shadow-[#1A3A6B]/20">
                <RotateCcw className="mr-2 w-5 h-5" />
                Retake Quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Answer Review Section */}
      <h3 className="text-2xl font-bold text-[#1A3A6B] mb-8 flex items-center gap-3">
        Detailed Answer Review
      </h3>

      <div className="space-y-6">
        {quiz.questions.map((q: any, idx: number) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;

          return (
            <div 
              key={q.id}
              className={cn(
                "rounded-[32px] p-8 border-2 transition-all",
                isCorrect ? "bg-white border-emerald-100 shadow-sm" : "bg-white border-rose-100 shadow-sm"
              )}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-bold",
                  isCorrect ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {idx + 1}
                </div>
                <h4 className="text-lg font-extrabold text-[#1A3A6B] pt-1">
                  {q.questionText}
                </h4>
              </div>

              <div className="space-y-3 ml-14">
                <div className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl font-bold text-sm",
                  isCorrect ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                )}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5 capitalize" /> : <XCircle className="w-5 h-5" />}
                  <span>Your Answer: <span className="underline">{userAnswer || "No answer provided"}</span></span>
                </div>

                {!isCorrect && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Correct Answer: <span className="underline">{q.correctAnswer}</span></span>
                  </div>
                )}

                {q.explanation && (
                  <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-3">
                    <Info className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Instructor Explanation</p>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed italic">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
