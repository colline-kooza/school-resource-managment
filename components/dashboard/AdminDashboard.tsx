"use client";

import React, { useEffect, useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SkeletonCard, SkeletonTable } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Users, FileText, Brain, HelpCircle, CheckCircle, XCircle, Settings, MapPin, Book, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Stats {
  userCount: number;
  pendingCount: number;
  resourceCount: number;
  quizCount: number;
  questionCount: number;
}

interface PendingResource {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  uploadedBy: { firstName: string; lastName: string };
  course: { code: string };
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch Stats
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["dashboard", "admin", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/api/dashboard/admin");
      return data;
    }
  });

  // Fetch Pending Resources
  const { data: pendingResources = [], isLoading: isResourcesLoading } = useQuery({
    queryKey: ["dashboard", "admin", "pending-resources"],
    queryFn: async () => {
      const { data } = await api.get("/api/resources/recent?status=PENDING");
      return data;
    }
  });

  const loading = isStatsLoading || isResourcesLoading;

  // Action mutation
  const actionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: "APPROVE" | "REJECT" }) => {
      // Theoretical endpoint for resource updates
      await api.patch(`/api/resources/${id}`, { status: action === "APPROVE" ? "APPROVED" : "REJECTED" });
    },
    onSuccess: (_, variables) => {
      toast.success(`Resource ${variables.action === "APPROVE" ? "approved" : "rejected"} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["dashboard", "admin"] });
    },
    onError: () => {
      toast.error("Action failed. Please try again.");
    }
  });

  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
    setActionLoading(id);
    try {
      actionMutation.mutate({ id, action });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="mb-10">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A3A6B] tracking-tight mb-2">
              Admin Control Center ⚡
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
              Global platform management and oversight. Approve new resources, manage users, 
              and monitor system health across all Arapai Campus departments.
            </p>
          </div>
          <div className="hidden md:flex items-center -space-x-3">
             <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">AD</div>
             <div className="w-10 h-10 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">OP</div>
             <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white border-dashed flex items-center justify-center text-slate-400 text-xs shadow-sm hover:border-[#1A3A6B] hover:text-[#1A3A6B] cursor-pointer transition-colors">+</div>
          </div>
        </div>
      </section>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon={Users} label="Total Users" value={stats?.userCount || 0} color="blue" />
            <StatCard icon={FileText} label="Pending Appr." value={stats?.pendingCount || 0} color="gold" />
            <StatCard icon={CheckCircle} label="Verify Resources" value={stats?.resourceCount || 0} color="green" />
            <StatCard icon={Brain} label="Total Quizzes" value={stats?.quizCount || 0} color="red" />
            <StatCard icon={HelpCircle} label="Total Q&A" value={stats?.questionCount || 0} color="blue" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Pending Resources Widget */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1A3A6B]">Pending Approvals</h2>
            <Link href="/admin/resources/pending" className="text-[#F4A800] text-sm font-bold flex items-center gap-1">
              Review All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex-grow">
            {loading ? (
              <div className="p-6"><SkeletonTable rows={3} /></div>
            ) : pendingResources.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {pendingResources.map((res: any) => (
                  <div key={res.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <h3 className="font-bold text-[#1A3A6B]">{res.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase font-bold tracking-tighter">{res.type}</span>
                        <span>{res.course.code}</span>
                        <span>•</span>
                        <span>By {res.uploadedBy?.firstName} {res.uploadedBy?.lastName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Button 
                        size="sm" 
                        onClick={() => handleAction(res.id, "REJECT")}
                        disabled={actionLoading === res.id}
                        className="bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold"
                       >
                         <XCircle className="w-4 h-4 mr-1" />
                         Reject
                       </Button>
                       <Button 
                        size="sm" 
                        onClick={() => handleAction(res.id, "APPROVE")}
                        disabled={actionLoading === res.id}
                        className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl font-bold"
                       >
                         <CheckCircle className="w-4 h-4 mr-1" />
                         Approve
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-slate-300 italic font-medium">
                <CheckCircle className="w-12 h-12 mb-4 opacity-10" />
                All caught up! No pending resources.
              </div>
            )}
          </div>
        </div>

        {/* Quick Navigation grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#1A3A6B]">Management</h2>
          <div className="grid grid-cols-2 gap-3 font-Inter">
            {[
              { label: "Users", href: "/admin/users", icon: Users },
              { label: "Courses", href: "/admin/courses", icon: Book },
              { label: "Campuses", href: "/admin/campuses", icon: MapPin },
              { label: "Settings", href: "/admin/settings", icon: Settings },
            ].map((nav) => (
              <Link key={nav.label} href={nav.href}>
                <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#1A3A6B] hover:shadow-md transition-all group">
                  <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
                    <nav.icon className="w-6 h-6 text-slate-400 group-hover:text-[#1A3A6B]" />
                  </div>
                  <span className="font-bold text-slate-600 group-hover:text-[#1A3A6B] text-sm">{nav.label}</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="bg-[#1A3A6B] rounded-3xl p-8 text-white text-center space-y-4">
            <h4 className="text-lg font-bold">Platform Status</h4>
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold">
               <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
               Systems Optimal
            </div>
            <p className="text-xs text-blue-200/50">Last Backup: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
