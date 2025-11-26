import { QualityResults } from "@/types/dataQuality";
import { CriterionCard } from "./CriterionCard";
import { ScoreGauge } from "./ScoreGauge";
import { Button } from "@/components/ui/button";
import { generatePDFReport } from "@/lib/quality/exportPDF";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Shield, TrendingUp, Clock, FileSearch, CheckCircle2, 
  FileText, Target, BarChart3, Layers, Zap, 
  Package, Award, BookOpen, Eye, Fingerprint,
  Activity, RotateCcw, Wifi, Database, Download
} from "lucide-react";

interface MetricsDisplayProps {
  results: QualityResults;
}

const criteriaConfig = [
  { key: "confidencialidad", title: "Confidencialidad", description: "Riesgo de publicar datos sensibles", icon: Shield },
  { key: "relevancia", title: "Relevancia", description: "Valor y utilidad de los datos", icon: TrendingUp },
  { key: "actualidad", title: "Actualidad", description: "Vigencia respecto a frecuencia de actualización", icon: Clock },
  { key: "trazabilidad", title: "Trazabilidad", description: "Metadatos diligenciados y auditoría", icon: FileSearch },
  { key: "conformidad", title: "Conformidad", description: "Adhesión a formatos y estándares", icon: CheckCircle2 },
  { key: "exactitudSintactica", title: "Exactitud Sintáctica", description: "Corrección formal y ortografía", icon: FileText },
  { key: "exactitudSemantica", title: "Exactitud Semántica", description: "Coherencia entre descripción y valores", icon: Target },
  { key: "completitud", title: "Completitud", description: "Proporción de valores disponibles", icon: BarChart3 },
  { key: "consistencia", title: "Consistencia", description: "Ausencia de contradicciones internas", icon: Layers },
  { key: "precision", title: "Precisión", description: "Nivel de desagregación de datos", icon: Target },
  { key: "portabilidad", title: "Portabilidad", description: "Facilidad de transferencia", icon: Package },
  { key: "credibilidad", title: "Credibilidad", description: "Presencia de metadatos de fuente", icon: Award },
  { key: "comprensibilidad", title: "Comprensibilidad", description: "Calidad de descripciones y etiquetas", icon: BookOpen },
  { key: "accesibilidad", title: "Accesibilidad", description: "Etiquetas de búsqueda y vínculos", icon: Eye },
  { key: "unicidad", title: "Unicidad", description: "Ausencia de duplicados", icon: Fingerprint },
  { key: "eficiencia", title: "Eficiencia", description: "Optimización de recursos", icon: Zap },
  { key: "recuperabilidad", title: "Recuperabilidad", description: "Facilidad de recuperación", icon: RotateCcw },
  { key: "disponibilidad", title: "Disponibilidad", description: "Vigencia y accesibilidad", icon: Wifi }
];

export const MetricsDisplay = ({ results }: MetricsDisplayProps) => {
  const handleDownloadPDF = async () => {
    toast.info("Generando reporte PDF...");
    try {
      await generatePDFReport(results);
      toast.success("Reporte descargado exitosamente");
    } catch (error) {
      toast.error("Error al generar el PDF");
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-8 shadow-xl"
      >
        <div className="flex justify-end mb-4">
          <Button 
            onClick={handleDownloadPDF}
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </Button>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Calidad General del Dataset</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Promedio de los 17 criterios de calidad e interoperabilidad evaluados
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary">
                ISO/IEC 25012
              </div>
              <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-medium text-accent">
                17 Criterios
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <ScoreGauge score={results.promedioGeneral} size="lg" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Clasificación</div>
              <div className={`text-sm font-bold ${
                results.promedioGeneral >= 8 ? "text-accent" :
                results.promedioGeneral >= 6 ? "text-chart-3" :
                results.promedioGeneral >= 4 ? "text-warning" :
                "text-destructive"
              }`}>
                {results.promedioGeneral >= 8 ? "Excelente" :
                 results.promedioGeneral >= 6 ? "Bueno" :
                 results.promedioGeneral >= 4 ? "Aceptable" :
                 "Deficiente"}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Individual Criteria */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Criterios Individuales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criteriaConfig.map((criterion, index) => (
            <CriterionCard
              key={criterion.key}
              title={criterion.title}
              description={criterion.description}
              score={results[criterion.key as keyof QualityResults] as number}
              icon={criterion.icon}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
