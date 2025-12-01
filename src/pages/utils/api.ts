// Utilities for API calls and shared constants

export const API_BASE_URL = "http://localhost:8001";

export const CRITERIA_ENDPOINTS = [
  "actualidad",
  "confidencialidad",
  "accesibilidad",
  "conformidad",
  "completitud",
  "unicidad",
  "recuperabilidad"
];

export const checkServerStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.ok;
  } catch (error) {
    console.error("Servidor no disponible:", error);
    return false;
  }
};
