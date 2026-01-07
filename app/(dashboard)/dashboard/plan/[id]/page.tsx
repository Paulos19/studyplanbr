import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TaskList } from "@/components/dashboard/task-list";
import { QuizPanel } from "@/components/dashboard/quiz-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, Dumbbell } from "lucide-react";

export default async function PlanDetailsPage({ params }: { params: { id: string } }) {
  // Acesso ao params em Next.js 15+ pode exigir await se for dynamic, 
  // mas no 14/standard é direto.
  // Vamos garantir que 'id' exista.
  const { id } = await params; 

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const plan = await prisma.studyPlan.findUnique({
    where: { 
      id: id,
      userId: session.user.id as string 
    },
    include: {
      tasks: {
        orderBy: { day: 'asc' } // Ou outra lógica de ordenação
      }
    }
  });

  if (!plan) redirect("/dashboard");

  // Cálculo de progresso
  const totalTasks = plan.tasks.length;
  const completedTasks = plan.tasks.filter(t => t.isCompleted).length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header do Plano */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{plan.title}</h1>
          <p className="text-zinc-500">{plan.description || "Sem descrição"}</p>
        </div>
        <Card className="px-6 py-3 flex items-center gap-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Progresso</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{progress}%</p>
          </div>
          <div className="h-10 w-10 rounded-full border-4 border-blue-500 flex items-center justify-center text-[10px] font-bold">
            {completedTasks}/{totalTasks}
          </div>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="schedule" className="flex gap-2">
            <CalendarDays size={16} /> Cronograma
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex gap-2">
            <Dumbbell size={16} /> Questões
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="mt-6">
          <TaskList tasks={plan.tasks} />
        </TabsContent>
        
        <TabsContent value="quiz" className="mt-6">
          <QuizPanel planId={plan.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}