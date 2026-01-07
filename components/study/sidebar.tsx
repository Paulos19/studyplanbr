"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  CalendarDays, 
  Dumbbell, 
  BarChart3, 
  ArrowLeft, 
  Crown,
  ChevronLeft,
  LayoutDashboard
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "./sidebar-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  plan: any;
}

export function Sidebar({ plan }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const baseUrl = `/plan/${plan.id}`;

  const routes = [
    { label: "Cronograma", icon: CalendarDays, href: `${baseUrl}` },
    { label: "Banco de Questões", icon: Dumbbell, href: `${baseUrl}/questions` },
    { label: "Métricas & PDF", icon: BarChart3, href: `${baseUrl}/metrics` },
  ];

  // Cálculo de Progresso
  const total = plan.tasks.length;
  const completed = plan.tasks.filter((t: any) => t.isCompleted).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 288 }} // 80px (collapsed) vs 288px (expanded)
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-full border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-20"
    >
      {/* Toggle Button (Absolute na borda) */}
      <Button
        onClick={toggleSidebar}
        variant="outline"
        size="icon"
        className="absolute -right-3 top-8 h-6 w-6 rounded-full border shadow-sm z-50 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft size={12} />
        </motion.div>
      </Button>

      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-zinc-100 dark:border-zinc-800 overflow-hidden">
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="mini-logo"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                 <span className="text-white font-bold text-xl">S</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2 px-6 w-full"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                 <LayoutDashboard className="text-white" size={18} />
              </div>
              <span className="font-bold text-lg text-zinc-900 dark:text-white whitespace-nowrap">
                StudyPlan
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <TooltipProvider delayDuration={0}>
          {routes.map((route) => {
            const isActive = pathname === route.href || (route.href !== baseUrl && pathname.startsWith(route.href));
            
            return (
              <Tooltip key={route.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all group relative overflow-hidden",
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900",
                      isCollapsed ? "justify-center" : ""
                    )}
                  >
                    <route.icon size={22} className={cn("shrink-0", isActive ? "text-white" : "group-hover:text-blue-600 transition-colors")} />
                    
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {route.label}
                      </motion.span>
                    )}

                    {isActive && !isCollapsed && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-white/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-zinc-900 text-white border-zinc-800">
                    {route.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Footer / User Card */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-800">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-black dark:to-zinc-900 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
              
              <div className="relative z-10 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Crown size={16} className="text-yellow-400" fill="currentColor" />
                    <span className="font-bold text-sm">PRO</span>
                  </div>
                  <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded-full">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-1.5 bg-white/20" />
                <p className="text-[10px] text-zinc-400 text-center">
                  {completed}/{total} Tarefas concluídas
                </p>
              </div>
            </motion.div>
          ) : (
             <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex justify-center"
            >
              <div className="relative group cursor-pointer">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center border border-zinc-700">
                    <Crown size={18} className="text-yellow-400" fill="currentColor" />
                 </div>
                 {/* Mini progress indicator ring (optional complex svg) */}
                 <svg className="absolute top-0 left-0 w-10 h-10 -rotate-90 pointer-events-none">
                    <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-200/10" />
                    <circle 
                      cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" 
                      className="text-blue-500 transition-all duration-500"
                      strokeDasharray="113"
                      strokeDashoffset={113 - (113 * percentage) / 100}
                      strokeLinecap="round"
                    />
                 </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn("mt-4 px-2", isCollapsed ? "flex justify-center" : "")}>
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            {isCollapsed ? (
              <TooltipProvider>
                 <Tooltip>
                    <TooltipTrigger><ArrowLeft size={20} /></TooltipTrigger>
                    <TooltipContent side="right">Voltar ao Dashboard</TooltipContent>
                 </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium">
                <ArrowLeft size={14} />
                <span>Voltar ao Dashboard</span>
              </div>
            )}
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}