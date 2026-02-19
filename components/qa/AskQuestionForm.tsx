"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { HelpCircle, Sparkles, Tags, MessageSquare } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(150),
  content: z.string().min(30, "Please explain your question in more detail (min 30 chars)"),
  courseId: z.string().optional(),
  courseUnitId: z.string().optional(),
  tags: z.string().optional(),
});

const AskQuestionForm = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      courseId: "",
      courseUnitId: "",
      tags: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const selectedCourseId = form.watch("courseId");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/courses");
        setCourses(res.data);
      } catch (err) {
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      const fetchUnits = async () => {
        try {
          const res = await api.get(`/api/courses/${selectedCourseId}/units`);
          setUnits(res.data);
        } catch (err) {
          toast.error("Failed to load units");
        }
      };
      fetchUnits();
    } else {
      setUnits([]);
      form.setValue("courseUnitId", "");
    }
  }, [selectedCourseId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const tagsArray = values.tags 
        ? values.tags.split(",").map(t => t.trim()).filter(t => t !== "").slice(0, 5) 
        : [];
      
      const payload = {
        ...values,
        tags: tagsArray
      };

      const res = await api.post("/api/questions", payload);
      toast.success("Question posted! Redirecting to your discussion...");
      router.push(`/qa/${res.data.id}`);
      router.refresh();
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data || "Please check your question details");
      }
      // 401/403/500 handled by interceptor
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 flex items-center gap-4">
         <div className="w-16 h-16 rounded-[2rem] bg-blue-50 flex items-center justify-center text-[#1A3A6B]">
            <HelpCircle className="w-8 h-8" />
         </div>
         <div>
            <h1 className="text-3xl font-bold text-[#1A3A6B] tracking-tight">Ask a Question</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Get help from the community</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-[#1A3A6B] uppercase tracking-widest">Title</FormLabel>
                    <FormDescription className="text-xs font-medium text-slate-400">
                      Be specific and imagine you&apos;re asking a question to another person.
                    </FormDescription>
                    <FormControl>
                      <Input 
                        placeholder="e.g. How to calculate the marginal utility in Agribusiness?" 
                        {...field} 
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-[#1A3A6B] focus:bg-white transition-all px-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-[#1A3A6B] uppercase tracking-widest">Description</FormLabel>
                    <FormDescription className="text-xs font-medium text-slate-400">
                      Include all the information someone would need to answer your question.
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain your problem in detail..." 
                        {...field} 
                        className="min-h-[250px] rounded-2xl border-slate-100 bg-slate-50/50 font-medium text-[#1A3A6B] focus:bg-white transition-all p-6 leading-relaxed"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                   control={form.control}
                   name="courseId"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel className="text-sm font-bold text-[#1A3A6B] uppercase tracking-widest">Course</FormLabel>
                       <FormControl>
                          <select 
                            {...field}
                            className="w-full h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-[#1A3A6B] outline-none px-6 focus:bg-white transition-all"
                          >
                             <option value="">Select Course</option>
                             {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                          </select>
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                 <FormField
                   control={form.control}
                   name="courseUnitId"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel className="text-sm font-bold text-[#1A3A6B] uppercase tracking-widest">Unit</FormLabel>
                       <FormControl>
                          <select 
                            disabled={!selectedCourseId}
                            {...field}
                            className="w-full h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-[#1A3A6B] outline-none px-6 focus:bg-white transition-all disabled:opacity-50"
                          >
                             <option value="">Select Unit</option>
                             {units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
                          </select>
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-[#1A3A6B] uppercase tracking-widest">Tags</FormLabel>
                    <FormDescription className="text-xs font-medium text-slate-400">
                       Add up to 5 tags to describe what your question is about (comma separated).
                    </FormDescription>
                    <FormControl>
                       <div className="relative">
                          <Tags className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input 
                            placeholder="e.g. math, agribusiness, utility" 
                            {...field} 
                            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-[#1A3A6B] focus:bg-white transition-all pl-16 pr-6"
                          />
                       </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                 <Button 
                   disabled={isLoading}
                   type="submit" 
                   className="h-16 px-12 rounded-2xl bg-[#1A3A6B] text-white hover:bg-[#122b52] font-bold text-lg transition-all shadow-xl shadow-[#1A3A6B]/20"
                 >
                    {isLoading ? "Posting..." : "Post Question"}
                 </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Tips Sidebar */}
        <div className="space-y-6">
           <div className="bg-blue-600 rounded-[2rem] p-8 text-white">
              <Sparkles className="w-8 h-8 mb-4 text-[#F4A800]" />
              <h4 className="text-lg font-bold mb-2">Asking a good question</h4>
              <p className="text-sm font-medium text-blue-50 leading-relaxed mb-6">
                 Your question may be answered by many people. Make sure it is clear and descriptive.
              </p>
              <ul className="space-y-4">
                 {[
                   "Summarize your problem in a one-line title.",
                   "Describe what you've tried so far.",
                   "Add tags to help people find your question.",
                   "Be polite and patient with responders."
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-3 text-xs font-bold items-start line-clamp-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500/50 flex items-center justify-center flex-shrink-0">
                         {i + 1}
                      </div>
                      {tip}
                   </li>
                 ))}
              </ul>
           </div>

           <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
              <MessageSquare className="w-8 h-8 mb-4 text-[#1A3A6B]" />
              <h4 className="text-lg font-bold text-[#1A3A6B] mb-2">Fast Answers</h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                 Questions with detailed descriptions and correct tags usually get answered within 24 hours.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionForm;
