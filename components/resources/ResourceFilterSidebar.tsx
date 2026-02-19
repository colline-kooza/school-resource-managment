"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Filter, 
  X, 
  ChevronDown, 
  BookOpen, 
  MapPin, 
  Grid, 
  Layers,
  Calendar,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

interface FilterOption {
  id: string;
  title: string;
}

const ResourceFilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [campuses, setCampuses] = useState<FilterOption[]>([]);
  const [courses, setCourses] = useState<FilterOption[]>([]);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected values
  const campusId = searchParams.get("campusId") || "";
  const courseId = searchParams.get("courseId") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const type = searchParams.get("type") || "";
  const year = searchParams.get("year") || "";
  const semester = searchParams.get("semester") || "";

  useEffect(() => {
    async function fetchData() {
      try {
        const [campusRes, categoryRes] = await Promise.all([
          api.get("/api/campuses"),
          api.get("/api/categories"),
        ]);
        setCampuses(campusRes.data);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error("Filter fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      if (!campusId) {
        setCourses([]);
        return;
      }
      try {
        const res = await api.get(`/api/courses?campusId=${campusId}`);
        setCourses(res.data);
      } catch (error) {
        console.error("Course fetch error:", error);
      }
    }
    fetchCourses();
  }, [campusId]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page on filter change
    params.delete("page");
    router.push(`/resources?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/resources");
  };

  const FilterGroup = ({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{label}</span>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  const Select = ({ value, onChange, options, placeholder }: { value: string, onChange: (val: string) => void, options: FilterOption[], placeholder: string }) => (
    <div className="relative group">
       <select
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-xs font-bold text-[#1A3A6B] appearance-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none cursor-pointer"
       >
         <option value="">{placeholder}</option>
         {options.map(opt => (
           <option key={opt.id} value={opt.id}>{opt.title}</option>
         ))}
       </select>
       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none group-focus-within:text-[#1A3A6B] transition-colors" />
    </div>
  );

  return (
    <aside className="w-full h-full flex flex-col font-Inter">
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1A3A6B] flex items-center justify-center">
            <Filter className="w-4 h-4 text-[#F4A800]" />
          </div>
          <h3 className="text-sm font-bold text-[#1A3A6B] uppercase tracking-wider">Filters</h3>
        </div>
        {(campusId || courseId || categoryId || type || year || semester) && (
          <button 
            onClick={clearFilters}
            className="text-[10px] font-bold text-rose-500 hover:text-rose-600 uppercase tracking-tighter flex items-center gap-1 transition-colors"
          >
            Clear <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
        <FilterGroup label="Location" icon={MapPin}>
          <Select 
            value={campusId} 
            onChange={(val) => updateFilter("campusId", val)} 
            options={campuses} 
            placeholder="Select Campus" 
          />
        </FilterGroup>

        <FilterGroup label="Academic" icon={BookOpen}>
          <Select 
            value={courseId} 
            onChange={(val) => updateFilter("courseId", val)} 
            options={courses} 
            placeholder="Select Course" 
          />
          <Select 
            value={categoryId} 
            onChange={(val) => updateFilter("categoryId", val)} 
            options={categories} 
            placeholder="Resource Category" 
          />
        </FilterGroup>

        <FilterGroup label="Resource Type" icon={Layers}>
          <div className="grid grid-cols-1 gap-2">
             {["PAST_PAPER", "NOTES", "VIDEO", "ASSIGNMENT", "OTHER"].map((t) => (
               <label 
                 key={t}
                 className={cn(
                   "flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all border",
                   type === t 
                    ? "bg-blue-50 border-blue-100 text-[#1A3A6B]" 
                    : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200"
                 )}
               >
                 <span className="text-xs font-bold">{t.replace("_", " ")}</span>
                 <input 
                   type="radio" 
                   name="type" 
                   value={t} 
                   checked={type === t}
                   onChange={() => updateFilter("type", t === type ? "" : t)}
                   className="hidden"
                 />
                 <div className={cn(
                   "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all",
                   type === t ? "border-[#1A3A6B] bg-[#1A3A6B]" : "border-slate-300 bg-white"
                 )}>
                   {type === t && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                 </div>
               </label>
             ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Timeframe" icon={Calendar}>
           <Select 
            value={year} 
            onChange={(val) => updateFilter("year", val)} 
            options={[2020, 2021, 2022, 2023, 2024, 2025].map(y => ({ id: y.toString(), title: y.toString() }))} 
            placeholder="By Year" 
          />
          <Select 
            value={semester} 
            onChange={(val) => updateFilter("semester", val)} 
            options={[
              { id: "Semester 1", title: "Semester 1" },
              { id: "Semester 2", title: "Semester 2" }
            ]} 
            placeholder="By Semester" 
          />
        </FilterGroup>
      </div>

      <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
         <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#F4A800]" />
            <span className="text-[10px] font-bold text-[#1A3A6B] uppercase tracking-tighter">Pro Tip</span>
         </div>
         <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
            Use filters to quickly find past papers for your course.
         </p>
      </div>
    </aside>
  );
};

export default ResourceFilterSidebar;
