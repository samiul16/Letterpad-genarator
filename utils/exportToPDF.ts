// utils/exportToPDF.ts
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export const exportToPDF = async (
  elementId: string,
  fileName: string = "Document.pdf"
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // 1. Capture the element
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2, // Keeps it sharp
      skipFonts: false,
      // This ensures images (especially base64) are processed correctly
      preferredFontFormat: "woff2",
    });

    // 2. Setup A4 PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // 3. Add to PDF and Save
    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    pdf.save(fileName);
  } catch (error) {
    console.error("PDF Generation failed:", error);
    alert("Error creating PDF. Please try a smaller logo or check console.");
  }
};
