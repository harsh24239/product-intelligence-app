import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { getCatalog, addProduct, clearCatalog } from './catalogRoutes.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ---------------------------------------------------------
// 1. Cleansing & Normalization Rules (PDF Requirements)
// ---------------------------------------------------------

const isPlaceholder = (val) => {
  if (!val) return true;
  const lower = val.toLowerCase();
  return lower.includes('unbranded') || 
         lower.includes('no unilog brand') || 
         lower.includes('no dib brand') || 
         lower.includes('unspecified');
};

const cleanField = (val) => isPlaceholder(val) ? '' : val.trim();

const normalizeUnits = (text) => {
  if (!text) return '';
  let cleaned = text;
  // Normalise Inches (e.g. 50-1/4IN, 24", 12 inches -> 50-1/4 in)
  cleaned = cleaned.replace(/(\d+(?:-\d+\/\d+|\.\d+|\/\d+)?)\s*(?:IN\.|IN|inch|inches|")/gi, '$1 in');
  // Normalise Voltage (e.g. 120V -> 120 V)
  cleaned = cleaned.replace(/(\d+(?:\.\d+)?)\s*(?:V|Volts|Volt)(?!\w)/gi, '$1 V');
  // Normalise Amperage (e.g. 15A -> 15 A)
  cleaned = cleaned.replace(/(\d+(?:\.\d+)?)\s*(?:A|Amps|Amp)(?!\w)/gi, '$1 A');
  return cleaned;
};

// ---------------------------------------------------------
// 2. Ingestion Route
// ---------------------------------------------------------

router.post('/seed', (req, res) => {
  try {
    const inputPath = path.join(__dirname, '../data/hackathonInput.csv');
    const fileContent = fs.readFileSync(inputPath, 'utf8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });
    
    clearCatalog();
    let count = 0;
    
    for (const record of records) {
      if (!record.Mfg_Part_Num) continue;
      
      // Clean raw fields
      const brand = cleanField(record.E1_Brand) || cleanField(record.Unilog_Brand) || cleanField(record.DIB_Brand);
      const manuf = cleanField(record.Part_Manuf) || 'Unknown Manufacturer';
      const rawDesc = record.Part_Desc || '';
      const normDesc = normalizeUnits(rawDesc);
      
      // Extract specific attributes
      const specs = {};
      const voltageMatch = normDesc.match(/(\d+(?:\.\d+)?\s*V)/i);
      if (voltageMatch) specs.voltage = voltageMatch[1];
      
      const ampMatch = normDesc.match(/(\d+(?:\.\d+)?\s*A)/i);
      if (ampMatch) specs.amperage = ampMatch[1];
      
      const inchMatch = normDesc.match(/(\d+(?:-\d+\/\d+|\.\d+|\/\d+)?\s*in)/i);
      if (inchMatch) specs.length = inchMatch[1];

      // Infer Item Type (naively first word of desc)
      const itemType = normDesc.split(' ')[0] || 'Component';

      // Generate Formulaic Product Title: Brand + MPN + Item Type + Attributes
      const attrStrings = Object.values(specs).join(', ');
      const productTitle = `${brand ? brand + ' ' : ''}${record.Mfg_Part_Num} ${itemType}${attrStrings ? ' - ' + attrStrings : ''}`.trim();
      
      const product = {
        id: `prod_${uuidv4().split('-')[0]}`,
        name: productTitle,
        sku: record.Mfg_Part_Num,
        category: itemType,
        manufacturer: manuf,
        status: 'commerce_ready',
        completeness: Object.keys(specs).length > 0 ? 100 : 60,
        rawInput: rawDesc,
        extractedAt: new Date().toISOString(),
        extractionMethod: 'hackathon_rules_engine',
        specs,
        attributes: Object.entries(specs).map(([k, v]) => ({ key: k, value: v, confidence: 98.5 })),
        certifications: [],
        anomalies: [],
        auditLog: []
      };
      
      // Keep the raw record but cleaned
      product.hackathonCleaned = {
        Mfg_Part_Num: record.Mfg_Part_Num,
        Part_Desc: normDesc, // Use normalised description
        Brand: brand,
        Part_Manuf: manuf,
        ProductTitle: productTitle
      };
      
      addProduct(product);
      count++;
    }
    
    res.json({ success: true, count });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// 3. Export Route (Delivery Format)
// ---------------------------------------------------------

router.get('/export', (req, res) => {
  try {
    const templatePath = path.join(__dirname, '../data/hackathonTemplate.csv');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const templateRecords = parse(templateContent, { columns: false, skip_empty_lines: true });
    
    const headers = templateRecords[0];
    const catalog = getCatalog();
    
    const outputRecords = [headers];
    
    for (const p of catalog) {
      if (!p.hackathonCleaned) continue;
      
      const hc = p.hackathonCleaned;
      
      let attrIndex = 1;
      
      const row = headers.map(header => {
        // Base mapping
        if (header === 'Mfg_Part_Num' || header === 'PART_NUMBER' || header === 'SKU - MY_PART_NUMBER' || header === 'MANUFACTURER_PART_NUMBER') return hc.Mfg_Part_Num;
        if (header === 'Part_Desc') return hc.Part_Desc; // Cleaned desc
        if (header === 'Part_Manuf' || header === 'MANUFACTURER_NAME') return hc.Part_Manuf;
        if (header === 'BRAND_NAME') return hc.Brand;
        
        // Ensure no placeholders export to these fields
        if (header === 'E1_Brand' || header === 'Unilog_Brand' || header === 'DIB_Brand') return hc.Brand;
        
        // Formulaic Titles
        if (header === 'Product Name' || header === 'SHORT_DESC') return hc.ProductTitle;
        if (header === 'INVOICE_DESC') return hc.Part_Desc.substring(0, 40).toUpperCase();
        if (header === 'MOBILE_DESC') return hc.ProductTitle.substring(0, 80);
        
        // Dynamic Attribute mapping
        // We will statically map the extracted specs to the first few ATTRIBUTE blocks
        if (header === 'ATTRIBUTE_LABEL 1' && p.specs.voltage) return 'Voltage';
        if (header === 'ATTRIBUTE_VALUE 1' && p.specs.voltage) return p.specs.voltage.split(' ')[0]; // just number
        if (header === 'ATTRIBUTE_UOM 1' && p.specs.voltage) return 'V';
        
        if (header === 'ATTRIBUTE_LABEL 2' && p.specs.amperage) return 'Amperage';
        if (header === 'ATTRIBUTE_VALUE 2' && p.specs.amperage) return p.specs.amperage.split(' ')[0];
        if (header === 'ATTRIBUTE_UOM 2' && p.specs.amperage) return 'A';
        
        if (header === 'ATTRIBUTE_LABEL 3' && p.specs.length) return 'Length';
        if (header === 'ATTRIBUTE_VALUE 3' && p.specs.length) return p.specs.length.split(' ')[0];
        if (header === 'ATTRIBUTE_UOM 3' && p.specs.length) return 'in';
        
        return ''; 
      });
      outputRecords.push(row);
    }
    
    const outputCsv = stringify(outputRecords);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Unihack_Expected_Output.csv"');
    res.send(outputCsv);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
