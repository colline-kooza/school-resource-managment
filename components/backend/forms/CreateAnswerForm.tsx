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

import makePostRequest from "@/lib/makePostRequest";
import FormHeader from "../FormHeader";
import TextInput from "../dashboard/FormInputs/TextInput";
import ImageInput from "../dashboard/FormInputs/ImageInput";
import FormFooter from "../FormFooter";
import TextArea from "../FormInputs/TextAreaInput";
import toast from "react-hot-toast";
import SubmitButton from "../dashboard/FormInputs/SubmitButton";



export default function CreateAnswerForm({userId,questionId}:{userId:any,questionId:any}) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register,watch, handleSubmit, reset, formState: { errors } } = useForm({
     
    });
  
    async function onSubmit(data: any) {
        data.userId=userId;
        data.questionId=questionId
   console.log(data)
      const endPoint = '/api/answers'; 
      const resourceName = 'Answer';


  
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(`${baseUrl}/api/answers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
    
        if (response.ok) {
          toast.success(`New response recorded`);
          reset();
          setLoading(false);
                // Trigger revalidation
      await fetch(`${baseUrl}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: `/questions/${questionId}` }), // Revalidate the question's page
      });
          
        } else {
          setLoading(false);
          throw new Error(`Failed to create ${resourceName}`);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error making POST request:", error);
        toast.error(`Failed to create ${resourceName}: ${error}`);
      }
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
                      loading={loading}
                    />
            </div>
          </CardContent>
        </Card>
    </form>
   
  );
}
