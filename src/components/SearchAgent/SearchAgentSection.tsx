import { useState } from "react";
import { Search, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export const SearchAgentSection = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [suggestions] = useState([
    "Datasets sobre educación con actualización reciente",
    "Análisis de calidad de datasets de salud pública",
    "Datasets con más de 10,000 registros",
  ]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse("");

    try {
      const res = await fetch("https://uzuma.duckdns.org/webhook/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: query
        }),
      });

      if (!res.ok) {
        throw new Error("Error al conectar con el agente");
      }

      const data = await res.json();
      if (data && data[0] && data[0].output) {
        setResponse(data[0].output);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error al conectar con el agente. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#2962FF] rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Búsqueda Inteligente Impulsada por IA</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Encuentra tu Dataset Perfecto
          </h1>
          <p className="text-lg text-gray-600">
            Describe lo que buscas en lenguaje natural y nuestro agente de IA te ayudará a encontrar el dataset ideal con la calidad que necesitas.
          </p>
        </div>

        {/* Search Box */}
        <Card className="p-6 border-0 shadow-lg shadow-blue-500/5 bg-white">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="¿Qué dataset estás buscando? Describe tus necesidades..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 h-12 border-0 bg-gray-50/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-base transition-colors"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
                aria-label={isLoading ? "Buscando" : "Buscar"}
                className="bg-gradient-to-r from-[#2962FF] to-[#1E4ED8] hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 text-white px-3 sm:px-6 gap-2 h-12 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {isLoading ? "Buscando..." : "Buscar"}
                </span>
              </button>
            </div>

            {/* Suggestions */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">Ejemplos de búsqueda:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(suggestion)}
                    className="text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            title: "Búsqueda Natural",
            description: "Usa lenguaje conversacional para buscar datasets",
            icon: "🧠",
          },
          {
            title: "Filtrado Inteligente",
            description: "IA filtra por calidad, actualización y relevancia",
            icon: "🎯",
          },
          {
            title: "Análisis Inmediato",
            description: "Obtén métricas de calidad al instante",
            icon: "⚡",
          },
        ].map((feature, idx) => (
          <Card
            key={idx}
            className="p-4 border-0 shadow-lg shadow-blue-500/5 hover:shadow-lg hover:shadow-blue-500/10 transition-shadow bg-white"
          >
            <div className="text-3xl mb-2">{feature.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </Card>
        ))}
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2962FF] to-[#1E4ED8] rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-white rounded-full" />
            </div>
            <p className="text-gray-600">
              El agente está buscando el dataset perfecto para ti...
            </p>
          </div>
        </motion.div>
      )}

      {/* Response Display */}
      {response && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 border-0 shadow-lg bg-white">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2962FF] to-[#1E4ED8] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Respuesta del Agente</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{response}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
