import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ScheduleView } from "@/components/study/schedule-view";
import { redirect } from "next/navigation";

// Definição correta do tipo para Next.js 15+
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlanSchedulePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  // CORREÇÃO CRÍTICA: Aguardar a resolução dos parâmetros
  const { id } = await params;
  
  const plan = await prisma.studyPlan.findUnique({
    where: { id }, // Agora 'id' é uma string válida
    include: {
      tasks: {
        orderBy: { day: 'asc' }
      }
    }
  });

  if (!plan) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-zinc-500">Plano não encontrado.</p>
      </div>
    );
  }

  return <ScheduleView plan={plan} />;
}