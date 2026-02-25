"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, Heart, Share2, MoreHorizontal, Send, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

interface QuestionAsker {
  name: string;
  firstName: string;
  lastName: string;
  image?: string | null;
}

interface Answer {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    firstName: string;
    lastName: string;
    image?: string | null;
  };
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
  answers?: Answer[];
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
  answers = [],
  className
}: QuestionCardProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const queryClient = useQueryClient();

  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await api.post(`/api/answers`, {
        content,
        questionId: id,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reply posted successfully!");
      setReplyContent("");
      setIsReplying(false);
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: () => {
      toast.error("Failed to post reply. Please try again.");
    },
  });

  const handleReplySubmit = () => {
    if (replyContent.trim().length < 5) {
      toast.error("Reply is too short.");
      return;
    }
    replyMutation.mutate(replyContent);
  };

  return (
    <div className={cn(
      "bg-white border-b border-slate-100 p-4 sm:p-5 transition-colors hover:bg-slate-50/30",
      className
    )}>
      <div className="flex gap-3 sm:gap-4">
        {/* Avatar Left */}
        <div className="flex-shrink-0">
          <UserAvatar 
            name={asker.name} 
            src={asker.image} 
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full ring-1 ring-slate-100"
          />
        </div>

        {/* Content Right */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-[#1A3A6B] text-[14px] sm:text-[15px] truncate">
                {asker.firstName} {asker.lastName}
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-slate-400 text-xs whitespace-nowrap">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </span>
              {courseUnit && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-blue-50 text-[#1A3A6B] text-[9px] font-bold rounded-md uppercase tracking-tight hidden sm:inline-block border border-blue-100">
                  {courseUnit}
                </span>
              )}
            </div>
            <button className="text-slate-400 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-slate-100">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Body */}
          <Link href={`/qa/${id}`} className="block group">
            <h3 className="text-base font-bold text-[#1A3A6B] mb-1 group-hover:text-blue-600 transition-colors leading-snug">
              {title}
            </h3>
            <p className="text-slate-600 text-[14px] leading-relaxed mb-3 line-clamp-2">
              {content.replace(/[#*`]/g, "")}
            </p>
          </Link>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
              {tags.map((tag) => (
                <span key={tag} className="text-blue-500 text-xs font-semibold hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between max-w-sm text-slate-500 mb-1">
            <button 
              onClick={(e) => {
                e.preventDefault();
                setIsReplying(!isReplying);
              }}
              className="flex items-center gap-2 hover:text-blue-500 transition-colors group p-1 -ml-1"
            >
              <div className="p-1.5 rounded-full group-hover:bg-blue-50">
                <MessageSquare className="w-[17px] h-[17px]" />
              </div>
              <span className="text-xs font-medium">{answerCount}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-rose-500 transition-colors group p-1">
              <div className="p-1.5 rounded-full group-hover:bg-rose-50">
                <Heart className="w-[17px] h-[17px]" />
              </div>
              <span className="text-xs font-medium">{upVotes - downVotes}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-emerald-500 transition-colors group p-1">
              <div className="p-1.5 rounded-full group-hover:bg-emerald-50">
                <Share2 className="w-[17px] h-[17px]" />
              </div>
              <span className="text-xs font-medium">{views}</span>
            </button>
          </div>

          {/* Latest Replies */}
          {answers.length > 0 && !isReplying && (
            <div className="mt-3 space-y-2.5 border-l border-slate-100 pl-4 py-0.5">
              {answers.slice(0, 3).map((reply) => (
                <div key={reply.id} className="flex gap-2.5 text-xs sm:text-[13px]">
                  <UserAvatar 
                    name={reply.user.name} 
                    src={reply.user.image} 
                    className="w-5 h-5 sm:w-6 h-6 rounded-full mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-[#1A3A6B]">
                        {reply.user.firstName} {reply.user.lastName}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-normal">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
              
              {answerCount > 3 && (
                <Link 
                  href={`/qa/${id}`}
                  className="text-blue-500 text-xs font-semibold hover:underline flex items-center gap-1 pt-0.5"
                >
                  View all {answerCount} replies <ChevronDown className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}

          {/* Inline Reply Form */}
          {isReplying && (
            <div className="mt-3 flex gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex-1 flex flex-col gap-2.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <Textarea 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Post your reply..."
                  className="min-h-[70px] bg-transparent border-none focus-visible:ring-0 p-0 text-[14px] resize-none placeholder:text-slate-400"
                  autoFocus
                />
                <div className="flex justify-end gap-2 items-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsReplying(false)}
                    className="text-slate-500 text-xs font-bold h-8 rounded-full hover:bg-slate-200"
                  >
                    Cancel
                  </Button>
                  <Button 
                    disabled={replyMutation.isPending || replyContent.trim().length === 0}
                    onClick={handleReplySubmit}
                    className="bg-[#1A3A6B] hover:bg-[#122b52] text-white rounded-full px-4 py-0 h-8 text-xs font-bold shadow-none"
                  >
                    {replyMutation.isPending ? "Posting..." : "Reply"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
