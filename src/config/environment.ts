/**
 * Configuration file for environment variables
 * This file centralizes all environment variable access
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";
export const AI_AGENT_WEBHOOK = import.meta.env.VITE_AI_AGENT_WEBHOOK || "https://uzuma.duckdns.org/webhook/agent-calification";
export const AI_AGENT_SEARCH_WEBHOOK = import.meta.env.VITE_AI_AGENT_SEARCH_WEBHOOK || "https://uzuma.duckdns.org/webhook/agent";

// External Data Source
export const DATOS_GOV_CO_BASE_URL = import.meta.env.VITE_DATOS_GOV_CO_BASE_URL || "https://www.datos.gov.co";
export const DATOS_GOV_CO_DATASET_PATH = import.meta.env.VITE_DATOS_GOV_CO_DATASET_PATH || "https://www.datos.gov.co/d";

// Default values
export const DEFAULT_DATASET_ID = import.meta.env.VITE_DEFAULT_DATASET_ID || "8dbv-wsjq";

// Repositories
export const GITHUB_FRONTEND_REPO = import.meta.env.VITE_GITHUB_FRONTEND_REPO || "https://github.com/valentinagn13/DATACENSUS";
export const GITHUB_BACKEND_REPO = import.meta.env.VITE_GITHUB_BACKEND_REPO || "https://github.com/valentinagn13/Mini_backend_metricas";

// Application Info
export const APP_NAME = import.meta.env.VITE_APP_NAME || "DataCensus";
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || "Evaluación de Calidad de Datos basado en ISO/IEC 25012";

// Criteria endpoints - derived from API
export const CRITERIA_ENDPOINTS = [
  "actualidad",
  "confidencialidad",
  "accesibilidad",
  "conformidad",
  "completitud",
  "unicidad",
  "recuperabilidad"
];

// Health check function
export const checkServerStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.ok;
  } catch (error) {
    console.error("Servidor no disponible:", error);
    return false;
  }
};
