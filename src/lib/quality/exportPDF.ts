import jsPDF from "jspdf";
import { QualityResults } from "@/types/dataQuality";

const formatMetricsForAgent = (results: QualityResults): string => {
  const criteria = [
    { key: "confidencialidad", label: "Confidencialidad" },
    { key: "actualidad", label: "Actualidad" },
    { key: "conformidad", label: "Conformidad" },
    { key: "unicidad", label: "Unicidad" },
    { key: "accesibilidad", label: "Accesibilidad" },
    { key: "portabilidad", label: "Portabilidad" },
    { key: "disponibilidad", label: "Disponibilidad" },
    { key: "trazabilidad", label: "Trazabilidad" },
    { key: "credibilidad", label: "Credibilidad" },
    { key: "recuperabilidad", label: "Recuperabilidad" },
    { key: "completitud", label: "Completitud" }
  ];

  const metricsText = criteria
    .map(({ key, label }) => {
      const value = results[key as keyof QualityResults];
      return `${label}: ${typeof value === 'number' ? value.toFixed(1) : 'N/A'}`;
    })
    .join('\n');

  return `Puntuación General: ${results.promedioGeneral.toFixed(1)}/10\n\nMétricas individuales:\n${metricsText}`;
};

const fetchAIAnalysis = async (metricsText: string): Promise<string> => {
  const response = await fetch("https://uzuma.duckdns.org/webhook/agent-calification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userMessage: metricsText
    }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener análisis del agente");
  }

  const data = await response.json();
  return Array.isArray(data) && data[0]?.output ? data[0].output : "";
};

const markdownToPlainText = (markdown: string): string => {
  return markdown
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, '')
    .trim();
};

export const generatePDFReport = async (results: QualityResults): Promise<void> => {
  const metricsText = formatMetricsForAgent(results);
  const aiAnalysisMarkdown = await fetchAIAnalysis(metricsText);
  const aiAnalysis = markdownToPlainText(aiAnalysisMarkdown);

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  
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
  
  // Metrics Section
  let yPosition = 55;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.text("Puntuación General", margin, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(32);
  pdf.setTextColor(37, 99, 235);
  pdf.text(`${results.promedioGeneral.toFixed(1)}/10`, margin, yPosition);
  
  yPosition += 15;
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Métricas Individuales", margin, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 60);
  const metricsLines = metricsText.split('\n');
  metricsLines.forEach((line: string) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(line, margin, yPosition);
    yPosition += 6;
  });
  
  // AI Analysis Section
  yPosition += 10;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.text("Análisis de Calidad", margin, yPosition);
  
  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 60);
  
  const lines = pdf.splitTextToSize(aiAnalysis, maxWidth);
  
  lines.forEach((line: string) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(line, margin, yPosition);
    yPosition += 6;
  });
  
  // Footer
  pdf.setTextColor(128, 128, 128);
  pdf.setFontSize(8);
  const finalPage = (pdf as any).internal.getNumberOfPages();
  for (let i = 1; i <= finalPage; i++) {
    pdf.setPage(i);
    pdf.text(
      "DataCensus • Análisis de Calidad de Datos basado en ISO/IEC 25012",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }
  
  // Save PDF
  pdf.save(`datacensus-report-${Date.now()}.pdf`);
};
