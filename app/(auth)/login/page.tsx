"use client";
import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { GraduationCap, BookOpen, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function getRoleRedirect(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "LECTURER") return "/lecturer";
  return "/dashboard";
}

function LoginFormInner() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl");
  const isAutoFill = params.has("auto-fill");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        setLoading(false);
        return;
      }

      // Fetch session to get role for redirect
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      toast.success("Login successful! Welcome back.");

      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push(getRoleRedirect(role));
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const handleAutoFill = (role: "admin" | "lecturer" | "student") => {
    const creds = {
      admin: { email: "admin@busilearn.ac.ug", password: "Admin@123" },
      lecturer: { email: "lecturer@busilearn.ac.ug", password: "Lecturer@123" },
      student: { email: "student@busilearn.ac.ug", password: "Student@123" },
    };
    
    setValue("email", creds[role].email);
    setValue("password", creds[role].password);
    handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      {isAutoFill && (
        <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 mb-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => handleAutoFill("student")}
            className="text-[10px] font-bold h-8 bg-white"
          >
            Student
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => handleAutoFill("lecturer")}
            className="text-[10px] font-bold h-8 bg-white"
          >
            Teacher
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => handleAutoFill("admin")}
            className="text-[10px] font-bold h-8 bg-white"
          >
            Admin
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@ade.ac.ug"
              className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full text-white font-semibold py-2.5 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#163360" }}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold hover:underline"
            style={{ color: "#163360" }}
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#F5F7FA" }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div
            className="px-8 py-8 text-center"
            style={{ backgroundColor: "#163360" }}
          >
            <div className="flex justify-center mb-3">
              <div className="relative">
                <GraduationCap className="h-10 w-10 text-white" />
                <BookOpen
                  className="h-5 w-5 absolute -bottom-1 -right-1"
                  style={{ color: "#F4A800" }}
                />
              </div>
            </div>
            <h1
              className="text-2xl font-bold text-white"
            >
              BusiLearn
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              Your Campus, Your Resources, Your Success.
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Welcome back
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Sign in to your BusiLearn account
              </p>
            </div>
            <Suspense fallback={<div className="animate-pulse h-48 bg-gray-100 rounded-lg" />}>
              <LoginFormInner />
            </Suspense>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          BusiLearn: Academic Hub © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
