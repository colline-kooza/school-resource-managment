"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  UserPlus,
  Trash2,
  Check,
  X,
  Loader2,
  ChevronRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminDashboardClientProps {
  initialRecentUsers: any[];
  initialPendingResources: any[];
}

const COLORS = ["#1A3A6B", "#F4A800", "#94A3B8"];

const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ 
  initialRecentUsers,
  initialPendingResources 
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pendingItems, setPendingItems] = useState(initialPendingResources);
  const [recentUsers, setRecentUsers] = useState(initialRecentUsers);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/api/analytics/overview");
        setData(response.data);
      } catch (error) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleApproveResource = async (id: string) => {
    try {
      await api.patch(`/api/resources/${id}/approve`);
      setPendingItems(prev => prev.filter(item => item.id !== id));
      toast.success("Resource approved!");
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
    <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-[#1A3A6B]">{loading ? <Skeleton className="h-8 w-20" /> : value}</h3>
            {subValue && <p className="text-[10px] text-slate-400 font-medium">{subValue}</p>}
          </div>
          <div className={cn("p-4 rounded-2xl bg-opacity-10", color)}>
            <Icon className={cn("w-6 h-6", color.replace("bg-", "text-"))} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading && !data) {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-[400px] rounded-3xl" />
                <Skeleton className="h-[400px] rounded-3xl" />
            </div>
        </div>
    );
  }

  const rolePieData = [
    { name: "Students", value: data.totals.students },
    { name: "Lecturers", value: data.totals.lecturers },
    { name: "Admins", value: data.totals.users - data.totals.students - data.totals.lecturers }
  ];

  return (
    <div className="space-y-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard title="Total Users" value={data.totals.users} icon={Users} color="bg-[#1A3A6B]" />
        <StatCard title="Students" value={data.totals.students} icon={GraduationCap} color="bg-emerald-500" />
        <StatCard title="Lecturers" value={data.totals.lecturers} icon={BookOpen} color="bg-indigo-500" />
        <StatCard title="Pending" value={data.totals.pendingResources} icon={Clock} color="bg-[#F4A800]" />
        <StatCard title="Approved" value={data.totals.approvedResources} icon={CheckCircle2} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Trend */}
          <Card className="lg:col-span-2 rounded-3xl border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-8 py-6">
                  <div>
                    <CardTitle className="text-lg font-bold text-[#1A3A6B]">Registration Trend</CardTitle>
                    <p className="text-xs text-slate-400 font-medium mt-1">New user signups over the last 30 days</p>
                  </div>
              </CardHeader>
              <CardContent className="p-8">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.registrationTrends}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                                labelStyle={{ fontWeight: 800, color: "#1A3A6B" }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#1A3A6B" 
                                strokeWidth={4} 
                                dot={{ r: 4, fill: "#F4A800", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                  </div>
              </CardContent>
          </Card>

          {/* User Distribution */}
          <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-slate-50 px-8 py-6">
                  <CardTitle className="text-lg font-bold text-[#1A3A6B]">User Composition</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={rolePieData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {rolePieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-3">
                    {rolePieData.map((role, idx) => (
                        <div key={role.name} className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-500">{role.name}</span>
                            <span className="text-[#1A3A6B]">{role.value}</span>
                        </div>
                    ))}
                </div>
              </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Approvals Table */}
          <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-8 py-6">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg font-bold text-[#1A3A6B]">Pending Reviews</CardTitle>
                    <Badge className="bg-[#F4A800] text-white hover:bg-[#F4A800]">{pendingItems.length}</Badge>
                  </div>
                  <Link href="/admin/resources/pending">
                    <Button variant="ghost" className="text-xs font-bold text-[#1A3A6B] hover:bg-slate-50 rounded-xl">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
              </CardHeader>
              <CardContent className="p-0">
                  {pendingItems.length === 0 ? (
                      <div className="py-20 text-center space-y-3">
                          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <p className="text-sm font-bold text-slate-500">All caught up! No pending resources.</p>
                      </div>
                  ) : (
                      <Table>
                          <TableHeader className="bg-slate-50/50">
                              <TableRow className="border-none">
                                  <TableHead className="text-[10px] font-bold uppercase text-slate-400 px-8">Resource</TableHead>
                                  <TableHead className="text-[10px] font-bold uppercase text-slate-400">By</TableHead>
                                  <TableHead className="text-right text-[10px] font-bold uppercase text-slate-400 px-8">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {pendingItems.map((resource) => (
                                  <TableRow key={resource.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                                      <TableCell className="px-8 py-4">
                                          <p className="text-xs font-bold text-[#1A3A6B] truncate max-w-[200px]">{resource.title}</p>
                                          <p className="text-[10px] text-slate-400 mt-0.5">{resource.course.title}</p>
                                      </TableCell>
                                      <TableCell>
                                          <p className="text-[10px] font-bold text-slate-500">{resource.uploadedBy?.name || "Unknown"}</p>
                                      </TableCell>
                                      <TableCell className="text-right px-8">
                                          <div className="flex items-center justify-end gap-2">
                                              <Button 
                                                onClick={() => handleApproveResource(resource.id)}
                                                size="icon" 
                                                variant="outline" 
                                                className="w-8 h-8 rounded-lg border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                                              >
                                                  <Check className="w-4 h-4" />
                                              </Button>
                                              <Link href={`/admin/resources/pending?id=${resource.id}`}>
                                                <Button size="icon" variant="outline" className="w-8 h-8 rounded-lg border-slate-100 text-slate-400 hover:bg-slate-50">
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                              </Link>
                                          </div>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  )}
              </CardContent>
          </Card>

          {/* Recent Registrations Table */}
          <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-8 py-6">
                  <CardTitle className="text-lg font-bold text-[#1A3A6B]">Newest Members</CardTitle>
                  <Link href="/admin/users">
                    <Button variant="ghost" className="text-xs font-bold text-[#1A3A6B] hover:bg-slate-50 rounded-xl">
                        Manage Users <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
              </CardHeader>
              <CardContent className="p-0">
                  <Table>
                      <TableHeader className="bg-slate-50/50">
                          <TableRow className="border-none">
                              <TableHead className="text-[10px] font-bold uppercase text-slate-400 px-8">User</TableHead>
                              <TableHead className="text-[10px] font-bold uppercase text-slate-400">Campus</TableHead>
                              <TableHead className="text-right text-[10px] font-bold uppercase text-slate-400 px-8">Joined</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {recentUsers.map((user) => (
                              <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                                  <TableCell className="px-8 py-4">
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                              <Users className="w-4 h-4 text-slate-400" />
                                          </div>
                                          <div>
                                              <p className="text-xs font-bold text-[#1A3A6B]">{user.name}</p>
                                              <p className="text-[10px] text-slate-400 mt-0.5">{user.role}</p>
                                          </div>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <p className="text-[10px] font-bold text-slate-500">{user.campus?.title || "N/A"}</p>
                                  </TableCell>
                                  <TableCell className="text-right px-8">
                                      <p className="text-[10px] font-medium text-slate-400">{format(new Date(user.createdAt), "MMM dd, yyyy")}</p>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default AdminDashboardClient;
