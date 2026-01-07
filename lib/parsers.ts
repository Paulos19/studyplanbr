import * as XLSX from "xlsx";
// Importação direta do build compatível com Node.js (ESM)
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // O pdfjs-dist trabalha com Uint8Array, não Buffer do Node diretamente
    const uint8Array = new Uint8Array(buffer);

    // Carrega o documento usando a engine da Mozilla
    const loadingTask = getDocument({
      data: uint8Array,
      // Desativa recursos de fonte que exigem DOM/Canvas
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = "";

    // Itera por todas as páginas para extrair o texto
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // textContent.items contém fragmentos de texto. Juntamos com espaço.
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");

      // Adiciona marcador de página para ajudar a IA a entender a estrutura
      fullText += `\n--- Página ${i} ---\n${pageText}`;
    }

    return fullText;
  } catch (error) {
    console.error("Erro no parser PDF (pdfjs-dist):", error);
    throw new Error("Falha ao processar o arquivo PDF. O arquivo pode estar corrompido ou protegido.");
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
    console.error("Erro detalhado no Parser Excel:", error);
    throw new Error("Falha ao ler o arquivo Excel.");
  }
}