"use client";

import { StatCard } from "@/components/shared/StatCard";
import { SkeletonCard, SkeletonText } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen, HelpCircle, Bookmark, ClipboardList, ArrowRight, ExternalLink, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function StudentDashboard({ user }: { user: any }) {
  // Fetch Stats
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["dashboard", "student", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/api/dashboard/student");
      return data;
    }
  });

  // Fetch Recent Resources
  const { data: resources = [], isLoading: isResourcesLoading } = useQuery({
    queryKey: ["dashboard", "student", "resources", user.courseId],
    queryFn: async () => {
      const { data } = await api.get(`/api/resources/recent?courseId=${user.courseId}`);
      return data;
    }
  });

  // Fetch Announcements
  const { data: announcements = [], isLoading: isAnnouncementsLoading } = useQuery({
    queryKey: ["dashboard", "student", "announcements", user.campusId],
    queryFn: async () => {
      const { data } = await api.get(`/api/announcements/recent?campusId=${user.campusId}`);
      return data;
    }
  });

  const loading = isStatsLoading || isResourcesLoading || isAnnouncementsLoading;

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <section className="mb-10">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-3xl font-bold text-[#163360] tracking-tight mb-2">
              Welcome back, {user.firstName || "Student"} 👋
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
              You are currently enrolled in <span className="text-[#163360] font-bold">Arapai Campus</span>. 
              Explore your course units, access past papers, and prepare for your next quiz.
            </p>
          </div>
          <div className="hidden md:flex items-center -space-x-3">
             <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#163360] shadow-sm">AU</div>
             <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#F4A800] shadow-sm">BU</div>
             <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white border-dashed flex items-center justify-center text-slate-400 text-xs shadow-sm hover:border-[#163360] hover:text-[#163360] cursor-pointer transition-colors">+</div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={BookOpen}
              label="Resources Available"
              value={stats?.resourceCount || 0}
              color="blue"
            />
            <StatCard
              icon={HelpCircle}
              label="My Questions"
              value={stats?.questionCount || 0}
              color="gold"
            />
            <StatCard
              icon={Bookmark}
              label="My Bookmarks"
              value={stats?.bookmarkCount || 0}
              color="green"
            />
            <StatCard
              icon={ClipboardList}
              label="Quizzes Taken"
              value={stats?.attemptCount || 0}
              color="red"
            />
          </>
        )}
      </div>

      {/* Recent Resources */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#163360] tracking-tight">
            Recent Resources
          </h2>
          <Link href="/resources" className="text-[#F4A800] font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-Inter">
            {resources.map((resource: any) => (
              <div key={resource.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 p-2 rounded-lg text-[#163360]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">
                    {resource.type}
                  </span>
                </div>
                <h3 className="font-bold text-[#163360] mb-2 group-hover:text-[#F4A800] transition-colors line-clamp-1">
                  {resource.title}
                </h3>
                <p className="text-xs text-slate-400 mb-4">{resource.course.code} • {resource.course.title}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-slate-500">By {resource.uploadedBy?.firstName || "Anonymous"}</span>
                  <Link href={`/resources/${resource.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-[#163360] hover:bg-blue-50">
                      Access <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No resources found"
            description="There are no approved resources for your course yet. Check back later!"
            actionLabel="Request Resource"
            actionHref="/qa/ask"
          />
        )}
      </div>

      {/* Two Column Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Announcements */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-[#163360] tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#F4A800]" />
            Latest Announcements
          </h2>
          {loading ? (
            <div className="space-y-4">
              <SkeletonText lines={4} />
              <SkeletonText lines={4} />
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((ann: any) => (
                <div key={ann.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-[#163360]">{ann.title}</h3>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{ann.content}</p>
                  <Link href={`/announcements/${ann.id}`} className="text-sm font-bold text-blue-600 hover:underline">
                    Read more
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bell}
              title="No announcements yet"
              description="Stay tuned! Campus announcements will appear here."
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#163360] tracking-tight">
            Quick Actions
          </h2>
          <div className="grid gap-3">
            {[
              { label: "Browse Resources", href: "/resources", icon: BookOpen },
              { label: "Ask a Question", href: "/qa/ask", icon: HelpCircle },
              { label: "Take a Quiz", href: "/quizzes", icon: ClipboardList },
              { label: "My Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <Button variant="outline" className="w-full h-14 justify-between border-slate-100 hover:border-[#163360] hover:bg-blue-50 group transition-all rounded-xl px-6">
                  <div className="flex items-center gap-3">
                    <action.icon className="w-5 h-5 text-slate-400 group-hover:text-[#163360]" />
                    <span className="font-bold text-slate-600 group-hover:text-[#163360]">{action.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#163360] transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ))}
          </div>

          <div className="p-6 bg-gradient-to-br from-[#163360] to-[#0F2447] rounded-2xl text-white shadow-xl">
            <h4 className="font-bold mb-2">Download Mobile App</h4>
            <p className="text-xs text-blue-100/60 mb-4 font-medium italic">Phase 2: Offline learning coming soon to iOS & Android.</p>
            <Button disabled className="w-full bg-[#F4A800] text-[#163360] font-bold uppercase text-xs">
              Coming Soon
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
