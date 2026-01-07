"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { generateQuizFromContent } from "@/services/ai-planner";
import { model } from "@/lib/gemini";

// --- Ações de Plano de Estudos ---

export async function saveStudyPlanAction(planData: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Não autorizado");

  const newPlan = await prisma.studyPlan.create({
    data: {
      userId: session.user.id as string,
      title: planData.title,
      description: planData.description,
      tasks: {
        create: planData.schedule.map((item: any) => ({
          day: item.day,
          subject: item.subject,
          topic: item.topic,
          method: item.method,
          durationMinutes: item.durationMinutes,
        })),
      },
    },
  });

  revalidatePath("/dashboard");
  return newPlan;
}

export async function toggleTaskCompletionAction(taskId: string, isCompleted: boolean) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Não autorizado");

  await prisma.studyTask.update({
    where: { id: taskId },
    data: { isCompleted },
  });

  revalidatePath("/dashboard/plan/[id]");
}

// --- Ações de Quiz ---

export async function createQuizAction(content: string, difficulty: string, planId?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Não autorizado");

  try {
    // 1. Gera as questões na IA
    const quizData = await generateQuizFromContent(content, difficulty as any);

    // 2. Salva no Banco
    const savedQuiz = await prisma.quiz.create({
      data: {
        userId: session.user.id as string,
        planId: planId,
        topic: quizData.topic,
        total: quizData.questions.length,
        questions: {
          create: quizData.questions.map((q) => ({
            statement: q.statement,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        },
      },
      include: { questions: true },
    });

    return savedQuiz;
  } catch (error) {
    console.error("Erro ao criar quiz:", error);
    throw new Error("Falha ao gerar o simulado. Verifique se o texto é válido.");
  }
}

// --- Ações de Dashboard (Metadata) ---

interface DashboardMetadata {
  quote: string;
  weather: {
    temperature: number;
    conditionCode: number; // Códigos WMO do Open-Meteo
    isDay: boolean;
  };
}

export async function getDashboardMetadataAction(lat: number, lon: number): Promise<DashboardMetadata> {
  // Definição de Fallbacks (Valores padrão para não quebrar a UI)
  const fallbackQuote = "A disciplina é a ponte entre metas e realizações.";
  const fallbackWeather = { temperature: 25, conditionCode: 0, isDay: true };

  // 1. Busca Frase Motivacional no Gemini
  const quotePromise = (async () => {
    try {
      // Verificação de Segurança: Se não tem chave, usa fallback direto sem tentar chamar a API
      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY não configurada. Usando frase de fallback.");
        return fallbackQuote;
      }

      const prompt = "Gere uma frase motivacional curta (max 15 palavras), impactante e estoica para um estudante de alto rendimento. Retorne APENAS o texto da frase, sem aspas.";
      
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      
      // Remove aspas se a IA colocar acidentalmente
      return text.replace(/^"|"$/g, '') || fallbackQuote;
    } catch (e) {
      console.error("Erro ao gerar frase motivacional:", e);
      return fallbackQuote;
    }
  })();

  // 2. Busca Clima (Open-Meteo)
  const weatherPromise = (async () => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`,
        { next: { revalidate: 1800 } } // Cache de 30 min
      );
      
      if (!res.ok) {
        throw new Error(`Open-Meteo API Error: ${res.status}`);
      }

      const data = await res.json();
      
      return {
        temperature: data.current_weather.temperature,
        conditionCode: data.current_weather.weathercode,
        isDay: data.current_weather.is_day === 1
      };
    } catch (e) {
      console.error("Erro ao buscar clima:", e);
      return fallbackWeather;
    }
  })();

  // Executa em paralelo e retorna
  const [quote, weather] = await Promise.all([quotePromise, weatherPromise]);

  return { quote, weather };
}