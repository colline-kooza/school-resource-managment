"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { 
  Bell, 
  Check, 
  Loader2, 
  ArrowRight, 
  Filter,
  CheckCheck,
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function NotificationsClient() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Fetch notifications
  const { data, isLoading } = useQuery({
    queryKey: ["notifications", "list", { page, unreadOnly }],
    queryFn: async () => {
      const { data } = await api.get(`/api/notifications?page=${page}&unread=${unreadOnly}`);
      return data;
    },
  });

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await api.patch("/api/notifications", { markAllRead: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Mark single as read mutation
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/api/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleNotificationClick = async (notif: any) => {
    if (notif.status === "UNREAD") {
      await markReadMutation.mutateAsync(notif.id);
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <div className="space-y-8 font-Inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A3A6B]">Notifications</h1>
          <p className="text-slate-400 font-medium mt-1">
            Stay updated with your activities and platform announcements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-slate-100 font-bold text-xs h-10 px-4"
            onClick={() => setUnreadOnly(!unreadOnly)}
          >
            <Filter className="w-3.5 h-3.5 mr-2" />
            {unreadOnly ? "Show All" : "Filter Unread"}
          </Button>
          <Button
            className="bg-[#1A3A6B] hover:bg-[#1A3A6B]/90 text-white rounded-xl font-bold text-xs h-10 px-4 shadow-lg shadow-[#1A3A6B]/20 transition-all hover:scale-[1.02]"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
          >
            {markAllReadMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5 mr-2" />
            )}
            Mark all Read
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))
        ) : !data?.notifications || data.notifications.length === 0 ? (
          <Card className="border-none bg-white shadow-sm rounded-3xl p-12 overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                 <Bell className="w-10 h-10 text-slate-200" />
               </div>
               <h3 className="text-xl font-bold text-[#1A3A6B]">You're all caught up! 🎉</h3>
               <p className="text-slate-400 max-w-sm font-medium">
                 {unreadOnly 
                    ? "No unread notifications to show. Check your archive to see previous messages." 
                    : "No notifications here yet. We'll let you know when something important happens."
                 }
               </p>
               {unreadOnly && (
                 <Button 
                    variant="link" 
                    className="text-[#F4A800] font-bold"
                    onClick={() => setUnreadOnly(false)}
                 >
                    View previous notifications
                 </Button>
               )}
            </CardContent>
          </Card>
        ) : (
          data.notifications.map((notif: any) => (
            <Card 
              key={notif.id}
              className={cn(
                "group relative border-none shadow-sm rounded-2xl overflow-hidden transition-all hover:shadow-md cursor-pointer",
                notif.status === "UNREAD" ? "bg-white border-l-4 border-l-[#1A3A6B]" : "bg-slate-50/50"
              )}
              onClick={() => handleNotificationClick(notif)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn(
                        "text-sm font-bold",
                        notif.status === "UNREAD" ? "text-[#1A3A6B]" : "text-slate-600"
                      )}>
                        {notif.title}
                      </h3>
                      {notif.status === "UNREAD" && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium mb-3">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </p>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                      {notif.message}
                    </p>
                  </div>
                  {notif.link && (
                    <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-[#1A3A6B]" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
            <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-100"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            >
                Previous
            </Button>
            <div className="flex items-center gap-1">
                {[...Array(data.meta.totalPages)].map((_, i) => (
                    <Button
                        key={i}
                        variant={page === i + 1 ? "default" : "outline"}
                        size="sm"
                        className={cn(
                            "w-8 h-8 rounded-lg text-xs font-bold",
                            page === i + 1 ? "bg-[#1A3A6B]" : "border-slate-100"
                        )}
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </Button>
                ))}
            </div>
            <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-100"
                disabled={page === data.meta.totalPages}
                onClick={() => setPage(page + 1)}
            >
                Next
            </Button>
        </div>
      )}
    </div>
  );
}
