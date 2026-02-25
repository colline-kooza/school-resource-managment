"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import FormHeader from "../FormHeader";
import TextInput from "../dashboard/FormInputs/TextInput";
import ImageInput from "../dashboard/FormInputs/ImageInput";
import FormFooter from "../FormFooter";
import TextArea from "../FormInputs/TextAreaInput";
import { toast } from "sonner";
import SubmitButton from "../dashboard/FormInputs/SubmitButton";



export default function CreateAnswerForm({userId,questionId}:{userId:any,questionId:any}) {

    const router = useRouter();
    const { register,watch, handleSubmit, reset, formState: { errors } } = useForm({
     
    });
  
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: async (data: any) => {
        const res = await api.post('/api/answers', data);
        return res.data;
      },
      onSuccess: () => {
        toast.success("Answer posted!");
        reset();
        queryClient.invalidateQueries({ queryKey: ["questions"] });
      },
      onError: (error: any) => {
        toast.error(error.response?.data || "Failed to post answer");
      }
    });
  
    async function onSubmit(data: any) {
        data.userId = userId;
        data.questionId = questionId;
        mutation.mutate(data);
    }


  return (
    <form className="max-w-4xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
         <Card>
          <CardContent className="p-4 space-y-4">
               <TextArea
                     register={register}
                     errors={errors}
                      label="Describe your answer"
                    name="content"
                      />
            <div className="flex justify-end">
              <SubmitButton
                      text=""
                      title="Post answer"
                      loading={mutation.isPending}
                    />
            </div>
          </CardContent>
        </Card>
    </form>
   
  );
}
