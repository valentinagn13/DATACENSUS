import { useState } from "react";
import { MetricsDisplay } from "@/components/DataCensus/MetricsDisplay";
import { QualityResults } from "@/types/dataQuality";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, CheckCircle2, Database, Search, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE_URL } from "../utils/api";

interface AnalysisSectionProps {
  onSearchClick: () => void;
}

export const AnalysisSection = ({ onSearchClick }: AnalysisSectionProps) => {
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
  const [isLoadingCompletitud, setIsLoadingCompletitud] = useState(false);

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

  const loadDatasetRecords = async (datasetId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    toast.info("Cargando registros del dataset...", {
      description: `Solicitando registros para ID: ${datasetId}`
    });

    try {
      const resp = await fetch(`${API_BASE_URL}/load_data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset_id: datasetId })
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || resp.statusText || "Error al cargar registros");
      }

      setLoading(false);
      toast.success("Registros cargados");
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al cargar registros";
      setError(msg);
      setLoading(false);
      toast.error("Error al cargar registros", { description: msg });
      return false;
    }
  };

  const fetchFastMetrics = async (datasetId?: string) => {
    const fastEndpoints = ["actualidad", "confidencialidad", "unicidad", "accesibilidad", "conformidad", "portabilidad", "disponibilidad", "trazabilidad", "credibilidad", "recuperabilidad"];
    try {
      const id = datasetId ?? datasetInput;
      const promises = fastEndpoints.map(async (criterion) => {
        const response = await fetch(`${API_BASE_URL}/${criterion}?dataset_id=${id}`);
        if (!response.ok) {
          throw new Error(`Error al obtener ${criterion}: ${response.statusText}`);
        }
        const data = await response.json();
        return { criterion, value: data.score || 0, details: data.details || null };
      });

      const metricsArray = await Promise.all(promises);
      console.log("Métricas rápidas obtenidas:", metricsArray);

      return metricsArray;
    } catch (error) {
      console.error("Error fetching fast metrics:", error);
      throw error;
    }
  };

  const fetchCompletitudMetric = async (datasetId?: string) => {
    setIsLoadingCompletitud(true);
    try {
      const id = datasetId ?? datasetInput;
      const response = await fetch(`${API_BASE_URL}/completitud?dataset_id=${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener completitud: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Completitud obtenida:", data);
      return { criterion: "completitud", value: data.score || 0, details: data.details || null };
    } catch (error) {
      console.error("Error fetching completitud:", error);
      throw error;
    } finally {
      setIsLoadingCompletitud(false);
    }
  };

  const fetchAllMetrics = async (datasetId?: string) => {
    setLoading(true);
    setError(null);

    toast.info("Calculando métricas de calidad...", {
      description: "Evaluando criterios de calidad"
    });

    try {
      const fastMetrics = await fetchFastMetrics(datasetId);

      const metricsObj: any = { details: {} };
      fastMetrics.forEach(({ criterion, value, details }) => {
        metricsObj[criterion] = value;
        metricsObj.details[criterion] = details ?? null;
      });

      const fastAverage = fastMetrics.reduce((sum, m) => sum + m.value, 0) / fastMetrics.length;

      metricsObj.completitud = undefined;
      metricsObj.details.completitud = null;
      metricsObj.promedioGeneral = fastAverage;
      setResults(metricsObj as QualityResults);
      setLoading(false);
      toast.success("Métricas rápidas cargadas");

      fetchCompletitudMetric(datasetId)
        .then((completitudData) => {
          setResults((prev) => {
            if (!prev) return prev;
            const updated = { ...prev };
            updated.completitud = completitudData.value;
            updated.details = { ...prev.details, completitud: completitudData.details ?? null };
            const metrics = [
              updated.actualidad,
              updated.confidencialidad,
              updated.unicidad,
              updated.accesibilidad,
              updated.conformidad,
              updated.completitud
            ].filter((m) => m !== undefined && m !== null);
            updated.promedioGeneral = metrics.length > 0 ? metrics.reduce((s, m) => s + m, 0) / metrics.length : 0;
            return updated;
          });
          toast.success("Completitud calculada", {
            description: "Análisis completado ✓"
          });
        })
        .catch((error) => {
          console.error("Error fetching completitud in background:", error);
          toast.error("Error al calcular Completitud", {
            description: error instanceof Error ? error.message : "Intenta de nuevo"
          });
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

  const handleAnalyze = async (overrideId?: string) => {
    const id = overrideId ?? datasetInput;
    if (!id || !id.trim()) {
      setError("Por favor, ingresa un ID de dataset válido");
      toast.error("Dataset ID requerido");
      return;
    }

    setDatasetInput(id);
    setAnalysisStarted(true);
    const initialized = await initializeDataset(id);

    if (initialized) {
      const loaded = await loadDatasetRecords(id);
      if (loaded) {
        setTimeout(() => fetchAllMetrics(id), 300);
      }
    }
  };

  return (
    <motion.div
      key="metrics-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header de Sección - Centrado y Minimalista */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-sm"
        >
          <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Basado en estándares ISO/IEC 25012
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-sm"
        >
          <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
          <a 
            href="https://datos.gov.co" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:underline"
          >
            Encuentra datasets en datos.gov.co
          </a>
        </motion.div>
      </div>

      {/* Buscador Principal - Diseño Futurista y Minimalista */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative"
      >
        {/* Efectos de fondo futuristas */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-transparent to-blue-400/20 rounded-3xl blur-sm"></div>
        
        <Card className="relative bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-cyan-500/10 rounded-3xl overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold text-white mb-4"
              >
                DataCensus
              </motion.h1>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Input Group */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-cyan-100 mb-3 text-center md:text-left">
                      Identificador del Dataset
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={datasetInput}
                        onChange={(e) => setDatasetInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !initializing && !loading && datasetInput.trim()) {
                            handleAnalyze();
                          }
                        }}
                        disabled={initializing || loading}
                        placeholder="ej: 8dbv-wsjq"
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 focus:bg-white/15 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-cyan-200 font-medium text-center md:text-left group-hover:border-white/30 shadow-lg shadow-cyan-500/10"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => handleAnalyze()}
                    disabled={initializing || loading || !datasetInput.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/40 flex items-center justify-center gap-3 whitespace-nowrap min-w-[160px]"
                  >
                    {initializing || loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-semibold">
                          {initializing ? 'Iniciando...' : 'Analizando...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span className="font-bold">Iniciar Análisis</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="flex items-center gap-4"
              >
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/30"></div>
                <span className="text-xs font-semibold text-cyan-200/70 uppercase tracking-wider">o</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/30"></div>
              </motion.div>

              {/* Agente IA Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={onSearchClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-md shadow-lg shadow-white/5"
              >
                <Sparkles className="w-5 h-5" />
                <span>Busca tu Dataset con Agente de IA</span>
              </motion.button>

              {/* Info Badges */}
              {datasetInfo.records_count ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap justify-center gap-3 pt-4"
                >
                  <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold border border-green-400/30 backdrop-blur-sm">
                    ✓ {datasetInfo.records_count} registros
                  </span>
                  {datasetInfo.rows && datasetInfo.columns && (
                    <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-400/30 backdrop-blur-sm">
                      📊 {datasetInfo.rows} filas × {datasetInfo.columns} columnas
                    </span>
                  )}
                  {datasetInfo.limit_reached && (
                    <span className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-semibold border border-yellow-400/30 backdrop-blur-sm">
                      ⚠️ Límite de datos alcanzado
                    </span>
                  )}
                </motion.div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Warning Alert - Dataset Requirements */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="max-w-2xl mx-auto"
      >
        <Alert className="border-0 bg-amber-500/20 backdrop-blur-sm shadow-lg shadow-amber-500/5 rounded-2xl border border-amber-400/30">
          <AlertCircle className="h-5 w-5 text-amber-300" />
          <AlertTitle className="text-amber-100 font-semibold">Requisitos de análisis</AlertTitle>
          <AlertDescription className="text-amber-200">
            Solo se pueden analizar activos que estén categorizados como <span className="font-semibold">Público</span>, sean de tipo <span className="font-semibold">Dataset</span> y estén marcados como <span className="font-semibold">Aprobados</span>.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="max-w-2xl mx-auto"
        >
          <Alert className="border-0 bg-red-500/20 backdrop-blur-sm shadow-lg shadow-red-500/5 rounded-2xl border border-red-400/30">
            <AlertCircle className="h-5 w-5 text-red-300" />
            <AlertTitle className="text-red-100 font-semibold">Error en el análisis</AlertTitle>
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Results Section */}
      {results && !loading && analysisStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p className="text-sm font-semibold text-green-300">Análisis completado exitosamente</p>
          </div>
          <MetricsDisplay
            results={results}
            datasetName={datasetInfo.dataset_name}
            datasetId={datasetInfo.dataset_id}
          />
        </motion.div>
      )}

      {/* Loading State - Diseño Mejorado */}
      {(initializing || loading) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="relative w-24 h-24 mb-6">
            {/* Orbital spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-cyan-200/30 border-t-cyan-400 border-r-blue-400 rounded-full"
            ></motion.div>
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20"
            ></motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Database className="w-8 h-8 text-cyan-300" />
            </div>
          </div>
          <p className="text-cyan-100 font-medium text-center text-lg">
            {initializing ? "Inicializando dataset..." : "Analizando métricas de calidad..."}
          </p>
          <p className="text-cyan-200 text-center mt-2">
            Esto puede tomar unos segundos
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
