import * as XLSX from "xlsx";

// --- POLYFILLS PARA AMBIENTE SERVERLESS (VERCEL) ---
// O pdfjs-dist precisa dessas classes globais para funcionar no Node.js
if (typeof Promise.withResolvers === "undefined") {
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  } else {
    // @ts-ignore
    global.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
}

// Mock minimalista do DOMMatrix para evitar ReferenceError na Vercel
if (typeof global.DOMMatrix === "undefined") {
  // @ts-ignore
  global.DOMMatrix = class DOMMatrix {
    constructor() {
      // @ts-ignore
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
    }
    // Métodos stubs para evitar crash durante a leitura de fontes/transformações
    translate() { return this; }
    scale() { return this; }
    rotate() { return this; }
    multiply() { return this; }
    transformPoint(p: any) { return p; }
  };
}
// ---------------------------------------------------

// Importação dinâmica para garantir que os polyfills rodem ANTES da biblioteca carregar
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Converte Buffer do Node para Uint8Array (formato esperado pelo pdfjs)
    const uint8Array = new Uint8Array(buffer);

    // Carrega o documento
    const loadingTask = getDocument({
      data: uint8Array,
      // Desativa funcionalidades que exigem Canvas/DOM pesado
      useSystemFonts: true,
      disableFontFace: true,
      verbosity: 0, // Silencia avisos no log
    });

    const pdf = await loadingTask.promise;
    let fullText = "";

    // Extrai texto página por página
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Junta os fragmentos de texto
      const pageText = textContent.items
        // @ts-ignore - Tipagem do pdfjs às vezes falha no item.str
        .map((item: any) => item.str)
        .join(" ");

      // Limpa espaços excessivos e adiciona marcador de página
      const cleanPageText = pageText.replace(/\s+/g, " ").trim();
      fullText += `\n--- Página ${i} ---\n${cleanPageText}`;
    }

    return fullText;
  } catch (error) {
    console.error("Erro no parser PDF (Vercel):", error);
    throw new Error("Falha ao processar o arquivo PDF. Tente um arquivo diferente ou em formato Excel.");
  }
}

export async function parseExcel(buffer: Buffer): Promise<string> {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    let text = "";

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      // sheet_to_txt gera uma representação CSV/Texto simples da aba
      const sheetText = XLSX.utils.sheet_to_txt(sheet);
      text += `\n--- Aba: ${sheetName} ---\n${sheetText}`;
    });

    return text;
  } catch (error) {
    console.error("Erro detalhado no Parser Excel:", error);
    throw new Error("Falha ao ler o arquivo Excel.");
  }
}