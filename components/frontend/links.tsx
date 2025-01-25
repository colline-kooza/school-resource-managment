import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Users, BookOpen, ArrowRight } from "lucide-react"

export default function QuickLinks() {
  const links = [
    {
      icon: MessageSquare,
      title: "Forum/Q&A",
      description: "Ask questions, share knowledge",
      href: "/forum",
    },
    {
      icon: Users,
      title: "Community Discussions",
      description: "Engage in agricultural topics",
      href: "/discussions",
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Access guides and resources",
      href: "/knowledge-base",
    },
  ]

  return (
    <section className="w-full px-4 md:px-24 py-8 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {links.map((link, index) => (
            <Link key={index} href={link.href} passHref>
              <Card className="bg-slate-50 hover:bg-slate-100 transition-colors duration-200 cursor-pointer h-full border border-slate-200">
                <CardContent className="flex items-center p-6">
                  <link.icon className="w-10 h-10 mr-4 text-green-600" />
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-1 text-slate-900">{link.title}</h3>
                    <p className="text-slate-600 text-sm">{link.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-green-600" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

