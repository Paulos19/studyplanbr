import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { MyPlansList } from "@/components/dashboard/my-plans-list";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardView userName={session.user?.name || "Estudante"}>
      <Suspense fallback={<PlansGridSkeleton />}>
        <MyPlansList />
      </Suspense>
    </DashboardView>
  );
}

function PlansGridSkeleton() {
  return (
    <>
      {[1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
          <div className="flex justify-between items-start">
             <Skeleton className="h-6 w-3/4 rounded-md" />
             <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2 pt-6">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}