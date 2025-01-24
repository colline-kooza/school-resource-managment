'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, Star, MessageSquare, ArrowDownUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import TextArea from '../backend/dashboard/FormInputs/TextAreaInput'
import { useForm } from 'react-hook-form'
import CreateAnswerForm from '../backend/forms/CreateAnswerForm'
import { incrementUpVotes } from '@/lib/increament'

export default function QuestionDetail({question,answers}:{question:any,answers:any}) {
 




  const [sortBy, setSortBy] = useState('votes');

   const [loading, setLoading] = useState(false);
      const { register,watch, handleSubmit, reset, formState: { errors } } = useForm({
       
      });

      const date = new Date(question.createdAt);
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = date.toLocaleDateString("en-US");

      const formatDate = (date:any) => {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      };

  
  return (
    <div className="container max-w-4xl py-6 space-y-8">
      {/* Question Card */}
      <Card>
        <CardHeader className="flex flex-row gap-4 space-y-0">
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl font-semibold">{question.title}</h1>
              <p className="text-muted-foreground mt-2">
                {question.content}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{question.user.image}</AvatarFallback>
                </Avatar>
                <span>Posted by {question.user.firstName}</span>
              </div>
              <span className="text-muted-foreground">{formatDate(question.createdAt)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{question.course.title}</Badge>
              <Badge variant="secondary">{question.courseUnit}</Badge>
              <div className="flex-1" />
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{answers.length} answers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{question.stars} stars</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Answers Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{answers.length} Answers</h2>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="votes">Most Votes</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Answer Form */}
        <CreateAnswerForm  questionId={question.id} userId={question.user.id}/>

        {/* Answer List */}
        <div className="space-y-4">
          {/* Sample Answer */}
          {
            answers.map((item:any,i:any)=>{
              return(
                <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <Button onClick={() => incrementUpVotes(item.id)} variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">{item.upVotes}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <p>
                    {item.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={item.user.image} />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <span>Answered by {item.user.name}</span>
                    </div>
                    <span className="text-muted-foreground">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
              )
            })
          }

         
        </div>
      </div>
    </div>
  )
}

