"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { 
  Megaphone, 
  Calendar, 
  Globe, 
  MapPin, 
  ChevronDown, 
  Plus,
  Loader2,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";

interface AnnouncementsClientProps {
  campuses: { id: string; title: string }[];
  userCampusId?: string | null;
  userRole?: string;
}

export default function AnnouncementsClient({ campuses, userCampusId, userRole }: AnnouncementsClientProps) {
  const [campusFilter, setCampusFilter] = useState<string>(userCampusId || "all");

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements", { campusId: campusFilter }],
    queryFn: async () => {
      const { data } = await api.get(`/api/announcements?campusId=${campusFilter}`);
      return data;
    },
  });

  const canCreate = userRole === "ADMIN" || userRole === "LECTURER";

  return (
    <div className="space-y-8 font-Inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#163360]">Announcements</h1>
          <p className="text-slate-400 font-medium mt-1">
            Official news and updates from BusiLearn: Academic Hub.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-100 p-1 pl-3 pr-2 h-11">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <Select value={campusFilter} onValueChange={setCampusFilter}>
                <SelectTrigger className="border-none bg-transparent shadow-none focus:ring-0 w-[160px] h-9 text-xs font-bold">
                    <SelectValue placeholder="All Campuses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    <SelectItem value="all" className="text-xs font-bold">All Campuses</SelectItem>
                    {campuses.map(campus => (
                        <SelectItem key={campus.id} value={campus.id} className="text-xs font-bold">
                            {campus.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          {canCreate && (
             <Link href="/admin/announcements">
                <Button className="bg-[#163360] hover:bg-[#163360]/90 text-white rounded-xl font-bold text-xs h-11 px-5 shadow-lg shadow-[#163360]/20 transition-all hover:scale-[1.02]">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                </Button>
             </Link>
          )}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))
        ) : !announcements || announcements.length === 0 ? (
          <Card className="border-none bg-white shadow-sm rounded-3xl p-16 text-center">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                    <Megaphone className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-[#163360]">No Announcements Found</h3>
                <p className="text-slate-400 max-w-sm font-medium">
                    Try adjusting your campus filter or check back later for updates.
                </p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {announcements.map((item: any) => (
              <AccordionItem 
                key={item.id} 
                value={item.id}
                className="border-none bg-white shadow-sm rounded-2xl overflow-hidden px-6"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                   <div className="flex flex-col items-start text-left gap-2 w-full pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        {item.isPublic ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold hover:bg-emerald-50 rounded-lg text-[10px] py-0 px-2 uppercase tracking-wide">
                                <Globe className="w-3 h-3 mr-1" />
                                Public
                            </Badge>
                        ) : (
                            <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-bold hover:bg-blue-50 rounded-lg text-[10px] py-0 px-2 uppercase tracking-wide">
                                <MapPin className="w-3 h-3 mr-1" />
                                {item.campus?.title || "Campus Only"}
                            </Badge>
                        )}
                        <span className="text-[10px] text-slate-400 font-bold flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(item.createdAt), "MMMM d, yyyy")}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#163360] group-hover:text-[#F4A800] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium line-clamp-1">
                        {item.content.substring(0, 150)}...
                      </p>
                   </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 pt-0 px-2">
                   <div className="prose prose-sm max-w-none text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
                      {item.content}
                   </div>
                   <div className="mt-6 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                        <span>Posted by:</span>
                        <span className="text-[#163360]">{item.createdBy?.name}</span>
                     </div>
                     {canCreate && (
                        <Button variant="ghost" size="sm" className="text-[10px] font-bold text-[#F4A800] hover:bg-[#F4A800]/5" asChild>
                            <Link href={`/admin/announcements`}>
                                Manage All
                            </Link>
                        </Button>
                     )}
                   </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
