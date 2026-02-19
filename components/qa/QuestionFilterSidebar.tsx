"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  activeFilters: any;
}

export const QuestionFilterSidebar = ({
  onFilterChange,
  activeFilters
}: FilterSidebarProps) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Fetch courses failed");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeFilters.courseId) {
      const fetchUnits = async () => {
        try {
          const res = await api.get(`/api/courses/${activeFilters.courseId}/units`);
          setUnits(res.data);
        } catch (err) {
          console.error("Fetch units failed");
        }
      };
      fetchUnits();
    } else {
      setUnits([]);
    }
  }, [activeFilters.courseId]);

  const handleChange = (key: string, value: any) => {
    onFilterChange({ ...activeFilters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      courseId: "",
      courseUnitId: "",
      tag: "",
      resolved: false
    });
  };

  return (
    <div className="space-y-8 sticky top-24">
      <div className="flex items-center justify-between">
         <h4 className="text-sm font-bold text-[#1A3A6B] uppercase tracking-widest flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
         </h4>
         <button 
           onClick={clearFilters}
           className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tighter"
         >
           Clear All
         </button>
      </div>

      <div className="space-y-6">
        {/* Course */}
        <div className="space-y-3">
           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course</label>
           <select 
             value={activeFilters.courseId}
             onChange={(e) => handleChange("courseId", e.target.value)}
             className="w-full h-12 rounded-xl border-slate-100 bg-white text-sm font-bold text-[#1A3A6B] outline-none focus:border-blue-200 transition-all px-4"
           >
              <option value="">All Courses</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
           </select>
        </div>

        {/* Course Unit */}
        <div className="space-y-3">
           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course Unit</label>
           <select 
             disabled={!activeFilters.courseId}
             value={activeFilters.courseUnitId}
             onChange={(e) => handleChange("courseUnitId", e.target.value)}
             className="w-full h-12 rounded-xl border-slate-100 bg-white text-sm font-bold text-[#1A3A6B] outline-none focus:border-blue-200 transition-all px-4 disabled:opacity-50"
           >
              <option value="">All Units</option>
              {units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
           </select>
        </div>

        {/* Tags */}
        <div className="space-y-3">
           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter by Tag</label>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={activeFilters.tag}
                onChange={(e) => handleChange("tag", e.target.value)}
                placeholder="e.g. accounting"
                className="w-full h-12 rounded-xl border-slate-100 bg-white text-sm font-bold text-[#1A3A6B] outline-none focus:border-blue-200 transition-all pl-11 pr-4"
              />
           </div>
        </div>

        {/* Resolved Toggle */}
        <div className="flex items-center gap-3 pt-4">
           <Checkbox 
             id="resolved" 
             checked={activeFilters.resolved}
             onCheckedChange={(checked) => handleChange("resolved", !!checked)}
             className="w-5 h-5 rounded-md border-slate-200 data-[state=checked]:bg-[#1A3A6B]"
           />
           <label 
             htmlFor="resolved"
             className="text-xs font-bold text-[#1A3A6B] uppercase tracking-tighter cursor-pointer"
           >
             Show Resolved Only
           </label>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[#1A3A6B] text-white space-y-4">
         <h5 className="font-bold text-sm">Need help?</h5>
         <p className="text-xs font-medium text-blue-100 leading-relaxed">
           Our community of lecturers and students are here to support your learning journey.
         </p>
         <Button className="w-full bg-[#F4A800] text-[#1A3A6B] hover:bg-white font-bold rounded-xl h-10 transition-all">
            Ask Now
         </Button>
      </div>
    </div>
  );
};
