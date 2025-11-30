import { useState, useEffect } from "react";
import { MetricsDisplay } from "@/components/DataCensus/MetricsDisplay";
import { QualityResults } from "@/types/dataQuality";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, CheckCircle2, Database, Search, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header/Header";
import { SearchAgentSection } from "@/components/SearchAgent/SearchAgentSection";
import { GlobalMetricsSection } from "@/components/Metrics/GlobalMetricsSection";

const API_BASE_URL = "http://localhost:8001";

const CRITERIA_ENDPOINTS = [
  "actualidad",
  "confidencialidad",
  "accesibilidad",
  "conformidad",
  "completitud",
  "unicidad",
  "recuperabilidad"
];

// Componente para el fondo de red neuronal
const NeuralNetworkBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-blue-700 to-slate-900"></div>
      
      {/* Neural Network Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Grid Points */}
        {Array.from({ length: 200 }, (_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const size = Math.random() * 0.3 + 0.1;
          const opacity = Math.random() * 0.6 + 0.2;
          
          return (
            <circle
              key={`point-${i}`}
              cx={x}
              cy={y}
              r={size}
              fill="white"
              opacity={opacity}
            >
              <animate
                attributeName="opacity"
                values={`${opacity};${opacity * 0.3};${opacity}`}
                dur={`${Math.random() * 5 + 3}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
        
        {/* Connecting Lines */}
        {Array.from({ length: 150 }, (_, i) => {
          const x1 = Math.random() * 100;
          const y1 = Math.random() * 100;
          const x2 = x1 + (Math.random() - 0.5) * 20;
          const y2 = y1 + (Math.random() - 0.5) * 20;
          const opacity = Math.random() * 0.3 + 0.1;
          
          if (x2 < 0 || x2 > 100 || y2 < 0 || y2 > 100) return null;
          
          return (
            <line
              key={`line-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth="0.1"
              opacity={opacity}
            >
              <animate
                attributeName="stroke-width"
                values="0.1;0.3;0.1"
                dur={`${Math.random() * 8 + 4}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })}
        
        {/* Animated Data Flow Lines */}
        {Array.from({ length: 30 }, (_, i) => {
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          const length = Math.random() * 15 + 5;
          const angle = Math.random() * 360;
          const endX = startX + length * Math.cos((angle * Math.PI) / 180);
          const endY = startY + length * Math.sin((angle * Math.PI) / 180);
          
          return (
            <line
              key={`flow-${i}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="url(#pulseGradient)"
              strokeWidth="0.15"
              opacity="0.4"
            >
              <animate
                attributeName="opacity"
                values="0;0.6;0"
                dur={`${Math.random() * 3 + 2}s`}
                repeatCount="indefinite"
                begin={`${Math.random() * 2}s`}
              />
            </line>
          );
        })}
        
        {/* Gradient for animated lines */}
        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="1">
              <animate
                attributeName="stop-color"
                values="#00FFFF; #0077FF; #00FFFF"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#0077FF" stopOpacity="1">
              <animate
                attributeName="stop-color"
                values="#0077FF; #00FFFF; #0077FF"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
      </svg>
      
      {/* Overlay para mejorar legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-blue-700/5 to-slate-900/20"></div>
    </div>
  );
};

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
  const [isLoadingCompletitud, setIsLoadingCompletitud] = useState(false);
  const [isLoadingUnicidad, setIsLoadingUnicidad] = useState(false);

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

      // backend should have loaded the data into memory for subsequent GET /completitud
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

  const fetchFastMetrics = async () => {
    // Fetch actualidad, confidencialidad, unicidad, accesibilidad, conformidad, portabilidad, disponibilidad, trazabilidad, credibilidad and recuperabilidad (fast endpoints)
    const fastEndpoints = ["actualidad", "confidencialidad", "unicidad", "accesibilidad", "conformidad", "portabilidad", "disponibilidad", "trazabilidad", "credibilidad", "recuperabilidad"];
    try {
      const promises = fastEndpoints.map(async (criterion) => {
        const response = await fetch(`${API_BASE_URL}/${criterion}?dataset_id=${datasetInput}`);
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

  const fetchCompletitudMetric = async () => {
    // Fetch completitud separately (slow endpoint)
    setIsLoadingCompletitud(true);
    try {
      const response = await fetch(`${API_BASE_URL}/completitud?dataset_id=${datasetInput}`);
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

  const fetchAllMetrics = async () => {
    setLoading(true);
    setError(null);

    toast.info("Calculando métricas de calidad...", {
      description: "Evaluando criterios de calidad"
    });

    try {
      // Fetch fast metrics first and show immediately
      const fastMetrics = await fetchFastMetrics();

      const metricsObj: any = { details: {} };
      fastMetrics.forEach(({ criterion, value, details }) => {
        metricsObj[criterion] = value;
        metricsObj.details[criterion] = details ?? null;
      });

      // Calculate initial average with fast metrics (actualidad, confidencialidad, unicidad)
      const fastAverage = fastMetrics.reduce((sum, m) => sum + m.value, 0) / fastMetrics.length;

      // Set results with fast metrics only (completitud will be undefined/loading)
      metricsObj.completitud = undefined; // Placeholder while loading
      metricsObj.details.completitud = null;
      metricsObj.promedioGeneral = fastAverage;
      setResults(metricsObj as QualityResults);
      setLoading(false);
      toast.success("Métricas rápidas cargadas");

      // Fetch completitud in background without blocking UI
      fetchCompletitudMetric()
        .then((completitudData) => {
          setResults((prev) => {
            if (!prev) return prev;
            const updated = { ...prev };
            updated.completitud = completitudData.value;
            updated.details = { ...prev.details, completitud: completitudData.details ?? null };
            // Recalculate average including completitud
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

  const handleAnalyze = async () => {
    if (!datasetInput.trim()) {
      setError("Por favor, ingresa un ID de dataset válido");
      toast.error("Dataset ID requerido");
      return;
    }

    setAnalysisStarted(true);
    const initialized = await initializeDataset(datasetInput);

    if (initialized) {
      // After initialization, request backend to load full data (POST /load_data)
      const loaded = await loadDatasetRecords(datasetInput);
      if (loaded) {
        // slight delay to allow backend to finish any processing
        setTimeout(() => fetchAllMetrics(), 300);
      }
    }
  };

  useEffect(() => {
    checkServerStatus().then(isActive => {
      if (!isActive) {
        setError("El servidor backend no está disponible. Por favor, verifica que esté ejecutándose en http://localhost:8001");
        toast.error("Servidor no disponible");
      }
    });
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Fondo de red neuronal */}
      <NeuralNetworkBackground />
      
      {/* Contenido principal */}
      <div className="relative z-10">
        <Header currentSection={currentSection} onSectionChange={setCurrentSection} />

        <main className="pt-8 pb-20 px-4 md:px-6 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* SECCIÓN 1: ANÁLISIS POR ID - DISEÑO MEJORADO */}
            {currentSection === "metrics" && (
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
                    <span className="text-sm font-medium text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Análisis de Calidad de Datos
                    </span>
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl font-bold text-white mb-4"
                  >
                    DataCensus
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-cyan-100 max-w-2xl mx-auto leading-relaxed"
                  >
                    Evalúa la calidad de tus datasets usando estándares <span className="font-semibold text-white">ISO/IEC 25012</span>
                  </motion.p>
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
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-cyan-500/25"
                        >
                          <Search className="w-8 h-8 text-white" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                          Ingresa el ID del Dataset
                        </h2>
                        <p className="text-cyan-100">
                          Encuentra IDs de datasets públicos en <span className="font-semibold text-cyan-300">datos.gov.co</span>
                        </p>
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
                              onClick={handleAnalyze}
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

                        {/* Info Badges */}
                        {datasetInfo.records_count && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
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
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
            )}

            {/* SECCIÓN 2: AGENTE DE IA */}
            {currentSection === "search" && (
              <motion.div
                key="search-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 top-[72px] z-40 flex items-center justify-center p-4 md:p-6"
              >
                <SearchAgentSection />
              </motion.div>
            )}

            {/* SECCIÓN 3: MÉTRICAS GENERALES */}
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

            {/* SECCIÓN 4: SOBRE ESTE SITIO */}
            {currentSection === "about" && (
              <motion.div
                key="about-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto space-y-8 pb-20"
              >
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Sobre DataCensus
                  </h1>
                  <p className="text-xl text-cyan-100">
                    Plataforma de Evaluación de Calidad de Datos
                  </p>
                </div>

                {/* Descripción General */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-4">Acerca de la Plataforma</h2>
                  <p className="text-cyan-100 leading-relaxed">
                    DataCensus es una plataforma innovadora diseñada para evaluar la calidad de datasets utilizando estándares internacionales ISO/IEC 25012. 
                    Proporciona métricas detalladas y análisis inteligentes para ayudarte a mejorar la calidad de tus datos.
                  </p>
                </motion.div>

                {/* Repositorios */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-white">Repositorios Fuente</h2>
                  
                  {/* Frontend */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Frontend</h3>
                        <p className="text-cyan-100 text-sm mb-4">Interfaz web de DataCensus</p>
                        <a
                          href="https://github.com/valentinagn13/DATACENSUS"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          Ver en GitHub
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Backend */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Backend</h3>
                        <p className="text-cyan-100 text-sm mb-4">Motor de cálculo de métricas</p>
                        <a
                          href="https://github.com/valentinagn13/Mini_backend_metricas"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          Ver en GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Agente de IA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">Agente de IA</h3>
                  <p className="text-cyan-100 text-sm mb-4">Búsqueda inteligente de datasets</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">Powered by:</span>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold text-sm">n8n</span>
                  </div>
                </motion.div>

                {/* Documentación */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-white">Recursos</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Manual de Usuario */}
                    <a
                      href="#manual"
                      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">Manual de Usuario</h3>
                          <p className="text-xs text-cyan-200">Guía completa de uso</p>
                        </div>
                      </div>
                      <p className="text-cyan-100 text-sm">Aprende cómo utilizar todas las funcionalidades de DataCensus</p>
                    </a>

                    {/* Documentación */}
                    <a
                      href="#documentacion"
                      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.996 10-10.747S17.5 6.253 12 6.253z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-pink-300 transition-colors">Documentación Técnica</h3>
                          <p className="text-xs text-purple-200">Referencias de API y arquitectura</p>
                        </div>
                      </div>
                      <p className="text-cyan-100 text-sm">Documentación técnica detallada para desarrolladores</p>
                    </a>
                  </div>
                </motion.div>

                {/* Footer de About */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center pt-8 border-t border-white/20"
                >
                  <p className="text-cyan-200 text-sm">
                    DataCensus © 2025 | Basado en estándares ISO/IEC 25012
                  </p>
                  <p className="text-cyan-300 text-xs mt-2">
                    Ministerio de Tecnologías de la Información y Comunicaciones
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer Minimalista - Hidden in search section */}
        {currentSection !== "search" && (
          <footer className="border-t border-white/10 bg-white/5 backdrop-blur-md py-8 mt-20">
            <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
              <p className="text-sm text-cyan-100 mb-2">
                DataCensus © 2025 • Plataforma de Evaluación de Calidad de Datos
              </p>
              <p className="text-xs text-cyan-200">
                Basado en estándares ISO/IEC 25012 • Ministerio de Tecnologías de la Información y Comunicaciones
              </p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Index;