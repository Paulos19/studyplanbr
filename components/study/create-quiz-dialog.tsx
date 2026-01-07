"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger, 
  DialogTitle,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Wand2, 
  BrainCircuit, 
  Sparkles, 
  Zap, 
  BookOpen, 
  Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createQuizAction } from "@/app/actions";
import { cn } from "@/lib/utils";

interface CreateQuizDialogProps {
  planId: string;
}

const steps = [
  { text: "Analisando o conteúdo...", color: "text-blue-500" },
  { text: "Identificando conceitos chave...", color: "text-purple-500" },
  { text: "Gerando questões desafiadoras...", color: "text-amber-500" },
  { text: "Finalizando simulado...", color: "text-green-500" },
];

export function CreateQuizDialog({ planId }: CreateQuizDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [difficulty, setDifficulty] = useState<"Fácil" | "Médio" | "Difícil">("Médio");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    setLoadingStep(0);

    // Simula passos de carregamento para melhor UX
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const newQuiz = await createQuizAction(content, difficulty, planId);
      
      clearInterval(interval);
      setOpen(false);
      setContent("");
      
      // Redireciona direto para o novo quiz
      router.push(`/plan/${planId}/questions/${newQuiz.id}`);
    } catch (error) {
      clearInterval(interval);
      alert("Erro ao criar o simulado. Tente novamente.");
      setLoading(false);
    }
  };

  const difficulties = [
    { label: "Fácil", icon: BookOpen, color: "bg-green-100 text-green-700 hover:bg-green-200 border-green-200" },
    { label: "Médio", icon: BrainCircuit, color: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200" },
    { label: "Difícil", icon: Zap, color: "bg-red-100 text-red-700 hover:bg-red-200 border-red-200" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 group">
          <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" /> 
          Novo Simulado
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <AnimatePresence mode="wait">
          {!loading ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Header Visual */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
                    <Wand2 className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                      Gerador de Questões IA
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                      Cole um texto ou artigo e deixe a mágica acontecer.
                    </DialogDescription>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-zinc-700 dark:text-zinc-300 font-medium">
                    Conteúdo Base
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Cole aqui: Artigos de lei, resumos, trechos de livros ou suas anotações..."
                    className="min-h-[150px] resize-none focus-visible:ring-blue-500 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-mono text-sm leading-relaxed"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <p className="text-xs text-zinc-400 text-right">
                    {content.length} caracteres
                  </p>
                </div>

                {/* Seletor de Dificuldade */}
                <div className="space-y-3">
                  <Label className="text-zinc-700 dark:text-zinc-300 font-medium">
                    Nível de Dificuldade
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {difficulties.map((diff) => (
                      <div
                        key={diff.label}
                        onClick={() => setDifficulty(diff.label as any)}
                        className={cn(
                          "cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-105",
                          difficulty === diff.label 
                            ? `${diff.color} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 ring-blue-500 border-transparent shadow-sm` 
                            : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 grayscale opacity-70 hover:opacity-100 hover:grayscale-0"
                        )}
                      >
                        <diff.icon size={20} />
                        <span className="text-xs font-bold">{diff.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botão de Ação */}
                <Button 
                  onClick={handleGenerate} 
                  disabled={!content.trim()}
                  className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 h-12 text-base font-semibold shadow-xl shadow-zinc-900/10"
                >
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Gerar Simulado Agora
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-12 text-center h-[480px]"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-white dark:bg-zinc-900 p-6 rounded-full shadow-2xl border border-zinc-100 dark:border-zinc-800">
                  <BrainCircuit size={48} className="text-blue-600 animate-spin-slow" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                Criando Questões
              </h3>
              
              <div className="h-8 mb-6">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn("text-sm font-medium", steps[loadingStep].color)}
                  >
                    {steps[loadingStep].text}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="w-64 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}