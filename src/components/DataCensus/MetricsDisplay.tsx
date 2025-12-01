import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QualityResults } from "@/types/dataQuality";
import { CriterionCard } from "./CriterionCard";
import { TrendingUp, AlertCircle, Download, Loader2 } from "lucide-react";
import { generatePDFReport } from "@/lib/quality/exportPDF";
import { toast } from "sonner";
import { useState } from "react";

interface MetricsDisplayProps {
  results: QualityResults;
  datasetName?: string;
  datasetId?: string;
}

export const MetricsDisplay = ({
  results,
  datasetName,
  datasetId,
}: MetricsDisplayProps) => {
  console.log("Results en MetricsDisplay:", results);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      toast.info("Generando reporte PDF...", {
        description: "El agente está analizando las métricas"
      });
      await generatePDFReport(results);
      toast.success("PDF generado exitosamente", {
        description: "El reporte se ha descargado"
      });
    } catch (error) {
      toast.error("Error al generar PDF", {
        description: error instanceof Error ? error.message : "Intenta de nuevo"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "from-green-500 to-green-600";
    if (score >= 6) return "from-yellow-500 to-yellow-600";
    if (score >= 4) return "from-blue-500 to-blue-600";
    return "from-red-500 to-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excelente";
    if (score >= 6) return "Bueno";
    if (score >= 4) return "Aceptable";
    return "Necesita Mejora";
  };

  return (
    <div className="space-y-8">
      {/* Dataset Header */}
      {(datasetName || datasetId) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border-0"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-[#2962FF] rounded-full" />
            <span className="text-sm font-semibold text-[#2962FF]">DATASET ACTIVO</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{datasetName || "Dataset"}</h2>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {datasetId && (
              <p className="text-sm text-gray-600 font-mono">ID: {datasetId}</p>
            )}
            {datasetId && (
              <a
                                href={`https://www.datos.gov.co/d/${datasetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2962FF]/10 hover:bg-[#2962FF]/20 text-[#2962FF] font-medium rounded-lg transition-colors"
              >
                <span>Ver en Datos Abiertos</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </motion.div>
      )}

      {/* Score General - Enhanced */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-lg shadow-blue-500/5 bg-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Puntuación General de Calidad
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-6xl font-bold bg-gradient-to-r ${getScoreColor(
                    results.promedioGeneral ?? 0
                  )} bg-clip-text text-transparent`}>
                    {(results.promedioGeneral ?? 0).toFixed(1)}
                  </span>
                  <span className="text-2xl text-gray-400">/10</span>
                </div>
                <p className="text-lg font-semibold text-gray-700 mt-2">
                  {getScoreLabel(results.promedioGeneral ?? 0)}
                </p>
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Descargar Reporte PDF
                    </>
                  )}
                </Button>
              </div>

              {/* Score Indicator */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="8"
                      className="transition-all duration-1000"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      strokeDasharray={`${(results.promedioGeneral ?? 0) * 33.93} 339.3`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2962FF" />
                        <stop offset="100%" stopColor="#1E4ED8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {Math.round((results.promedioGeneral ?? 0) * 10)}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  <span className="px-3 py-1 bg-blue-50 text-[#2962FF] rounded-full text-xs font-medium">
                    {getScoreLabel(results.promedioGeneral ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métricas Individuales */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#2962FF]" />
            Criterios de Calidad Evaluados
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
          {/* Actualidad */}
          <CriterionCard
            title="Actualidad"
            value={results.actualidad}
            description="Vigencia y actualización según frecuencia"
            tooltipContent="Evalúa si los datos están actualizados según la frecuencia de actualización declarada"
            color="blue"
            delay={0.1}
          />

          {/* Confidencialidad */}
          <CriterionCard
            title="Confidencialidad"
            value={results.confidencialidad}
            description="Protección de datos sensibles"
            tooltipContent="Evalúa la presencia de información sensible y riesgos de privacidad"
            color="yellow"
            delay={0.2}
          />

          {/* Conformidad */}
          <CriterionCard
            title="Conformidad"
            value={results.conformidad}
            description="Alineación con el esquema y reglas del dataset"
            tooltipContent="Evalúa la correspondencia entre los datos y la metadata/estructura esperada"
            color="blue"
            delay={0.25}
          />

          {/* Unicidad */}
          <CriterionCard
            title="Unicidad"
            value={results.unicidad}
            description="Detección de valores duplicados en el dataset"
            tooltipContent="Evalúa la presencia de registros duplicados y valores únicos por columna"
            color="red"
            delay={0.3}
          />

          {/* Accesibilidad */}
          <CriterionCard
            title="Accesibilidad"
            value={results.accesibilidad}
            description="Disponibilidad y facilidad de acceso a los datos"
            tooltipContent="Evalúa si los datos son accesibles, recuperables y están correctamente documentados para su uso"
            color="blue"
            delay={0.35}
          />

          {/* Portabilidad */}
          <CriterionCard
            title="Portabilidad"
            value={results.portabilidad}
            description="Facilidad para trasladar y reutilizar datos entre sistemas"
            tooltipContent="Evalúa si los datos y formatos permiten transferencia y uso entre diferentes entornos"
            color="purple"
            delay={0.37}
          />

          {/* Disponibilidad */}
          <CriterionCard
            title="Disponibilidad"
            value={results.disponibilidad}
            description="Accesibilidad temporal y garantía de disponibilidad del servicio"
            tooltipContent="Evalúa el tiempo de disponibilidad del dataset y garantía de acceso sin interrupciones"
            color="teal"
            delay={0.39}
          />

          {/* Trazabilidad */}
          <CriterionCard
            title="Trazabilidad"
            value={results.trazabilidad}
            description="Capacidad de rastrear el origen y cambios de los datos"
            tooltipContent="Evalúa la capacidad de auditar y rastrear el origen, transformaciones y cambios de los datos en el tiempo"
            color="orange"
            delay={0.41}
          />

          {/* Credibilidad */}
          <CriterionCard
            title="Credibilidad"
            value={results.credibilidad}
            description="Confiabilidad y autoridad de la fuente de datos"
            tooltipContent="Evalúa la credibilidad de la fuente, reputación del publicador y confiabilidad de los datos proporcionados"
            color="indigo"
            delay={0.43}
          />

          {/* Recuperabilidad */}
          <CriterionCard
            title="Recuperabilidad"
            value={results.recuperabilidad}
            description="Capacidad de recuperarse ante fallos o pérdida de datos"
            tooltipContent="Evalúa la existencia de mecanismos de respaldo, recuperación ante desastres y continuidad de disponibilidad"
            color="rose"
            delay={0.45}
          />

          {/* Completitud - Show loading skeleton if undefined */}
          {results.completitud === undefined ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200 border flex items-center justify-center min-h-[180px] animate-pulse">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-green-300/30 rounded-full mx-auto animate-bounce" />
                  <p className="text-sm font-medium text-green-700">Calculando Completitud...</p>
                </div>
              </Card>
            </motion.div>
          ) : (
            <CriterionCard
              title="Completitud"
              value={results.completitud}
              description="Proporción de celdas y columnas completas en el dataset"
              tooltipContent="Mide la presencia de valores no nulos y la correspondencia con la metadata declarada"
              color="green"
              delay={0.4}
              extra={
                // Mostrar porcentaje de celdas nulas si el backend lo devuelve en details
                (results as any)?.details?.completitud?.porcentaje_celdas_nulas != null
                  ? `${(results as any).details.completitud.porcentaje_celdas_nulas}% celdas nulas`
                  : undefined
              }
            />
          )}

          {/* Otras métricas pendientes (placeholders) */}
          {[
            { title: "Consistencia", icon: "✓" },
            { title: "Exactitud", icon: "🎯" },
          ].map((metric, idx) => (
            <Card
              key={idx}
              className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center rounded-lg"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{metric.icon}</div>
                <p className="text-xs text-gray-600 font-medium">{metric.title}</p>
                <p className="text-xs text-gray-400">Próximamente</p>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="p-4 bg-blue-50 border-l-4 border-l-[#2962FF] rounded-lg flex gap-3"
      >
        <AlertCircle className="w-5 h-5 text-[#2962FF] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#2962FF]">Basado en ISO/IEC 25012</p>
          <p className="text-xs text-gray-700 mt-1">
            Los criterios se evalúan conforme a los estándares internacionales de calidad de datos.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
