import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function MyPlansList() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const plans = await prisma.studyPlan.findMany({
    where: {
      userId: session.user.id as string,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tasks: true,
    },
  });

  if (plans.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center p-8 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed">
        <BookOpen className="h-10 w-10 mb-4 opacity-20" />
        <h3 className="font-semibold text-lg">Nenhum plano encontrado</h3>
        <p className="text-sm">Comece criando um novo plano de estudos acima.</p>
      </div>
    );
  }

  return (
    <>
      {plans.map((plan) => {
        const totalTasks = plan.tasks.length;
        const completedTasks = plan.tasks.filter((t) => t.isCompleted).length;
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        return (
          // CORREÇÃO AQUI: Link aponta para a rota limpa /plan/ID
          <Link key={plan.id} href={`/plan/${plan.id}`} className="group">
            <Card className="h-full transition-all hover:border-blue-500 hover:shadow-md dark:hover:border-blue-900 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1 text-lg group-hover:text-blue-600 transition-colors">
                    {plan.title}
                  </CardTitle>
                </div>
                <CardDescription>
                  Criado em {format(plan.createdAt, "d 'de' MMMM, yyyy", { locale: ptBR })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-medium">Progresso</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{progress}%</span>
                  </div>
                  
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }} 
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end text-xs text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    Ver detalhes <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </>
  );
}