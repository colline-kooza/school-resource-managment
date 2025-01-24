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

import { generateSlug } from "@/lib/generateSlug";
import toast from "react-hot-toast";
import { Category } from "@prisma/client";
import { CategoryProps } from "@/types/types";
import makePostRequest from "@/lib/makePostRequest";
import FormHeader from "../FormHeader";
import TextInput from "../dashboard/FormInputs/TextInput";
import SelectInput from "../dashboard/FormInputs/SelectInput";
import TextArea from "../dashboard/FormInputs/TextAreaInput";
import MultipleImageInput from "../dashboard/FormInputs/MultipleImageInput";
import ImageInput from "../dashboard/FormInputs/ImageInput";
import FormFooter from "../FormFooter";
import Pdfinput from "../FormInputs/PdfInput";
import MultipleFileUpload from "../FormInputs/fileUpload";


export type SelectOptionProps = {
  label: string;
  value: string;
};
type CategoryFormProps = {
  editingId?: string | undefined;
  initialData?: Category | undefined | null;
};
export default function CreateResourceForm({campuses,user,courses,categories}:{campuses:any,user:any,courses:any,categories:any}) {
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const { register,watch, handleSubmit, reset, formState: { errors } } = useForm({
     
    });
  
    async function onSubmit(data: any) {
      data.slug = data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^\-+/, "").replace(/\-+$/, "");
      data.pdfUrl = imageUrl;
      data.userId=user.id
      
      const endPoint = '/api/resources'; 
      const resourceName = 'Resource';
      const redirect ="/resources"

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
    <div className="max-w-3xl mx-auto">
      <form className="" onSubmit={handleSubmit(onSubmit)}>
      <FormHeader
        href="/resources"
        parent=""
        title="create resource"
        editingId={""}
        loading={loading}
      />

      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-12 col-span-full space-y-3">
          <Card>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid mt-4 gap-3">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Resource title"
                    name="title"
                  />
                   <TextInput
                    register={register}
                    errors={errors}
                    label="Course unit"
                    name="courseUnit"
                  />
                </div>
                <div className="grid grid-cols-2 mt-4 gap-3">
                <SelectInput
        label="Select Category"
        name="categoryId"
        register={register}
        errors={errors}
        // isRequired
        multiple={false}
        type=""
        className=''
        options={categories}
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
                <div className="grid grid-cols-2 mt-4 gap-3">
                <SelectInput
        label="Select Campus"
        name="campusId"
        register={register}
        errors={errors}
        // isRequired
        multiple={false}
        type=""
        className=''
        options={campuses}
      />
      </div>
                <div className="grid gap-3">
                  <TextArea
                    register={register}
                    errors={errors}
                    label="Description"
                    name="description"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-12 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <Pdfinput
              label="resource /pdf/docx/xls"
              pdfUrl={imageUrl}
              setPdfUrl={setImageUrl}
              endpoint="documentUploader"
            />
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
