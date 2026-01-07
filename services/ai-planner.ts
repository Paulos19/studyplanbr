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

// Interfaces para o Quiz
export interface QuizQuestion {
  statement: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResponse {
  topic: string;
  questions: QuizQuestion[];
}

// FUNÇÃO DE LIMPEZA MELHORADA (A "Blindagem")
function cleanJSONResponse(text: string): string {
  // 1. Remove marcadores de markdown comuns
  let clean = text.replace(/```json/g, "").replace(/```/g, "");

  // 2. Encontra o primeiro '{' e o último '}' para ignorar textos introdutórios como "Prezados..."
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }

  return clean.trim();
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
    Retorne APENAS o JSON cru, sem introduções, sem markdown, sem "Aqui está o plano".
    Estrutura:
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
    ${extractedText.slice(0, 30000)}
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

export async function generateQuizFromContent(
  content: string,
  difficulty: "Fácil" | "Médio" | "Difícil" = "Médio"
): Promise<QuizResponse> {
  
  const prompt = `
    Atue como uma Banca Examinadora de Concursos (estilo Cebraspe/FGV).
    
    OBJETIVO:
    Crie um quiz de 5 questões de múltipla escolha baseadas EXCLUSIVAMENTE no texto/tópico fornecido abaixo.
    Dificuldade: ${difficulty}

    FORMATO JSON OBRIGATÓRIO:
    Retorne APENAS o JSON cru. Não escreva "Prezados", "Aqui está", ou nada do tipo.
    Estrutura:
    {
      "topic": "Resumo do tópico abordado",
      "questions": [
        {
          "statement": "Enunciado da questão...",
          "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
          "correctAnswer": 0, // Índice da resposta correta (0 a 3)
          "explanation": "Breve explicação do porquê esta é a correta."
        }
      ]
    }

    TEXTO BASE:
    ${content.slice(0, 15000)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // A correção principal acontece aqui
    const cleanJson = cleanJSONResponse(text);
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Erro ao gerar quiz. Texto bruto recebido:", error); // Log ajuda a debugar o texto original se falhar
    throw new Error("Falha ao gerar questões com IA");
  }
}