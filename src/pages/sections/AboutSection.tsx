import { motion } from "framer-motion";
import { GITHUB_FRONTEND_REPO, GITHUB_BACKEND_REPO } from "@/config/environment";

export const AboutSection = () => {
  return (
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
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 min-h-[160px] flex flex-col justify-center"
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
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 min-h-[160px] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Frontend</h3>
            <p className="text-cyan-100 text-sm mb-4">Interfaz web de DataCensus</p>
              <a
                href={GITHUB_FRONTEND_REPO}
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

        {/* Backend */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 min-h-[160px] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Backend</h3>
            <p className="text-cyan-100 text-sm mb-4">Motor de cálculo de métricas</p>
              <a
                href={GITHUB_BACKEND_REPO}
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
  );
};
