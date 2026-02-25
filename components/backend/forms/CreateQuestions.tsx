"use client";
import {
  Card,
  CardContent,
} from "@/components/ui/card";


import { useState } from "react";
import { useForm } from "react-hook-form";

import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import TextInput from "../dashboard/FormInputs/TextInput";
import SelectInput from "../dashboard/FormInputs/SelectInput";
import TextArea from "../FormInputs/TextAreaInput";
import FormFooter from "../FormFooter";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
 


export type SelectOptionProps = {
  label: string;
  value: string;
};
type CategoryFormProps = {
  editingId?: string | undefined;
  initialData?: Category | undefined | null;
};
export default function CreateQuestions({campuses,user,courses,categories}:{campuses:any,user:any,courses:any,categories:any}) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const mutation = useMutation({
      mutationFn: async (data: any) => {
        const res = await api.post('/api/questions', data);
        return res.data;
      },
      onSuccess: () => {
        toast.success("Question posted successfully!");
        reset();
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        router.push("/qa");
      },
      onError: (error: any) => {
        toast.error(error.response?.data || "Failed to post question");
      }
    });
  
    async function onSubmit(data: any) {
      if(!user || !user.id){
        toast.error("Please login first to ask a question");
        return;
      }
      data.userId=user.id;
      mutation.mutate(data);
    }


  return (
    <div className="max-w-2xl mx-auto px-1 py-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-5">
          <TextInput
            register={register}
            errors={errors}
            label="Question title"
            name="title"
            placeholder="e.g., How to implement optimistic updates in React Query?"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              register={register}
              errors={errors}
              label="Course unit (Optional)"
              name="courseUnit"
              placeholder="e.g., BIT 2104"
            />
            <SelectInput
              label="Associated Course"
              name="courseId"
              register={register}
              errors={errors}
              options={courses}
              className="text-xs"
            />
          </div>

          <TextArea
            register={register}
            errors={errors}
            label="Describe your question"
            name="content"
          />
        </div>

        <div className="pt-4 mt-6 border-t border-slate-100">
          <FormFooter
            href="/qa"
            editingId={""}
            loading={mutation.isPending}
            title="Post Question"
            parent=""
          />
        </div>
      </form>
    </div>
  );
}
