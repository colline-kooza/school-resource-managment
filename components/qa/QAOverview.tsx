"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Plus, Search, LayoutGrid, List, SlidersHorizontal, MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionCard } from "./QuestionCard";
import { QuestionFilterSidebar } from "./QuestionFilterSidebar";
import { SkeletonCard } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-hot-toast";

// Simple debounce
function debounce(fn: Function, ms: number) {
  let timeout: any;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  };
}

const QAOverview = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    courseId: "",
    courseUnitId: "",
    tag: "",
    resolved: false,
    sort: "newest"
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const searchParamsObj: Record<string, string> = {
        page: page.toString(),
        search,
        sort: activeFilters.sort,
        ...Object.fromEntries(
          Object.entries(activeFilters).filter(([_, v]) => typeof v === 'string' && v !== "")
        )
      };
      const params = new URLSearchParams(searchParamsObj);
      if (activeFilters.resolved) params.set("resolved", "true");
      else params.delete("resolved");

      const res = await api.get(`/api/questions?${params.toString()}`);
      setQuestions(res.data.questions);
      setTotal(res.data.pagination.total);
    } catch (error) {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, activeFilters, search]);

  const debouncedSearch = useCallback(
    debounce((val: string) => setSearch(val), 500),
    []
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12 font-Inter">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
        <div className="max-w-xl">
           <h1 className="text-4xl sm:text-5xl font-bold text-[#1A3A6B] tracking-tight mb-4">Community Quiz & Answers</h1>
           <p className="text-lg font-medium text-slate-500 leading-relaxed">
             Ask questions, share knowledge, and learn from your peers and lecturers at Arapai Campus.
           </p>
        </div>
        
        <Link href="/qa/ask">
           <Button className="h-16 px-10 rounded-2xl bg-[#F4A800] text-[#1A3A6B] hover:bg-[#1A3A6B] hover:text-white font-bold text-lg shadow-xl shadow-[#F4A800]/20 active:scale-95 transition-all group">
              <MessageSquarePlus className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Ask a Question
           </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar */}
        <div className="lg:col-span-3 order-2 lg:order-1">
           <QuestionFilterSidebar 
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
           />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 order-1 lg:order-2 space-y-10">
           {/* Controls */}
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="relative flex-1 max-w-lg">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                 <input 
                   onChange={(e) => debouncedSearch(e.target.value)}
                   type="text"
                   placeholder="Search questions by title or content..."
                   className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white border border-slate-100 font-bold text-[#1A3A6B] outline-none focus:border-blue-200 focus:shadow-sm transition-all"
                 />
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                 {[
                   { id: "newest", label: "Newest" },
                   { id: "most-votes", label: "Votes" },
                   { id: "unanswered", label: "Unanswered" },
                 ].map((s) => (
                   <button
                     key={s.id}
                     onClick={() => setActiveFilters({...activeFilters, sort: s.id})}
                     className={cn(
                       "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                       activeFilters.sort === s.id 
                         ? "bg-[#1A3A6B] text-white shadow-lg shadow-[#1A3A6B]/20" 
                         : "text-slate-400 hover:text-[#1A3A6B] hover:bg-slate-50"
                     )}
                   >
                     {s.label}
                   </button>
                 ))}
              </div>
           </div>

           {/* List */}
           {loading ? (
             <div className="space-y-6">
               {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
             </div>
           ) : questions.length > 0 ? (
             <div className="space-y-6">
               {questions.map((q) => (
                 <QuestionCard 
                   key={q.id}
                   id={q.id}
                   title={q.title}
                   content={q.content}
                   tags={q.tags}
                   upVotes={q.upVotes}
                   downVotes={q.downVotes}
                   answerCount={q._count.answers}
                   views={q.views}
                   isResolved={q.isResolved}
                   asker={q.user}
                   createdAt={q.createdAt}
                   courseUnit={q.courseUnit?.title}
                 />
               ))}
               
               <div className="pt-10">
                 <Pagination 
                   total={total}
                   page={page}
                   pageSize={20}
                   onPageChange={setPage}
                 />
               </div>
             </div>
           ) : (
             <EmptyState
               icon={Search}
               title="No questions found"
               description="Try adjusting your keywords or filters to find what you're looking for."
               actionLabel="Post a Question"
               actionHref="/qa/ask"
             />
           )}
        </div>
      </div>
    </div>
  );
};

export default QAOverview;
