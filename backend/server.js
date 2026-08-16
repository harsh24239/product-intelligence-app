import express from 'express';
import cors from 'cors';
import multer from 'multer';
import catalogRoutes from './routes/catalogRoutes.js';
import extractionRoutes from './routes/extractionRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import hackathonRoutes from './routes/hackathonRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Global Multer setup for in-memory storage, max 10MB
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Make multer globally available in req
app.use((req, res, next) => {
  req.upload = upload;
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Product Intelligence Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api/catalog', catalogRoutes);
app.use('/api/extract', extractionRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/hackathon', hackathonRoutes);

// Serve static frontend assets if built
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
