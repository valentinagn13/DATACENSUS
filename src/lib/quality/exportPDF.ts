import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QualityResults } from "@/types/dataQuality";

export const generatePDFReport = async (results: QualityResults): Promise<void> => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Header
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, pageWidth, 40, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.text("DataCensus", pageWidth / 2, 20, { align: "center" });
  
  pdf.setFontSize(12);
  pdf.text("Reporte de Calidad de Datos", pageWidth / 2, 30, { align: "center" });
  
  // Date
  pdf.setFontSize(10);
  const date = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  pdf.text(`Generado: ${date}`, pageWidth / 2, 37, { align: "center" });
  
  // Overall Score Section
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.text("Calificación General", 20, 55);
  
  pdf.setFontSize(32);
  const overallScore = results.promedioGeneral.toFixed(1);
  pdf.text(`${overallScore}/10`, pageWidth / 2, 70, { align: "center" });
  
  const scoreColor = results.promedioGeneral >= 7 ? [34, 197, 94] : 
                      results.promedioGeneral >= 5 ? [234, 179, 8] : [239, 68, 68];
  pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  pdf.setFontSize(12);
  const classification = results.promedioGeneral >= 7 ? "Excelente" :
                        results.promedioGeneral >= 5 ? "Aceptable" : "Deficiente";
  pdf.text(classification, pageWidth / 2, 80, { align: "center" });
  
  // Criteria Details
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.text("Métricas Individuales", 20, 95);
  
  const criteria = [
    { key: "confidencialidad", label: "Confidencialidad" },
    { key: "relevancia", label: "Relevancia" },
    { key: "actualidad", label: "Actualidad" },
    { key: "trazabilidad", label: "Trazabilidad" },
    { key: "conformidad", label: "Conformidad" },
    { key: "exactitudSintactica", label: "Exactitud Sintáctica" },
    { key: "exactitudSemantica", label: "Exactitud Semántica" },
    { key: "completitud", label: "Completitud" },
    { key: "consistencia", label: "Consistencia" },
    { key: "precision", label: "Precisión" },
    { key: "portabilidad", label: "Portabilidad" },
    { key: "credibilidad", label: "Credibilidad" },
    { key: "comprensibilidad", label: "Comprensibilidad" },
    { key: "accesibilidad", label: "Accesibilidad" },
    { key: "unicidad", label: "Unicidad" },
    { key: "eficiencia", label: "Eficiencia" },
    { key: "recuperabilidad", label: "Recuperabilidad" },
    { key: "disponibilidad", label: "Disponibilidad" }
  ];
  
  let yPosition = 105;
  pdf.setFontSize(10);
  
  criteria.forEach((criterion, index) => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }
    
    const value = results[criterion.key as keyof QualityResults] as number;
    const displayValue = value.toFixed(1);
    
    // Criterion name
    pdf.setTextColor(0, 0, 0);
    pdf.text(criterion.label, 20, yPosition);
    
    // Score bar
    const barWidth = 80;
    const barHeight = 4;
    const barX = pageWidth - barWidth - 40;
    const barY = yPosition - 3;
    
    // Background bar
    pdf.setFillColor(229, 231, 235);
    pdf.rect(barX, barY, barWidth, barHeight, "F");
    
    // Filled bar
    const fillWidth = (value / 10) * barWidth;
    const fillColor = value >= 7 ? [34, 197, 94] : 
                      value >= 5 ? [234, 179, 8] : [239, 68, 68];
    pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    pdf.rect(barX, barY, fillWidth, barHeight, "F");
    
    // Score text
    pdf.setTextColor(fillColor[0], fillColor[1], fillColor[2]);
    pdf.text(displayValue, pageWidth - 25, yPosition);
    
    yPosition += 10;
  });
  
  // Footer
  pdf.setTextColor(128, 128, 128);
  pdf.setFontSize(8);
  pdf.text(
    "DataCensus • Análisis de Calidad de Datos basado en ISO/IEC 25012",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );
  
  // Save PDF
  pdf.save(`datacensus-report-${Date.now()}.pdf`);
};
