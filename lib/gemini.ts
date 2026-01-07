import { GoogleGenerativeAI } from "@google/generative-ai";

// Removemos o throw Error que trava o build/runtime se a chave faltar momentaneamente
const apiKey = process.env.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 8192,
  } 
});