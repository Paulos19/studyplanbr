import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlansGrid } from "@/components/dashboard/plans-grid";

export default async function PlansPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const plans = await prisma.studyPlan.findMany({
    where: { userId: session.user.id as string },
    orderBy: { updatedAt: 'desc' },
    include: { tasks: true }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Meus Planos de Estudo
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Gerencie seus editais e estratégias ativas.
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
            <Plus className="mr-2 h-4 w-4" /> Novo Plano
          </Button>
        </Link>
      </div>

      <PlansGrid plans={plans} />
    </div>
  );
}