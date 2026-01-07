"use client";

import { useState } from "react";
import { StudyTask } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toggleTaskCompletionAction } from "@/app/actions";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: StudyTask[];
}

export function TaskList({ tasks }: TaskListProps) {
  // Agrupa tarefas por dia (simples string sort ou lógica mais complexa se necessário)
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.day]) acc[task.day] = [];
    acc[task.day].push(task);
    return acc;
  }, {} as Record<string, StudyTask[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([day, dayTasks]) => (
        <div key={day} className="space-y-3">
          <h3 className="font-semibold text-lg text-zinc-800 dark:text-zinc-200 sticky top-0 bg-zinc-50 dark:bg-zinc-950 py-2 z-10">
            {day}
          </h3>
          <div className="grid gap-3">
            {dayTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskItem({ task }: { task: StudyTask }) {
  const [completed, setCompleted] = useState(task.isCompleted);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setCompleted(checked);
    setLoading(true);
    try {
      await toggleTaskCompletionAction(task.id, checked);
    } catch (error) {
      setCompleted(!checked); // Reverte em caso de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn(
      "p-4 flex items-start gap-4 transition-all border-l-4",
      completed ? "border-l-green-500 bg-green-50/50 dark:bg-green-900/10 opacity-70" : 
      task.method === "Teoria" ? "border-l-blue-500" :
      task.method === "Exercícios" ? "border-l-orange-500" : "border-l-purple-500"
    )}>
      <Checkbox 
        checked={completed} 
        onCheckedChange={handleToggle}
        disabled={loading}
        className="mt-1"
      />
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <p className={cn("font-medium text-sm", completed && "line-through text-zinc-500")}>
            {task.subject}
          </p>
          <span className="text-xs text-zinc-500 font-mono">{task.durationMinutes}min</span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{task.topic}</p>
        <Badge variant="outline" className="text-[10px] h-5">
          {task.method}
        </Badge>
      </div>
    </Card>
  );
}