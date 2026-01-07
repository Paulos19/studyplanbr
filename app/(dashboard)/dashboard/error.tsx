"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro no console do navegador para você ver o que é
    console.error("Erro no Dashboard:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
        Algo deu errado ao carregar seus planos.
      </h2>
      <p className="text-zinc-500 max-w-md text-center">
        {error.message || "Erro interno do servidor."}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          Recarregar Página
        </Button>
        <Button onClick={() => reset()}>Tentar Novamente</Button>
      </div>
    </div>
  );
}