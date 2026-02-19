"use client";

import React from "react";
import { CheckCircle2, Trash2, MoreVertical, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { VoteButtons } from "./VoteButtons";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { formatDistanceToNow } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface AnswerItemProps {
  id: string;
  content: string;
  upVotes: number;
  downVotes: number;
  isAccepted: boolean;
  user: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    image?: string | null;
  };
  createdAt: string;
  currentUserId?: string;
  isOwner?: boolean; // of the question
  canModerate?: boolean; // can accept/delete any
  onVote: (direction: "UP" | "DOWN") => void;
  onAccept: () => void;
  onDelete: () => void;
}

export const AnswerItem = ({
  id,
  content,
  upVotes,
  downVotes,
  isAccepted,
  user,
  createdAt,
  currentUserId,
  isOwner,
  canModerate,
  onVote,
  onAccept,
  onDelete
}: AnswerItemProps) => {
  const isAuthor = currentUserId === user.id;

  return (
    <div className={cn(
      "flex gap-6 sm:gap-10 p-8 rounded-[2rem] border transition-all",
      isAccepted 
        ? "bg-emerald-50/30 border-emerald-100 shadow-[0_8px_30px_rgba(16,185,129,0.05)]" 
        : "bg-white border-slate-50"
    )}>
      {/* Voting Sidebar */}
      <div className="flex flex-col items-center flex-shrink-0">
        <VoteButtons 
          upVotes={upVotes} 
          downVotes={downVotes} 
          onVote={onVote} 
        />
        {isAccepted && (
          <div className="mt-4 text-emerald-600" title="Selected as best answer">
            <CheckCircle2 className="w-8 h-8 fill-emerald-50" />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
              <UserAvatar name={user.name} src={user.image} className="w-10 h-10 rounded-xl" />
              <div className="flex flex-col">
                 <span className="text-sm font-bold text-[#1A3A6B]">{user.firstName} {user.lastName}</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                   {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                 </span>
              </div>
           </div>

           {(isAuthor || canModerate || isOwner) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-slate-100 w-40">
                   {(isOwner || canModerate) && !isAccepted && (
                     <DropdownMenuItem onClick={onAccept} className="text-emerald-600 font-bold text-xs py-2.5 cursor-pointer">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Accept Answer
                     </DropdownMenuItem>
                   )}
                   {(isAuthor || canModerate) && (
                     <DropdownMenuItem onClick={onDelete} className="text-rose-600 font-bold text-xs py-2.5 cursor-pointer">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                     </DropdownMenuItem>
                   )}
                </DropdownMenuContent>
              </DropdownMenu>
           )}
        </div>

        <div className="prose prose-slate max-w-none prose-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
           {content}
        </div>
      </div>
    </div>
  );
};
