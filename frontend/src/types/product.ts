export type ProductStatus = 'raw' | 'ai_enriched' | 'validated' | 'commerce_ready' | 'flagged';
export type EnrichmentSource = 'llm_extraction' | 'rag_enrichment' | 'human_validated' | 'rule_engine' | 'gemini_extraction';
export type AnomalySeverity = 'low' | 'medium' | 'high';

export interface ProductAttribute {
  key: string;
  value: string;
  confidence: number;
  source: string;
  sourceQuote: string;
  enrichedBy: EnrichmentSource;
  flagged: boolean;
  flagReason?: string;
}

export interface ProductAnomaly {
  field: string;
  issue: string;
  severity: AnomalySeverity;
  resolved: boolean;
}

export interface AuditLogEntry {
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export interface ProductSpecs {
  material: string | null;
  dimensions: string | null;
  weight: string | null;
  color: string | null;
  voltage: string | null;
  ipRating: string | null;
  certification: string | null;
  [key: string]: string | null;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  manufacturer: string;
  status: ProductStatus;
  category: string;
  completeness: number;
  lastUpdated: string;
  specs: ProductSpecs;
  attributes: ProductAttribute[];
  anomalies: ProductAnomaly[];
  auditLog: AuditLogEntry[];
  certifications?: string[];
  price?: string | number;
  extractionMethod?: string;
}

export interface CatalogMetrics {
  totalProducts: number;
  byCategory: Record<string, number>;
  commerceReadyPercent: number;
  averageCompleteness: number;
  anomaliesDetected: number;
  anomaliesBySeverity: Record<AnomalySeverity, number>;
  dataHealthScore: number;
  pipelineStatus: 'idle' | 'running';
}

export interface ExtractionResult {
  products: Product[];
  stats: {
    processed: number;
    extracted: number;
    failed: number;
    processingTimeMs: number;
  };
}
