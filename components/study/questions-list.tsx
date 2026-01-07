"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { BrainCircuit, ChevronRight, HelpCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function QuestionsList({ quizzes, planId }: { quizzes: any[], planId: string }) {
  if (quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
        <div className="p-4 bg-white dark:bg-zinc-800 rounded-full shadow-lg mb-4">
          <BrainCircuit size={40} className="text-zinc-400" />
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Nenhum simulado criado</h3>
        <p className="text-zinc-500 text-sm mt-1">Use o botão acima para gerar questões com IA.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz, idx) => (
        <motion.div
          key={quiz.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Link href={`/plan/${planId}/questions/${quiz.id}`}>
            <Card className="group h-full hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-0">
                {/* Header do Card com Gradiente */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 border-b border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                      <BrainCircuit size={20} className="text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                      {quiz._count.questions} Questões
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white line-clamp-2 leading-tight">
                    {quiz.topic}
                  </h3>
                </div>

                {/* Footer do Card */}
                <div className="p-4 flex items-center justify-between text-sm text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{format(new Date(quiz.createdAt), "d 'de' MMM", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    Resolver <ChevronRight size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}