"use client"
import React, { useState } from 'react'
import { Search, Plus, Book, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
    title: string
    description: string
    articles: number
    subscribers: number
    icon: React.ElementType
  }

export default function Knowledge() {
    const [searchQuery, setSearchQuery] = useState("")

  const categories: Category[] = [
    {
      title: "General Science",
      description: "Fundamental concepts in physics, chemistry, and biology for all levels.",
      articles: 156,
      subscribers: 2345,
      icon: Book,
    },
    {
      title: "Business & Finance",
      description: "Explore accounting, management, and economic principles.",
      articles: 98,
      subscribers: 1876,
      icon: Book,
    },
    {
      title: "Information Technology",
      description: "Learn about software development, networking, and digital systems.",
      articles: 134,
      subscribers: 3210,
      icon: Book,
    },
    {
      title: "Humanities & Arts",
      description: "Dive into literature, history, philosophy, and creative arts.",
      articles: 87,
      subscribers: 2654,
      icon: Book,
    },
    {
      title: "Engineering",
      description: "Principles and applications of civil, electrical, and mechanical engineering.",
      articles: 112,
      subscribers: 1987,
      icon: Book,
    },
    {
      title: "Social Sciences",
      description: "Understand society, psychology, and human behavior through research.",
      articles: 145,
      subscribers: 2789,
      icon: Book,
    },
  ]
  return (
    <div>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search the knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
        <Button className="bg-[#163360] hover:bg-[#0c1f3a] text-white">
          <Plus className="mr-2 h-4 w-4" /> Add New Topic
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900">
                <category.icon className="mr-2 h-5 w-5 text-[#163360]" />
                {category.title}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-slate-600">
                <span className="flex items-center">
                  <Book className="mr-1 h-4 w-4" /> {category.articles} articles
                </span>
                <span className="flex items-center">
                  <Users className="mr-1 h-4 w-4" /> {category.subscribers} subscribers
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
