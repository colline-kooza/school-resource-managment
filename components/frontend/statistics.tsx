"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Users, MessageSquare, CheckSquare, BookOpen, Sprout } from "lucide-react"

interface StatItemProps {
  icon: React.ElementType
  value: number
  label: string
}

const StatItem = ({ icon: Icon, value, label }: StatItemProps) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md"
    >
      <Icon className="w-8 h-8 mb-2 text-green-600" />
      <motion.span
        className="text-3xl font-bold text-slate-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {value.toLocaleString()}
      </motion.span>
      <span className="text-sm text-slate-600">{label}</span>
    </motion.div>
  )
}

export default function AnimatedStatistics() {
  const stats = [
    { icon: Users, value: 50000, label: "Registered Users" },
    { icon: MessageSquare, value: 75000, label: "Questions Asked" },
    { icon: CheckSquare, value: 120000, label: "Answers Provided" },
    { icon: Sprout, value: 5000, label: "Active Discussions" },
    { icon: BookOpen, value: 1000, label: "Knowledge Base Articles" },
  ]

  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-4 md:py-6 bg-slate-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-slate-900">
          Our Growing Community
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

