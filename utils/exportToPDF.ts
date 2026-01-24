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
    // 1. Convert HTML to a high-quality PNG
    // html-to-image handles oklch/lab/variable colors much better than html2canvas
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      cacheBust: true,
    });

    // 2. Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
  } catch (error) {
    console.error("oops, something went wrong!", error);
    alert("Failed to generate PDF. Check console for details.");
  }
};
