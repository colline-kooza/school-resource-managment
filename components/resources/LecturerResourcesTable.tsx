"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  ExternalLink,
  Info,
  AlertCircle
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonTable } from "@/components/shared/LoadingSkeleton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LecturerResourcesTable = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/resources?mine=true");
      setResources(res.data.resources);
    } catch (error) {
      toast.error("Failed to fetch your resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/resources/${deleteId}`);
      toast.success("Resource deleted");
      setResources(resources.filter(r => r.id !== deleteId));
    } catch (error) {
      toast.error("Failed to delete resource");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <SkeletonTable rows={5} />;

  return (
    <div className="space-y-6 font-Inter">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A3A6B] tracking-tight">My Uploads</h2>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
            Manage your academic contributions
          </p>
        </div>
        <Link href="/lecturer/resources/upload">
          <Button className="bg-[#1A3A6B] text-white hover:bg-[#F4A800] hover:text-[#1A3A6B] h-12 px-6 rounded-xl font-bold transition-all shadow-lg shadow-[#1A3A6B]/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Upload New
          </Button>
        </Link>
      </div>

      {resources.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-6 pl-8">Resource Title</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-6">Type</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-6">Course</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-6">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-6">Uploaded</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-6 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id} className="group border-slate-50 transition-colors hover:bg-slate-50/30">
                  <TableCell className="py-5 pl-8">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-[#1A3A6B] group-hover:text-blue-600 transition-colors line-clamp-1">
                          {resource.title}
                       </span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {resource.courseUnit?.title || "No unit"}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={resource.type} className="border-none font-bold text-[9px]" />
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-slate-600">{resource.course?.title}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={resource.status} className="font-bold text-[9px]" />
                      {resource.status === "REJECTED" && resource.rejectionNote && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="text-rose-500 hover:text-rose-600">
                                <AlertCircle className="w-3.5 h-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs bg-white border-rose-100 p-4 rounded-xl shadow-xl">
                              <p className="text-xs font-bold text-[#1A3A6B] mb-1">Reason for rejection:</p>
                              <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">"{resource.rejectionNote}"</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-slate-400">{new Date(resource.createdAt).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-[#1A3A6B]">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl border-slate-100 shadow-xl">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/resources/${resource.id}`} className="flex items-center gap-2 font-bold text-xs py-2.5">
                            <Eye className="w-3.5 h-3.5" /> View Live
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 font-bold text-xs py-2.5 text-blue-600">
                           <Edit className="w-3.5 h-3.5" /> Edit Resource
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleteId(resource.id)}
                          className="cursor-pointer flex items-center gap-2 font-bold text-xs py-2.5 text-rose-500 hover:text-rose-600 focus:text-rose-600"
                        >
                           <Trash2 className="w-3.5 h-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          icon={Plus}
          title="No resources yet"
          description="Start sharing your academic documents with students today."
          actionLabel="Upload First Resource"
          actionHref="/lecturer/resources/upload"
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Resource?"
        description="This action cannot be undone. This resource will be permanently removed from the platform."
      />
    </div>
  );
};

export default LecturerResourcesTable;
