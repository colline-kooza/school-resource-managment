"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { 
  User, 
  Lock, 
  UserCircle, 
  Phone, 
  BookOpen, 
  MapPin, 
  Save, 
  Loader2,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import { UploadButton } from "@/lib/uploadthing";

interface ProfileClientProps {
  user: any;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    yearOfStudy: user.yearOfStudy?.toString() || "",
    image: user.image || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: updated } = await api.patch(`/api/users/${user.id}`, data);
      return updated;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: () => {
      toast.error("Failed to update profile");
    }
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.patch(`/api/users/${user.id}/password`, data);
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data || "Failed to change password");
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    updatePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  return (
    <div className="space-y-8 font-Inter">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A3A6B]">Profile Settings</h1>
        <p className="text-slate-400 font-medium mt-1">
          Manage your account information and security preferences.
        </p>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-2xl mb-8">
          <TabsTrigger value="info" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-[#1A3A6B] data-[state=active]:shadow-sm">
            <UserCircle className="w-4 h-4 mr-2" />
            Information
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-[#1A3A6B] data-[state=active]:shadow-sm">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Info Tab */}
        <TabsContent value="info">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Avatar Card */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden h-fit">
              <CardContent className="p-8 flex flex-col items-center">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-slate-50 shadow-xl">
                    <AvatarImage src={formData.image} />
                    <AvatarFallback className="text-2xl font-bold bg-[#1A3A6B] text-white">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-[#1A3A6B]/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="mt-6 w-full space-y-4 text-center">
                  <div>
                    <h3 className="text-xl font-bold text-[#1A3A6B]">{user.name}</h3>
                    <p className="text-xs font-bold text-[#F4A800] uppercase tracking-wider">{user.role}</p>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <UploadButton
                        endpoint="campusLogo"
                        onClientUploadComplete={(res) => {
                            setFormData({ ...formData, image: res[0].url });
                            updateProfileMutation.mutate({ ...formData, image: res[0].url });
                            toast.success("Avatar uploaded!");
                        }}
                        onUploadError={(error: Error) => {
                            toast.error(`Upload failed: ${error.message}`);
                        }}
                        appearance={{
                            button: "bg-[#1A3A6B] rounded-xl text-xs font-bold h-9 px-4 w-full ut-uploading:bg-slate-200",
                            allowedContent: "hidden"
                        }}
                        content={{
                            button({ ready }) {
                              if (ready) return "Change Avatar";
                              return "Preparing...";
                            }
                        }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Info Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm rounded-3xl">
                <CardHeader className="p-8 pb-0">
                   <CardTitle className="text-xl font-bold text-[#1A3A6B]">Personal Information</CardTitle>
                   <CardDescription className="text-slate-400 font-medium pt-2">
                     Update your identity and contact details.
                   </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                   <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 ml-1">First Name</Label>
                          <Input 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="bg-slate-50 border-none rounded-xl h-11 px-4 font-medium focus-visible:ring-1 focus-visible:ring-[#1A3A6B]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 ml-1">Last Name</Label>
                          <Input 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="bg-slate-50 border-none rounded-xl h-11 px-4 font-medium focus-visible:ring-1 focus-visible:ring-[#1A3A6B]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 ml-1">Email Address (Read Only)</Label>
                          <Input 
                            value={user.email}
                            disabled
                            className="bg-slate-100 border-none rounded-xl h-11 px-4 font-medium text-slate-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 ml-1">Phone Number</Label>
                          <div className="relative">
                            <Input 
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="bg-slate-50 border-none rounded-xl h-11 pl-10 pr-4 font-medium focus-visible:ring-1 focus-visible:ring-[#1A3A6B]"
                              placeholder="+256..."
                            />
                            <Phone className="w-4 h-4 text-slate-300 absolute left-3.5 top-3.5" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 ml-1">Campus</Label>
                          <div className="flex items-center gap-3 bg-slate-100 rounded-xl h-11 px-4 text-slate-500 text-sm font-bold">
                             <MapPin className="w-4 h-4" />
                             {user.campus?.title || "Not Assigned"}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 ml-1">Course</Label>
                          <div className="flex items-center gap-3 bg-slate-100 rounded-xl h-11 px-4 text-slate-500 text-sm font-bold">
                             <BookOpen className="w-4 h-4" />
                             {user.course?.title || "Not Assigned"}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button 
                            type="submit"
                            className="bg-[#1A3A6B] hover:bg-[#1A3A6B]/90 text-white rounded-xl font-bold h-11 px-8 shadow-lg shadow-[#1A3A6B]/20 transition-all hover:scale-[1.02]"
                            disabled={updateProfileMutation.isPending}
                        >
                            {updateProfileMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Changes
                        </Button>
                      </div>
                   </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
           <div className="max-w-2xl">
              <Card className="border-none shadow-sm rounded-3xl">
                <CardHeader className="p-8 pb-0">
                   <CardTitle className="text-xl font-bold text-[#1A3A6B]">Account Security</CardTitle>
                   <CardDescription className="text-slate-400 font-medium pt-2">
                     Regularly update your password to keep your account safe.
                   </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                   <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 ml-1">Current Password</Label>
                        <Input 
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="bg-slate-50 border-none rounded-xl h-11 px-4 font-medium focus-visible:ring-1 focus-visible:ring-[#1A3A6B]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 ml-1">New Password</Label>
                        <Input 
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="bg-slate-50 border-none rounded-xl h-11 px-4 font-medium focus-visible:ring-1 focus-visible:ring-[#1A3A6B]"
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 ml-1">Confirm New Password</Label>
                        <Input 
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="bg-slate-50 border-none rounded-xl h-11 px-4 font-medium focus-visible:ring-1 focus-visible:ring-[#1A3A6B]"
                          required
                        />
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button 
                            type="submit"
                            className="bg-[#1A3A6B] hover:bg-[#1A3A6B]/90 text-white rounded-xl font-bold h-11 px-8 shadow-lg shadow-[#1A3A6B]/20 transition-all hover:scale-[1.02]"
                            disabled={updatePasswordMutation.isPending}
                        >
                            {updatePasswordMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Lock className="w-4 h-4 mr-2" />
                            )}
                            Change Password
                        </Button>
                      </div>
                   </form>
                </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
