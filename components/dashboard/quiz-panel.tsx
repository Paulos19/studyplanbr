"use client";

import { useState } from "react";
import { createQuizAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, BrainCircuit, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../ui/badge";

export function QuizPanel({ planId }: { planId?: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setQuiz(null);
    setShowResults(false);
    setUserAnswers({});

    try {
      const newQuiz = await createQuizAction(content, "Médio", planId);
      setQuiz(newQuiz);
    } catch (error) {
      alert("Erro ao gerar quiz. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q: any) => {
      if (userAnswers[q.id] === q.correctAnswer) correct++;
    });
    return correct;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Coluna 1: Gerador */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="text-purple-600" />
              Gerador de Questões IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cole aqui o conteúdo (Texto, Artigo de Lei ou Resumo)</Label>
              <Textarea 
                placeholder="Ex: Artigo 5º da Constituição Federal..." 
                className="h-48 resize-none font-mono text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !content} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              {loading ? "Criando Questões..." : "Gerar Quiz"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Coluna 2: O Quiz */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {quiz && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{quiz.topic}</h3>
                  {showResults && (
                    <Badge variant={calculateScore() >= 3 ? "default" : "destructive"}>
                      Nota: {calculateScore()}/{quiz.questions.length}
                    </Badge>
                  )}
                </div>

                {quiz.questions.map((q: any, idx: number) => (
                  <Card key={q.id} className="overflow-hidden">
                    <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 py-3 border-b">
                      <span className="text-sm font-bold text-zinc-500">Questão {idx + 1}</span>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <p className="font-medium">{q.statement}</p>
                      
                      <RadioGroup 
                        onValueChange={(val) => setUserAnswers(prev => ({ ...prev, [q.id]: parseInt(val) }))}
                        disabled={showResults}
                      >
                        {q.options.map((opt: string, optIdx: number) => {
                          let itemStyle = "";
                          if (showResults) {
                            if (optIdx === q.correctAnswer) itemStyle = "bg-green-100 dark:bg-green-900/30 border-green-500";
                            else if (userAnswers[q.id] === optIdx && optIdx !== q.correctAnswer) itemStyle = "bg-red-100 dark:bg-red-900/30 border-red-500";
                          }

                          return (
                            <div key={optIdx} className={`flex items-center space-x-2 p-2 rounded-lg border border-transparent ${itemStyle}`}>
                              <RadioGroupItem value={optIdx.toString()} id={`q${q.id}-opt${optIdx}`} />
                              <Label htmlFor={`q${q.id}-opt${optIdx}`} className="flex-1 cursor-pointer">
                                {opt}
                              </Label>
                              {showResults && optIdx === q.correctAnswer && <Check size={16} className="text-green-600" />}
                              {showResults && userAnswers[q.id] === optIdx && optIdx !== q.correctAnswer && <X size={16} className="text-red-600" />}
                            </div>
                          );
                        })}
                      </RadioGroup>

                      {showResults && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-800 dark:text-blue-200 rounded-md">
                          <strong>Explicação:</strong> {q.explanation}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {!showResults && (
                  <Button onClick={() => setShowResults(true)} className="w-full" size="lg">
                    Finalizar e Corrigir
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}