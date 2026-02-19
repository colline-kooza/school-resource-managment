"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Search, X, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { ResourceCard } from "@/components/shared/ResourceCard";
import { SkeletonCard } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import ResourceFilterSidebar from "./ResourceFilterSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Simple debounce function to replace lodash
function debounce(fn: Function, ms: number) {
  let timeout: any;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  };
}

const ResourcesClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [resources, setResources] = useState<any[]>([]);
  const [totalResources, setTotalResources] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const page = parseInt(searchParams.get("page") || "1");

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const queryString = searchParams.toString();
      const res = await api.get(`/api/resources?${queryString}`);
      setResources(res.data.resources);
      setTotalResources(res.data.pagination.total);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Fetch resources error:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set("search", term);
      } else {
        params.delete("search");
      }
      params.delete("page");
      router.push(`/resources?${params.toString()}`);
    }, 500),
    [searchParams, router]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/resources?${params.toString()}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 font-Inter">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-[280px] flex-shrink-0">
        <ResourceFilterSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Search & Actions Bar */}
        <div className="mb-10 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1A3A6B] transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title or topic..."
              className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-bold text-[#1A3A6B] shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-[#1A3A6B]/20 transition-all outline-none"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-rose-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
             {/* Mobile Filters Trigger */}
             <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="h-12 px-6 bg-white border border-slate-100 rounded-2xl flex items-center gap-2 text-sm font-bold text-[#1A3A6B] shadow-sm hover:bg-slate-50 transition-all">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-8 w-[320px] border-none shadow-2xl overflow-y-auto no-scrollbar">
                    <ResourceFilterSidebar />
                  </SheetContent>
                </Sheet>
             </div>

             <div className="hidden sm:flex items-center bg-white border border-slate-100 rounded-2xl p-1 shadow-sm">
                <button className="p-2.5 rounded-xl bg-blue-50 text-[#1A3A6B] transition-all">
                   <Grid3X3 className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 transition-all">
                   <List className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-bold text-[#1A3A6B] tracking-tight">
                  {searchTerm ? `Search results for "${searchTerm}"` : "All Resources"}
               </h2>
               <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                  Showing {resources.length} of {totalResources} items
               </p>
            </div>
        </div>

        {/* Resource Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : resources.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {resources.map((resource: any) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  type={resource.type}
                  courseUnitTitle={resource.courseUnit?.title || "Unknown Unit"}
                  year={resource.year}
                  semester={resource.semester}
                  downloads={resource.downloads}
                  isBookmarked={false} // Handle bookmarks later in Step 8
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16">
                <Pagination
                  total={totalResources}
                  page={page}
                  pageSize={20}
                  onPageChange={(p) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", p.toString());
                    router.push(`/resources?${params.toString()}`);
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Search}
            title="No resources found"
            description="Try adjusting your filters or search terms to find what you're looking for."
            actionLabel="Clear all filters"
            onAction={clearSearch}
          />
        )}
      </div>
    </div>
  );
};

export default ResourcesClient;
