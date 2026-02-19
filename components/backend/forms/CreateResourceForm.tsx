"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  FormDescription
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
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

interface CreateResourceFormProps {
  user?: any;
  categories?: any[];
  courses?: any[];
  campuses?: any[];
}

const CreateResourceForm = ({ 
  user, 
  categories: initialCategories = [], 
  courses: initialCourses = [], 
  campuses: initialCampuses = [] 
}: CreateResourceFormProps) => {
  const router = useRouter();
  const [campuses, setCampuses] = useState<any[]>(initialCampuses);
  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [units, setUnits] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "NOTES",
      fileUrl: "",
    },
  });

  const { watch, setValue } = form;
  const selectedCampusId = watch("campusId");
  const selectedCourseId = watch("courseId");
  const fileUrl = watch("fileUrl");

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
    } else {
      setCourses([]);
    }
  }, [selectedCampusId]);

  useEffect(() => {
    if (selectedCourseId) {
      api.get(`/api/course-units?courseId=${selectedCourseId}`).then(res => setUnits(res.data));
    } else {
      setUnits([]);
    }
  }, [selectedCourseId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const slug = values.title.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);
      await api.post("/api/resources", { ...values, slug });
      toast.success("Resource uploaded successfully! Pending admin approval.");
      router.push("/lecturer/resources");
    } catch (error) {
      toast.error("Failed to create resource");
      console.error(error);
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
         <h1 className="text-4xl font-bold text-[#1A3A6B] mb-2">Upload Resource</h1>
         <p className="text-slate-500 font-medium">Contribute to the academic community. Your upload will be visible once approved.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Basic Info */}
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
                        <Input placeholder="e.g. Introduction to Macroeconomics Past Paper 2024" className="h-14 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold" {...field} />
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
                        <Textarea placeholder="What is this resource about? Any specific instructions for students?" className="min-h-[120px] rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold leading-relaxed" {...field} />
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
                            <SelectValue placeholder="What are you uploading?" />
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

          {/* Academic Context */}
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
                            <SelectValue placeholder="Target Campus" />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCampusId}>
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                            <SelectValue placeholder={selectedCampusId ? "Select Course" : "Select Campus First"} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCourseId}>
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                            <SelectValue placeholder={selectedCourseId ? "Select Unit" : "Select Course First"} />
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
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Year</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2025" className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold text-center" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Semester</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                              <SelectValue placeholder="Sem" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="Semester 1">Sem 1</SelectItem>
                            <SelectItem value="Semester 2">Sem 2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
             </div>
          </section>

          {/* File Upload */}
          <section className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                   <Upload className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1A3A6B]">Upload File</h3>
             </div>

             <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                       <div className="space-y-4">
                          {!fileUrl ? (
                            <UploadDropzone
                              endpoint="resourceUploader"
                              onClientUploadComplete={(res) => {
                                setValue("fileUrl", res[0].url);
                                toast.success("File uploaded!");
                              }}
                              onUploadError={(error: Error) => {
                                toast.error(`Error! ${error.message}`);
                              }}
                              className="border-2 border-dashed border-slate-100 rounded-[2rem] py-16 bg-slate-50/30 hover:bg-slate-50 transition-all ut-label:text-slate-400 ut-label:font-bold ut-button:bg-[#1A3A6B] ut-button:rounded-xl ut-button:font-bold"
                            />
                          ) : (
                            <div className="p-8 border-2 border-emerald-100 bg-emerald-50 rounded-[2rem] flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                                     <CheckCircle2 className="w-6 h-6" />
                                  </div>
                                  <div>
                                     <p className="text-sm font-bold text-[#1A3A6B]">File Ready for Submission</p>
                                     <p className="text-xs font-bold text-emerald-700 truncate max-w-[200px] sm:max-w-md">{fileUrl}</p>
                                  </div>
                               </div>
                               <button 
                                onClick={() => setValue("fileUrl", "")}
                                className="text-xs font-bold text-rose-500 uppercase tracking-widest hover:bg-rose-100 px-4 py-2 rounded-xl transition-all"
                               >
                                 Replace
                               </button>
                            </div>
                          )}
                       </div>
                    </FormControl>
                    <FormDescription className="text-xs font-medium text-slate-400 mt-4 italic">
                       Supported formats: PDF, Images, Word documents. Max size: 20MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </section>

          <div className="flex items-center justify-end gap-4 pt-10">
             <Button 
               type="button" 
               variant="ghost" 
               onClick={() => router.back()}
               className="h-14 px-8 rounded-2xl font-bold text-slate-400 hover:text-rose-500 transition-all"
             >
                Cancel
             </Button>
             <Button 
               type="submit" 
               disabled={isSubmitting}
               className="bg-[#1A3A6B] text-white hover:bg-[#F4A800] hover:text-[#1A3A6B] h-14 px-12 rounded-2xl font-bold transition-all shadow-xl shadow-[#1A3A6B]/20 flex items-center gap-3 active:scale-95"
             >
                {isSubmitting ? (
                   <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     Uploading...
                   </>
                ) : (
                   <>
                     Submit Resource
                     <ArrowRight className="w-5 h-5" />
                   </>
                )}
             </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateResourceForm;
