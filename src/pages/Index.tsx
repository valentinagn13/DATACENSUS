import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Header } from "@/components/Header/Header";
import { NeuralNetworkBackground } from "./components/NeuralNetworkBackground";
import { checkServerStatus } from "./utils/api";
import { AnalysisSection } from "./sections/AnalysisSection";
import { SearchSection } from "./sections/SearchSection";
import { GlobalSection } from "./sections/GlobalSection";
import { AboutSection } from "./sections/AboutSection";

const Index = () => {
  const [currentSection, setCurrentSection] = useState<"metrics" | "search" | "global" | "about">("metrics");
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    checkServerStatus().then(isActive => {
      if (!isActive) {
        toast.error("Servidor no disponible", {
          description: "El servidor backend no está disponible. Por favor, verifica que esté ejecutándose en http://3.148.102.253:8001"
        });
      }
    });
  }, []);

  // Si la página se carga con ?dataset_id=XXX iniciamos análisis automáticamente
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const embedFlag = params.get('embed');
      if (embedFlag === '1' || embedFlag === 'true') setIsEmbedded(true);
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Fondo de red neuronal */}
      <NeuralNetworkBackground />
      
      {/* Contenido principal */}
      <div className="relative z-10">
        <Header currentSection={currentSection} onSectionChange={setCurrentSection} isEmbedded={isEmbedded} />

        <main className="pt-8 pb-20 px-4 md:px-6 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* SECCIÓN 1: ANÁLISIS POR ID */}
            {currentSection === "metrics" && (
              <AnalysisSection onSearchClick={() => setCurrentSection("search")} />
            )}

            {/* SECCIÓN 2: AGENTE DE IA */}
            {currentSection === "search" && (
              <SearchSection />
            )}

            {/* SECCIÓN 3: MÉTRICAS GENERALES */}
            {currentSection === "global" && (
              <GlobalSection />
            )}

            {/* SECCIÓN 4: SOBRE DATACENSUS */}
            {currentSection === "about" && (
              <AboutSection />
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