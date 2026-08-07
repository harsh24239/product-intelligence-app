import { Product, ProductStatus, CatalogMetrics, ExtractionResult } from '../types/product';

export const api = {
  // Catalog
  getCatalog: async (filters?: { status?: string; category?: string; q?: string }): Promise<Product[]> => {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    const res = await fetch(`/api/catalog?${params}`);
    if (!res.ok) throw new Error('Failed to fetch catalog');
    return res.json();
  },
  getMetrics: async (): Promise<CatalogMetrics> => {
    const res = await fetch(`/api/metrics`);
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return res.json();
  },
  getProduct: async (id: string): Promise<Product> => {
    const res = await fetch(`/api/catalog/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },
  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const res = await fetch(`/api/catalog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },
  updateStatus: async (id: string, status: ProductStatus): Promise<Product> => {
    return api.updateProduct(id, { status });
  },
  deleteProduct: async (id: string): Promise<void> => {
    const res = await fetch(`/api/catalog/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
  },
  resolveAnomaly: async (id: string, index: number): Promise<Product> => {
    const res = await fetch(`/api/catalog/${id}/anomalies/${index}/resolve`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to resolve anomaly');
    return res.json();
  },
  
  // Extraction
  extractFromText: async (rawText: string, productName?: string): Promise<Product> => {
    const res = await fetch(`/api/extract/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText, productName }),
    });
    if (!res.ok) throw new Error('Failed to extract from text');
    return res.json();
  },
  extractFromFile: async (file: File): Promise<Product> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`/api/extract/file`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to extract from file');
    return res.json();
  },
  enrichProduct: async (id: string): Promise<Product> => {
    const res = await fetch(`/api/catalog/${id}/enrich`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to enrich product');
    return res.json();
  },
  validateProduct: async (id: string): Promise<Product> => {
    const res = await fetch(`/api/catalog/${id}/validate`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to validate product');
    return res.json();
  },
  batchExtract: async (items: { rawText: string }[]): Promise<ExtractionResult> => {
    const res = await fetch(`/api/extract/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error('Failed to run batch extraction');
    return res.json();
  },
  
  // Export
  exportJSON: async (): Promise<void> => {
    window.open('/api/export/json', '_blank');
  },
  exportCSV: async (): Promise<void> => {
    window.open('/api/export/csv', '_blank');
  },
  exportProduct: async (id: string): Promise<object> => {
    const res = await fetch(`/api/export/product/${id}`);
    if (!res.ok) throw new Error('Failed to export product');
    return res.json();
  },
  getCatalogSummary: async (): Promise<object> => {
    const res = await fetch(`/api/export/summary`);
    if (!res.ok) throw new Error('Failed to fetch catalog summary');
    return res.json();
  },
};
