import Knowledge from "@/components/frontend/knowledge"
import { useState } from "react"



export default function page() {
  

  return (
    <div className=" mx-auto px-4 md:px-12 lg:px-24 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Agricultural Knowledge Base</h1>
      <Knowledge/>
    </div>
  )
}

