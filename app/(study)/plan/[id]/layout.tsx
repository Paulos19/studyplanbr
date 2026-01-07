import { Sidebar } from "@/components/study/sidebar";
import { StudyHeader } from "@/components/study/study-header";
import { SidebarProvider } from "@/components/study/sidebar-context"; // Importe o provider
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function StudyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  const plan = await prisma.studyPlan.findUnique({
    where: { id: id, userId: session.user.id as string },
    include: { tasks: true }
  });

  if (!plan) redirect("/dashboard");

  return (
    // Envolvemos tudo no Provider Client-Side
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        {/* Sidebar agora controla sua própria largura via Contexto interno */}
        <Sidebar plan={plan} />

        <div className="flex flex-col flex-1 h-full overflow-hidden relative">
          <StudyHeader title={plan.title} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
            <div className="max-w-6xl mx-auto pb-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}