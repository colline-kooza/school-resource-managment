"use client";

import React, { useState } from "react";
import api from "@/lib/api";
import { 
  Check, 
  X, 
  Eye, 
  Search, 
  LayoutGrid, 
  List, 
  ExternalLink,
  MessageSquare,
  Loader2,
  FileText,
  User,
  MapPin,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonTable } from "@/components/shared/LoadingSkeleton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const AdminPendingApprovals = () => {
  const queryClient = useQueryClient();
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [rejectionId, setRejectionId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");

  // Fetch resources query
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "resources", statusFilter],
    queryFn: async () => {
      const res = await api.get(`/api/resources?status=${statusFilter}`);
      return res.data.resources;
    }
  });

  const resources = data || [];

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/api/resources/${id}/approve`);
    },
    onSuccess: (_, id) => {
      toast.success("Resource approved! Uploader notified.");
      queryClient.invalidateQueries({ queryKey: ["admin", "resources"] });
      if (selectedResource?.id === id) setIsPreviewOpen(false);
    },
    onError: () => {
      toast.error("Failed to approve resource");
    }
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      await api.patch(`/api/resources/${id}/reject`, { rejectionNote: note });
    },
    onSuccess: (_, variables) => {
      toast.success("Resource rejected. Uploader notified.");
      queryClient.invalidateQueries({ queryKey: ["admin", "resources"] });
      setRejectionId(null);
      setRejectionNote("");
      if (selectedResource?.id === variables.id) setIsPreviewOpen(false);
    },
    onError: () => {
      toast.error("Failed to reject resource");
    }
  });

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleReject = () => {
    if (!rejectionId || !rejectionNote) return;
    rejectMutation.mutate({ id: rejectionId, note: rejectionNote });
  };

  const openPreview = (resource: any) => {
    setSelectedResource(resource);
    setIsPreviewOpen(true);
  };

  if (isLoading) return <SkeletonTable rows={8} />;

  return (
    <div className="space-y-8 font-Inter">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1A3A6B] tracking-tight">Pending Approval</h2>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
            Platform quality control dashboard
          </p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
           {["PENDING", "APPROVED", "REJECTED"].map((s) => (
             <button
               key={s}
               onClick={() => setStatusFilter(s)}
               className={cn(
                 "px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                 statusFilter === s 
                  ? "bg-[#1A3A6B] text-white shadow-lg shadow-[#1A3A6B]/20" 
                  : "text-slate-400 hover:text-[#1A3A6B] hover:bg-slate-50"
               )}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {resources.length > 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-6 pl-10">Resource</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-6">Course / Unit</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-6">Uploaded By</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-6">Submitted</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-6 text-right pr-10">Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource: any) => (
                <TableRow key={resource.id} className="group border-slate-50 hover:bg-slate-50/30 transition-colors">
                  <TableCell className="py-5 pl-10">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1A3A6B] flex-shrink-0">
                          <FileText className="w-5 h-5" />
                       </div>
                       <div className="flex flex-col">
                          <span 
                            onClick={() => openPreview(resource)}
                            className="text-sm font-bold text-[#1A3A6B] hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                          >
                             {resource.title}
                          </span>
                          <StatusBadge status={resource.type} className="border-none px-0 text-[8px] font-bold opacity-60" />
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-600">{resource.course?.title}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{resource.courseUnit?.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-3 h-3 text-slate-400" />
                       </div>
                       <span className="text-xs font-bold text-[#1A3A6B]">{resource.uploadedBy?.firstName} {resource.uploadedBy?.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(resource.createdAt).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell className="text-right pr-10">
                    <div className="flex items-center justify-end gap-2 outline-none">
                      <Button 
                        onClick={() => openPreview(resource)}
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-[#1A3A6B]"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {statusFilter === "PENDING" && (
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={() => handleApprove(resource.id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 shadow-sm"
                          >
                            <Check className="w-4 h-4 text-emerald-600" />
                          </Button>
                          <Button 
                            onClick={() => setRejectionId(resource.id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 shadow-sm"
                          >
                            <X className="w-4 h-4 text-rose-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          icon={Check}
          title="All caught up!"
          description={`There are currently no ${statusFilter.toLowerCase()} resources to review.`}
          actionLabel="Back to Dashboard"
          actionHref="/admin"
        />
      )}

      {/* Resource Preview Sidebar */}
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent className="sm:max-w-xl p-0 border-none shadow-2xl font-Inter">
          {selectedResource && (
            <div className="h-full flex flex-col bg-white">
               <SheetHeader className="p-8 border-b border-slate-50 bg-[#F5F7FA]/50">
                  <div className="flex items-center gap-3 mb-4">
                     <StatusBadge status={selectedResource.type} />
                     <StatusBadge status={selectedResource.status} />
                  </div>
                  <SheetTitle className="text-2xl font-bold text-[#1A3A6B] leading-tight">
                    {selectedResource.title}
                  </SheetTitle>
                  <SheetDescription className="text-slate-500 font-medium py-4 leading-relaxed line-clamp-3">
                    {selectedResource.description}
                  </SheetDescription>
               </SheetHeader>

               <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uploader</p>
                        <p className="text-sm font-bold text-[#1A3A6B]">{selectedResource.uploadedBy?.firstName} {selectedResource.uploadedBy?.lastName}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course</p>
                        <p className="text-sm font-bold text-[#1A3A6B]">{selectedResource.course?.title}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit</p>
                        <p className="text-sm font-bold text-[#1A3A6B]">{selectedResource.courseUnit?.title}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campus</p>
                        <p className="text-sm font-bold text-[#1A3A6B]">{selectedResource.campus?.title}</p>
                     </div>
                  </div>

                  {/* Document Embed */}
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center min-h-[200px] text-center">
                     <FileText className="w-12 h-12 text-[#1A3A6B] mb-4 opacity-20" />
                     <p className="text-sm font-bold text-[#1A3A6B] mb-6">Preview might be limited in sidebar</p>
                     <a href={selectedResource.fileUrl} target="_blank" className="w-full">
                        <Button variant="outline" className="w-full h-12 rounded-xl border-[#1A3A6B]/10 font-bold text-[#1A3A6B] hover:bg-blue-50">
                           <ExternalLink className="w-4 h-4 mr-2" />
                           View Full Document
                        </Button>
                     </a>
                  </div>
               </div>

               {statusFilter === "PENDING" && (
                 <div className="p-8 border-t border-slate-50 flex items-center justify-end gap-4 bg-slate-50/30">
                    <Button 
                      onClick={() => setRejectionId(selectedResource.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      variant="ghost" 
                      className="h-12 px-6 rounded-xl font-bold text-rose-500 hover:bg-rose-50"
                    >
                      Reject Resource
                    </Button>
                    <Button 
                      onClick={() => handleApprove(selectedResource.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="h-12 px-10 rounded-xl bg-[#1A3A6B] text-white hover:bg-emerald-600 font-bold shadow-lg shadow-[#1A3A6B]/10 active:scale-95 transition-all"
                    >
                      Approve Now
                    </Button>
                 </div>
               )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Rejection Modal */}
      <ConfirmDialog
        open={!!rejectionId}
        onOpenChange={(open) => !open && setRejectionId(null)}
        onConfirm={handleReject}
        title="Reject Resource"
        description="Please provide a reason for rejection. This will be sent to the uploader."
        confirmLabel="Confirm Rejection"
        danger={true}
      >
        <div className="mt-4 space-y-2">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rejection Note</p>
           <Textarea 
             value={rejectionNote}
             onChange={(e) => setRejectionNote(e.target.value)}
             placeholder="e.g. Incomplete content, wrong course unit selective, or poor quality..."
             className="min-h-[100px] rounded-xl border-slate-100 bg-white font-medium text-sm leading-relaxed"
           />
        </div>
      </ConfirmDialog>
    </div>
  );
};

export default AdminPendingApprovals;
