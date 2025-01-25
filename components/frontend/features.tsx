import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, BookOpen, Check } from "lucide-react"

export default function AgricultureFeatures() {
  const features = [
    {
      icon: MessageSquare,
      title: "Forum/Q&A",
      description: "Ask and answer questions, share tips, and solve agricultural issues.",
      keyFeatures: [
        "Question posting with relevant tags",
        "Answering mechanism with comments",
        "Voting system for quality answers",
        "Accepted answer marking",
        "Badges and rewards for engagement",
      ],
    },
    {
      icon: Users,
      title: "Community Discussions",
      description: "Engage in topic-based discussions on broader agricultural issues.",
      keyFeatures: [
        "Discussion threads with titles and content",
        "Organized categories (e.g., organic farming, pest control)",
        "Comments and nested replies",
        "Sorting options (newest, most popular, most commented)",
      ],
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Access a searchable archive of articles, guides, and resources.",
      keyFeatures: [
        "Categorized content on various agricultural topics",
        "Tags and filtering options",
        "Rich media support (images, videos, infographics)",
        "Easy-to-navigate structure",
      ],
    },
  ]

  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-4 md:py-6 bg-white text-green-900">
      <div className="container px-4 md:px-6">
        <h2 className="text-xl font-bold tracking-tighter sm:text-3xl text-center mb-12">
          Empowering Agriculture Through Community and Knowledge
        </h2>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col h-full bg-slate-100 text-slate-600">
              <CardHeader>
                <feature.icon className="w-10 h-10 mb-4 text-green-300" />
                <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                <CardDescription className="text-green-100">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {feature.keyFeatures.map((keyFeature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 mr-2 text-green-300" />
                      <span>{keyFeature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

