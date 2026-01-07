"use client";

import React, { useState } from "react";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Target, 
  Zap, 
  Trophy, 
  ArrowRight,
  Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/dashboard/file-upload";
import { PlanViewer } from "@/components/dashboard/plan-viewer";
import { GreetingBanner } from "@/components/dashboard/greeting-banner";
import { saveStudyPlanAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

interface DashboardViewProps {
  userName: string;
  children: ReactNode;
}

export function DashboardView({ userName, children }: DashboardViewProps) {
  const [view, setView] = useState<"dashboard" | "create">("dashboard");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSavePlan = async () => {
    if (!generatedPlan) return;
    setSaving(true);
    try {
      const saved = await saveStudyPlanAction(generatedPlan);
      // CORREÇÃO AQUI: Redireciona para /plan/[id] (fora do dashboard)
      router.push(`/plan/${saved.id}`);
    } catch (error) {
      alert("Erro ao salvar plano.");
      setSaving(false);
    }
  };

  if (view === "create") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-5xl mx-auto space-y-6 relative z-10"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setView("dashboard")} 
            className="group text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white pl-0"
          >
            <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full mr-3 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
              <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            </div>
            <span className="text-lg font-medium">Voltar ao Dashboard</span>
          </Button>
        </div>
        
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <div className="mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Novo Plano de Estudos
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">
              Faça upload do seu edital e deixe nossa IA traçar a melhor estratégia.
            </p>
          </div>

          {!generatedPlan ? (
            <div className="max-w-2xl mx-auto py-8">
              <FileUpload onPlanGenerated={setGeneratedPlan} />
            </div>
          ) : (
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-center bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/50"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-0">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full text-emerald-600 dark:text-emerald-400">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-800 dark:text-emerald-200">Plano Gerado com Sucesso!</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Revise o conteúdo abaixo antes de salvar.</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button variant="ghost" onClick={() => setGeneratedPlan(null)} className="flex-1 sm:flex-none">
                    Descartar
                  </Button>
                  <Button 
                    onClick={handleSavePlan} 
                    disabled={saving} 
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                  >
                    {saving ? "Salvando..." : "Confirmar e Salvar"}
                  </Button>
                </div>
              </motion.div>
              
              <PlanViewer initialPlan={generatedPlan} />
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative z-10 space-y-8 pb-12">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full">
        <GreetingBanner userName={userName} />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatsCard 
          icon={<Target className="text-blue-600" />}
          label="Foco Atual"
          value="Alta Performance"
          sub="Mantenha o ritmo"
          color="blue"
        />
        <StatsCard 
          icon={<Zap className="text-amber-500" />}
          label="Sequência"
          value="3 Dias"
          sub="Não quebre a corrente!"
          color="yellow"
        />
        <StatsCard 
          icon={<Trophy className="text-purple-600" />}
          label="Questões"
          value="120+"
          sub="Resolvidas esta semana"
          color="purple"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-6 pt-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Meus Planos Ativos</h2>
          </div>
          <Button variant="link" onClick={() => setView("create")} className="md:hidden">
            Novo Plano
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, translateY: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView("create")}
            className="group relative flex flex-col items-center justify-center h-full min-h-[220px] bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500" />
            <div className="p-4 bg-white dark:bg-zinc-800 rounded-full shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 border border-zinc-100 dark:border-zinc-700">
              <Plus size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Criar Novo Plano
            </h3>
            <p className="text-sm text-zinc-500 text-center max-w-[200px] mt-2">
              Use a IA para organizar seu edital em segundos
            </p>
          </motion.div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function StatsCard({ icon, label, value, sub, color }: any) {
  const colorStyles: any = {
    blue: "from-blue-50 to-white border-blue-100 dark:from-blue-900/20 dark:to-zinc-900 dark:border-blue-900/50",
    yellow: "from-amber-50 to-white border-amber-100 dark:from-amber-900/20 dark:to-zinc-900 dark:border-amber-900/50",
    purple: "from-purple-50 to-white border-purple-100 dark:from-purple-900/20 dark:to-zinc-900 dark:border-purple-900/50",
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className={`border bg-gradient-to-br ${colorStyles[color]} shadow-sm hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
              {icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{value}</h3>
            <p className="text-xs font-medium text-zinc-400 mt-2 flex items-center gap-1">
              {sub}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}