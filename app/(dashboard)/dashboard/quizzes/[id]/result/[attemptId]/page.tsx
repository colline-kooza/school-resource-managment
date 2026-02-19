import React from "react";
import { QuizResultClient } from "@/components/quiz/QuizResultClient";

export default async function QuizResultPage({ params }: { params: Promise<{ id: string, attemptId: string }> }) {
  const { id, attemptId } = await params;
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <QuizResultClient quizId={id} attemptId={attemptId} />
    </div>
  );
}
