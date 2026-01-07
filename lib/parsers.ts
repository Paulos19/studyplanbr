import * as XLSX from "xlsx";

// CORREÇÃO: Usar 'require' evita o erro "no default export" em bibliotecas antigas
// @ts-ignore - Ignora aviso de tipagem para esta importação específica
const pdf = require("pdf-parse");

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error("Erro ao processar PDF com pdf-parse:", error);
    throw new Error("Falha ao ler o conteúdo do PDF. O arquivo pode estar corrompido ou protegido por senha.");
  }
}

export async function parseExcel(buffer: Buffer): Promise<string> {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    let text = "";

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const sheetText = XLSX.utils.sheet_to_txt(sheet);
      text += `\n--- Aba: ${sheetName} ---\n${sheetText}`;
    });

    return text;
  } catch (error) {
    console.error("Erro ao processar Excel:", error);
    throw new Error("Falha ao ler o arquivo Excel.");
  }
}