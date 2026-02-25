"use client";

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useSession } from "next-auth/react";
import CreateQuestions from "../backend/forms/CreateQuestions";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function QuestionSheet() {
  const { data: session } = useSession();
  const user = session?.user;

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await api.get("/api/courses");
      return res.data.map((item: any) => ({ title: item.title, id: item.id }));
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/api/categories");
      return res.data.map((item: any) => ({ title: item.title, id: item.id }));
    }
  });

  const { data: campuses = [] } = useQuery({
    queryKey: ["campuses"],
    queryFn: async () => {
      const res = await api.get("/api/campuses");
      return res.data.map((item: any) => ({ title: item.title, id: item.id }));
    }
  });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-[#1A3A6B] hover:bg-[#122b52] text-white font-bold text-xs px-6 rounded-full shadow-lg shadow-[#1A3A6B]/20 transition-all">
          Ask Question
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[600px] w-full p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
            <SheetTitle className="text-xl font-bold text-[#1A3A6B]">Ask a Question</SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Share your challenge with the community. Detailed questions get faster answers.
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            <CreateQuestions user={user} categories={categories} courses={courses} campuses={campuses}/>
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-white">
            <SheetClose asChild>
              <Button variant="ghost" className="w-full text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50">
                Cancel
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
