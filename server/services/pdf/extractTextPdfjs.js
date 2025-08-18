import { DOMMatrix } from "canvas";
global.DOMMatrix = DOMMatrix;

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "fs";

const { getDocument } = pdfjsLib;

export async function extractPdfText(filePath) {
  console.log(`[extractPdfText] Starting extraction for: ${filePath}`);
  try {
    // Read file as binary
    const data = new Uint8Array(fs.readFileSync(filePath));

    console.log(`[extractPdfText] File read. Initializing PDF.js...`);
    const pdf = await getDocument({ data }).promise;
    console.log(`[extractPdfText] PDF loaded. Pages: ${pdf.numPages}`);

    let textContent = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`[extractPdfText] Extracting page ${i}`);
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const strings = content.items.map((item) => item.str);
      textContent += strings.join(" ") + "\n";
    }

    console.log(`[extractPdfText] Extraction complete.`);
    return textContent.trim();
  } catch (err) {
    console.error(`[extractPdfText] Error:`, err);
    throw new Error("Failed to parse PDF");
  }
}
