"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Heart } from "lucide-react";
import { ResourceCard } from "@/components/shared/ResourceCard";
import { SkeletonCard } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { toast } from "react-hot-toast";

const BookmarksClient = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/bookmarks");
      setBookmarks(res.data);
    } catch (error) {
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = async (resourceId: string) => {
    try {
      await api.delete(`/api/bookmarks/${resourceId}`);
      setBookmarks(bookmarks.filter(b => b.resource.id !== resourceId));
      toast.success("Removed from bookmarks");
    } catch (error) {
      toast.error("Failed to remove bookmark");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10 font-Inter">
      <div>
        <h2 className="text-3xl font-bold text-[#1A3A6B] tracking-tight">Saved Resources</h2>
        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
           Your personal library of study materials
        </p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookmarks.map((bookmark) => (
            <ResourceCard
              key={bookmark.id}
              id={bookmark.resource.id}
              title={bookmark.resource.title}
              type={bookmark.resource.type}
              courseUnitTitle={bookmark.resource.courseUnit?.title || "No unit"}
              year={bookmark.resource.year}
              semester={bookmark.resource.semester}
              downloads={bookmark.resource.downloads}
              isBookmarked={true}
              onBookmarkToggle={() => handleBookmarkToggle(bookmark.resource.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No bookmarks yet"
          description="Save resources you find helpful to easily find them later."
          actionLabel="Browse Resources"
          actionHref="/resources"
        />
      )}
    </div>
  );
};

export default BookmarksClient;
