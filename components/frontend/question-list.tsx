"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { QuestionCard } from '@/components/qa/QuestionCard';
import { SkeletonCard } from '@/components/shared/LoadingSkeleton';
import { QuestionSheet } from './QuestionSheet';
import { Search } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

export default function QuestionList({ initialQuestions, initialAnswers }: { initialQuestions: any[], initialAnswers: any[] }) {
  const { data, isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const res = await api.get('/api/questions');
      return res.data;
    },
    initialData: { questions: initialQuestions },
  });

  const questions = data?.questions || [];

  return (
    <div className="space-y-6 py-6 font-Inter">
      <div className="flex justify-between items-center sticky top-0 bg-slate-100/80 backdrop-blur-sm py-4 z-10">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1A3A6B]">Top Questions</h2>
          <p className="text-sm text-slate-500 font-medium">Recently asked community challenges</p>
        </div>
        <QuestionSheet />
      </div>

      {isLoading && questions.length === 0 ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-6">
          {questions.map((q: any) => (
            <QuestionCard 
              key={q.id}
              id={q.id}
              title={q.title}
              content={q.content}
              tags={q.tags}
              upVotes={q.upVotes}
              downVotes={q.downVotes}
              answerCount={q._count.answers}
              views={q.views}
              isResolved={q.isResolved}
              asker={q.user}
              createdAt={q.createdAt}
              courseUnit={q.courseUnit?.title}
              answers={q.answers} 
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No questions found"
          description="Be the first to ask a question in the community!"
        />
      )}
    </div>
  );
}




