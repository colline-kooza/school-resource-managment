import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, TrendingUp, BookOpen, ExternalLink } from 'lucide-react'
import Link from "next/link"

interface RightSidebarProps {
  className?: string
  resources:string[]
}

export default function RightSidebar({ className,resources }: RightSidebarProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Sponsored</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-slate-100 dark:bg-slate-800 aspect-video flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Advertisement Space</p>
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Recent Discussions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { title: "Tips for Final Exams", author: "Alex Kim", replies: 23, avatar: "/placeholder.svg?height=32&width=32", initials: "AK" },
            { title: "Study Group for Economics", author: "Maria Garcia", replies: 15, avatar: "/placeholder.svg?height=32&width=32", initials: "MG" },
            { title: "Research Paper Guidelines", author: "James Wilson", replies: 19, avatar: "/placeholder.svg?height=32&width=32", initials: "JW" }
          ].map((discussion) => (
            <div key={discussion.title} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={discussion.avatar} alt={discussion.author} />
                <AvatarFallback>{discussion.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <a href="#" className="text-sm font-medium hover:underline block">{discussion.title}</a>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{discussion.author}</span>
                  <span className="mx-1">•</span>
                  <span>{discussion.replies} replies</span>
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-sm" size="sm">
            View All Discussions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Recent Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resources.slice(0,4).map((resource:any,i:any) => (
            <div key={resource.title} className="flex items-center justify-between">
              <div className="space-y-1">
                <Link href="#" className="text-sm font-medium hover:underline block">{resource.title}</Link>
                <p className="text-xs text-muted-foreground">{resource.campus.title} downloads</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Link href="/resources">
          <Button variant="ghost" className="w-full text-sm" size="sm">
            Browse Resources
          </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Platform Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Active Users", value: "2,345" },
              { label: "Questions Today", value: "127" },
              { label: "Answers Today", value: "486" },
              { label: "Resources Shared", value: "1,293" }
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <span className="text-sm font-medium">{stat.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

