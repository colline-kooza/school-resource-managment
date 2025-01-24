import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const categories = [
  { name: 'Engineering Math', count: 156 },
  { name: 'Computer Science', count: 243 },
  { name: 'Biology', count: 89 },
  { name: 'Physics', count: 112 },
  { name: 'Chemistry', count: 78 },
]

export default function TopicCategories() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.name} className="flex justify-between items-center">
              <a href="#" className="text-indigo-600 hover:underline dark:text-indigo-400">{category.name}</a>
              <span className="text-sm text-gray-500 dark:text-gray-400">{category.count}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

