"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  ChevronLeft, 
  MessageSquare, 
  User, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { VoteButtons } from "./VoteButtons";
import { AnswerItem } from "./AnswerItem";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { SkeletonCard, SkeletonText } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface QuestionDetailProps {
  id: string;
  currentUserId?: string;
  currentUserRole?: string;
}

const QuestionDetailClient = ({ 
  id, 
  currentUserId,
  currentUserRole 
}: QuestionDetailProps) => {
  const router = useRouter();
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"QUESTION" | "ANSWER" | null>(null);

  const fetchQuestion = async () => {
    try {
      const res = await api.get(`/api/questions/${id}`);
      setQuestion(res.data);
    } catch (err) {
      toast.error("Failed to load question");
      router.push("/qa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const handleVote = async (targetId: string, type: "QUESTION" | "ANSWER", direction: "UP" | "DOWN") => {
    try {
      const url = type === "QUESTION" ? `/api/questions/${id}/vote` : `/api/answers/${targetId}/vote`;
      await api.patch(url, { direction });
      toast.success("Vote registered");
      fetchQuestion();
    } catch (err) {
      // Interceptor handles 401/403/500
    }
  };

  const handleAccept = async (answerId: string) => {
    try {
      await api.patch(`/api/answers/${answerId}/accept`);
      toast.success("Answer accepted as best solution!");
      fetchQuestion();
    } catch (err) {
      // Interceptor handles errors
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !deleteType) return;
    try {
      if (deleteType === "QUESTION") {
        await api.delete(`/api/questions/${id}`);
        toast.success("Question has been permanently removed");
        router.push("/qa");
      } else {
        await api.delete(`/api/answers/${deleteId}`);
        toast.success("Answer deleted");
        fetchQuestion();
      }
    } catch (err) {
      // Handled by interceptor
    } finally {
      setDeleteId(null);
      setDeleteType(null);
    }
  };

  const submitAnswer = async () => {
    if (newAnswer.length < 20) {
      return toast.error("Please provide a more detailed answer (min 20 characters)");
    }
    setIsSubmitting(true);
    try {
      await api.post(`/api/questions/${id}/answers`, { content: newAnswer });
      setNewAnswer("");
      toast.success("Thank you! Your answer has been posted.");
      fetchQuestion();
    } catch (err: any) {
      // Interceptor handles auth/server errors
      if (err.response?.status === 400) {
        toast.error(err.response.data || "Incomplete answer data");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-8">
      <SkeletonCard />
      <SkeletonText lines={10} />
    </div>
  );

  if (!question) return null;

  const canModerate = currentUserRole === "ADMIN" || currentUserRole === "LECTURER";
  const isQuestionOwner = currentUserId === question.userId;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 font-Inter pb-24">
      {/* Navigation */}
      <button 
        onClick={() => router.push("/qa")}
        className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-8 hover:text-[#1A3A6B] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Forums
      </button>

      {/* 1. The Question */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-12 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
         <div className="flex flex-col sm:flex-row gap-10">
            {/* Vote Column */}
            <div className="flex-shrink-0">
               <VoteButtons 
                 upVotes={question.upVotes || 0} 
                 downVotes={question.downVotes || 0} 
                 onVote={(d) => handleVote(id, "QUESTION", d)}
               />
            </div>

            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex flex-wrap gap-2">
                     {question.isResolved && (
                       <StatusBadge status="APPROVED"  />
                     )}
                     <span className="text-[10px] font-bold text-white bg-[#1A3A6B] px-2 py-1 rounded-md uppercase tracking-tighter">
                        {question.courseUnit?.title || "Community"}
                     </span>
                  </div>
                  
                  {(isQuestionOwner || canModerate) && (
                    <Button 
                      onClick={() => { setDeleteId(id); setDeleteType("QUESTION"); }}
                      variant="ghost" 
                      className="text-rose-600 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Question
                    </Button>
                  )}
               </div>

               <h1 className="text-3xl sm:text-4xl font-bold text-[#1A3A6B] leading-tight mb-8">
                  {question.title}
               </h1>

               <div className="prose prose-slate max-w-none font-medium text-slate-600 leading-relaxed mb-10 whitespace-pre-wrap">
                  {question.content}
               </div>

               {/* Meta Bar */}
               <div className="flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-slate-50">
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                           Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                        </span>
                     </div>
                     <div className="flex items-center gap-2 text-slate-400">
                        <Eye className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{question.views} Views</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="text-right flex flex-col items-end">
                        <span className="text-sm font-bold text-[#1A3A6B]">{question.user.firstName} {question.user.lastName}</span>
                        <StatusBadge status={question.user.role} className="border-none px-0 text-[8px] font-bold h-auto opacity-60" />
                     </div>
                     <UserAvatar 
                        src={question.user.image} 
                        name={`${question.user.firstName} ${question.user.lastName}`} 
                        className="w-10 h-10 rounded-xl" 
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 2. Answers Section */}
      <div className="space-y-12">
         <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-bold text-[#1A3A6B] flex items-center gap-3">
               <MessageSquare className="w-6 h-6" /> {question._count.answers} Answers
            </h2>
         </div>

         <div className="space-y-8">
            {question.answers.map((answer: any) => (
              <AnswerItem 
                key={answer.id}
                {...answer}
                currentUserId={currentUserId}
                isOwner={isQuestionOwner}
                canModerate={canModerate}
                onVote={(d) => handleVote(answer.id, "ANSWER", d)}
                onAccept={() => handleAccept(answer.id)}
                onDelete={() => { setDeleteId(answer.id); setDeleteType("ANSWER"); }}
              />
            ))}
         </div>

         {/* Answer Form */}
         <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 mt-16 shadow-sm">
            <h3 className="text-xl font-bold text-[#1A3A6B] mb-6">Your Answer</h3>
            <div className="space-y-6">
               <Textarea 
                 value={newAnswer}
                 onChange={(e) => setNewAnswer(e.target.value)}
                 placeholder="Share your knowledge or solution..."
                 className="min-h-[200px] rounded-2xl border-slate-100 bg-slate-50/50 font-medium p-6 focus:bg-white transition-all text-[#1A3A6B] leading-relaxed"
               />
               <div className="flex justify-end">
                  <Button 
                    disabled={isSubmitting}
                    onClick={submitAnswer}
                    className="h-14 px-10 rounded-2xl bg-[#1A3A6B] text-white hover:bg-[#122b52] font-bold text-lg transition-all shadow-xl shadow-[#1A3A6B]/20"
                  >
                     {isSubmitting ? "Posting..." : "Submit Answer"}
                  </Button>
               </div>
            </div>
         </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog 
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title={deleteType === "QUESTION" ? "Delete Question?" : "Delete Answer?"}
        description={deleteType === "QUESTION" 
          ? "This will remove the question and all associated answers permanently." 
          : "This will permanently remove this answer from the thread."}
        confirmLabel="Yes, Delete"
        danger={true}
      />
    </div>
  );
};

export default QuestionDetailClient;
