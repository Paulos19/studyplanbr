"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Flag,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import Link from "next/link";

interface QuizRunnerProps {
  quiz: any;
  backUrl: string;
}

export function QuizRunner({ quiz, backUrl }: QuizRunnerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answersLog, setAnswersLog] = useState<any[]>([]); 

  const question = quiz.questions[currentIdx];
  const progress = ((currentIdx) / quiz.questions.length) * 100;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === question.correctAnswer;
    setIsAnswered(true);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#ffffff']
      });
    }

    setAnswersLog(prev => [...prev, {
      questionIdx: currentIdx,
      selected: selectedOption,
      correct: question.correctAnswer,
      isCorrect
    }]);
  };

  const handleNext = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      if (score > quiz.questions.length / 2) {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      }
    }
  };

  // --- TELA DE RESULTADOS ---
  if (showResults) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-10">
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl mb-4">
            <Flag size={48} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">Simulado Finalizado!</h2>
          <p className="text-lg md:text-xl text-zinc-500">
            Você acertou <span className="font-bold text-blue-600">{score}</span> de {quiz.questions.length} questões.
          </p>
        </div>

        <div className="grid gap-4 max-w-3xl mx-auto">
          {quiz.questions.map((q: any, idx: number) => {
            const log = answersLog.find(l => l.questionIdx === idx);
            if (!log) return null;

            return (
              <Card key={q.id} className={cn("border-l-4 overflow-hidden", log.isCorrect ? "border-l-green-500" : "border-l-red-500")}>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    {log.isCorrect ? (
                      <CheckCircle2 className="text-green-500 shrink-0 mt-1" />
                    ) : (
                      <XCircle className="text-red-500 shrink-0 mt-1" />
                    )}
                    <div className="space-y-2 w-full">
                      <p className="font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">{q.statement}</p>
                      
                      <div className="grid gap-2 text-sm mt-2">
                        {!log.isCorrect && (
                          <div className="p-2 rounded bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-200 border border-red-100 dark:border-red-900/20">
                            <span className="font-bold">Sua resposta:</span> {q.options[log.selected]}
                          </div>
                        )}
                        <div className="p-2 rounded bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-200 border border-green-100 dark:border-green-900/20">
                          <span className="font-bold">Correta:</span> {q.options[q.correctAnswer]}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg mt-2 text-sm text-blue-800 dark:text-blue-200">
                    <div className="flex items-center gap-2 mb-1 font-bold">
                      <Lightbulb size={14} /> Explicação:
                    </div>
                    {q.explanation}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
           <Link href={backUrl} className="w-full sm:w-auto">
             <Button variant="outline" size="lg" className="w-full">Voltar ao Banco</Button>
           </Link>
           <Button onClick={() => window.location.reload()} size="lg" className="w-full sm:w-auto">
             Refazer Simulado
           </Button>
        </div>
      </div>
    );
  }

  // --- MODO DE EXECUÇÃO (QUESTIONÁRIO) ---
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header com Progresso */}
      <div className="flex items-center gap-4 mb-4 md:mb-8">
        <Button variant="ghost" size="icon" onClick={() => setShowResults(true)} title="Desistir/Sair">
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-xs font-medium text-zinc-500">
            <span>Questão {currentIdx + 1} de {quiz.questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Cartão da Questão */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-medium leading-relaxed text-zinc-900 dark:text-white mb-6 md:mb-8">
                {question.statement}
              </h3>

              <div className="space-y-3">
                {question.options.map((option: string, idx: number) => {
                  let style = "hover:bg-zinc-50 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700";
                  let icon = null;

                  if (isAnswered) {
                    if (idx === question.correctAnswer) {
                      style = "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-500 dark:text-green-200";
                      icon = <CheckCircle2 size={20} className="text-green-600 shrink-0" />;
                    } else if (idx === selectedOption) {
                      style = "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-500 dark:text-red-200";
                      icon = <XCircle size={20} className="text-red-600 shrink-0" />;
                    } else {
                      style = "opacity-50 grayscale";
                    }
                  } else if (selectedOption === idx) {
                    style = "border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-600";
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={cn(
                        "relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm md:text-base",
                        style
                      )}
                    >
                      <div className="flex-1 font-medium mr-2">{option}</div>
                      {icon}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer com Feedback e Botões Responsivos */}
            <div className="p-4 md:p-6 bg-zinc-50 dark:bg-black/20 border-t border-zinc-100 dark:border-zinc-800">
              {isAnswered ? (
                <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in">
                  <div className={cn(
                    "p-4 rounded-lg text-sm border",
                    selectedOption === question.correctAnswer 
                      ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/10 dark:border-green-900" 
                      : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/10 dark:border-red-900"
                  )}>
                    <div className="font-bold flex items-center gap-2 mb-1">
                      <Lightbulb size={16} /> 
                      {selectedOption === question.correctAnswer ? "Muito bem!" : "Atenção!"}
                    </div>
                    {question.explanation}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleNext} size="lg" className="w-full md:w-auto bg-zinc-900 text-white hover:bg-zinc-800">
                      {currentIdx === quiz.questions.length - 1 ? "Ver Resultado Final" : "Próxima Questão"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleConfirm} 
                    disabled={selectedOption === null}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    Confirmar Resposta
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}