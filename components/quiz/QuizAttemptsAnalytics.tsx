"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  BarChart3, 
  Users, 
  Target, 
  Timer, 
  TrendingUp,
  Download,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { UserAvatar } from "@/components/shared/UserAvatar";
import toast from "react-hot-toast";

export const QuizAttemptsAnalytics = ({ quizId }: { quizId: string }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/quizzes/${quizId}/results`);
        setData(res.data);
      } catch (e) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [quizId]);

  if (loading) return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
      </div>
      <Skeleton className="h-96 w-full rounded-[32px]" />
    </div>
  );

  if (!data) return <div>Data not found</div>;

  const { attempts, summary } = data;

  const exportCSV = () => {
    const headers = ["Student", "Email", "Score", "Result", "Time Taken", "Date"];
    const rows = attempts.map((a: any) => [
      `${a.user.firstName} ${a.user.lastName}`,
      a.user.email,
      `${Math.round(a.score)}%`,
      a.passed ? "Passed" : "Failed",
      `${Math.floor(a.timeTaken / 60)}m ${a.timeTaken % 60}s`,
      format(new Date(a.createdAt), "yyyy-MM-dd")
    ]);

    const csvContent = [headers, ...rows].map((e: any) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `quiz_results_${quizId}.csv`;
    link.click();
  };

  const SummaryCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-2xl", color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-bold text-[#1A3A6B]">{value}</h4>
        <span className="text-xs font-bold text-slate-400">{sub}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 font-Inter">
      {/* Back Link */}
      <Link href="/lecturer/quizzes" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-[#1A3A6B] transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Attempts" 
          value={summary.totalAttempts} 
          sub="Students"
          icon={Users}
          color="bg-blue-50 text-blue-600"
        />
        <SummaryCard 
          title="Average Score" 
          value={`${Math.round(summary.avgScore)}%`} 
          sub="Accuracy"
          icon={TrendingUp}
          color="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard 
          title="Pass Rate" 
          value={`${Math.round(summary.passRate)}%`} 
          sub="Success"
          icon={Target}
          color="bg-[#F4A800]/10 text-[#F4A800]"
        />
        <SummaryCard 
          title="Highest Score" 
          value={`${Math.round(summary.highestScore)}%`} 
          sub="Best Prep"
          icon={BarChart3}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Attempts Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#1A3A6B]">Detailed Student Performance</h3>
          <Button 
            onClick={exportCSV}
            variant="outline" 
            className="h-10 rounded-xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-none bg-slate-50/50">
              <TableHead className="pl-8 text-[10px] font-bold uppercase text-slate-400 h-14">Student</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-14">Performance</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-14">Attempt Stats</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-14">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.map((attempt: any) => (
              <TableRow key={attempt.id} className="border-slate-50 group hover:bg-slate-50/50">
                <TableCell className="pl-8 py-5">
                  <div className="flex items-center gap-4">
                    <UserAvatar src={attempt.user.image} name={`${attempt.user.firstName} ${attempt.user.lastName}`} size="sm" />
                    <div>
                      <p className="text-sm font-bold text-[#1A3A6B]">{attempt.user.firstName} {attempt.user.lastName}</p>
                      <p className="text-xs text-slate-400 font-bold">{attempt.user.email}</p>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      attempt.passed ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                    )}>
                      {attempt.passed ? "Passed" : "Failed"}
                    </div>
                    <span className="text-sm font-bold text-[#1A3A6B]">{Math.round(attempt.score)}%</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-slate-400 font-bold">
                    <Timer className="w-4 h-4" />
                    <span className="text-xs">
                      {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs font-bold text-slate-400 capitalize">
                    {format(new Date(attempt.createdAt), "MMM d, yyyy")}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
