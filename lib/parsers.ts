import pdf from "pdf-parse";
import * as XLSX from "xlsx";

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    throw new Error("Falha ao processar arquivo PDF");
  }
}

export async function parseExcel(buffer: Buffer): Promise<string> {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    let text = "";

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      // Converte cada linha em texto separado por tabulação/quebra de linha
      const sheetText = XLSX.utils.sheet_to_txt(sheet);
      text += `\n--- Planilha: ${sheetName} ---\n${sheetText}`;
    });

    return text;
  } catch (error) {
    throw new Error("Falha ao processar arquivo Excel");
  }
}