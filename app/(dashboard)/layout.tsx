import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, BookOpen } from "lucide-react";
import LogoutButton from "@/components/dashboard/logout-button"; // Vamos criar este componente cliente

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <BookOpen size={20} />
            </div>
            <span className="hidden sm:inline-block text-zinc-900 dark:text-white">
              StudyPlanner
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                {session.user?.name}
              </span>
              <span className="text-xs text-zinc-500 capitalize">
                {session.user?.role.toLowerCase()}
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}