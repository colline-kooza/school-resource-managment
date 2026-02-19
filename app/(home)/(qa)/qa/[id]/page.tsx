// app/(home)/qa/[id]/page.tsx
export const dynamic = "force-dynamic";
import QuestionDetail from '@/components/frontend/question-details';
import { getData } from '@/lib/getData';
import { getSingleDataItem } from '@/lib/getSingleDataItem';


export default async function QuestionPage({params}: {params: Promise<{ id: string }>}) {
 

  try {
    const {id} =await params
    const endPoint = 'questions';
    
    const [question, questions] = await Promise.all([
      getSingleDataItem(id, endPoint),
      getData(endPoint)
    ]);

    if (!question) {
      return <div className="p-4 text-center">Question not found</div>;
    }

    const answers =await getData("answers");
    const filteredAnswers = answers.filter((item: any) => item.questionId === question.id);

console.log(filteredAnswers);

    console.log(answers);

    // const filteredQuestions = (questions).filter((item) => 
    //   item.course.title.toLowerCase() === question.course.title.toLowerCase() &&
    //   item.id !== id
    // );

    return (
      <div>
        <QuestionDetail 
          question={question}
          answers={filteredAnswers}
          // relatedQuestions={filteredQuestions}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading question:', error);

    
    return (
      <div className="p-4 text-center text-red-600">
        Error loading question. Please try again later.
      </div>
    );
  }
}