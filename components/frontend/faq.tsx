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
    <Card className="mb-4 border-slate-100 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <button
          className="flex justify-between items-center w-full p-5 text-left focus:outline-none transition-colors hover:bg-slate-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="font-bold text-[#163360]">{question}</span>
          <ChevronDown
            className={`w-5 h-5 text-[#F4A800] transition-transform duration-300 ${
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
              <p className="px-5 pb-5 text-slate-600 border-t border-slate-50 pt-4 leading-relaxed">{answer}</p>
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
      question: "How do I access past papers and lecture notes?",
      answer:
        "Once you're logged in, navigate to the 'Resources' section. You can use the search bar to filter by course unit name or code. All materials are categorized by year and semester for easy access.",
    },
    {
      question: "Who can upload resources to BusiLearn?",
      answer:
        "Currently, only Lecturers and Admins can upload verified resources like lecture notes. However, students can contribute through the Q&A Forum and share study tips. Student uploads will be available in the next update.",
    },
    {
      question: "Is the platform free to use for all ADE students?",
      answer:
        "Yes, BusiLearn is a free resource developed for the students. You only need your university email or student details to register.",
    },
    {
      question: "Can I take quizzes on my mobile phone?",
      answer:
        "Absolutely! BusiLearn is fully responsive and works perfectly on smartphones. While we don't have a native app yet, the web experience is optimized for mobile study sessions.",
    },
    {
      question: "How do I report an error in a resource?",
      answer:
        "If you find an error in a quiz or lecture note, please use the 'Report' flag within that specific resource, or start a discussion in the 'Community' section. Our moderators will review it promptly.",
    },
  ]

  return (
    <section className="w-full py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extrabold tracking-tighter sm:text-3xl text-[#163360] mb-4">
            Got Questions?
          </h2>
          <p className="text-base text-slate-500 max-w-2xl mx-auto">
            Everything you need to know about navigating the BusiLearn platform.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}


