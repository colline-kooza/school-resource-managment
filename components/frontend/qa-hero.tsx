"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

export default function QaHero() {
  return (
    <div className="bg-gradient-to-r from-[#163360] to-[#0c1f3a] text-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <p className="mt-6 text-xl max-w-2xl mx-auto">
          Your platform for collaborative learning. Ask questions, share knowledge, and grow together.
        </p>
        <div className="mt-10 max-w-xl mx-auto">
          <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-sm items-center space-x-2 mx-auto">
            <Input
              type="text"
              placeholder="Search similar questions..."
              className="flex-grow bg-white text-gray-900 placeholder-gray-500"
            />
            <Button type="submit" className="bg-[#163360] hover:bg-[#0c1f3a] text-white">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

