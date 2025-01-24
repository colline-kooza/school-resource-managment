import { Home, BookOpen, Users, Award, HelpCircle, GraduationCap } from 'lucide-react'

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
              <Home size={20} />
              <span>Home</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
              <BookOpen size={20} />
              <span>Courses</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
              <Users size={20} />
              <span>Study Groups</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
              <Award size={20} />
              <span>Achievements</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
              <GraduationCap size={20} />
              <span>Departments</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
              <HelpCircle size={20} />
              <span>Help Center</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
