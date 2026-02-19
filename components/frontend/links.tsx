import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, FileText, Brain, ArrowRight } from "lucide-react"

export default function QuickLinks() {
  const links = [
    {
      icon: FileText,
      title: "Resources",
      description: "Access past papers and notes",
      href: "/resources",
    },
    {
      icon: MessageSquare,
      title: "Q&A Forum",
      description: "Ask questions and get help",
      href: "/qa",
    },
    {
      icon: Brain,
      title: "Self Quizzes",
      description: "Test your understanding",
      href: "/quizzes",
    },
  ]

  return (
    <section className="w-full px-4 md:px-24 py-8 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {links.map((link, index) => (
            <Link key={index} href={link.href} passHref>
              <Card className="bg-white hover:bg-blue-50/50 transition-all duration-200 cursor-pointer h-full border border-slate-100 shadow-sm hover:shadow-md">
                <CardContent className="flex items-center p-6">
                  <div className="p-3 bg-blue-50 rounded-xl mr-4 group-hover:bg-blue-100 transition-colors">
                    <link.icon className="w-8 h-8 text-[#1A3A6B]" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-1 text-[#1A3A6B]">{link.title}</h3>
                    <p className="text-slate-500 text-sm">{link.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#F4A800]" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}


