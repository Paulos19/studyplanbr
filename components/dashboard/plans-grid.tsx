"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, BarChart, ArrowRight, MoreHorizontal, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function PlansGrid({ plans }: { plans: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = plans.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Barra de Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <Input 
          placeholder="Buscar plano..." 
          className="pl-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed">
          <p className="text-zinc-500">Nenhum plano encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((plan, idx) => {
               const total = plan.tasks.length;
               const completed = plan.tasks.filter((t: any) => t.isCompleted).length;
               const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

               return (
                 <motion.div
                   key={plan.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.05 }}
                 >
                   <Link href={`/plan/${plan.id}`}>
                     <Card className="group h-full hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg cursor-pointer flex flex-col justify-between overflow-hidden">
                       <CardContent className="p-6">
                         <div className="flex justify-between items-start mb-4">
                           <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                             <Calendar size={24} />
                           </div>
                           <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-zinc-400 hover:text-red-500">
                              <Trash2 size={16} />
                           </Button>
                         </div>
                         
                         <h3 className="font-bold text-lg text-zinc-900 dark:text-white line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                           {plan.title}
                         </h3>
                         <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                           Atualizado em {format(new Date(plan.updatedAt), "d MMM", { locale: ptBR })}
                         </p>

                         <div className="space-y-2">
                           <div className="flex justify-between text-xs font-medium text-zinc-500">
                             <span>Progresso</span>
                             <span>{progress}%</span>
                           </div>
                           <Progress value={progress} className="h-2" />
                         </div>
                       </CardContent>
                       
                       <CardFooter className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-sm font-medium text-zinc-500">
                          <span>{total} Tarefas</span>
                          <span className="flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                            Abrir <ArrowRight size={14} className="ml-1" />
                          </span>
                       </CardFooter>
                     </Card>
                   </Link>
                 </motion.div>
               );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}