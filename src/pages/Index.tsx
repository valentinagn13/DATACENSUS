import { useState, useEffect } from "react";
import { MetricsDisplay } from "@/components/DataCensus/MetricsDisplay";
import { QualityResults } from "@/types/dataQuality";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const API_BASE_URL = "http://localhost:8000";

const CRITERIA_ENDPOINTS = [
  "confidencialidad",
  "relevancia",
  "actualidad",
  "trazabilidad",
  "conformidad",
  "exactitudSintactica",
  "exactitudSemantica",
  "completitud",
  "consistencia",
  "precision",
  "portabilidad",
  "credibilidad",
  "comprensibilidad",
  "accesibilidad",
  "unicidad",
  "eficiencia",
  "recuperabilidad",
  "disponibilidad"
];

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QualityResults | null>(null);

  const fetchAllMetrics = async () => {
    setLoading(true);
    setError(null);
    
    toast.info("Obteniendo métricas de calidad...", {
      description: "Consultando 18 criterios desde el servidor"
    });

    try {
      const promises = CRITERIA_ENDPOINTS.map(async (criterion) => {
        const response = await fetch(`${API_BASE_URL}/${criterion}`);
        if (!response.ok) {
          throw new Error(`Error al obtener ${criterion}: ${response.statusText}`);
        }
        const data = await response.json();
        return { criterion, value: data.value || data.score || 0 };
      });

      const metricsArray = await Promise.all(promises);
      
      const metricsObj: any = {};
      metricsArray.forEach(({ criterion, value }) => {
        metricsObj[criterion] = value;
      });

      const promedio = metricsArray.reduce((sum, m) => sum + m.value, 0) / metricsArray.length;
      metricsObj.promedioGeneral = promedio;

      setResults(metricsObj as QualityResults);
      setLoading(false);

      toast.success("Métricas obtenidas exitosamente", {
        description: `Calidad general: ${promedio.toFixed(1)}/10`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al conectar con el servidor";
      setError(errorMessage);
      setLoading(false);
      
      toast.error("Error al obtener métricas", {
        description: errorMessage
      });
    }
  };

  useEffect(() => {
    fetchAllMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                DataCensus
              </h1>
              <p className="text-xs text-muted-foreground">
                Plataforma de Análisis de Calidad de Datos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Loading State */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  Analizando dataset...
                </p>
                <p className="text-sm text-muted-foreground">
                  Evaluando 17 criterios de calidad
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence mode="wait">
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error al obtener métricas</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {results && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MetricsDisplay results={results} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome State */}
        {!results && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-4"
          >
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Bienvenido a DataCensus
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visualiza métricas de calidad de datos en tiempo real desde tu servidor local.
              Las métricas se actualizan automáticamente al cargar la página.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">Confidencialidad</div>
              </div>
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">Completitud</div>
              </div>
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">Consistencia</div>
              </div>
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">Precisión</div>
              </div>
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">+13 más</div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-xs text-muted-foreground">
            DataCensus • Análisis de Calidad de Datos basado en ISO/IEC 25012
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
