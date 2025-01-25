"use client"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-cyan-100 dark:from-gray-900 dark:to-gray-800">
      {/* <Header /> */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Community</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-grow">
            <form onSubmit={(e) => e.preventDefault()} className="flex w-full items-center space-x-2">
              <Input type="text" placeholder="Search discussions..." className="flex-grow" />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>Start New Discussion</Button>
        </div>
        {children}
      </main>
    </div>
  )
}

