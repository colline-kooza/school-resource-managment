import React from "react";
// import { Button } from "../ui/button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CloseButton({
  href,
  parent = "inventory",
}: {
  href: string;
  parent?: string;
}) {
  return (
    <Button type="button" variant="outline" asChild className="hidden md:block">
      <Link
        href={
          parent === "" ? `/dashboard${href}` : `/dashboard/${parent}${href}`
        }
      >
        Close
      </Link>
    </Button>
  );
}
