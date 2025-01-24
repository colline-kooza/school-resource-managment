import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

const trendingTopics = [
  { title: 'Quantum Computing Basics', views: 1234 },
  { title: 'AI Ethics in Modern Society', views: 987 },
  { title: 'Renewable Energy Technologies', views: 876 },
  { title: 'Blockchain in Finance', views: 765 },
  { title: 'Genetic Engineering Advancements', views: 654 },
]

export default function TrendingTopics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <li key={index} className="flex justify-between items-center">
              <a href="#" className="text-indigo-600 hover:underline dark:text-indigo-400">{topic.title}</a>
              <span className="text-sm text-gray-500 dark:text-gray-400">{topic.views} views</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

