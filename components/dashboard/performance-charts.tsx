"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PerformanceCharts({ plans }: { plans: any[] }) {
  // 1. Processamento de Dados: Gráfico de Barras (Tarefas Totais vs Feitas)
  const tasksData = plans.map(p => ({
    name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
    fullTitle: p.title,
    Total: p.tasks.length,
    Feito: p.tasks.filter((t: any) => t.isCompleted).length
  }));

  // 2. Processamento de Dados: Gráfico de Pizza (Distribuição de Métodos)
  const methodCounts: any = {};
  plans.forEach(p => {
    p.tasks.forEach((t: any) => {
      // Conta ocorrências de 'Teoria', 'Exercícios', 'Revisão'
      methodCounts[t.method] = (methodCounts[t.method] || 0) + 1;
    });
  });
  
  const pieData = Object.keys(methodCounts).map(key => ({
    name: key,
    value: methodCounts[key]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {/* Gráfico de Barras: Progresso por Plano */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Progresso por Plano</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tasksData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
              <XAxis 
                dataKey="name" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#71717a' }}
              />
              <YAxis 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#71717a' }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  backgroundColor: 'var(--tooltip-bg)',
                  color: 'var(--tooltip-fg)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#3f3f46' }}
              />
              <Bar dataKey="Total" fill="#e4e4e7" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="Feito" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza: Distribuição de Metodologia */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Métodos de Estudo</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-[-20px]">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span>{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
              Sem dados suficientes para gerar gráfico.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}