import express from 'express';
import { getCatalog } from './catalogRoutes.js';
import { getCatalogMetrics } from '../services/anomalyService.js';

const router = express.Router();

router.get('/json', (req, res) => {
  const catalog = getCatalog();
  const exportable = catalog.filter(p => p.status === 'validated' || p.status === 'commerce_ready');
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="product-catalog-export.json"');
  res.send(JSON.stringify(exportable, null, 2));
});

router.get('/csv', (req, res) => {
  const catalog = getCatalog();
  const exportable = catalog.filter(p => p.status === 'validated' || p.status === 'commerce_ready');
  
  const headers = ['id', 'sku', 'name', 'category', 'manufacturer', 'status', 'completeness', 'power', 'voltage', 'current', 'speed', 'torque', 'ipRating', 'certifications', 'price'];
  
  const csvRows = [headers.join(',')];
  
  for (const p of exportable) {
    const row = [
      `"${p.id || ''}"`,
      `"${p.sku || ''}"`,
      `"${p.name?.replace(/"/g, '""') || ''}"`,
      `"${p.category || ''}"`,
      `"${p.manufacturer || ''}"`,
      `"${p.status || ''}"`,
      `${p.completeness || 0}`,
      `"${p.specs?.power || ''}"`,
      `"${p.specs?.voltage || ''}"`,
      `"${p.specs?.current || ''}"`,
      `"${p.specs?.speed || ''}"`,
      `"${p.specs?.torque || ''}"`,
      `"${p.specs?.ipRating || ''}"`,
      `"${(p.certifications || []).join('; ')}"`,
      `${p.price || ''}`
    ];
    csvRows.push(row.join(','));
  }
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="product-catalog-export.csv"');
  res.send(csvRows.join('\n'));
});

router.get('/product/:id/json', (req, res) => {
  const catalog = getCatalog();
  const product = catalog.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${product.id}-export.json"`);
  res.send(JSON.stringify(product, null, 2));
});

router.get('/catalog-summary', (req, res) => {
  const catalog = getCatalog();
  const metrics = getCatalogMetrics(catalog);
  res.json({
    summary: 'Catalog Export Summary',
    timestamp: new Date().toISOString(),
    metrics
  });
});

export default router;
