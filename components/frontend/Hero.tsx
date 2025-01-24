import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function Hero() {
  return (
  <div className="bg-green-950 w-full h-32">
      <section className="  w-full relative text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/agriculture-vegetable-field-landscape-view-freshly-growing-84090367.png" alt="Farm background" layout="fill" objectFit="cover" quality={100}/>
        <div className="absolute inset-0 bg-green-900/70" />
      </div>
      <div className="mx-auto px-4 py-24 w-screen relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Cultivate Knowledge, Grow Together</h1>
          <p className="text-xl md:text-2xl mb-8">
            Your all-in-one platform for agricultural discussions, expert answers, and comprehensive knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-green-950 hover:bg-green-700">
              Join the Community
            </Button>
            <Button size="lg" variant="outline" className="border-white hover:bg-white/60 text-green-950">
              Explore Knowledge Base
            </Button>
          </div>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for topics, questions, or articles..."
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white/10 border-white/20 text-green-950 placeholder-green-950 focus:ring-2 focus:ring-green-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-800 to-transparent h-24"/>
    </section>
  </div>
  )
}

