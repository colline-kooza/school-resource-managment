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


export type SelectOptionProps = {
  label: string;
  value: string;
};
export default function CreateCategoryForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register,watch, handleSubmit, reset, formState: { errors } } = useForm({
     
    });
  
    async function onSubmit(data: any) {
      data.slug = data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^\-+/, "").replace(/\-+$/, "");
      const endPoint = '/api/categories'; 
      const resourceName = 'Category';
      const redirect ="/dashboard/categories"

  
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
    <form className="max-w-2xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
      <FormHeader
        href="/categories"
        parent=""
        title="create category"
        editingId={""}
        loading={loading}
      />

      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-full col-span-full space-y-3">
          <Card>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid mt-4 gap-3">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Category title"
                    name="title"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
     
    </form>
  );
}
