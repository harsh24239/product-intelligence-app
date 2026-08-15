import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCatalogMetrics } from '../services/anomalyService.js';
import { findInterchangeableSubstitutes } from '../services/vectorSearchService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sampleDataPath = path.join(__dirname, '../data/sampleProducts.json');

// In-memory data store
let catalog = [];
try {
  const data = fs.readFileSync(sampleDataPath, 'utf8');
  catalog = JSON.parse(data);
} catch (err) {
  console.error("Could not load sample products", err);
}

const router = express.Router();

export const getCatalog = () => catalog;
export const addProduct = (p) => catalog.push(p);
export const clearCatalog = () => { catalog.length = 0; };

router.get('/', (req, res) => {
  let results = [...catalog];
  const { status, category, q } = req.query;

  if (status) {
    results = results.filter(p => p.status === status);
  }
  if (category) {
    results = results.filter(p => p.category === category);
  }
  if (q) {
    const term = q.toLowerCase();
    results = results.filter(p => 
      p.name?.toLowerCase().includes(term) || 
      p.sku?.toLowerCase().includes(term) || 
      p.rawInput?.toLowerCase().includes(term)
    );
  }

  res.json(results);
});

router.get('/metrics', (req, res) => {
  const metrics = getCatalogMetrics(catalog);
  res.json(metrics);
});

router.get('/:id', (req, res) => {
  const product = catalog.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Vector Similarity Search for Drop-in Replacement Substitutes
router.get('/:id/substitutes', (req, res) => {
  const product = catalog.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const substitutes = findInterchangeableSubstitutes(product, catalog);
  res.json({
    productId: product.id,
    sku: product.sku,
    substitutes
  });
});

router.put('/:id', (req, res) => {
  const index = catalog.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    catalog[index] = { ...catalog[index], ...req.body };
    catalog[index].auditLog.push({
      timestamp: new Date().toISOString(),
      action: 'Update',
      actor: 'Human_Reviewer',
      details: 'Manual product update'
    });
    res.json(catalog[index]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.put('/:id/status', (req, res) => {
  const index = catalog.findIndex(p => p.id === req.params.id);
  if (index !== -1 && req.body.status) {
    catalog[index].status = req.body.status;
    catalog[index].auditLog.push({
      timestamp: new Date().toISOString(),
      action: 'Status Update',
      actor: 'Human_Reviewer',
      details: `Status changed to ${req.body.status}`
    });
    res.json(catalog[index]);
  } else {
    res.status(404).json({ error: 'Product not found or missing status' });
  }
});

router.delete('/:id', (req, res) => {
  const index = catalog.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    const deleted = catalog.splice(index, 1);
    res.json({ success: true, deleted: deleted[0].id });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.post('/:id/resolve-anomaly', (req, res) => {
  const index = catalog.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    const { anomalyIndex } = req.body;
    if (catalog[index].anomalies && catalog[index].anomalies[anomalyIndex]) {
      catalog[index].anomalies[anomalyIndex].resolved = true;
      catalog[index].auditLog.push({
        timestamp: new Date().toISOString(),
        action: 'Anomaly Resolved',
        actor: 'Human_Reviewer',
        details: `Resolved anomaly on field: ${catalog[index].anomalies[anomalyIndex].field}`
      });
      res.json(catalog[index]);
    } else {
      res.status(400).json({ error: 'Invalid anomaly index' });
    }
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

export default router;
