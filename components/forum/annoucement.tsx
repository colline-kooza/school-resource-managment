import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

const announcements = [
  {
    title: 'New Feature: File Attachments',
    content: 'You can now attach files to your discussion threads and comments!',
    date: '2024-01-07',
  },
  {
    title: 'Upcoming Maintenance',
    content: 'The forum will be down for maintenance on January 15th from 2 AM to 4 AM UTC.',
    date: '2024-01-06',
  },
]

export default function Announcements() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {announcements.map((announcement, index) => (
            <li key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
              <h3 className="font-semibold text-lg mb-1">{announcement.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{announcement.content}</p>
              <span className="text-sm text-gray-500 dark:text-gray-400">{announcement.date}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

