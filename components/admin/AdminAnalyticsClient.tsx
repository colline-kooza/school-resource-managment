"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { 
  TrendingUp, 
  FileBox, 
  Zap, 
  Download, 
  Trophy,
  Loader2,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const AdminAnalyticsClient = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get("/api/analytics/overview");
                setData(response.data);
            } catch (error) {
                toast.error("Failed to load detailed analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-10 h-10 text-[#1A3A6B] animate-spin" />
                <p className="text-sm font-bold text-slate-400 animate-pulse">Aggregating Platform Intelligence...</p>
            </div>
        );
    }

    const StatMini = ({ label, value, icon: Icon, color }: any) => (
        <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-5 flex items-center gap-4">
                <div className={cn("p-3 rounded-xl bg-opacity-10", color)}>
                    <Icon className={cn("w-5 h-5", color.replace("bg-", "text-"))} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
                    <p className="text-xl font-bold text-[#1A3A6B] mt-1">{value}</p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h2 className="text-2xl font-bold text-[#1A3A6B]">Detailed Analytics</h2>
                <p className="text-sm text-slate-400 font-medium mt-1">Deep-dive into platform performance and academic impact</p>
            </div>

            {/* Top Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatMini label="Total Resources" value={data.totals.resources} icon={FileBox} color="bg-indigo-500" />
                <StatMini label="Total Quizzes" value={data.totals.quizzes} icon={Zap} color="bg-amber-500" />
                <StatMini label="Active Questions" value={data.totals.questions} icon={TrendingUp} color="bg-emerald-500" />
                <StatMini label="Quiz Attempts" value={data.totals.attempts} icon={Trophy} color="bg-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Registration Growth */}
                <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold text-[#1A3A6B]">User Growth (30d)</CardTitle>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.registrationTrends}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" hide />
                                    <YAxis hide />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                        labelStyle={{ fontWeight: 800, color: "#1A3A6B" }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#1A3A6B" 
                                        strokeWidth={3} 
                                        dot={false}
                                        activeDot={{ r: 6, fill: "#F4A800" }} 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Resource Distribution */}
                <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold text-[#1A3A6B]">Resources by Type</CardTitle>
                        <FileBox className="w-5 h-5 text-indigo-500" />
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.resourcesByType}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="type" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip cursor={{ fill: "#f8fafc" }} />
                                    <Bar dataKey="count" fill="#1A3A6B" radius={[4, 4, 0, 0]} barSize={40}>
                                        {data.resourcesByType.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#1A3A6B" : "#F4A800"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quiz Engagement */}
                <Card className="lg:col-span-2 rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold text-[#1A3A6B]">Top 10 Quizzes by Attempts</CardTitle>
                        <Zap className="w-5 h-5 text-amber-500" />
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.quizAttemptsByQuiz} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="quizTitle" 
                                        type="category" 
                                        width={120}
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#F4A800" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Downloads Table */}
                <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold text-[#1A3A6B]">Top Resources</CardTitle>
                        <Download className="w-5 h-5 text-emerald-500" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-none">
                                    <TableHead className="text-[10px] font-bold uppercase text-slate-400 pl-8">Resource</TableHead>
                                    <TableHead className="text-right text-[10px] font-bold uppercase text-slate-400 pr-8">Hits</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.topDownloads.map((res: any, idx: number) => (
                                    <TableRow key={res.id} className="border-slate-50">
                                        <TableCell className="pl-8 py-3">
                                            <p className="text-xs font-bold text-[#1A3A6B] truncate max-w-[150px]">{res.title}</p>
                                            <p className="text-[9px] text-slate-400 uppercase font-bold">{res.type}</p>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 bg-emerald-50">{res.downloads}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Quiz Performance Table */}
            <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-50">
                    <CardTitle className="text-lg font-bold text-[#1A3A6B]">Quiz Academic Impact</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="border-none">
                                <TableHead className="text-[10px] font-bold uppercase text-slate-400 pl-8 py-5">Assessment</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Total Attempts</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Pass Rate</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase text-slate-400">Avg. Score</TableHead>
                                <TableHead className="text-right text-[10px] font-bold uppercase text-slate-400 pr-8">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.quizPassRates.map((quiz: any) => (
                                <TableRow key={quiz.quizId} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                                    <TableCell className="pl-8 py-4 font-bold text-xs text-[#1A3A6B]">{quiz.title}</TableCell>
                                    <TableCell className="text-xs font-bold text-slate-500">{quiz.attempts}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-500",
                                                        quiz.passRate > 70 ? "bg-emerald-500" : quiz.passRate > 40 ? "bg-amber-500" : "bg-rose-500"
                                                    )}
                                                    style={{ width: `${quiz.passRate}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600">{quiz.passRate}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-indigo-600">{quiz.avgScore}%</Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-[#1A3A6B] hover:bg-slate-100 rounded-xl">Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAnalyticsClient;
