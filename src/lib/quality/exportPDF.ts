import jsPDF from "jspdf";
import { QualityResults } from "@/types/dataQuality";

const formatMetricsForAgent = (results: QualityResults, datasetName?: string, datasetId?: string): string => {
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

  let message = `Puntuación General: ${results.promedioGeneral.toFixed(1)}/10\n\nMétricas individuales:\n${metricsText}`;
  
  if (datasetName || datasetId) {
    message = `Dataset: ${datasetName || 'N/A'} (ID: ${datasetId || 'N/A'})\n\n${message}`;
  }

  return message;
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

export const generatePDFReport = async (
  results: QualityResults,
  datasetName?: string,
  datasetId?: string
): Promise<void> => {
  const metricsText = formatMetricsForAgent(results, datasetName, datasetId);
  const aiAnalysisMarkdown = await fetchAIAnalysis(metricsText);
  const aiAnalysis = markdownToPlainText(aiAnalysisMarkdown);

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  
  // Define colors
  const primaryColor = [37, 99, 235] as const;
  const accentColor = [59, 130, 246] as const;
  const textDark = [20, 25, 40] as const;
  const textMedium = [80, 90, 120] as const;
  const textLight = [140, 150, 180] as const;
  const bgLight = [242, 246, 255] as const;
  
  // Header - Enhanced design
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 50, "F");
  
  // Header accent line
  pdf.setFillColor(...accentColor);
  pdf.rect(0, 48, pageWidth, 2, "F");
  
  // Logo/Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.text("DataCensus", margin, 20);
  
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("Reporte de Evaluación de Calidad de Datos", margin, 28);
  
  // Dataset info in header
  if (datasetName || datasetId) {
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    const datasetInfo = `Dataset: ${datasetName || 'N/A'} | ID: ${datasetId || 'N/A'}`;
    pdf.text(datasetInfo, margin, 35);
  }
  
  // Date
  pdf.setFontSize(9);
  const date = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  pdf.text(`Generado: ${date}`, pageWidth - margin, 35, { align: "right" });
  
  // Main content starts
  let yPosition = 60;
  
  // Score Section - Prominent
  pdf.setFillColor(...bgLight);
  pdf.rect(margin - 5, yPosition - 5, maxWidth + 10, 40, "F");
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(2);
  pdf.rect(margin - 5, yPosition - 5, maxWidth + 10, 40);
  
  pdf.setTextColor(...textDark);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Puntuación General de Calidad", margin, yPosition + 3);
  
  pdf.setFontSize(36);
  pdf.setTextColor(...primaryColor);
  pdf.setFont("helvetica", "bold");
  pdf.text(`${results.promedioGeneral.toFixed(1)}`, margin + maxWidth / 2 - 10, yPosition + 25, { align: "center" });
  
  pdf.setFontSize(12);
  pdf.setTextColor(...textMedium);
  pdf.setFont("helvetica", "normal");
  pdf.text("de 10.0", margin + maxWidth / 2 + 10, yPosition + 25, { align: "left" });
  
  yPosition += 50;
  
  // Metrics Section
  pdf.setTextColor(...textDark);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Métricas de Evaluación", margin, yPosition);
  
  yPosition += 10;
  
  // Metrics background
  pdf.setFillColor(...bgLight);
  const metricsLines = metricsText.split('\n').filter(line => line.includes(':'));
  const metricsHeight = metricsLines.length * 6 + 10;
  pdf.rect(margin - 5, yPosition - 5, maxWidth + 10, metricsHeight, "F");
  pdf.setDrawColor(...accentColor);
  pdf.setLineWidth(1);
  pdf.rect(margin - 5, yPosition - 5, maxWidth + 10, metricsHeight);
  
  pdf.setFontSize(10);
  pdf.setTextColor(...textMedium);
  pdf.setFont("helvetica", "normal");
  
  metricsLines.forEach((line: string) => {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(line, margin + 5, yPosition);
    yPosition += 6;
  });
  
  yPosition += 8;
  
  // AI Analysis Section
  pdf.setTextColor(...textDark);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Análisis Inteligente", margin, yPosition);
  
  yPosition += 8;
  
  pdf.setFontSize(9);
  pdf.setTextColor(...textMedium);
  pdf.setFont("helvetica", "normal");
  
  const lines = pdf.splitTextToSize(aiAnalysis, maxWidth - 5);
  
  lines.forEach((line: string) => {
    if (yPosition > pageHeight - 25) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(line, margin + 2, yPosition);
    yPosition += 5;
  });
  
  // Footer on all pages
  pdf.setTextColor(...textLight);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  const finalPage = (pdf as any).internal.getNumberOfPages();
  for (let i = 1; i <= finalPage; i++) {
    pdf.setPage(i);
    
    // Footer separator line
    pdf.setDrawColor(...accentColor);
    pdf.setLineWidth(0.5);
    pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    
    // Footer text
    pdf.text(
      "DataCensus • Evaluación de Calidad de Datos basado en ISO/IEC 25012",
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
    
    // Page number
    pdf.text(
      `Página ${i} de ${finalPage}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: "right" }
    );
  }
  
  // Save PDF
  const filename = datasetName
    ? `datacensus-${datasetName.replace(/\s+/g, '-')}-${Date.now()}.pdf`
    : `datacensus-report-${Date.now()}.pdf`;
  pdf.save(filename);
};
