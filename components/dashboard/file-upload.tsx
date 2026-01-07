"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onPlanGenerated: (plan: any) => void;
}

export function FileUpload({ onPlanGenerated }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (uploadedFile: File) => {
    const validTypes = [
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    
    if (!validTypes.includes(uploadedFile.type)) {
      setError("Formato inválido. Por favor, envie PDF ou Excel.");
      return;
    }
    
    if (uploadedFile.size > 10 * 1024 * 1024) { // 10MB
      setError("Arquivo muito grande. Limite de 10MB.");
      return;
    }

    setError("");
    setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("preferences", preferences);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar o plano. Tente novamente.");
      }

      const data = await response.json();
      onPlanGenerated(data);
      // Limpa arquivo após sucesso (opcional)
      // setFile(null); 
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-dashed border-2 shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div 
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-colors cursor-pointer",
            dragActive 
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
              : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800",
            file && "border-green-500 bg-green-50 dark:bg-green-950/20"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.xlsx"
            onChange={handleChange}
          />
          
          {file ? (
            <div className="flex flex-col items-center text-green-600 dark:text-green-400">
              <CheckCircle size={40} className="mb-2" />
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-zinc-500 dark:text-zinc-400">
              <UploadCloud size={40} className="mb-2" />
              <p className="font-medium">Arraste seu edital ou clique aqui</p>
              <p className="text-xs">PDF ou Excel (Max 10MB)</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferences">Preferências de Estudo (Opcional)</Label>
          <Textarea 
            id="preferences"
            placeholder="Ex: Tenho 2 horas por dia, prefiro estudar Matemática de manhã..."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="resize-none"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm font-medium">{error}</div>
        )}

        <Button 
          onClick={handleSubmit} 
          disabled={!file || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisando Edital com IA...
            </>
          ) : (
            "Gerar Plano de Estudos"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}