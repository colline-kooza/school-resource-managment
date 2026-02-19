import React from "react";
import { QuizTakingInterface } from "@/components/quiz/QuizTakingInterface";

export default async function QuizTakePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-white">
      <QuizTakingInterface quizId={id} />
    </div>
  );
}
