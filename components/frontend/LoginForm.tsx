"use client";
import { Eye, EyeOff, GraduationCap, Loader2, Lock, Mail, ShieldCheck, User } from "lucide-react";
import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { LoginProps } from "@/types/types";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import SubmitButton from "../backend/FormInputs/SubmitButton";
import PasswordInput from "../backend/FormInputs/PasswordInput";
import TextInput from "../backend/FormInputs/TextInput";
export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<LoginProps>();
  const params = useSearchParams();
  const returnUrl = params.get("returnUrl") || "/resources";
  const [passErr, setPassErr] = useState("");
  const router = useRouter();
  async function onSubmit(data: LoginProps) {
    try {
      setLoading(true);
      setPassErr("");
      console.log("Attempting to sign in with credentials:", data);
      const loginData = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      console.log("SignIn response:", loginData);
      if (loginData?.error) {
        setLoading(false);
        toast.error("Sign-in error: Check your credentials");
        setPassErr("Wrong Credentials, Check again");
        // setShowNotification(true);
      } else {
        // Sign-in was successful
        // setShowNotification(false);
        reset();
        setLoading(false);
        toast.success("Login Successful");
        setPassErr("");
        router.push(returnUrl);
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      // toast.error("Its seems something is wrong with your Network");
    }
  }
  return (
    <Suspense>
      <div className="w-full py-5 lg:px-8 px-6 ">
      <div className="">
        <div className="py-4 text-gray-900">
          <h2 className="text-xl lg:text-2xl font-bold leading-9 tracking-tight  ">
            Login in to your account
          </h2>
          <p className="text-xs">Welcome Back, fill in details to login</p>
        </div>
        <div className="grid grid-cols-1 gap-2 mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSubmit({ email: "student@busilearn.ac.ug", password: "Student@123" })}
            className="flex items-center justify-start gap-3 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            disabled={loading}
          >
            <User className="w-4 h-4" />
            <div className="text-left">
              <p className="text-sm font-semibold">Login as Student</p>
              <p className="text-[10px] text-gray-500">Full access to learning resources</p>
            </div>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onSubmit({ email: "lecturer@busilearn.ac.ug", password: "Lecturer@123" })}
            className="flex items-center justify-start gap-3 hover:bg-green-50 hover:text-green-600 transition-colors"
            disabled={loading}
          >
            <GraduationCap className="w-4 h-4" />
            <div className="text-left">
              <p className="text-sm font-semibold">Login as Lecturer</p>
              <p className="text-[10px] text-gray-500">Manage courses and students</p>
            </div>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onSubmit({ email: "admin@busilearn.ac.ug", password: "Admin@123" })}
            className="flex items-center justify-start gap-3 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            disabled={loading}
          >
            <ShieldCheck className="w-4 h-4" />
            <div className="text-left">
              <p className="text-sm font-semibold">Login as Admin</p>
              <p className="text-[10px] text-gray-500">Full system management</p>
            </div>
          </Button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500 font-medium">Or manual login</span>
          </div>
        </div>
      </div>
      <div className="">
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            register={register}
            errors={errors}
            label="Email Address"
            name="email"
            icon={Mail}
            placeholder="email"
          />
          <PasswordInput
            register={register}
            errors={errors}
            label="Password"
            name="password"
            icon={Lock}
            placeholder="password"
            forgotPasswordLink="/forgot-password"
          />
          {passErr && <p className="text-red-500 text-xs">{passErr}</p>}
          <div>
            <SubmitButton
              title="Sign In"
              loadingTitle="Loading Please wait.."
              loading={loading}
              className="w-full"
              loaderIcon={Loader2}
              showIcon={false}
            />
          </div>
        </form>
        {/* <div className="flex items-center py-4 justify-center space-x-1 text-slate-900">
          <div className="h-[1px] w-full bg-slate-200"></div>
          <div className="uppercase">Or</div>
          <div className="h-[1px] w-full bg-slate-200"></div>
        </div> */}

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Button
            onClick={() => signIn("google")}
            variant={"outline"}
            className="w-full"
          >
            <FaGoogle className="mr-2 w-6 h-6 text-red-500" />
            Login with Google
          </Button>
          <Button
            onClick={() => signIn("github")}
            variant={"outline"}
            className="w-full"
          >
            <FaGithub className="mr-2 w-6 h-6 text-slate-900 dark:text-white" />
            Login with Github
          </Button>
        </div> */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Not a Registered ?{" "}
          <Link
            href="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>

    </Suspense>
    
  );
}
