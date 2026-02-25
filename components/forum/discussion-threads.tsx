import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageSquare, ThumbsUp, Bookmark, MoreHorizontal } from 'lucide-react'

const threads = [
  {
    id: 1,
    title: 'Tips for solving differential equations?',
    author: { name: 'Alice Johnson', avatar: '', initials: 'AJ' },
    category: 'Engineering Math',
    replies: 23,
    likes: 45,
    isSolved: true,
    createdAt: '2024-01-05T14:48:00.000Z',
  },
  {
    id: 2,
    title: 'Best resources for learning machine learning?',
    author: { name: 'Bob Smith', avatar: '', initials: 'BS' },
    category: 'Computer Science',
    replies: 18,
    likes: 32,
    isSolved: false,
    createdAt: '2024-01-06T09:15:00.000Z',
  },
]

export default function DiscussionThreads() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Discussions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-6">
          {threads.map((thread) => (
            <li key={thread.id} className="border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={thread.author.avatar} alt={thread.author.name} />
                  <AvatarFallback>{thread.author.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold mb-1">
                    <a href="#" className="text-indigo-600 hover:underline dark:text-indigo-400">{thread.title}</a>
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{thread.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{thread.category}</span>
                    {thread.isSolved && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-green-500">Solved</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {thread.replies} Replies
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {thread.likes} Likes
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

