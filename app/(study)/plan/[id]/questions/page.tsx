import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { QuestionsList } from "@/components/study/questions-list";
import { CreateQuizDialog } from "@/components/study/create-quiz-dialog"; // Vamos criar um dialog para isso
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestionsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  // Busca os quizzes salvos para este plano
  const quizzes = await prisma.quiz.findMany({
    where: { planId: id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { questions: true }
      }
    }
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Banco de Questões
          </h2>
          <p className="text-zinc-500 mt-1">
            Gerencie seus simulados e revise seus erros com inteligência artificial.
          </p>
        </div>
        
        {/* Componente para criar novo quiz (Dialog) */}
        <CreateQuizDialog planId={id} />
      </div>

      {/* Lista de Cards */}
      <QuestionsList quizzes={quizzes} planId={id} />
    </div>
  );
}