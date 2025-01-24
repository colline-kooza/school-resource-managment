"use client";
import {
  Card,
  CardContent,
} from "@/components/ui/card";


import { useState } from "react";
import { useForm } from "react-hook-form";

import { Category } from "@prisma/client";
import makePostRequest from "@/lib/makePostRequest";
import FormHeader from "../FormHeader";
import TextInput from "../dashboard/FormInputs/TextInput";
import SelectInput from "../dashboard/FormInputs/SelectInput";
import QuillEditor from "../dashboard/FormInputs/QuilEditor";
import TextArea from "../FormInputs/TextAreaInput";
import FormFooter from "../FormFooter";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
 


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
    const [loading, setLoading] = useState(false);
    const { register,watch, handleSubmit, reset, formState: { errors } } = useForm({
     
    });
  
    async function onSubmit(data: any) {
      data.userId=user.id
      
      const endPoint = '/api/questions'; 
      const resourceName = 'Question';
      router.push("/qa")
      const redirect ="/qa"
      
    //   revalidatePath("/qa")
      console.log(data);
  
      await makePostRequest({
        setLoading,
        endPoint,
        data,
        resourceName,
        reset,
        redirect,
        router // Pass the router object obtained from useRouter
      });
    }


  return (
    <div className="max-w-3xl mt-4 mx-auto">
      <form className="" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-12 col-span-full space-y-3">
         <div className="">
         <div className="grid gap-6">
                <div className="grid mt-4 gap-3">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Question title"
                    name="title"
                  />
                
                </div>
                <div className="grid grid-cols-2 mt-4 gap-3">
                <TextInput
                    register={register}
                    errors={errors}
                    label="Course unit"
                    name="courseUnit"
                  />
                <SelectInput
        label="Select Course"
        name="courseId"
        register={register}
        errors={errors}
        // isRequired
        multiple={false}
        type=""
        className=''
        options={courses}
      />
    </div>
    <div className="mt-4">
         <TextArea
         register={register}
         errors={errors}
          label="Describe your question"
        name="content"
          />
    </div>
        </div>
         </div>
               <FormFooter
                href="/resources"
                editingId={""}
                loading={loading}
                title="create resource"
                parent=""
              />
        </div>
      </div>
     
    </form>
    </div>
  );
}
