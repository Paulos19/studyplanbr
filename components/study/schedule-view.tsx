"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toggleTaskCompletionAction } from "@/app/actions";
import { cn } from "@/lib/utils";

export function ScheduleView({ plan }: { plan: any }) {
  // CORREÇÃO: Forçamos a tipagem para string[] para evitar o erro 'unknown'
  const uniqueDays = Array.from(new Set(plan.tasks.map((t: any) => t.day))) as string[];
  
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const currentDay = uniqueDays[currentDayIndex];
  
  const daysTasks = plan.tasks.filter((t: any) => t.day === currentDay);

  const handleNextDay = () => {
    if (currentDayIndex < uniqueDays.length - 1) setCurrentDayIndex(prev => prev + 1);
  };

  const handlePrevDay = () => {
    if (currentDayIndex > 0) setCurrentDayIndex(prev => prev - 1);
  };

  return (
    <div className="space-y-8">
      {/* Banner de Saudação do Cronograma */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-2 opacity-80 mb-2">
            <span className="uppercase tracking-widest text-xs font-bold">Cronograma Oficial</span>
            <div className="h-px w-10 bg-white/50" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Foco no Objetivo: {currentDay}
          </h2>
          <p className="text-white/80 max-w-xl">
            A constância é a chave. Hoje temos {daysTasks.length} tarefas programadas. 
            Mantenha o foco na qualidade do estudo.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <BookOpen size={200} />
        </div>
      </div>

      {/* Controles de Dia */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <Button variant="ghost" onClick={handlePrevDay} disabled={currentDayIndex === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        
        <div className="flex flex-col items-center">
          <span className="font-bold text-lg">{currentDay}</span>
          <span className="text-xs text-zinc-500">
            {currentDayIndex + 1} de {uniqueDays.length} Dias
          </span>
        </div>

        <Button variant="ghost" onClick={handleNextDay} disabled={currentDayIndex === uniqueDays.length - 1}>
          Próximo <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Grid de Tarefas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {daysTasks.map((task: any) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </AnimatePresence>
        
        <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 text-zinc-400 bg-zinc-50/50 hover:bg-zinc-50 transition-colors cursor-pointer min-h-[200px]">
          <div className="bg-white dark:bg-zinc-800 p-3 rounded-full shadow-sm mb-3">
            <PlayCircle size={24} className="text-blue-500" />
          </div>
          <p className="font-medium text-sm">Adicionar Sessão Extra</p>
          <p className="text-xs text-center mt-1">Reforce o estudo de hoje</p>
        </Card>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: any }) {
  const [completed, setCompleted] = useState(task.isCompleted);

  const toggle = async () => {
    setCompleted(!completed);
    try {
      await toggleTaskCompletionAction(task.id, !completed);
    } catch {
      setCompleted(task.isCompleted);
    }
  };

  const methodColors: any = {
    "Teoria": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    "Exercícios": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    "Revisão": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card className={cn(
        "relative overflow-hidden group transition-all hover:shadow-md border-l-4",
        completed ? "border-l-green-500 opacity-60" : "border-l-blue-500"
      )}>
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <Badge variant="secondary" className={cn("font-medium", methodColors[task.method] || "bg-zinc-100")}>
              {task.method}
            </Badge>
            <div className="text-xs font-mono text-zinc-500 flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
              <Clock size={12} /> {task.durationMinutes} min
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg leading-tight text-zinc-900 dark:text-white line-clamp-2">
              {task.subject}
            </h3>
            <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{task.topic}</p>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <Button 
              onClick={toggle}
              variant={completed ? "default" : "outline"} 
              className={cn("flex-1 gap-2", completed ? "bg-green-600 hover:bg-green-700" : "")}
            >
              {completed ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-zinc-400" />}
              {completed ? "Concluído" : "Marcar Feito"}
            </Button>
            
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-blue-600">
              <MoreVertical size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}