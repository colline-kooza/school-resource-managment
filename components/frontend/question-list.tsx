import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown, MessageSquare, Eye, Clock, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { CreateQuestionPopOver } from './question-popup'
import { QuestionSheet } from './QuestionSheet'

interface QuestionListProps {
  className?: string
}

export default function QuestionList({ questions,answers}:{questions:any,answers:any}) {

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex justify-between items-center sticky top-0  dark:from-gray-900 dark:to-gray-800 py-4 z-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Top Questions</h2>
    
          {/* <CreateQuestionPopOver/> */}
          <QuestionSheet/>
       
      </div>
      <ul className="space-y-4">
        {questions.map((question:any,i:any) => (
          <li key={question.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4">
              
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-[#163360] dark:text-blue-400 mb-2">
                  <Link href={`/qa/${question.id}`} className="hover:underline">{question.title}</Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{question.content}</p>
                <div className="space-y-4">
                  <div className="md:flex items-center justify-between">
                    <div className="flex flex-wrap items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={question.user.image} alt={question.user.name} />
                      </Avatar>
                      <div className="text-sm sm:flex">
                        <span className="text-gray-600 dark:text-gray-400">Posted by </span>
                        <a href="#" className="font-medium text-[#163360] dark:text-blue-400 hover:underline">
                          {question.user.name}
                        </a>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(question.createdAt)}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-[#163360] dark:bg-blue-900 dark:text-blue-200">
                      {question.course?.title}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-[#163360] dark:bg-blue-900 dark:text-blue-200">
                      {question.courseUnit?.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-end space-x-4 text-sm text-gray-500 dark:text-gray-400">
                   <Link href={`/qa/${question.id}`}>
                   <span className="flex items-center">
                      <MessageSquare size={16} className="mr-1" />
                      kk answers
                    </span>
                   </Link>
                    <span className="flex items-center">
                      <Star size={16} className="mr-1" />
                      {question.stars} stars
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}




