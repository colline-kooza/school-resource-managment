"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FAQItemProps {
  question: string
  answer: string
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="mb-4">
      <CardContent className="p-0">
        <button
          className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="font-semibold text-slate-900">{question}</span>
          <ChevronDown
            className={`w-5 h-5 text-green-600 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="p-4 text-slate-600 border-t border-slate-200">{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export default function FAQSection() {
  const faqs = [
    {
      question: "How do I create an account on the platform?",
      answer:
        "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details, including your name, email address, and a secure password. Once submitted, you'll receive a confirmation email to activate your account.",
    },
    {
      question: "Can I ask questions anonymously in the Forum?",
      answer:
        "While we encourage open communication, we understand that some topics might be sensitive. You can choose to post questions anonymously in the Forum. However, you'll need to be logged in to use this feature, and moderators will still be able to see your account details if needed for community management purposes.",
    },
    {
      question: "How can I contribute to the Knowledge Base?",
      answer:
        "We welcome contributions from our community! To add to the Knowledge Base, navigate to the Knowledge Base section and click on 'Contribute'. You can submit articles, guides, or resources. All submissions are reviewed by our team before being published to ensure accuracy and relevance.",
    },
    {
      question: "Is there a mobile app for the platform?",
      answer:
        "Yes, we have mobile apps available for both iOS and Android devices. You can download them from the App Store or Google Play Store. The mobile apps offer most of the features available on the web platform, allowing you to stay connected on the go.",
    },
    {
      question: "How do I report inappropriate content or behavior?",
      answer:
        "We take community safety seriously. If you come across any content or behavior that violates our community guidelines, please use the 'Report' button available on all posts and user profiles. Our moderation team will review the report and take appropriate action as quickly as possible.",
    },
  ]

  return (
    <section className="w-full py-12 bg-slate-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-slate-900">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}

