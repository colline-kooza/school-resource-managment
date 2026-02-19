"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { 
  FileText, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ChevronLeft,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["PAST_PAPER", "NOTES", "VIDEO", "ASSIGNMENT", "OTHER"]),
  campusId: z.string().min(1, "Please select a campus"),
  courseId: z.string().min(1, "Please select a course"),
  courseUnitId: z.string().min(1, "Please select a course unit"),
  categoryId: z.string().min(1, "Please select a category"),
  year: z.string().optional(),
  semester: z.string().optional(),
  fileUrl: z.string().min(1, "Please upload a file"),
});

interface UpdateResourceFormProps {
  initialData: any;
  categories: any[];
  courses: any[];
  campuses: any[];
}

export default function UpdateResourceForm({ 
  initialData,
  categories: initialCategories = [], 
  courses: initialCourses = [], 
  campuses: initialCampuses = [] 
}: UpdateResourceFormProps) {
  const router = useRouter();
  const [campuses, setCampuses] = useState<any[]>(initialCampuses);
  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [units, setUnits] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      type: initialData.type || "NOTES",
      campusId: initialData.campusId || "",
      courseId: initialData.courseId || "",
      courseUnitId: initialData.courseUnitId || "",
      categoryId: initialData.categoryId || "",
      year: initialData.year?.toString() || "",
      semester: initialData.semester || "",
      fileUrl: initialData.fileUrl || "",
    },
  });

  const { watch, setValue } = form;
  const selectedCampusId = watch("campusId");
  const selectedCourseId = watch("courseId");

  useEffect(() => {
    async function init() {
      try {
        const [cRes, catRes] = await Promise.all([
          api.get("/api/campuses"),
          api.get("/api/categories")
        ]);
        setCampuses(cRes.data);
        setCategories(catRes.data);
      } catch (err) {
        toast.error("Failed to load initial data");
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (selectedCampusId) {
      api.get(`/api/courses?campusId=${selectedCampusId}`).then(res => setCourses(res.data));
    }
  }, [selectedCampusId]);

  useEffect(() => {
    if (selectedCourseId) {
      api.get(`/api/course-units?courseId=${selectedCourseId}`).then(res => setUnits(res.data));
    }
  }, [selectedCourseId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await api.patch(`/api/resources/${initialData.id}`, values);
      toast.success("Resource updated successfully!");
      router.push("/lecturer/resources");
    } catch (error) {
      toast.error("Failed to update resource");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 font-Inter">
      <div className="mb-10">
         <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#1A3A6B] mb-6 transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
         </button>
         <h1 className="text-4xl font-bold text-[#1A3A6B] mb-2">Edit Resource</h1>
         <p className="text-slate-500 font-medium">Update the academic resource details.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <section className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                   <FileText className="w-5 h-5 text-[#1A3A6B]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A3A6B]">General Information</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                   control={form.control}
                   name="title"
                   render={({ field }) => (
                     <FormItem className="col-span-full">
                       <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Resource Title</FormLabel>
                       <FormControl>
                         <Input {...field} className="h-14 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold" />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                />
                
                <FormField
                   control={form.control}
                   name="description"
                   render={({ field }) => (
                     <FormItem className="col-span-full">
                       <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Brief Description</FormLabel>
                       <FormControl>
                         <Textarea {...field} className="min-h-[120px] rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold" />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Resource Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-slate-100">
                          <SelectItem value="NOTES">Lecture Notes</SelectItem>
                          <SelectItem value="PAST_PAPER">Past Paper</SelectItem>
                          <SelectItem value="VIDEO">Video Lesson</SelectItem>
                          <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                          <SelectItem value="OTHER">Other Reference</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-slate-100">
                          {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
          </section>

          <section className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                   <CheckCircle2 className="w-5 h-5 text-[#F4A800]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A3A6B]">Academic Context</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="campusId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Campus</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-slate-100">
                          {campuses.map((c: any) => (
                            <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Course</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-slate-100">
                          {courses.map((c: any) => (
                            <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courseUnitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Course Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={units.length === 0}>
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-slate-100">
                          {units.map((u: any) => (
                            <SelectItem key={u.id} value={u.id}>{u.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Year</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold text-center" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Semester</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="Semester 1">Sem 1</SelectItem>
                            <SelectItem value="Semester 2">Sem 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
             </div>
          </section>

          <div className="flex items-center justify-end gap-4 pt-10">
             <Button type="button" variant="ghost" onClick={() => router.back()} className="h-14 px-8 rounded-2xl font-bold text-slate-400">
                Cancel
             </Button>
             <Button type="submit" disabled={isSubmitting} className="bg-[#1A3A6B] text-white hover:bg-[#F4A800] hover:text-[#1A3A6B] h-14 px-12 rounded-2xl font-bold transition-all shadow-xl shadow-[#1A3A6B]/20 flex items-center gap-3">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSubmitting ? "Updating..." : "Save Changes"}
             </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
