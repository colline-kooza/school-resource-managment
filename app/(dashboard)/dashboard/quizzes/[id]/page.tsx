import React from "react";
import { QuizDetailClient } from "@/components/quiz/QuizDetailClient";

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <QuizDetailClient quizId={id} />
    </div>
  );
}
