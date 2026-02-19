"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export const QuizTakingInterface = ({ quizId }: { quizId: string }) => {
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch Quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/api/quizzes/${quizId}`);
        setQuiz(res.data);
        if (res.data.timeLimit) {
          setTimeLeft(res.data.timeLimit * 60);
        }
      } catch (error) {
        toast.error("Failed to load quiz");
        router.push("/quizzes");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, router]);

  // Submit Logic
  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const res = await api.post(`/api/quizzes/${quizId}/attempt`, {
        answers,
        timeTaken
      });
      toast.success("Quiz submitted successfully!");
      router.push(`/quizzes/${quizId}/result/${res.data.id}`);
    } catch (error) {
      toast.error("Failed to submit quiz");
      setSubmitting(false);
    }
  }, [quizId, answers, startTime, router, submitting]);

  // Timer Effect
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      toast.error("Time is up! Submitting automatically...");
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  // Unload protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submitting) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave? Your progress will be lost.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitting]);

  if (loading) return (
    <div className="max-w-3xl mx-auto py-20 px-6 space-y-12">
      <Skeleton className="h-4 w-1/4 rounded-full" />
      <Skeleton className="h-10 w-full rounded-2xl" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
      </div>
    </div>
  );

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (option: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  return (
    <div className="max-w-3xl mx-auto py-10 md:py-20 px-6 font-Inter">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
          <div className="w-48">
            <Progress value={progress} className="h-1.5 bg-slate-100" />
          </div>
        </div>

        {timeLeft !== null && (
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-300",
            timeLeft < 60 
              ? "bg-rose-50 text-rose-600 border-rose-100 animate-pulse scale-105" 
              : "bg-slate-50 text-[#1A3A6B] border-slate-100"
          )}>
            <Clock className={cn("w-4 h-4", timeLeft < 60 && "animate-spin-slow")} />
            <span className="text-sm font-bold tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Question Body */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A3A6B] leading-tight mb-10">
          {currentQuestion.questionText}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option: string, idx: number) => {
            const isSelected = answers[currentQuestion.id] === option;
            const label = String.fromCharCode(65 + idx); // A, B, C...

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={cn(
                  "w-full flex items-center gap-4 p-5 rounded-3xl border-2 transition-all duration-200 text-left group",
                  isSelected 
                    ? "bg-[#1A3A6B] border-[#1A3A6B] text-white shadow-xl shadow-[#1A3A6B]/20 scale-[1.01]" 
                    : "bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-colors",
                  isSelected ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600"
                )}>
                  {label}
                </div>
                <span className="text-base font-bold flex-1">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-10">
        <Button
          variant="ghost"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          className="h-12 px-6 rounded-2xl text-slate-400 font-bold hover:bg-slate-50"
        >
          <ChevronLeft className="mr-2 w-5 h-5" />
          Previous
        </Button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
            className="h-12 px-8 rounded-2xl bg-[#F4A800] hover:bg-[#F4A800]/90 text-white font-bold shadow-lg shadow-[#F4A800]/20"
          >
            Submit Quiz
            <Send className="ml-2 w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (!answers[currentQuestion.id]) {
                toast("You haven't selected an answer yet!", { icon: "💡" });
              }
              setCurrentQuestionIndex(prev => prev + 1);
            }}
            className="h-12 px-8 rounded-2xl bg-[#1A3A6B] hover:bg-[#1A3A6B]/90 text-white font-bold shadow-lg shadow-[#1A3A6B]/20"
          >
            Next Question
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Confirmation */}
      <ConfirmDialog 
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleSubmit}
        title="Submit Quiz?"
        description="Are you sure you want to finish and submit your answers? You cannot review them once submitted."
        confirmLabel="Yes, Submit"
        cancelLabel="No, Keep Reviewing"
        danger={false}
      />
    </div>
  );
};
