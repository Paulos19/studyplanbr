import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acesso - StudyPlanner",
  description: "Faça login ou registre-se",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8">
        {children}
      </div>
    </div>
  );
}