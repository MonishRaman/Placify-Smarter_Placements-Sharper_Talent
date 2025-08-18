import fs from 'fs';
import pdfjsLib from 'pdfjs-dist';
import pkg from 'canvas';

const { getDocument } = pdfjsLib;
const { DOMMatrix, ImageData, Path2D } = pkg;

global.DOMMatrix = DOMMatrix;
global.ImageData = ImageData;
global.Path2D = Path2D;

export async function extractPdfText(filePath) {
  console.log(`[extractPdfText] Starting extraction for: ${filePath}`);
  try {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await getDocument({ data }).promise;

    let textContent = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      textContent += strings.join(" ") + "\n";
    }

    console.log(`[extractPdfText] Extraction complete.`);
    return textContent.trim();
  } catch (err) {
    console.error(`[extractPdfText] Error:`, err);
    throw new Error("Failed to parse PDF");
  }
}
