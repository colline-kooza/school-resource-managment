"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Trash2, 
  Search,
  CheckCircle2,
  XCircle,
  BarChart3,
  Globe,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export const LecturerQuizzesTable = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    try {
      // In a real app, this would be /api/lecturer/quizzes to only show their own
      const res = await api.get("/api/quizzes"); 
      setQuizzes(res.data.quizzes);
    } catch (e) {
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const handleTogglePublish = async (quizId: string, currentState: boolean) => {
    try {
      await api.patch(`/api/quizzes/${quizId}/publish`, { isPublished: !currentState });
      setQuizzes(prev => prev.map(q => q.id === quizId ? { ...q, isPublished: !currentState } : q));
      toast.success(currentState ? "Quiz unpublished" : "Quiz published!");
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/quizzes/${deleteId}`);
      setQuizzes(prev => prev.filter(q => q.id !== deleteId));
      toast.success("Quiz deleted successfully");
    } catch (e) {
      toast.error("Failed to delete quiz");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
    </div>
  );

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-[#1A3A6B]">Manage Quizzes</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Track student performance & visibility
          </p>
        </div>
        <Link href="/lecturer/quizzes/create">
          <Button className="bg-[#1A3A6B] hover:bg-[#1A3A6B]/90 text-white font-bold rounded-2xl h-12 px-6 shadow-xl shadow-[#1A3A6B]/20">
            <Plus className="mr-2 w-5 h-5" />
            Create New Quiz
          </Button>
        </Link>
      </div>

      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-14 pl-8">Quiz Details</TableHead>
            <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-14">Stats</TableHead>
            <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-14">Efficiency</TableHead>
            <TableHead className="text-[100px] font-bold uppercase text-slate-400 h-14">Status</TableHead>
            <TableHead className="text-right pr-8 h-14"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.map((quiz: any) => (
            <TableRow key={quiz.id} className="group hover:bg-slate-50/50 border-slate-50 transition-colors">
              <TableCell className="pl-8 py-5">
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#1A3A6B] group-hover:text-blue-600 transition-colors">
                    {quiz.title}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    {quiz.difficulty} • {quiz._count.questions} Questions
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#1A3A6B]">{quiz._count.attempts}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Attempts</span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1A3A6B]">--%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Avg. Score</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={quiz.isPublished} 
                    onCheckedChange={() => handleTogglePublish(quiz.id, quiz.isPublished)}
                    className="data-[state=checked]:bg-[#1A3A6B]"
                  />
                  <span className={cn(
                    "text-[10px] font-bold uppercase flex items-center gap-1",
                    quiz.isPublished ? "text-emerald-500" : "text-amber-500"
                  )}>
                    {quiz.isPublished ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {quiz.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-right pr-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-100 rounded-xl">
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-slate-100">
                    <Link href={`/lecturer/quizzes/${quiz.id}/attempts`}>
                      <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer rounded-xl font-bold text-slate-600 hover:text-[#1A3A6B]">
                        <BarChart3 className="w-4 h-4" />
                        View Results
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/lecturer/quizzes/${quiz.id}/edit`}>
                      <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer rounded-xl font-bold text-slate-600 hover:text-blue-600">
                        <Edit3 className="w-4 h-4" />
                        Edit Quiz
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      onClick={() => setDeleteId(quiz.id)}
                      className="flex items-center gap-3 p-3 cursor-pointer rounded-xl font-bold text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Quiz
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {quizzes.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-40 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No quizzes created yet</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmDialog 
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Quiz?"
        description="This will permanently delete the quiz and all associated student attempts. This action cannot be undone."
        confirmLabel="Yes, Delete Permanently"
        cancelLabel="Cancel"
        danger={true}
      />
    </div>
  );
};
