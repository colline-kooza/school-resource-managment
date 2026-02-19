"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  Download, 
  Heart, 
  Eye, 
  Calendar, 
  BookOpen, 
  MapPin, 
  User, 
  Clock,
  ArrowLeft,
  ExternalLink,
  PlayCircle,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceCard } from "@/components/shared/ResourceCard";
import { SkeletonText, SkeletonCard } from "@/components/shared/LoadingSkeleton";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

const ResourceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [resource, setResource] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return;
      setLoading(true);
      try {
        const res = await api.get(`/api/resources/${params.id}`);
        setResource(res.data);
        
        // Fetch related resources from the same course unit
        if (res.data.courseUnitId) {
           const relatedRes = await api.get(`/api/resources?courseUnitId=${res.data.courseUnitId}&limit=4`);
           setRelated(relatedRes.data.resources.filter((r: any) => r.id !== params.id).slice(0, 3));
        }
      } catch (error) {
        console.error("Fetch resource detail error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await api.patch(`/api/resources/${resource.id}/download`);
      // Trigger actual download
      window.open(resource.fileUrl, "_blank");
      // Refresh local count
      setResource({ ...resource, downloads: resource.downloads + 1 });
    } catch (error) {
      console.error("Download increment error:", error);
      toast.error("Failed to track download");
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveBookmark = async () => {
    try {
      // Simulate API call for now if endpoint not confirmed, 
      // but typically it would be a POST to /api/bookmarks
      await api.post("/api/bookmarks", { resourceId: resource.id });
      toast.success("Added to bookmarks!");
    } catch (error) {
      toast.error("Could not save bookmark");
    }
  };

  const SidebarSection = ({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) => (
    <div className="pb-6 border-b border-slate-50 last:border-none last:pb-0 pt-6 first:pt-0">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{label}</span>
      </div>
      {children}
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout user={session?.user}>
        <div className="animate-pulse space-y-8">
           <div className="h-10 w-64 bg-slate-200 rounded-xl" />
           <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 space-y-4">
                 <div className="h-96 bg-slate-100 rounded-3xl" />
              </div>
              <div className="w-full lg:w-[320px] h-96 bg-slate-50 rounded-3xl" />
           </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!resource) return null;

  return (
    <DashboardLayout user={session?.user}>
      <div className="max-w-7xl mx-auto font-Inter">
        {/* Back Link */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#1A3A6B] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Resources
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content (Left) */}
          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <StatusBadge status={resource.type} className="px-3" />
                {resource.year && (
                  <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Class of {resource.year}
                  </div>
                )}
                {resource.semester && (
                  <div className="bg-blue-50 px-3 py-1 rounded-full text-[10px] font-bold text-[#1A3A6B] uppercase tracking-widest">
                    {resource.semester}
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-[#1A3A6B] tracking-tight leading-tight mb-6">
                {resource.title}
              </h1>
              
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-4xl">
                {resource.description || "No description provided for this resource."}
              </p>
            </div>

            {/* Viewer Section */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-12">
               {resource.type === "VIDEO" ? (
                 <div className="aspect-video bg-slate-900 flex flex-col items-center justify-center p-12 text-center text-white">
                    <PlayCircle className="w-20 h-20 text-[#F4A800] mb-6 animate-pulse" />
                    <h3 className="text-2xl font-bold mb-4">Ready to watch?</h3>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto font-medium">This video lesson will open in a new tab for the best viewing experience.</p>
                    <a href={resource.fileUrl} target="_blank">
                       <Button size="lg" className="bg-[#F4A800] text-[#1A3A6B] hover:bg-white px-10 rounded-2xl font-bold">
                          Open Video Player
                       </Button>
                    </a>
                 </div>
               ) : resource.fileUrl.endsWith(".pdf") ? (
                 <div className="h-[600px] md:h-[800px] w-full bg-slate-100 relative">
                    <iframe 
                      src={`${resource.fileUrl}#toolbar=0`} 
                      className="w-full h-full border-none"
                      title={resource.title}
                    />
                    <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10">
                       <Button 
                         onClick={handleDownload}
                         disabled={downloading}
                         className="bg-[#1A3A6B] text-white hover:bg-[#0F2447] px-8 h-14 rounded-2xl font-bold shadow-2xl transition-all active:scale-95 flex items-center gap-3"
                       >
                         <Download className="w-5 h-5" />
                         {downloading ? "Processing..." : "Download PDF"}
                       </Button>
                    </div>
                 </div>
               ) : (
                 <div className="p-12 md:p-20 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mb-8">
                       <FileText className="w-10 h-10 text-[#1A3A6B]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1A3A6B] mb-2">Academic File</h3>
                    <p className="text-slate-400 font-medium mb-10 max-w-sm">This resource is available for download in its original format.</p>
                    <Button 
                      onClick={handleDownload}
                      disabled={downloading}
                      size="lg" 
                      className="bg-[#1A3A6B] text-white hover:bg-[#0F2447] px-12 rounded-2xl font-bold flex items-center gap-3"
                    >
                      <Download className="w-5 h-5" />
                      {downloading ? "Downloading..." : "Get Resource"}
                    </Button>
                 </div>
               )}
            </div>

            {/* Related Section */}
            {related.length > 0 && (
              <div className="mt-20">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-bold text-[#1A3A6B] tracking-tight">More from this Course Unit</h2>
                   <Link href={`/resources?courseUnitId=${resource.courseUnitId}`} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">
                      View All
                   </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {related.map(r => (
                     <ResourceCard 
                       key={r.id}
                       id={r.id}
                       title={r.title}
                       type={r.type}
                       courseUnitTitle={resource.courseUnit?.title}
                       year={r.year}
                       downloads={r.downloads}
                     />
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Right) */}
          <div className="w-full lg:w-[320px]">
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_15px_60px_rgba(0,0,0,0.03)] sticky top-28">
                <SidebarSection label="Uploader" icon={User}>
                   <div className="flex items-center gap-3">
                      <UserAvatar 
                        src={resource.uploadedBy?.image} 
                        name={`${resource.uploadedBy?.firstName} ${resource.uploadedBy?.lastName}`} 
                      />
                      <div>
                         <p className="text-xs font-bold text-[#1A3A6B] uppercase tracking-tighter">
                            {resource.uploadedBy?.firstName} {resource.uploadedBy?.lastName}
                         </p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {resource.uploadedBy?.role}
                         </p>
                      </div>
                   </div>
                </SidebarSection>

                <SidebarSection label="Academic Path" icon={MapPin}>
                   <div className="space-y-4">
                      <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Campus</p>
                         <p className="text-xs font-bold text-[#1A3A6B]">{resource.campus?.title}</p>
                      </div>
                      <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Course</p>
                         <p className="text-xs font-bold text-[#1A3A6B]">{resource.course?.title}</p>
                      </div>
                      <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Unit</p>
                         <p className="text-xs font-bold text-[#1A3A6B]">{resource.courseUnit?.title}</p>
                      </div>
                   </div>
                </SidebarSection>

                <SidebarSection label="Platform Stats" icon={Clock}>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl text-center">
                         <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                            <Eye className="w-4 h-4" />
                            <span className="text-lg font-bold">{resource.views}</span>
                         </div>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Views</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl text-center">
                         <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
                            <Download className="w-4 h-4" />
                            <span className="text-lg font-bold">{resource.downloads}</span>
                         </div>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Installs</p>
                      </div>
                   </div>
                   <div className="mt-4 flex items-center justify-center gap-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">Uploaded {new Date(resource.createdAt).toLocaleDateString()}</span>
                   </div>
                </SidebarSection>

                <div className="mt-8 space-y-3">
                   <Button 
                    variant="outline"
                    onClick={handleSaveBookmark}
                    className="w-full h-14 rounded-2xl border-slate-100 font-bold text-slate-600 hover:text-[#1A3A6B] hover:bg-blue-50 group active:scale-95 transition-all"
                   >
                     <Heart className="w-5 h-5 mr-3 group-hover:fill-[#F4A800] group-hover:text-[#F4A800] transition-colors" />
                     Save to Bookmarks
                   </Button>
                   <Button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full h-14 rounded-2xl bg-[#1A3A6B] text-white hover:bg-[#F4A800] hover:text-[#1A3A6B] font-bold active:scale-95 transition-all shadow-xl shadow-[#1A3A6B]/10"
                   >
                     <Download className="w-5 h-5 mr-3" />
                     {downloading ? "Processing..." : "Download File"}
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResourceDetailPage;
