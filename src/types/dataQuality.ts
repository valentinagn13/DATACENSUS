export interface QualityResults {
  confidencialidad: number;
  relevancia: number;
  actualidad: number;
  trazabilidad: number;
  conformidad: number;
  exactitudSintactica: number;
  exactitudSemantica: number;
  completitud: number;
  consistencia: number;
  precision: number;
  portabilidad: number;
  credibilidad: number;
  comprensibilidad: number;
  accesibilidad: number;
  unicidad: number;
  eficiencia: number;
  recuperabilidad: number;
  disponibilidad: number;
  promedioGeneral: number;
}

export interface DatasetMetadata {
  titulo?: string;
  descripcion?: string;
  fechaActualizacion?: Date;
  frecuenciaActualizacion?: number; // días
  fuente?: string;
  publicador?: string;
  contacto?: string;
  etiquetas?: string[];
  vinculo?: string;
  columnasDescripciones?: Record<string, string>;
}
