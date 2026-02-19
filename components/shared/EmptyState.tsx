import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="bg-slate-50 p-4 rounded-full mb-4">
        <Icon className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-[#1A3A6B] mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6">{description}</p>
      
      {actionLabel && (
        <>
          {actionHref ? (
            <Link href={actionHref}>
              <Button className="bg-[#1A3A6B] hover:bg-[#122b52] text-white">
                {actionLabel}
              </Button>
            </Link>
          ) : onAction ? (
            <Button 
              onClick={onAction}
              className="bg-[#1A3A6B] hover:bg-[#122b52] text-white"
            >
              {actionLabel}
            </Button>
          ) : null}
        </>
      )}
    </div>
  );
}
