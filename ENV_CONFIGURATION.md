# Configuración de Variables de Entorno

Este documento explica cómo configurar las variables de entorno para el proyecto DataCensus.

## 📋 Archivo .env

Todas las variables de configuración se deben definir en un archivo `.env` en la raíz del proyecto.

### Crear el archivo .env

1. Copia el archivo `.env.example` como base:
```bash
cp .env.example .env
```

2. O crea un nuevo archivo `.env` en la raíz del proyecto:
```
.env
```

### Variables Disponibles

#### Backend API Configuration
- **`VITE_API_BASE_URL`**: URL del servidor backend
  - Valor por defecto: `http://localhost:8001`
  - Ejemplo: `VITE_API_BASE_URL=http://localhost:8001`
  - Para producción: `VITE_API_BASE_URL=https://api.ejemplo.com`

#### AI Agent Configuration
- **`VITE_AI_AGENT_WEBHOOK`**: Webhook para análisis inteligente de métricas
  - Valor por defecto: `https://uzuma.duckdns.org/webhook/agent-calification`
  - Se usa para generar análisis en los reportes PDF

- **`VITE_AI_AGENT_SEARCH_WEBHOOK`**: Webhook para búsqueda inteligente de datasets
  - Valor por defecto: `https://uzuma.duckdns.org/webhook/agent`
  - Se usa en la sección de búsqueda con IA

#### External Data Source
- **`VITE_DATOS_GOV_CO_BASE_URL`**: Base URL del portal de datos abiertos
  - Valor por defecto: `https://www.datos.gov.co`
  - URL del portal donde se cargan los datasets

- **`VITE_DATOS_GOV_CO_DATASET_PATH`**: URL para acceder a datasets específicos
  - Valor por defecto: `https://www.datos.gov.co/d`
  - Se usa para generar enlaces a datasets

#### Default Values
- **`VITE_DEFAULT_DATASET_ID`**: Dataset de ejemplo que se carga por defecto
  - Valor por defecto: `8dbv-wsjq`
  - Se muestra en el input cuando se carga la aplicación

#### Repositories
- **`VITE_GITHUB_FRONTEND_REPO`**: Repositorio del frontend
  - Valor por defecto: `https://github.com/valentinagn13/DATACENSUS`
  - URL del repositorio en GitHub

- **`VITE_GITHUB_BACKEND_REPO`**: Repositorio del backend
  - Valor por defecto: `https://github.com/valentinagn13/Mini_backend_metricas`
  - URL del repositorio en GitHub

#### Application Info
- **`VITE_APP_NAME`**: Nombre de la aplicación
  - Valor por defecto: `DataCensus`

- **`VITE_APP_DESCRIPTION`**: Descripción de la aplicación
  - Valor por defecto: `Evaluación de Calidad de Datos basado en ISO/IEC 25012`

## 📁 Archivos Relacionados

- **`.env`**: Archivo de configuración (no se sube a Git)
- **`.env.example`**: Template con todas las variables y su documentación
- **`.gitignore`**: Ya incluye `.env` para que no se suba al repositorio
- **`src/config/environment.ts`**: Archivo centralizado que importa todas las variables

## 🔧 Implementación

El archivo `src/config/environment.ts` centraliza el acceso a todas las variables de entorno:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";
export const AI_AGENT_WEBHOOK = import.meta.env.VITE_AI_AGENT_WEBHOOK || "...";
// etc.
```

### Uso en los componentes

En lugar de hardcodear URLs:
```typescript
// ❌ MAL - No hacer así
const url = "https://uzuma.duckdns.org/webhook/agent-calification";
```

Ahora se importa desde la configuración:
```typescript
// ✅ BIEN - Importar desde config
import { AI_AGENT_WEBHOOK } from "@/config/environment";
const url = AI_AGENT_WEBHOOK;
```

## 🚀 Para Desarrollo

1. Asegúrate de que tienes un archivo `.env` con las variables necesarias
2. Ejecuta `npm run dev` para iniciar el servidor de desarrollo
3. Las variables de entorno se cargarán automáticamente

## 📦 Para Producción

1. Define las variables de entorno en tu plataforma de hosting (Vercel, Netlify, etc.)
2. Reemplaza las URLs por las de tu entorno de producción
3. Asegúrate de que `VITE_API_BASE_URL` apunte al backend de producción

## ⚠️ Seguridad

- **NUNCA** commitsees el archivo `.env` al repositorio
- **NUNCA** pongas secretos o tokens en las variables de entorno del cliente
- El archivo `.env` está incluido en `.gitignore`
- Para información sensible, usa variables de entorno del servidor

## 📝 Checklist

- [ ] He copiado `.env.example` a `.env`
- [ ] He actualizado las URLs según mi entorno
- [ ] He verificado que `VITE_API_BASE_URL` es correcto
- [ ] He probado que la aplicación conecta con el backend
- [ ] Mis valores locales están en `.env` (no en el código)
