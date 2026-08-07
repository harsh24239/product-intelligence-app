import express from 'express';
import { structureProductFromText, enrichProductWithRAG, validateProduct } from '../services/aiStructuringService.js';
import { addProduct, getCatalog } from './catalogRoutes.js';

const router = express.Router();

// Helper to extract text from uploaded file buffer
async function extractTextFromFile(file) {
  const filename = file.originalname.toLowerCase();
  
  if (filename.endsWith('.pdf')) {
    try {
      const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
      const data = await pdfParse(file.buffer);
      return data.text;
    } catch (e) {
      console.warn('PDF parse failed, using raw buffer text:', e.message);
      return file.buffer.toString('utf8').substring(0, 2000);
    }
  }
  
  // For TXT, CSV, JSON — read as UTF-8
  return file.buffer.toString('utf8').substring(0, 5000);
}

router.post('/text', async (req, res) => {
  try {
    const { rawText, productName } = req.body;
    if (!rawText) return res.status(400).json({ error: 'rawText is required' });

    let product = await structureProductFromText(rawText, { productName });
    product = await enrichProductWithRAG(product);
    product = await validateProduct(product);
    
    addProduct(product);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/file', async (req, res) => {
  req.upload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const rawText = await extractTextFromFile(req.file);
      
      let product = await structureProductFromText(rawText, { productName: req.file.originalname });
      product = await enrichProductWithRAG(product);
      product = await validateProduct(product);
      
      addProduct(product);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

router.post('/enrich/:id', async (req, res) => {
  try {
    const catalog = getCatalog();
    const index = catalog.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });

    let product = catalog[index];
    product = await enrichProductWithRAG(product);
    catalog[index] = product;
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/validate/:id', async (req, res) => {
  try {
    const catalog = getCatalog();
    const index = catalog.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });

    let product = catalog[index];
    product = await validateProduct(product);
    catalog[index] = product;
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/batch', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'Items array is required' });
    
    const limitItems = items.slice(0, 10);
    const results = [];
    
    for (const item of limitItems) {
      let product = await structureProductFromText(item.rawText || '', { productName: item.productName });
      product = await enrichProductWithRAG(product);
      product = await validateProduct(product);
      addProduct(product);
      results.push(product);
    }
    
    res.json({
      processedCount: results.length,
      products: results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
