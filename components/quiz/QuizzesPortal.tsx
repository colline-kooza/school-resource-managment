"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Search, Filter, BookOpen, Layers } from "lucide-react";
import { QuizCard } from "./QuizCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter, useSearchParams } from "next/navigation";

export const QuizzesPortal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "");
  const [courseId, setCourseId] = useState(searchParams.get("courseId") || "");
  const [courses, setCourses] = useState<any[]>([]);
  
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (debouncedSearch) query.set("search", debouncedSearch);
        if (difficulty) query.set("difficulty", difficulty);
        if (courseId) query.set("courseId", courseId);

        const res = await api.get(`/api/quizzes?${query.toString()}`);
        setQuizzes(res.data.quizzes);
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/courses");
        setCourses(res.data);
      } catch (e) {}
    };

    fetchQuizzes();
    fetchCourses();
  }, [debouncedSearch, difficulty, courseId]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/quizzes?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 font-Inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-[#1A3A6B] tracking-tight mb-2">
            Academic Quizzes
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            Test your knowledge • Track your progress
          </p>
        </div>

        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#1A3A6B] transition-colors" />
          <input
            type="text"
            placeholder="Search quizzes by title or topic..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              updateFilters("search", e.target.value);
            }}
            className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold text-[#1A3A6B] outline-none focus:border-[#F4A800] transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-10">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <BookOpen className="w-4 h-4 text-[#1A3A6B]" />
          <select 
            className="bg-transparent text-sm font-bold text-[#1A3A6B] outline-none"
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value);
              updateFilters("courseId", e.target.value);
            }}
          >
            <option value="">All Courses</option>
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <Layers className="w-4 h-4 text-[#1A3A6B]" />
          <select 
            className="bg-transparent text-sm font-bold text-[#1A3A6B] outline-none"
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              updateFilters("difficulty", e.target.value);
            }}
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      {/* Quiz Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-50 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz: any) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Filter className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A3A6B] mb-2">No quizzes found</h2>
          <p className="text-slate-400 font-medium">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
};
