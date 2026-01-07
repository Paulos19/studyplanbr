"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, CalendarDays, Dumbbell, BarChart3, Crown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface MobileSidebarProps {
  planId: string;
  planTitle: string;
  stats: {
    total: number;
    completed: number;
    percentage: number;
  };
}

export function MobileSidebar({ planId, planTitle, stats }: MobileSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const baseUrl = `/plan/${planId}`;

  const routes = [
    { label: "Cronograma", icon: CalendarDays, href: `${baseUrl}` },
    { label: "Banco de Questões", icon: Dumbbell, href: `${baseUrl}/questions` },
    { label: "Métricas & PDF", icon: BarChart3, href: `${baseUrl}/metrics` },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-zinc-500">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
        <VisuallyHidden.Root>
          <SheetTitle>Menu de Navegação</SheetTitle>
        </VisuallyHidden.Root>
        
        <div className="flex flex-col h-full">
          {/* Header Mobile */}
          <div className="h-16 flex items-center gap-2 px-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="text-white" size={18} />
            </div>
            <span className="font-bold text-lg text-zinc-900 dark:text-white truncate">
              StudyPlan
            </span>
          </div>

          {/* Links */}
          <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
            {routes.map((route) => {
              const isActive = pathname === route.href || (route.href !== baseUrl && pathname.startsWith(route.href));
              
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)} // Fecha ao clicar
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  )}
                >
                  <route.icon size={22} />
                  {route.label}
                </Link>
              );
            })}
          </div>

          {/* Card de Status Mobile */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-black dark:to-zinc-900 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
               <div className="relative z-10 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Crown size={16} className="text-yellow-400" fill="currentColor" />
                    <span className="font-bold text-xs">PRO</span>
                  </div>
                  <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded-full">{stats.percentage}%</span>
                </div>
                <Progress value={stats.percentage} className="h-1.5 bg-white/20" />
                <p className="text-[10px] text-zinc-400 text-center">
                  {stats.completed}/{stats.total} Tarefas
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}