"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Layout, 
  HelpCircle,
  Eye
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
  FormDescription
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const quizSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  timeLimit: z.string().optional(),
  passMark: z.string().min(1, "Pass mark is required"),
  courseId: z.string().optional(),
  courseUnitId: z.string().optional(),
  questions: z.array(z.object({
    questionText: z.string().min(10, "Question is too short"),
    options: z.array(z.string().min(1, "Option cannot be empty")).length(4),
    correctAnswer: z.string().min(1, "Please select the correct answer"),
    explanation: z.string().optional(),
    points: z.string().optional()
  })).min(1, "At least one question is required")
});

export const CreateQuizForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [courses, setCourses] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "MEDIUM",
      timeLimit: "30",
      passMark: "50",
      questions: [
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          explanation: "",
          points: "1"
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions"
  });

  const watchCourseId = form.watch("courseId");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/courses");
        setCourses(res.data);
      } catch (e) {}
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (watchCourseId) {
      const course = courses.find((c: any) => c.id === watchCourseId);
      setUnits(course?.units || []);
    }
  }, [watchCourseId, courses]);

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        passMark: parseFloat(values.passMark),
        timeLimit: values.timeLimit ? parseInt(values.timeLimit) : null,
        questions: values.questions.map((q: any) => ({
          ...q,
          points: parseInt(q.points) || 1
        }))
      };
      await api.post("/api/quizzes", data);
      toast.success("Quiz created as draft!");
      router.push("/lecturer/quizzes");
    } catch (e: any) {
      if (e.response?.status === 400) {
        toast.error(e.response.data || "Could not save quiz");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      // Validate step 1 fields before moving
      const isValid = await form.trigger(["title", "difficulty", "passMark"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-Inter">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 -z-10 rounded-full" />
        {[
          { icon: Layout, label: "General" },
          { icon: HelpCircle, label: "Questions" },
          { icon: Eye, label: "Review" }
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4",
              step > i + 1 ? "bg-emerald-500 border-white text-white shadow-xl shadow-emerald-500/20" :
              step === i + 1 ? "bg-[#1A3A6B] border-white text-white shadow-xl shadow-[#1A3A6B]/20 scale-110" :
              "bg-white border-slate-100 text-slate-300"
            )}>
              {step > i + 1 ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-6 h-6" />}
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              step === i + 1 ? "text-[#1A3A6B]" : "text-slate-400"
            )}>{s.label}</span>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          
          {/* STEP 1: General Info */}
          {step === 1 && (
            <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#1A3A6B]">Quiz Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Intro to Agribusiness Management" {...field} className="h-14 rounded-2xl border-2 border-slate-100 font-bold focus:border-[#F4A800]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#1A3A6B]">Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 font-bold">
                            <SelectValue placeholder="Select Difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HARD">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#1A3A6B]">Time Limit (Minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="30" {...field} className="h-14 rounded-2xl border-2 border-slate-100 font-bold" />
                      </FormControl>
                      <FormDescription>Leave blank for no limit.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Questions Editor */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm relative group">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1A3A6B] rounded-2xl flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <h4 className="font-bold text-[#1A3A6B] uppercase text-xs tracking-widest">Question Block</h4>
                    </div>
                    {fields.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => remove(index)}
                        className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name={`questions.${index}.questionText`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Write your question here..." 
                              {...field} 
                              className="min-h-[100px] rounded-2xl border-2 border-slate-100 font-bold focus:border-[#F4A800] p-6 text-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["A", "B", "C", "D"].map((opt, optIdx) => (
                        <FormField
                          key={optIdx}
                          control={form.control}
                          name={`questions.${index}.options.${optIdx}`}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-3 space-y-0">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">
                                {opt}
                              </div>
                              <FormControl>
                                <Input placeholder={`Option ${opt}`} {...field} className="h-12 rounded-xl border-slate-100 font-medium" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                      <FormField
                        control={form.control}
                        name={`questions.${index}.correctAnswer`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-slate-400">Correct Answer</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl border-slate-100 font-bold">
                                  <SelectValue placeholder="Select Answer" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl">
                                {form.watch(`questions.${index}.options`).map((o, i) => (
                                  <SelectItem key={i} value={o || `Option ${i}`}>
                                    Option {String.fromCharCode(65 + i)}: {o || "(Empty)"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`questions.${index}.points`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-slate-400">Points</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="h-12 rounded-xl border-slate-100 font-bold" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button 
                type="button" 
                onClick={() => append({ questionText: "", options: ["", "", "", ""], correctAnswer: "", explanation: "", points: "1" })}
                className="w-full h-16 rounded-[40px] bg-white border-2 border-dashed border-slate-200 text-slate-400 hover:text-[#1A3A6B] hover:border-[#1A3A6B] hover:bg-slate-50 transition-all font-bold text-xs uppercase tracking-widest"
              >
                <Plus className="mr-2 w-5 h-5" />
                Add Another Question
              </Button>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div className="bg-white rounded-[40px] p-12 border border-slate-100 shadow-sm text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-emerald-500">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold text-[#1A3A6B] mb-4">Quiz Ready!</h3>
              <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">
                You've configured "{form.watch("title")}" with {fields.length} questions.
              </p>
              
              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-10">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Difficulty</span>
                  <span className="text-sm font-bold text-[#1A3A6B]">{form.watch("difficulty")}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</span>
                  <span className="text-sm font-bold text-[#1A3A6B]">{form.watch("timeLimit") || "∞"} min</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="h-14 rounded-2xl bg-[#1A3A6B] text-white font-bold shadow-xl shadow-[#1A3A6B]/20"
                >
                  {loading ? "Creating..." : "Save as Draft"}
                </Button>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  You can publish this quiz from your dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-12">
            {step > 1 ? (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setStep(step - 1)}
                className="h-12 px-8 rounded-2xl font-bold text-slate-400 hover:bg-slate-50"
              >
                <ChevronLeft className="mr-2 w-5 h-5" />
                Previous Step
              </Button>
            ) : <div />}
            
            {step < 3 && (
              <Button 
                type="button" 
                onClick={nextStep}
                className="h-12 px-8 rounded-2xl bg-[#F4A800] text-white font-bold shadow-lg shadow-[#F4A800]/20"
              >
                Next: {step === 1 ? "Add Questions" : "Final Review"}
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </div>

        </form>
      </Form>
    </div>
  );
};
