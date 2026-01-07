import { Logo } from "@/components/ui/logo";
import { UserNav } from "@/components/dashboard/user-nav";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Lado Esquerdo: Logo e Nav Links (Desktop) */}
        <div className="flex items-center gap-8">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <a href="/dashboard" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Visão Geral
            </a>
            <a href="/dashboard/plans" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Meus Planos
            </a>
            <a href="/dashboard/performance" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Desempenho
            </a>
          </nav>
        </div>

        {/* Lado Direito: Ações do Usuário */}
        <div className="flex items-center gap-4">
          {/* Se tiver o componente ThemeToggle, descomente abaixo */}
          {/* <ThemeToggle /> */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}