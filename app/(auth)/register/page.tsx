"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  GraduationCap,
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  User,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    campusId: z.string().min(1, "Please select a campus"),
    courseId: z.string().min(1, "Please select a course"),
    yearOfStudy: z.string().min(1, "Please select your year of study"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type Campus = { id: string; title: string };
type Course = { id: string; title: string; campusId?: string | null };

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedCampusId = watch("campusId");

  // Fetch campuses on mount
  useEffect(() => {
    fetch("/api/campuses")
      .then((r) => r.json())
      .then((data) => setCampuses(data))
      .catch(() => toast.error("Failed to load campuses"));
  }, []);

  // Fetch courses when campus changes
  useEffect(() => {
    if (!selectedCampusId) {
      setFilteredCourses([]);
      return;
    }
    fetch(`/api/courses?campusId=${selectedCampusId}`)
      .then((r) => r.json())
      .then((data) => setFilteredCourses(data))
      .catch(() => toast.error("Failed to load courses"));
  }, [selectedCampusId]);

  async function onSubmit(data: RegisterFormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password,
          phone: data.phone || null,
          campusId: data.campusId,
          courseId: data.courseId,
          yearOfStudy: parseInt(data.yearOfStudy),
        }),
      });

      const result = await res.json();

      if (res.status === 409) {
        toast.error("An account with this email already exists.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        toast.error(result.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Account created! Please log in.");
      router.push("/login?auto-fill");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#F5F7FA" }}
    >
      <div className="w-full max-w-xl">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div
            className="px-8 py-6 text-center"
            style={{ backgroundColor: "#163360" }}
          >
            <div className="flex justify-center mb-2">
              <div className="relative">
                <GraduationCap className="h-9 w-9 text-white" />
                <BookOpen
                  className="h-4 w-4 absolute -bottom-1 -right-1"
                  style={{ color: "#F4A800" }}
                />
              </div>
            </div>
            <h1
              className="text-xl font-bold text-white"
            >
              BusiLearn
            </h1>
            <p className="text-blue-200 text-xs mt-1">
              Your Campus, Your Resources, Your Success.
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="mb-6">
              <h2
                className="text-xl font-bold text-gray-900"
              >
                Create your account
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Join BusiLearn: Academic Hub
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      placeholder="First name"
                      className={`pl-10 ${errors.firstName ? "border-red-500" : ""}`}
                      {...register("firstName")}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      className={`pl-10 ${errors.lastName ? "border-red-500" : ""}`}
                      {...register("lastName")}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@busilearn.ac.ug"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Phone (optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number <span className="text-gray-400 text-xs">(optional)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+256 700 000 000"
                    className="pl-10"
                    {...register("phone")}
                  />
                </div>
              </div>

              {/* Campus + Course Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="campusId" className="text-sm font-medium text-gray-700">
                    Campus <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("campusId", value)}
                    defaultValue={watch("campusId")}
                  >
                    <SelectTrigger className={`w-full h-10 rounded-md border ${errors.campusId ? "border-red-500" : "border-input"}`}>
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {campuses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.campusId && (
                    <p className="text-xs text-red-500">{errors.campusId.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="courseId" className="text-sm font-medium text-gray-700">
                    Course <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("courseId", value)}
                    disabled={!selectedCampusId}
                    key={selectedCampusId} // Reset on campus change
                  >
                    <SelectTrigger className={`w-full h-10 rounded-md border ${errors.courseId ? "border-red-500" : "border-input"}`}>
                      <SelectValue placeholder={selectedCampusId ? "Select course" : "Select campus first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCourses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.courseId && (
                    <p className="text-xs text-red-500">{errors.courseId.message}</p>
                  )}
                </div>
              </div>

              {/* Year of Study */}
              <div className="space-y-1.5">
                <Label htmlFor="yearOfStudy" className="text-sm font-medium text-gray-700">
                  Year of Study <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("yearOfStudy", value)}
                  defaultValue={watch("yearOfStudy")}
                >
                  <SelectTrigger className={`w-full h-10 rounded-md border ${errors.yearOfStudy ? "border-red-500" : "border-input"}`}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                  </SelectContent>
                </Select>
                {errors.yearOfStudy && (
                  <p className="text-xs text-red-500">{errors.yearOfStudy.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login?auto-fill"
                  className="font-semibold hover:underline"
                  style={{ color: "#163360" }}
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          BusiLearn: Academic Hub © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
