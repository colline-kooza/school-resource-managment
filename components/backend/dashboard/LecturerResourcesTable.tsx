"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  MoreVertical, 
  Eye, 
  Edit3, 
  Trash2, 
  Search,
  FileText,
  Clock,
  CheckCircle2,
  XCircle
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
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const LecturerResourcesTable = ({ userId }: { userId: string }) => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchResources = async () => {
    try {
      const res = await api.get(`/api/resources/recent?userId=${userId}&status=ALL`); 
      setResources(res.data);
    } catch (e) {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, [userId]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/resources/${deleteId}`);
      setResources(prev => prev.filter(r => r.id !== deleteId));
      toast.success("Resource deleted successfully");
    } catch (e) {
      toast.error("Failed to delete resource");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
    </div>
  );

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-[#1A3A6B]">My Resources</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Manage your academic uploads and their status
          </p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search resources..." 
                    className="pl-10 pr-4 py-2 rounded-xl border border-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1A3A6B]/5 transition-all w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Link href="/lecturer/resources/upload">
                <Button className="bg-[#1A3A6B] hover:bg-[#1A3A6B]/90 text-white font-bold rounded-2xl h-11 px-6 shadow-xl shadow-[#1A3A6B]/10">
                    Upload New
                </Button>
            </Link>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-14 pl-8">Resource Title</TableHead>
            <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-14">Course & Unit</TableHead>
            <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-14">Type</TableHead>
            <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-14">Status</TableHead>
            <TableHead className="text-right pr-8 h-14"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredResources.map((resource: any) => (
            <TableRow key={resource.id} className="group hover:bg-slate-50/50 border-slate-50 transition-colors">
              <TableCell className="pl-8 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1A3A6B]">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-[#1A3A6B] group-hover:text-blue-600 transition-colors">
                            {resource.title}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                            Uploaded {new Date(resource.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1A3A6B]">{resource.course?.title}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {resource.courseUnit?.title || "N/A"}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <span className="text-xs font-bold text-slate-500 uppercase">{resource.type}</span>
              </TableCell>

              <TableCell>
                <StatusBadge status={resource.status} />
              </TableCell>

              <TableCell className="text-right pr-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-100 rounded-xl">
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-slate-100">
                    <Link href={`/dashboard/resources/${resource.id}`}>
                      <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer rounded-xl font-bold text-slate-600 hover:text-[#1A3A6B]">
                        <Eye className="w-4 h-4" />
                        Preview Resource
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/lecturer/resources/edit/${resource.id}`}>
                      <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer rounded-xl font-bold text-slate-600 hover:text-blue-600">
                        <Edit3 className="w-4 h-4" />
                        Edit Resource
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      onClick={() => setDeleteId(resource.id)}
                      className="flex items-center gap-3 p-3 cursor-pointer rounded-xl font-bold text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Resource
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {filteredResources.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-40 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No resources found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmDialog 
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Resource?"
        description="This will permanently delete the academic resource. This action cannot be undone."
        confirmLabel="Yes, Delete Permanently"
        cancelLabel="Cancel"
        danger={true}
      />
    </div>
  );
};
