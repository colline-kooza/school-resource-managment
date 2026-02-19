import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  total: number;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  total,
  page,
  pageSize = 20,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-xl"
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(
          <div key="start-ellipsis" className="flex items-center justify-center w-10">
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </div>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={page === i ? "default" : "ghost"}
          size="sm"
          className={cn(
            "w-10 h-10 rounded-xl font-bold",
            page === i ? "bg-[#1A3A6B] text-white" : "text-slate-600"
          )}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <div key="end-ellipsis" className="flex items-center justify-center w-10">
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </div>
        );
      }
      pages.push(
        <Button
          key={totalPages}
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-xl"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className={cn("flex items-center justify-between py-4", className)}>
      <p className="text-sm text-slate-500 font-medium">
        Showing <span className="text-[#1A3A6B] font-bold">{Math.min(total, (page - 1) * pageSize + 1)}</span> to{" "}
        <span className="text-[#1A3A6B] font-bold">{Math.min(total, page * pageSize)}</span> of{" "}
        <span className="text-[#1A3A6B] font-bold">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="w-10 h-10 rounded-xl text-[#1A3A6B]"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="hidden sm:flex items-center gap-1">{renderPageNumbers()}</div>
        <div className="sm:hidden font-bold text-[#1A3A6B] mx-4">
          Page {page} of {totalPages}
        </div>

        <Button
          variant="ghost"
          size="icon"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="w-10 h-10 rounded-xl text-[#1A3A6B]"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
