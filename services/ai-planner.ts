import { model } from "@/lib/gemini";
import { parseExcel, parsePDF } from "@/lib/parsers";

export interface StudyItem {
  day: string;
  subject: string;
  topic: string;
  method: "Teoria" | "Exercícios" | "Revisão";
  durationMinutes: number;
}

export interface StudyPlanResponse {
  title: string;
  description: string;
  schedule: StudyItem[];
}

// Limpa blocos de código markdown se o modelo retornar ```json ... ```
function cleanJSONResponse(text: string): string {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function generateStudyPlan(
  fileBuffer: Buffer,
  fileType: "application/pdf" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  userPreferences?: string
): Promise<StudyPlanResponse> {
  
  // 1. Extração do Texto
  let extractedText = "";
  if (fileType === "application/pdf") {
    extractedText = await parsePDF(fileBuffer);
  } else {
    extractedText = await parseExcel(fileBuffer);
  }

  // 2. Construção do Prompt
  const prompt = `
    Atue como um Especialista em Concursos Públicos e Pedagogia.
    
    OBJETIVO:
    Analise o conteúdo do edital/documento extraído abaixo e crie um plano de estudos organizado.
    
    PREFERÊNCIAS DO USUÁRIO:
    ${userPreferences || "Nenhuma preferência específica (padronizar 4 horas diárias)."}

    FORMATO DE SAÍDA OBRIGATÓRIO (JSON):
    Você deve retornar APENAS um objeto JSON válido, sem texto antes ou depois, seguindo exatamente esta estrutura:
    {
      "title": "Nome do Concurso ou Cargo identificado",
      "description": "Breve resumo da estratégia adotada",
      "schedule": [
        {
          "day": "Segunda-feira" (ou Dia 1, Dia 2...),
          "subject": "Matéria (ex: Direito Constitucional)",
          "topic": "Tópico específico (ex: Art. 5º)",
          "method": "Teoria" | "Exercícios" | "Revisão",
          "durationMinutes": 60
        }
      ]
    }

    CONTEÚDO DO DOCUMENTO:
    ${extractedText.slice(0, 30000)} // Limite de caracteres para segurança, embora o Flash aguente mais
  `;

  // 3. Chamada à API
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanJson = cleanJSONResponse(text);
    const plan: StudyPlanResponse = JSON.parse(cleanJson);

    return plan;
  } catch (error) {
    console.error("Erro na geração do plano:", error);
    throw new Error("Falha ao gerar plano de estudos com IA");
  }
}