"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Calendar, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MetricsPage() {
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("relatorio-desempenho.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Métricas de Desempenho</h2>
          <p className="text-zinc-500">Acompanhe sua evolução detalhada</p>
        </div>
        <Button onClick={downloadPDF} className="bg-zinc-900 text-white gap-2">
          <Download size={16} /> Baixar Relatório PDF
        </Button>
      </div>

      {/* Área Imprimível */}
      <div ref={reportRef} className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl space-y-6">
        
        {/* KPI Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard icon={TrendingUp} label="Taxa de Conclusão" value="78%" trend="+12%" color="green" />
          <KpiCard icon={Calendar} label="Dias Seguidos" value="14" trend="Recorde!" color="blue" />
          <KpiCard icon={CheckCircle} label="Questões Feitas" value="342" trend="+45 hoje" color="purple" />
        </div>

        {/* Gráfico Customizado (Barras Animadas) */}
        <Card>
          <CardHeader>
            <CardTitle>Horas de Estudo por Matéria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Direito Const.", "Português", "Raciocínio Lógico", "Informática", "Dir. Admin"].map((subject, idx) => (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{subject}</span>
                    <span>{Math.floor(Math.random() * 20) + 5}h</span>
                  </div>
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.random() * 80 + 20}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, trend, color }: any) {
  const colors: any = {
    green: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
  };

  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`p-4 rounded-full ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm text-zinc-500 font-medium">{label}</p>
          <h4 className="text-2xl font-bold">{value}</h4>
          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}