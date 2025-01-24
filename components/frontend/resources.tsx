import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from 'lucide-react'

interface ResourceCardProps {
  title: string;
  course: string;
  courseUnit: string;
  campus: string;
  category: string;
  type: string;
}

export function ResourceCard({ title, course, courseUnit, campus, category, type }: ResourceCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-4 w-4 text-purple-500 flex-shrink-0" />
          <span className="truncate" title={title}>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm"><span className="font-semibold">Course:</span> {course}</p>
        <p className="text-sm"><span className="font-semibold">Unit:</span> {courseUnit}</p>
        <p className="text-sm"><span className="font-semibold">Campus:</span> {campus}</p>
        <p className="text-sm"><span className="font-semibold">Category:</span> {category}</p>
        <p className="text-sm"><span className="font-semibold">Type:</span> {type}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full text-sm group hover:bg-purple-500 hover:text-white">
          <Download className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}

