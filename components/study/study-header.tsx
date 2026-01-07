"use client";

import { UserNav } from "@/components/dashboard/user-nav";
import { Bell, Search, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { MobileSidebar } from "./mobile-sidebar"; // Importar

interface StudyHeaderProps {
  title: string;
  planId: string;
  stats: {
    total: number;
    completed: number;
    percentage: number;
  };
}

export function StudyHeader({ title, planId, stats }: StudyHeaderProps) {
  const pathname = usePathname();
  
  const isQuestions = pathname.includes("/questions");
  const isMetrics = pathname.includes("/metrics");
  let currentPage = "Cronograma";
  if (isQuestions) currentPage = "Questões";
  if (isMetrics) currentPage = "Métricas";

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-10 sticky top-0 transition-all">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Menu Mobile (Só aparece em telas pequenas) */}
        <MobileSidebar planId={planId} planTitle={title} stats={stats} />

        {/* Breadcrumb Visual */}
        <nav className="flex items-center text-sm text-zinc-500 overflow-hidden">
           <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-white transition-colors hidden sm:block">
             <Home size={16} />
           </Link>
           <ChevronRight size={14} className="mx-2 text-zinc-300 hidden sm:block" />
           <span className="font-medium text-zinc-900 dark:text-white truncate max-w-[120px] md:max-w-xs cursor-default" title={title}>
             {title}
           </span>
           {currentPage !== "Cronograma" && (
             <>
               <ChevronRight size={14} className="mx-1 md:mx-2 text-zinc-300" />
               <span className="font-medium text-blue-600 dark:text-blue-400 truncate max-w-[80px] md:max-w-none">
                 {currentPage}
               </span>
             </>
           )}
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
         <div className="relative hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="h-9 w-48 lg:w-64 rounded-full bg-zinc-100 dark:bg-zinc-900 border-none pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
         </div>
         
         <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden md:block" />
         
         <Button variant="ghost" size="icon" className="relative text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />
        </Button>
        
        <UserNav />
      </div>
    </header>
  );
}