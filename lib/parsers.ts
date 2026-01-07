import * as XLSX from "xlsx";

// 1. Usamos 'require' para evitar que o TypeScript force uma conversão estrita de ESM
// 2. O 'no-var-requires' é desativado apenas nesta linha
/* eslint-disable @typescript-eslint/no-var-requires */
const pdfLib = require("pdf-parse");

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // 3. Verificação de Segurança (Bulletproof): 
    // Dependendo do ambiente (Dev vs Build), o export pode vir direto OU dentro de 'default'.
    // Esta lógica garante que pegamos a função correta independentemente do bundler.
    const pdfParse = typeof pdfLib === 'function' ? pdfLib : pdfLib.default;

    if (typeof pdfParse !== 'function') {
        throw new Error("A biblioteca pdf-parse não foi inicializada corretamente. Verifique o next.config.ts.");
    }

    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("Erro detalhado no Parser PDF:", error);
    throw new Error("Falha interna ao processar o PDF. Verifique os logs do servidor.");
  }
}

export async function parseExcel(buffer: Buffer): Promise<string> {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    let text = "";

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const sheetText = XLSX.utils.sheet_to_txt(sheet);
      // Adiciona cabeçalho para ajudar a IA a entender a separação
      text += `\n--- Aba: ${sheetName} ---\n${sheetText}`;
    });

    return text;
  } catch (error) {
    console.error("Erro detalhado no Parser Excel:", error);
    throw new Error("Falha ao ler o arquivo Excel.");
  }
}