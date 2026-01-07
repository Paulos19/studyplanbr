"use client";

import { useState } from "react";
import { FileUpload } from "@/components/dashboard/file-upload";
import { PlanViewer } from "@/components/dashboard/plan-viewer";
import { StudyPlanResponse } from "@/services/ai-planner";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [plan, setPlan] = useState<StudyPlanResponse | null>(null);

  // Função para receber o plano gerado pelo componente de upload
  const handlePlanGenerated = (newPlan: StudyPlanResponse) => {
    setPlan(newPlan);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Gerador de Plano de Estudos
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Faça upload do seu edital (PDF ou Excel) e deixe nossa IA organizar sua rotina.
        </p>
      </div>

      {/* Área de Upload - Sempre visível se não houver plano, ou colapsada? 
          Vamos deixar visível para permitir gerar novo plano. */}
      <div className="grid gap-8">
        <FileUpload onPlanGenerated={handlePlanGenerated} />

        <AnimatePresence mode="wait">
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <PlanViewer initialPlan={plan} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}