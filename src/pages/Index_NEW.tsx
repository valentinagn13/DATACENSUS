import { useState, useEffect } from "react";
import { MetricsDisplay } from "@/components/DataCensus/MetricsDisplay";
import { QualityResults } from "@/types/dataQuality";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, CheckCircle2, Database } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header/Header";
import { SearchAgentSection } from "@/components/SearchAgent/SearchAgentSection";
import { GlobalMetricsSection } from "@/components/Metrics/GlobalMetricsSection";

const API_BASE_URL = "http://3.148.102.253:8001";

const CRITERIA_ENDPOINTS = [
  "actualidad",
  "confidencialidad"
];

const Index = () => {
  const [currentSection, setCurrentSection] = useState<"metrics" | "search" | "global" | "about">("metrics");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QualityResults | null>(null);
  const [datasetInfo, setDatasetInfo] = useState<{
    dataset_id?: string;
    dataset_name?: string;
    rows?: number;
    columns?: number;
    records_count?: number;
    total_records_available?: number;
    limit_reached?: boolean;
  }>({});
  const [datasetInput, setDatasetInput] = useState("8dbv-wsjq");
  const [analysisStarted, setAnalysisStarted] = useState(false);

  // Verificar si el servidor está activo
  const checkServerStatus = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch (error) {
      console.error("Servidor no disponible:", error);
      return false;
    }
  };

  const initializeDataset = async (datasetId: string): Promise<boolean> => {
    setInitializing(true);
    setError(null);
    setResults(null);

    toast.info("Inicializando dataset...", {
      description: `Cargando datos para ID: ${datasetId}`
    });

    try {
      const response = await fetch(`${API_BASE_URL}/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataset_id: datasetId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al inicializar el dataset");
      }

      const data = await response.json();
      setDatasetInfo({
        dataset_id: data.dataset_id,
        dataset_name: data.dataset_name,
        rows: data.rows,
        columns: data.columns,
        records_count: data.records_count,
        total_records_available: data.total_records_available,
        limit_reached: data.limit_reached
      });

      setInitializing(false);

      toast.success("Dataset cargado exitosamente", {
        description: `✅ ${data.records_count} registros obtenidos • ${data.rows} filas × ${data.columns} columnas${
          data.limit_reached ? ' • ⚠️ Límite de descarga alcanzado' : ''
        }`
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al conectar con el servidor";
      setError(errorMessage);
      setInitializing(false);

      toast.error("Error al cargar dataset", {
        description: errorMessage
      });
      return false;
    }
  };

  const fetchAllMetrics = async () => {
    setLoading(true);
    setError(null);

    toast.info("Calculando métricas de calidad...", {
      description: "Evaluando criterios de calidad"
    });

    try {
      const promises = CRITERIA_ENDPOINTS.map(async (criterion) => {
        const response = await fetch(`${API_BASE_URL}/${criterion}?dataset_id=${datasetInput}`);
        if (!response.ok) {
          throw new Error(`Error al obtener ${criterion}: ${response.statusText}`);
        }
        const data = await response.json();
        return { criterion, value: data.score || 0 };
      });

      const metricsArray = await Promise.all(promises);

      console.log("Métricas obtenidas del backend:", metricsArray);

      const metricsObj: any = {};
      metricsArray.forEach(({ criterion, value }) => {
        metricsObj[criterion] = value;
      });

      const promedio = metricsArray.length > 0 ? metricsArray.reduce((sum, m) => sum + m.value, 0) / metricsArray.length : 0;
      metricsObj.promedioGeneral = promedio;

      console.log("Objeto final de métricas:", metricsObj);

      setResults(metricsObj as QualityResults);
      setLoading(false);

      toast.success("Análisis completado", {
        description: `📊 Puntuación promedio: ${promedio.toFixed(1)}/10`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al conectar con el servidor";
      setError(errorMessage);
      setLoading(false);

      toast.error("Error al calcular métricas", {
        description: errorMessage
      });
    }
  };

  const handleAnalyze = async () => {
    if (!datasetInput.trim()) {
      setError("Por favor, ingresa un ID de dataset válido");
      toast.error("Dataset ID requerido");
      return;
    }

    setAnalysisStarted(true);
    const initialized = await initializeDataset(datasetInput);

    if (initialized) {
      setTimeout(() => {
        fetchAllMetrics();
      }, 500);
    }
  };

  useEffect(() => {
    checkServerStatus().then(isActive => {
      if (!isActive) {
        setError("El servidor backend no está disponible. Por favor, verifica que esté ejecutándose en http://3.148.102.253:8001");
        toast.error("Servidor no disponible");
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Header currentSection={currentSection} onSectionChange={setCurrentSection} />

      <main className="pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {/* SECTION 1: ANÁLISIS POR ID */}
          {currentSection === "metrics" && (
            <motion.div
              key="metrics-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Intro Card - Diseño Moderno */}
              {!analysisStarted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-lg shadow-blue-500/5 bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
                    <CardContent className="p-8 md:p-12">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#2962FF] to-[#1E4ED8] rounded-xl flex items-center justify-center">
                            <Database className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Análisis de Calidad de Datos
                          </h2>
                          <p className="text-gray-600 text-lg mb-4">
                            Evalúa la calidad integral de tus datasets usando estándares internacionales ISO/IEC 25012
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-[#2962FF] rounded-full text-sm font-medium">
                              ✓ Actualidad
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-[#2962FF] rounded-full text-sm font-medium">
                              ✓ Confidencialidad
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-[#2962FF] rounded-full text-sm font-medium">
                              + Más métricas
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Input Section - Diseño Moderno */}
              <motion.div
                layout
                className="bg-white border-0 shadow-lg shadow-blue-500/5 rounded-lg p-6 md:p-8"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ID del Dataset
                    </label>
                    <div className="flex gap-3 flex-col md:flex-row">
                      <input
                        type="text"
                        value={datasetInput}
                        onChange={(e) => setDatasetInput(e.target.value)}
                        disabled={initializing || loading}
                        placeholder="ej: 8dbv-wsjq"
                        className="flex-1 px-4 py-3 border-0 bg-gray-50/50 rounded-lg focus:ring-2 focus:ring-[#2962FF]/20 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500"
                      />
                      <button
                        onClick={handleAnalyze}
                        disabled={initializing || loading || !datasetInput.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-[#2962FF] to-[#1E4ED8] hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        {initializing || loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{initializing ? 'Iniciando...' : 'Analizando...'}</span>
                          </>
                        ) : (
                          <>
                            <span>Analizar Dataset</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Info Badges */}
                  {datasetInfo.records_count && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-wrap gap-2 pt-2"
                    >
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                        ✓ {datasetInfo.records_count} registros
                      </span>
                      {datasetInfo.rows && datasetInfo.columns && (
                        <span className="px-3 py-1 bg-blue-50 text-[#2962FF] rounded-full text-xs font-medium">
                          {datasetInfo.rows} × {datasetInfo.columns}
                        </span>
                      )}
                      {datasetInfo.limit_reached && (
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">
                          ⚠️ Límite alcanzado
                        </span>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Error Alert - Diseño Moderno */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert className="border-0 bg-red-50 shadow-lg shadow-red-500/5">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-900 font-semibold">Error</AlertTitle>
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Results Section */}
              {results && !loading && analysisStarted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <p className="text-sm font-semibold text-green-700">Análisis completado exitosamente</p>
                  </div>
                  <MetricsDisplay
                    results={results}
                    datasetName={datasetInfo.dataset_name}
                    datasetId={datasetInfo.dataset_id}
                  />
                </motion.div>
              )}

              {/* Loading State */}
              {(initializing || loading) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <div className="relative w-20 h-20 mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full"
                    >
                      <div className="w-full h-full bg-gradient-to-r from-[#2962FF] to-[#1E4ED8] rounded-full opacity-30" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-[#2962FF] to-[#1E4ED8] rounded-full opacity-10"
                    />
                  </div>
                  <p className="text-gray-600 font-medium text-center">
                    {initializing ? "Inicializando dataset..." : "Analizando métricas de calidad..."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* SECTION 2: AGENTE DE BÚSQUEDA */}
          {currentSection === "search" && (
            <motion.div
              key="search-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <SearchAgentSection />
            </motion.div>
          )}

          {/* SECTION 3: MÉTRICAS GLOBALES */}
          {currentSection === "global" && (
            <motion.div
              key="global-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <GlobalMetricsSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/50 backdrop-blur-md py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            DataCensus © 2024 • Plataforma de Evaluación de Calidad de Datos
          </p>
          <p className="text-xs text-gray-500">
            Basado en estándares ISO/IEC 25012 • Ministerio de Tecnologías de la Información y Comunicaciones
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
