import { GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
type LogoProps = {
  title?: string;
  href: string;
  labelShown?: boolean;
};
export default function Logo({ title = "BusiLearn", href, labelShown = true }: LogoProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 group transition-all"
    >
      <div className="relative flex items-center justify-center w-10 h-10 bg-[#163360] rounded-xl shadow-lg group-hover:rotate-6 transition-transform">
        <GraduationCap className="h-6 w-6 text-white" />
        <div className="absolute -bottom-1 -right-1 bg-[#F4A800] text-[#163360] text-[10px] font-bold w-5 h-5 rounded-lg flex items-center justify-center border-2 border-white">
          B
        </div>
      </div>
      {labelShown && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold tracking-tight text-[#163360]">
            Busi<span className="text-[#F4A800]">Learn</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Academic Hub
          </span>
        </div>
      )}
    </Link>
  );
}
