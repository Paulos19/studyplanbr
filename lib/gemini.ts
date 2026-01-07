import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Usando o modelo solicitado na versão flash para velocidade
export const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 8192,
  } 
});