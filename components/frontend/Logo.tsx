import { AirVent } from "lucide-react";
import Link from "next/link";
import React from "react";
type LogoProps = {
  title?: string;
  href: string;
  labelShown?: boolean;
};
export default function Logo({ title, href, labelShown = true }: LogoProps) {
  return (
    <Link
      href={href}
      className="-m-1 p-1 flex items-center space-x-2 dark:text-slate-900"
    >
      <span className="sr-only">{title}</span>
      <img
        alt=""
        src="/KampusAccess.jpg"
        className="h-8 w-auto"
      />
      <span className="font-bold text-purple-600">{title}</span>
    </Link>
  );
}
