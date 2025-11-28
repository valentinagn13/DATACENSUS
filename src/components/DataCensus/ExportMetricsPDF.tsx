import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { QualityResults } from "@/types/dataQuality";

interface ExportMetricsPDFProps {
  results: QualityResults | null;
  datasetInfo?: Record<string, any>;
}

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, fontFamily: "Helvetica" },
  header: { marginBottom: 12 },
  title: { fontSize: 18, marginBottom: 6 },
  section: { marginBottom: 8 },
  metricRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  metricName: { fontSize: 12 },
  metricValue: { fontSize: 12, fontWeight: 700 }
});

const PDFDocument: React.FC<{ results: QualityResults; datasetInfo?: Record<string, any> }> = ({ results, datasetInfo }) => {
  const metricsToShow = [
    "actualidad",
    "confidencialidad",
    "unicidad",
    "accesibilidad",
    "conformidad",
    "completitud",
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Reporte de Métricas de Calidad</Text>
          <Text>Dataset: {datasetInfo?.dataset_name ?? datasetInfo?.dataset_id ?? "-"}</Text>
          {datasetInfo?.dataset_id && <Text>ID: {datasetInfo.dataset_id}</Text>}
          <Text>Fecha: {new Date().toLocaleString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 14, marginBottom: 6 }}>Puntuación General</Text>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>{(results.promedioGeneral ?? 0).toFixed(1)} / 10</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 14, marginBottom: 6 }}>Métricas</Text>
          {metricsToShow.map((m) => (
            <View key={m} style={styles.metricRow}>
              <Text style={styles.metricName}>{m}</Text>
              <Text style={styles.metricValue}>{(results as any)[m] !== undefined && (results as any)[m] !== null ? ((results as any)[m]).toFixed(1) : "-"}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 14, marginBottom: 6 }}>Detalles</Text>
          {results?.details && Object.keys(results.details).length > 0 ? (
            Object.entries(results.details).map(([key, value]) => (
              <View key={key} style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: 600 }}>{key}</Text>
                <Text style={{ fontSize: 11 }}>{JSON.stringify(value)}</Text>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 11 }}>No hay detalles adicionales disponibles.</Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export const ExportMetricsPDF: React.FC<ExportMetricsPDFProps> = ({ results, datasetInfo }) => {
  const handleDownload = async () => {
    if (!results) return;

    try {
      const doc = <PDFDocument results={results} datasetInfo={datasetInfo} />;
      const asPdf = pdf();
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = `metrics_${datasetInfo?.dataset_id ?? "dataset"}_${new Date().toISOString()}.pdf`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error al generar PDF:", e);
      alert("Error al generar PDF. Revisa la consola para más detalles.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!results}
      className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-1 text-sm hover:bg-slate-800 disabled:opacity-50"
    >
      Descargar PDF
    </button>
  );
};

export default ExportMetricsPDF;
