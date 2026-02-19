"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { 
  Users, 
  Search, 
  Filter, 
  Shield, 
  UserCog, 
  Lock, 
  Unlock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
    Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/use-debounce";

interface UserManagementClientProps {
  campuses: any[];
}

const UserManagementClient: React.FC<UserManagementClientProps> = ({ campuses }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [campusId, setCampusId] = useState("all");
  
  const [confirmModal, setConfirmModal] = useState<{
      open: boolean;
      userId: string;
      action: "role" | "status";
      payload: any;
      title: string;
      description: string;
  }>({
      open: false,
      userId: "",
      action: "role",
      payload: null,
      title: "",
      description: ""
  });

  const debouncedSearch = useDebounce(search, 500);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search: debouncedSearch,
        role: role !== "all" ? role : "",
        status: status !== "all" ? status : "",
        campusId: campusId !== "all" ? campusId : ""
      });
      const response = await api.get(`/api/users?${params.toString()}`);
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, role, status, campusId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusToggle = (userId: string, currentStatus: boolean, name: string) => {
      setConfirmModal({
          open: true,
          userId,
          action: "status",
          payload: !currentStatus,
          title: currentStatus ? "Deactivate Account?" : "Activate Account?",
          description: currentStatus 
            ? `Are you sure you want to deactivate ${name}'s account? They will lose platform access immediately.`
            : `Are you sure you want to reactivate ${name}'s account?`
      });
  };

  const handleRoleChange = (userId: string, newRole: string, name: string) => {
      setConfirmModal({
          open: true,
          userId,
          action: "role",
          payload: newRole,
          title: "Update User Role?",
          description: `Are you sure you want to change ${name}'s role to ${newRole}? This will update their platform permissions.`
      });
  };

  const executeAction = async () => {
      try {
          if (confirmModal.action === "status") {
              await api.patch(`/api/users/${confirmModal.userId}/status`, { status: confirmModal.payload });
              toast.success("Account status updated");
          } else {
              await api.patch(`/api/users/${confirmModal.userId}/role`, { role: confirmModal.payload });
              toast.success("User role updated");
          }
          setConfirmModal(prev => ({ ...prev, open: false }));
          fetchUsers();
      } catch (error) {
          toast.error("Operation failed");
      }
  };

  const RoleBadge = ({ role }: { role: string }) => {
    const variants: any = {
      ADMIN: "bg-rose-100 text-rose-700 border-rose-200",
      LECTURER: "bg-amber-100 text-amber-700 border-amber-200",
      STUDENT: "bg-indigo-100 text-indigo-700 border-indigo-200"
    };
    return (
      <Badge variant="outline" className={cn("font-bold text-[10px] tracking-wide", variants[role] || "bg-slate-100")}>
        {role}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1A3A6B]">Users Management</h2>
            <p className="text-sm text-slate-400 font-medium mt-1">Manage platform accounts, roles, and access status</p>
          </div>
          <div className="flex items-center gap-3">
              <Badge className="bg-[#1A3A6B] text-white py-1.5 px-4 rounded-full font-bold">Total: {total}</Badge>
          </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-1 md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search name, email, ID..." 
                className="pl-10 rounded-xl border-slate-200 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
          </div>
          <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="rounded-xl border-slate-200 bg-white">
                  <SelectValue placeholder="Role: All" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">Role: All</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="LECTURER">Lecturer</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-xl border-slate-200 bg-white">
                  <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">Status: All</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
          </Select>
          <Select value={campusId} onValueChange={setCampusId}>
              <SelectTrigger className="rounded-xl border-slate-200 bg-white">
                  <SelectValue placeholder="Campus: All" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">Campus: All</SelectItem>
                  {campuses.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
              </SelectContent>
          </Select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-50">
          <Table>
              <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-none">
                      <TableHead className="text-[10px] font-bold uppercase text-slate-400 px-8 py-5">User</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-slate-400">Role</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-slate-400">Campus / Course</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-slate-400">Status</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-slate-400">Joined</TableHead>
                      <TableHead className="text-right text-[10px] font-bold uppercase text-slate-400 px-8">Actions</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {loading ? (
                      [1, 2, 3, 4, 5].map(i => (
                          <TableRow key={i}>
                              <TableCell className="px-8 py-4"><div className="flex items-center gap-3"><Loader2 className="animate-spin w-4 h-4 text-slate-200" /><div className="space-y-2"><div className="h-3 w-32 bg-slate-100 rounded" /><div className="h-2 w-20 bg-slate-50 rounded" /></div></div></TableCell>
                              <TableCell><div className="h-5 w-16 bg-slate-100 rounded-full" /></TableCell>
                              <TableCell><div className="h-3 w-24 bg-slate-50 rounded" /></TableCell>
                              <TableCell><div className="h-6 w-10 bg-slate-100 rounded-full" /></TableCell>
                              <TableCell><div className="h-3 w-16 bg-slate-50 rounded" /></TableCell>
                              <TableCell className="text-right px-8"><div className="h-8 w-8 bg-slate-100 rounded-lg ml-auto" /></TableCell>
                          </TableRow>
                      ))
                  ) : users.length === 0 ? (
                      <TableRow>
                          <TableCell colSpan={6} className="py-20 text-center">
                              <Users className="w-12 h-12 text-slate-200 mx-auto transition-transform hover:scale-110" />
                              <p className="text-sm font-bold text-slate-400 mt-4">No users matching your criteria.</p>
                          </TableCell>
                      </TableRow>
                  ) : (
                      users.map((user) => (
                          <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                              <TableCell className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                  <UserAvatar 
                                    src={user.image} 
                                    name={user.name} 
                                    size="sm" 
                                    className="ring-2 ring-slate-50"
                                  />
                                  <div className="max-w-[180px]">
                                    <p className="text-xs font-bold text-[#1A3A6B] truncate">{user.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <RoleBadge role={user.role} />
                              </TableCell>
                              <TableCell>
                                <p className="text-[10px] font-bold text-slate-600">{user.campus?.title || "No Campus"}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{user.course?.title || "No Course"}</p>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Switch 
                                    checked={user.status} 
                                    onCheckedChange={() => handleStatusToggle(user.id, user.status, user.name)}
                                    className="data-[state=checked]:bg-emerald-500 scale-75"
                                  />
                                  <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest",
                                    user.status ? "text-emerald-500" : "text-rose-500"
                                  )}>
                                    {user.status ? "Active" : "Inactive"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="text-[10px] font-medium text-slate-400 italic">
                                  {format(new Date(user.createdAt), "dd MMM yyyy")}
                                </p>
                              </TableCell>
                              <TableCell className="text-right px-8">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-100 shadow-xl p-2 font-Inter">
                                    <DropdownMenuLabel className="text-[10px] font-bold uppercase text-slate-400 px-3 py-2">Quick Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-slate-50" />
                                    <DropdownMenuItem 
                                        onClick={() => handleRoleChange(user.id, "ADMIN", user.name)}
                                        className="rounded-xl px-3 py-2 text-xs font-bold text-rose-600 flex items-center justify-between"
                                    >
                                      Make Admin <ShieldCheck className="w-3.5 h-3.5" />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleRoleChange(user.id, "LECTURER", user.name)}
                                        className="rounded-xl px-3 py-2 text-xs font-bold text-amber-600 flex items-center justify-between"
                                    >
                                      Make Lecturer <UserCog className="w-3.5 h-3.5" />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleRoleChange(user.id, "STUDENT", user.name)}
                                        className="rounded-xl px-3 py-2 text-xs font-bold text-indigo-600 flex items-center justify-between"
                                    >
                                      Make Student <GraduationCap className="w-3.5 h-3.5" />
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-50" />
                                    <DropdownMenuItem 
                                        onClick={() => handleStatusToggle(user.id, user.status, user.name)}
                                        className={cn(
                                            "rounded-xl px-3 py-2 text-xs font-bold flex items-center justify-between",
                                            user.status ? "text-rose-600" : "text-emerald-600"
                                        )}
                                    >
                                      {user.status ? "Deactivate" : "Activate"}
                                      {user.status ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                          </TableRow>
                      ))
                  )}
              </TableBody>
          </Table>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex items-center justify-between px-8 py-5 border-t border-slate-50 bg-slate-50/20">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                Showing <span className="text-[#1A3A6B]">{(page - 1) * 20 + 1}</span> - <span className="text-[#1A3A6B]">{Math.min(page * 20, total)}</span> of <span className="text-[#1A3A6B]">{total}</span> Users
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl px-4 border-slate-200" 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl px-4 border-slate-200"
                  disabled={page * 20 >= total}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
      </div>

      <ConfirmDialog 
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, open }))}
        onConfirm={executeAction}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmLabel="Continue"
        cancelLabel="Cancel"
        danger={confirmModal.action === "status" && confirmModal.payload === false}
      />
    </div>
  );
};

export default UserManagementClient;
