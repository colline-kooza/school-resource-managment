"use client";
import Image from "next/image";
import React from "react";
export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-[200px] ">
        <Image src="/KampusAccess.jpg" width={100} height={100} alt="kampus access ug"/>
        </div>
        <div className="pt-4">
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    </div>
  );
}

