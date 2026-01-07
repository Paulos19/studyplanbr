import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, CheckCircle2, Clock, Zap } from "lucide-react";
import { PerformanceCharts } from "@/components/dashboard/performance-charts";

export default async function PerformancePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Buscar dados agregados de TODOS os planos
  const plans = await prisma.studyPlan.findMany({
    where: { userId: session.user.id as string },
    include: { tasks: true, quizzes: { include: { questions: true } } }
  });

  // Cálculos de Métricas Globais
  let totalTasks = 0;
  let completedTasks = 0;
  let totalQuizzes = 0;
  let totalQuestions = 0;
  
  plans.forEach(plan => {
    totalTasks += plan.tasks.length;
    completedTasks += plan.tasks.filter(t => t.isCompleted).length;
    totalQuizzes += plan.quizzes.length;
    // Assumindo que você tenha como saber acertos no futuro, por enquanto contagem bruta
  });

  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Central de Performance
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Análise global do seu desempenho em todos os editais.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Taxa de Conclusão" 
          value={`${completionRate}%`} 
          icon={TrendingUp} 
          trend="+5% vs semana passada"
          color="blue"
        />
        <KpiCard 
          title="Tarefas Cumpridas" 
          value={completedTasks} 
          icon={CheckCircle2} 
          sub={`de ${totalTasks} planejadas`}
          color="green"
        />
        <KpiCard 
          title="Simulados Gerados" 
          value={totalQuizzes} 
          icon={Zap} 
          trend="IA trabalhando por você"
          color="purple"
        />
        <KpiCard 
          title="Horas Estimadas" 
          value={`${Math.round(totalTasks * 0.8)}h`} // Estimativa
          icon={Clock} 
          sub="Tempo de estudo investido"
          color="amber"
        />
      </div>

      {/* Gráficos */}
      <PerformanceCharts plans={plans} />
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, trend, sub, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900",
    green: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900",
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colors[color]} border`}>
            <Icon size={20} />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {(trend || sub) && (
            <p className="text-xs text-zinc-400 mt-1">
              {trend ? <span className="text-green-600 font-medium">{trend}</span> : sub}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}