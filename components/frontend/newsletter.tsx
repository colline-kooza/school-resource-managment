"use client"

import { useState } from "react"
import { Mail, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    // Mock API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Success! You'll now receive ADE updates.")
      setEmail("")
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full py-20 bg-[#F5F7FA]">
      <div className="container px-4 md:px-6">
        <Card className="max-w-xl mx-auto border-none shadow-lg overflow-hidden">
          <div className="bg-[#163360] py-3 flex justify-center">
            <Bell className="w-6 h-6 text-[#F4A800]" />
          </div>
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl font-bold text-[#163360]">Stay Informed</CardTitle>
            <CardDescription className="text-slate-500 text-base">
              Get notified about new past papers, internship opportunities, and campus announcements.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2 relative group">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 group-focus-within:text-[#163360]" />
                <Input
                  type="email"
                  placeholder="Enter your student email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-grow pl-10 border-slate-200 focus:border-[#163360] focus:ring-[#163360]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#163360] hover:bg-[#122b52] text-white font-bold h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Join Mailing List"}
              </Button>
              {message && (
                <p className={`text-sm text-center font-medium ${message.includes("error") ? "text-red-500" : "text-[#163360]"}`}>
                  {message}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}


