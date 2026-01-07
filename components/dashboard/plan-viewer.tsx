"use client";

import { useState, useEffect } from "react";
import { StudyPlanResponse, StudyItem } from "@/services/ai-planner";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Clock } from "lucide-react";

interface PlanViewerProps {
  initialPlan: StudyPlanResponse;
}

export function PlanViewer({ initialPlan }: PlanViewerProps) {
  const [plan, setPlan] = useState(initialPlan);
  const [isEditing, setIsEditing] = useState(false);

  // Atualiza estado local se a prop mudar (novo upload)
  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

  const handleUpdateItem = (index: number, field: keyof StudyItem, value: any) => {
    const newSchedule = [...plan.schedule];
    newSchedule[index] = {
      ...newSchedule[index],
      [field]: value
    };
    setPlan({ ...plan, schedule: newSchedule });
  };

  const saveChanges = () => {
    // Aqui você implementaria a lógica de salvar no banco de dados futuramente
    console.log("Plano salvo:", plan);
    setIsEditing(false);
    alert("Plano atualizado localmente! (Integração com BD pendente)");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{plan.title}</h2>
          <p className="text-zinc-500">{plan.description}</p>
        </div>
        
        <Button 
          onClick={() => isEditing ? saveChanges() : setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? <Save className="mr-2 h-4 w-4" /> : null}
          {isEditing ? "Salvar Alterações" : "Editar Plano"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plan.schedule.map((item, idx) => (
          <Card key={idx} className="relative overflow-hidden transition-all hover:shadow-md">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              item.method === 'Teoria' ? 'bg-blue-500' : 
              item.method === 'Exercícios' ? 'bg-green-500' : 'bg-purple-500'
            }`} />
            
            <CardHeader className="pb-2 pl-6">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="mb-2">
                  {item.day}
                </Badge>
                <div className="flex items-center text-xs text-zinc-500">
                  <Clock size={12} className="mr-1" />
                  {isEditing ? (
                    <Input 
                      type="number" 
                      className="h-6 w-16 text-right"
                      value={item.durationMinutes}
                      onChange={(e) => handleUpdateItem(idx, "durationMinutes", parseInt(e.target.value))}
                    />
                  ) : (
                    <span>{item.durationMinutes} min</span>
                  )}
                </div>
              </div>
              
              <CardTitle className="text-lg leading-tight">
                {isEditing ? (
                  <Input 
                    value={item.subject}
                    onChange={(e) => handleUpdateItem(idx, "subject", e.target.value)}
                    className="font-bold h-8 px-2 -ml-2"
                  />
                ) : item.subject}
              </CardTitle>
            </CardHeader>

            <CardContent className="pl-6 pt-2">
              <div className="space-y-3">
                <div className="text-sm text-zinc-600 dark:text-zinc-300">
                  {isEditing ? (
                    <Input 
                      value={item.topic}
                      onChange={(e) => handleUpdateItem(idx, "topic", e.target.value)}
                      className="h-8 px-2 -ml-2 text-sm"
                    />
                  ) : item.topic}
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  {isEditing ? (
                    <Select 
                      value={item.method} 
                      onValueChange={(val) => handleUpdateItem(idx, "method", val)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Teoria">Teoria</SelectItem>
                        <SelectItem value="Exercícios">Exercícios</SelectItem>
                        <SelectItem value="Revisão">Revisão</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      item.method === 'Teoria' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 
                      item.method === 'Exercícios' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}>
                      {item.method}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}