import { Home, BookOpen, Users, Award, HelpCircle, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { MdQuestionMark } from 'react-icons/md'

interface MainSidebarProps {
  className?: string
}

export default function MainSidebar({ className }: MainSidebarProps) {
  return (
    <aside className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <nav className="space-y-2">
        <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link href="/resources" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
          <BookOpen size={20} />
          <span>Resources</span>
        </Link>
        <Link href="/forum" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
          <Users size={20} />
          <span>Forum</span>
        </Link>
        <Link href="#" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
          <MdQuestionMark size={20} />
          <span>About</span>
        </Link>
        <Link href="#" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
          <HelpCircle size={20} />
          <span>Help Center</span>
        </Link>
      </nav>
    </aside>
  )
}

