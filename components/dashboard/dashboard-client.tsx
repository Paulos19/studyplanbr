"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FileUpload } from "@/components/dashboard/file-upload";
import { PlanViewer } from "@/components/dashboard/plan-viewer";
import { Card } from "@/components/ui/card";
import { saveStudyPlanAction } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function DashboardClient({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<"list" | "create">("list");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSavePlan = async () => {
    if (!generatedPlan) return;
    setSaving(true);
    try {
      const saved = await saveStudyPlanAction(generatedPlan);
      router.push(`/dashboard/plan/${saved.id}`);
    } catch (error) {
      alert("Erro ao salvar plano");
      setSaving(false);
    }
  };

  if (view === "create") {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setView("list")} className="mb-4">
          ← Voltar para Meus Planos
        </Button>
        
        {!generatedPlan ? (
          <FileUpload onPlanGenerated={setGeneratedPlan} />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end gap-4">
               <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePlan} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
                {saving ? "Salvando..." : "Confirmar e Salvar Plano"}
              </Button>
            </div>
            <PlanViewer initialPlan={generatedPlan} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Meus Planos de Estudo</h1>
        <Button onClick={() => setView("create")}>
          <Plus className="mr-2 h-4 w-4" /> Novo Plano
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card para criar novo (atalho visual na grid) */}
        <Card 
          className="border-dashed border-2 flex flex-col items-center justify-center p-8 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors min-h-[200px]" 
          onClick={() => setView("create")}
        >
          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
            <Plus size={24} className="text-zinc-600 dark:text-zinc-400" />
          </div>
          <p className="font-medium text-center">Criar novo plano com IA</p>
        </Card>

        {/* Lista de Planos do Servidor (Injetada via children) */}
        {children}
      </div>
    </div>
  );
}