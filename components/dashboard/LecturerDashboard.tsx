"use client";

import { StatCard } from "@/components/shared/StatCard";
import { SkeletonCard, SkeletonTable } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Upload, PlusCircle, FileText, Brain, Edit, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function LecturerDashboard({ user }: { user: any }) {
  // Fetch Stats
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["dashboard", "lecturer", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/api/dashboard/lecturer");
      return data;
    }
  });

  // Fetch Recent Uploads
  const { data: recentUploads = [], isLoading: isUploadsLoading } = useQuery({
    queryKey: ["dashboard", "lecturer", "uploads"],
    queryFn: async () => {
      const { data } = await api.get("/api/resources/recent");
      return data.slice(0, 5);
    }
  });

  const loading = isStatsLoading || isUploadsLoading;

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="mb-10">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A3A6B] tracking-tight mb-2">
              Lecturer Panel 🎓
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
              Manage your academic resources, publish new quizzes, and monitor student engagement. 
              Keep your course units updated for the current semester.
            </p>
          </div>
          <div className="hidden md:flex items-center -space-x-3">
             <div className="w-10 h-10 rounded-full bg-[#1A3A6B] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">LC</div>
             <div className="w-10 h-10 rounded-full bg-[#F4A800] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#1A3A6B] shadow-sm">DE</div>
             <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white border-dashed flex items-center justify-center text-slate-400 text-xs shadow-sm hover:border-[#1A3A6B] hover:text-[#1A3A6B] cursor-pointer transition-colors">+</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={Upload}
              label="My Uploads"
              value={stats?.uploadCount || 0}
              color="blue"
            />
            <StatCard
              icon={FileText}
              label="Pending Approval"
              value={stats?.pendingCount || 0}
              color="gold"
            />
            <StatCard
              icon={FileText}
              label="Approved"
              value={stats?.approvedCount || 0}
              color="green"
            />
            <StatCard
              icon={Brain}
              label="My Quizzes"
              value={stats?.quizCount || 0}
              color="red"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Upload Resource", href: "/lecturer/resources/upload", icon: Upload, color: "bg-[#1A3A6B] text-white" },
          { label: "Create Quiz", href: "/lecturer/quizzes/create", icon: PlusCircle, color: "bg-[#F4A800] text-[#1A3A6B]" },
          { label: "Manage Resources", href: "/lecturer/resources", icon: FileText, color: "bg-white text-slate-700 border-slate-200" },
          { label: "Manage Quizzes", href: "/lecturer/quizzes", icon: Brain, color: "bg-white text-slate-700 border-slate-200" },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <Button className={`${action.color} w-full h-16 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-sm hover:scale-[1.02] transition-transform`}>
              <action.icon className="w-5 h-5" />
              {action.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Recent Uploads Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1A3A6B]">Recent Uploads</h2>
          <Link href="/lecturer/resources" className="text-[#F4A800] text-sm font-bold flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6"><SkeletonTable rows={5} /></div>
          ) : recentUploads.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-bold">Resource Title</th>
                  <th className="px-6 py-4 font-bold">Type</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-Inter">
                {recentUploads.map((upload: any) => (
                  <tr key={upload.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#1A3A6B] text-sm">{upload.title}</td>
                    <td className="px-6 py-4"><span className="text-xs font-bold text-slate-500 uppercase">{upload.type}</span></td>
                    <td className="px-6 py-4"><StatusBadge status={upload.status} /></td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-400">{new Date(upload.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400 font-bold">No uploads yet. Start sharing resources!</div>
          )}
        </div>
      </div>
    </div>
  );
}
