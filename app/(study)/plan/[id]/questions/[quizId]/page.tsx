import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { QuizRunner } from "@/components/study/quiz-runner";

interface PageProps {
  params: Promise<{ id: string; quizId: string }>;
}

export default async function QuizRunPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id, quizId } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: true
    }
  });

  if (!quiz) redirect(`/plan/${id}/questions`);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <QuizRunner quiz={quiz} backUrl={`/plan/${id}/questions`} />
    </div>
  );
}