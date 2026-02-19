"use client";

import React, { useState } from "react";
import { Bell, Check, Loader2, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function NotificationBell() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch unread count
  const { data: unreadCountData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const { data } = await api.get("/api/notifications/unread-count");
      return data.count;
    },
    refetchInterval: 30000, // Poll every 30s
  });

  // Fetch latest notifications
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["notifications", "latest"],
    queryFn: async () => {
      const { data } = await api.get("/api/notifications?limit=5");
      return data.notifications;
    },
    enabled: isOpen,
  });

  // Mark single as read mutation
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/api/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to update notification");
    }
  });

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await api.patch("/api/notifications", { markAllRead: true });
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to mark notifications as read");
    }
  });

  const handleNotificationClick = async (notif: any) => {
    if (notif.status === "UNREAD") {
      await markReadMutation.mutateAsync(notif.id);
    }
    setIsOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-full text-gray-500 hover:text-[#1A3A6B] hover:bg-blue-50 transition-colors focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCountData > 0 && (
            <span
              className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
              style={{ backgroundColor: "#EF4444" }}
            >
              {unreadCountData > 9 ? "9+" : unreadCountData}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 border-none shadow-xl rounded-2xl overflow-hidden font-Inter">
        <div className="p-4 bg-white border-b flex items-center justify-between">
          <DropdownMenuLabel className="p-0 font-bold text-sm text-[#1A3A6B]">
            Notifications
          </DropdownMenuLabel>
          {unreadCountData > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[10px] font-bold text-[#F4A800] hover:text-[#1A3A6B] hover:bg-blue-50 rounded-lg px-2"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
            >
              {markAllReadMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </>
              )}
            </Button>
          )}
        </div>
        <div className="max-h-[350px] overflow-y-auto">
          {isLoading ? (
            <div className="p-10 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 text-[#1A3A6B] animate-spin" />
              <p className="text-[10px] font-bold text-slate-400">Loading notifications...</p>
            </div>
          ) : !notificationsData || notificationsData.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                <Bell className="h-6 w-6 text-slate-200" />
              </div>
              <p className="text-xs font-bold text-slate-400">Nothing here yet. 🔔</p>
            </div>
          ) : (
            notificationsData.map((notif: any) => (
              <DropdownMenuItem
                key={notif.id}
                className={cn(
                  "flex flex-col items-start p-4 cursor-pointer focus:bg-blue-50/50 border-b border-slate-50 last:border-0",
                  notif.status === "UNREAD" ? "bg-white border-l-4 border-l-[#1A3A6B]" : "bg-slate-50/50"
                )}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={cn(
                    "text-xs font-bold truncate pr-2",
                    notif.status === "UNREAD" ? "text-[#1A3A6B]" : "text-slate-500"
                  )}>
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <Link href="/notifications" onClick={() => setIsOpen(false)}>
          <div className="p-3 text-center text-[11px] font-bold text-[#1A3A6B] hover:bg-slate-50 transition-colors">
            View all notifications →
          </div>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
