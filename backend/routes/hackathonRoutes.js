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

// ============================================================
// CONSTANTS: Abbreviation Lookup Tables (PDF Requirement)
// ============================================================

const COLOR_MAP = {
  'WH': 'White', 'Wh': 'White', 'BK': 'Black', 'Bk': 'Black',
  'SS': 'Stainless Steel', 'BSS': 'Black Stainless Steel',
  'CH': 'Charcoal', 'BL': 'Blue', 'RD': 'Red', 'SV': 'Silver',
  'GY': 'Gray', 'BO': 'Bronze', 'DG': 'Dark Gray',
};

const MATERIAL_MAP = {
  'SS': 'Stainless Steel', 'SST': 'Stainless Steel', 'Sst': 'Stainless Steel',
  'Alm': 'Aluminum', 'Alum': 'Aluminum', 'ALM': 'Aluminum',
  'PVC': 'PVC', 'Vinyl': 'Vinyl', 'Composite': 'Composite',
  'BRS': 'Brass', 'Brs': 'Brass', 'Cast Iron': 'Cast Iron',
};

// Words that indicate what kind of item it is (noun extraction)
const ITEM_TYPE_KEYWORDS = [
  'Dishwasher', 'Dryer', 'Washer', 'Refrigerator', 'Laundry', 'Range',
  'Sanding Belt', 'Sanding Disc', 'Cut-Off Disc', 'Grinding Wheel', 'Sponge',
  'Decking', 'Fascia', 'Railing', 'Rail Kit', 'Post', 'Balusters', 'Baluster',
  'Threshold', 'Skylight', 'Window', 'Door', 'Gate',
  'Tape', 'Drywall', 'Mortar', 'Subflooring', 'Siding',
  'Heater Kit', 'Pressure Gauge', 'Kneeling Pad',
];

// ============================================================
// UTILITY: Clean a placeholder string
// ============================================================
const PLACEHOLDERS = ['-- unbranded --', '-- no unilog brand --', '-- no dib brand --', 'commodity - unbranded', '-'];
const isPlaceholder = (val) => {
  if (!val || !val.trim()) return true;
  return PLACEHOLDERS.some(p => val.trim().toLowerCase() === p);
};
const cleanField = (val) => isPlaceholder(val) ? '' : val.trim();

// ============================================================
// UTILITY: Normalize units (PDF core rule)
// ============================================================
const normalizeUnits = (text) => {
  if (!text) return '';
  let t = text;
  // Inches: 50-1/4IN, 12", 6 inches, 6in → 50-1/4 in, 12 in, 6 in
  t = t.replace(/(\d[\d\/\-]*)\s*(?:IN\.|IN\b|in\.|in\b|inch(?:es)?|")/gi, (_, n) => `${n} in`);
  // Voltage: 120V, 240V → 120 V, 240 V
  t = t.replace(/(\d+(?:\.\d+)?)\s*V(?!\w)/g, '$1 V');
  // Amps: 15A, 10A → 15 A, 10 A
  t = t.replace(/(\d+(?:\.\d+)?)\s*A(?!\w)/g, '$1 A');
  // Feet: 6', 8' → 6 ft, 8 ft
  t = t.replace(/(\d+)\s*'/g, '$1 ft');
  // dBA stays as dBA
  return t;
};

// ============================================================
// UTILITY: Extract manufacturer code from raw string
// e.g. "Appliance Dealers Cooperative (APPDE)" → { name: "Appliance Dealers Cooperative", code: "APPDE" }
// ============================================================
const splitManufacturer = (raw) => {
  if (!raw || isPlaceholder(raw)) return { name: '', code: '' };
  const match = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) return { name: match[1].trim(), code: match[2].trim() };
  return { name: raw.trim(), code: '' };
};

// ============================================================
// UTILITY: Extract item type from description
// ============================================================
const extractItemType = (desc) => {
  const lower = desc.toLowerCase();
  for (const kw of ITEM_TYPE_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) return kw;
  }
  // Fallback: first meaningful word after the part number pattern
  const words = desc.replace(/^[\w\-]+ /, '').split(/\s+/);
  return words[0] || 'Item';
};

// ============================================================
// UTILITY: Extract color from description
// ============================================================
const extractColor = (desc) => {
  // Try exact keyword match first
  for (const [abbr, color] of Object.entries(COLOR_MAP)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'g');
    if (regex.test(desc)) return color;
  }
  // Try full color words
  const colorWords = ['White', 'Black', 'Charcoal', 'Gray', 'Silver', 'Bronze', 'Red', 'Blue'];
  for (const c of colorWords) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(desc)) return c;
  }
  return '';
};

// ============================================================
// UTILITY: Extract material from description
// ============================================================
const extractMaterial = (desc) => {
  for (const [abbr, mat] of Object.entries(MATERIAL_MAP)) {
    const regex = new RegExp(`\\b${abbr}\\b`);
    if (regex.test(desc)) return mat;
  }
  const matWords = ['Stainless Steel', 'Aluminum', 'PVC', 'Vinyl', 'Composite', 'Brass'];
  for (const m of matWords) {
    if (new RegExp(m, 'i').test(desc)) return m;
  }
  return '';
};

// ============================================================
// UTILITY: Extract abrasive grit from description (e.g. P150, P80)
// ============================================================
const extractGrit = (desc) => {
  const m = desc.match(/\bP(\d+)\b/i);
  return m ? `P${m[1]}` : '';
};

// ============================================================
// UTILITY: Extract dimensions from description
// Returns { length, width, height, uom }
// ============================================================
const extractDimensions = (desc) => {
  // Pattern like: 1x6-16' or 7/8nx6-20' or 31.5x14.75
  const ftMatch = desc.match(/(\d+(?:\/\d+)?n?x\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\s*ft/i);
  if (ftMatch) {
    const [, cross, length] = ftMatch;
    return { length, uom: 'ft' };
  }
  // Inch dimensions e.g. 24x48
  const inMatch = desc.match(/(\d+(?:\.\d+)?)\s*in\s*x\s*(\d+(?:\.\d+)?)\s*in/i);
  if (inMatch) return { width: inMatch[1], length: inMatch[2], uom: 'in' };
  // Single length like 16', 20'
  const singleFt = desc.match(/\b(\d+(?:\.\d+)?)\s*ft\b/);
  if (singleFt) return { length: singleFt[1], uom: 'ft' };
  return {};
};

// ============================================================
// UTILITY: Extract voltage & amperage
// ============================================================
const extractVoltage = (desc) => {
  const m = desc.match(/(\d+(?:\.\d+)?)\s*V\b/);
  return m ? m[1] : '';
};
const extractAmperage = (desc) => {
  const m = desc.match(/(\d+(?:\.\d+)?)\s*A\b/);
  return m ? m[1] : '';
};

// ============================================================
// UTILITY: Extract brand from Part_Desc (first token before space)
// e.g. "3M 775L Stikit Film..." → "3M"
// e.g. "FRIGIDAIRE® Dishwasher..." → "FRIGIDAIRE®"
// ============================================================
const extractBrandFromDesc = (desc, mpn, existingBrand) => {
  if (existingBrand && !isPlaceholder(existingBrand)) return existingBrand;
  // Strip the MPN prefix from the start of the description
  const stripped = desc.replace(new RegExp(`^${mpn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'), '').trim();
  // Take first word as brand if it looks like a brand (not lower case, not a number)
  const firstWord = stripped.split(/\s+/)[0];
  if (firstWord && /^[A-Z0-9]/.test(firstWord) && !firstWord.match(/^\d+/)) {
    return firstWord;
  }
  return '';
};

// ============================================================
// UTILITY: Generate formulaic descriptions
// Based on the expected output sample rows
// ============================================================
const buildInvoiceDesc = (itemType, attrs) => {
  // ≤40 chars, ALL CAPS, abbreviations
  const abbrev = (s) => s.toUpperCase()
    .replace(/STAINLESS STEEL/g, 'SST')
    .replace(/ALUMINUM/g, 'ALM')
    .replace(/WHITE/g, 'WH')
    .replace(/BLACK/g, 'BK')
    .replace(/CHARCOAL/g, 'CH')
    .replace(/STAIR/g, 'STR')
    .replace(/HORIZONTAL/g, 'HORIZ')
    .replace(/SQUARE/g, 'SQ')
    .replace(/ROUND/g, 'RD');
  
  const parts = [abbrev(itemType)];
  if (attrs.color) parts.push(abbrev(attrs.color).slice(0, 3));
  if (attrs.voltage) parts.push(`${attrs.voltage}V`);
  if (attrs.amperage) parts.push(`${attrs.amperage}A`);
  if (attrs.grit) parts.push(attrs.grit.toUpperCase());
  if (attrs.material && !parts.join(' ').includes(abbrev(attrs.material).slice(0, 3))) {
    parts.push(abbrev(attrs.material).slice(0, 3));
  }
  return parts.join(' ').slice(0, 40);
};

const buildMobileDesc = (brand, itemType, mpn, attrs) => {
  // 60-80 chars: Brand + Item Type + MPN + key attr
  const base = [brand, itemType, mpn].filter(Boolean).join(', ');
  const extra = [attrs.color, attrs.material].filter(Boolean).join(', ');
  const full = extra ? `${base}, ${extra}` : base;
  return full.slice(0, 80);
};

const buildShortDesc = (brand, itemType, mpn, attrs, normDesc) => {
  // Full sentence with key attributes
  const parts = [brand && `${brand}®`, itemType, mpn].filter(Boolean).join(' ');
  const attrParts = [
    attrs.color && `${attrs.color}`,
    attrs.material && `${attrs.material}`,
    attrs.voltage && `${attrs.voltage} V`,
    attrs.amperage && `${attrs.amperage} A`,
  ].filter(Boolean).join(', ');
  return attrParts ? `${parts}, ${attrParts}` : parts;
};

const buildLongDesc = (brand, itemType, mpn, attrs, normDesc) => {
  const parts = [];
  parts.push(`${brand ? brand + ' ' : ''}${itemType} ${mpn}`);
  if (attrs.color) parts.push(`${attrs.color} Finish`);
  if (attrs.material) parts.push(`${attrs.material} Construction`);
  if (attrs.voltage) parts.push(`${attrs.voltage} V Power Supply`);
  if (attrs.amperage) parts.push(`${attrs.amperage} A Rated Current`);
  if (attrs.grit) parts.push(`${attrs.grit} Abrasive Grit`);
  if (attrs.length) parts.push(`${attrs.length} ${attrs.dimUom || 'ft'} Length`);
  return parts.join(', ');
};

// ============================================================
// ROUTE: POST /api/hackathon/seed
// Reads input CSV, applies full enrichment pipeline, populates catalog
// ============================================================
router.post('/seed', (req, res) => {
  try {
    const inputPath = path.join(__dirname, '../data/hackathonInput.csv');
    const fileContent = fs.readFileSync(inputPath, 'utf8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    clearCatalog();
    let count = 0;
    let placeholdersRemoved = 0;
    let attributesExtracted = 0;

    for (const record of records) {
      if (!record.Mfg_Part_Num) continue;

      const mpn = record.Mfg_Part_Num.trim();
      const rawDesc = record.Part_Desc || '';
      const normDesc = normalizeUnits(rawDesc);

      // --- STEP 1: Cleanse brand/manufacturer ---
      const rawBrand = cleanField(record.E1_Brand);
      const rawUnilogBrand = cleanField(record.Unilog_Brand);
      const rawDIBBrand = cleanField(record.DIB_Brand);
      
      if (isPlaceholder(record.E1_Brand)) placeholdersRemoved++;
      if (isPlaceholder(record.Unilog_Brand)) placeholdersRemoved++;
      if (isPlaceholder(record.DIB_Brand)) placeholdersRemoved++;

      const { name: manufName, code: manufCode } = splitManufacturer(record.Part_Manuf);
      const brand = rawBrand || rawUnilogBrand || rawDIBBrand || extractBrandFromDesc(normDesc, mpn, '');

      // --- STEP 2 & 3: Extract attributes ---
      const itemType = extractItemType(normDesc);
      const color = extractColor(normDesc);
      const material = extractMaterial(normDesc);
      const grit = extractGrit(normDesc);
      const voltage = extractVoltage(normDesc);
      const amperage = extractAmperage(normDesc);
      const dims = extractDimensions(normDesc);

      const attrs = { color, material, grit, voltage, amperage, length: dims.length, width: dims.width, height: dims.height, dimUom: dims.uom };
      
      // Count extracted attributes
      const extractedCount = Object.values(attrs).filter(v => v && v !== '').length;
      attributesExtracted += extractedCount;

      // --- STEP 4: Build descriptions ---
      const invoiceDesc = buildInvoiceDesc(itemType, attrs);
      const mobileDesc = buildMobileDesc(brand, itemType, mpn, attrs);
      const shortDesc = buildShortDesc(brand, itemType, mpn, attrs, normDesc);
      const longDesc = buildLongDesc(brand, itemType, mpn, attrs, normDesc);
      const productName = shortDesc;

      // Build structured attribute list
      const attrList = [];
      if (color) attrList.push({ label: 'Color', value: color, uom: '' });
      if (material) attrList.push({ label: 'Material', value: material, uom: '' });
      if (voltage) attrList.push({ label: 'Voltage Rating', value: voltage, uom: 'V' });
      if (amperage) attrList.push({ label: 'Amperage Rating', value: amperage, uom: 'A' });
      if (grit) attrList.push({ label: 'Abrasive Grit', value: grit, uom: '' });
      if (dims.length) attrList.push({ label: 'Length', value: dims.length, uom: dims.uom || 'in' });
      if (dims.width) attrList.push({ label: 'Width', value: dims.width, uom: dims.uom || 'in' });
      if (dims.height) attrList.push({ label: 'Height', value: dims.height, uom: dims.uom || 'in' });
      if (itemType) attrList.push({ label: 'Item Type', value: itemType, uom: '' });
      if (manufCode) attrList.push({ label: 'Manufacturer Code', value: manufCode, uom: '' });

      const product = {
        id: `prod_${uuidv4().split('-')[0]}`,
        name: shortDesc || normDesc.slice(0, 60),
        sku: mpn,
        category: itemType,
        manufacturer: manufName,
        status: extractedCount >= 3 ? 'commerce_ready' : extractedCount >= 1 ? 'validated' : 'ai_enriched',
        completeness: Math.min(100, 40 + extractedCount * 8),
        rawInput: rawDesc,
        extractedAt: new Date().toISOString(),
        extractionMethod: 'unilog_rules_engine_v2',
        specs: { voltage, amperage, material, color, grit, length: dims.length },
        attributes: attrList.map(a => ({
          key: a.label,
          value: a.value,
          confidence: 0.92,
          source: 'Part_Desc extraction',
          sourceQuote: rawDesc.slice(0, 60),
          enrichedBy: 'rules_engine',
          flagged: false,
        })),
        certifications: [],
        anomalies: extractedCount === 0
          ? [{ field: 'attributes', issue: 'No attributes could be extracted from Part_Desc. Manual review required.', severity: 'medium', resolved: false }]
          : [],
        auditLog: [
          { timestamp: new Date().toISOString(), actor: 'Cleansing Engine', action: 'Placeholder Removal', details: `Removed placeholder brand fields; extracted brand: "${brand || 'N/A'}"` },
          { timestamp: new Date().toISOString(), actor: 'Normalization Engine', action: 'Unit Standardization', details: 'Applied UOM normalization: IN→in, V→ V, A→ A, ft applied' },
          { timestamp: new Date().toISOString(), actor: 'Attribute Extractor', action: 'Attribute Extraction', details: `Extracted ${extractedCount} attributes: ${attrList.map(a=>a.label).join(', ') || 'none'}` },
          { timestamp: new Date().toISOString(), actor: 'Content Builder', action: 'Description Generation', details: `Generated INVOICE_DESC, MOBILE_DESC, SHORT_DESC, LONG_DESC1` },
        ],
      };

      // Store enriched data for export
      product.hackathonEnriched = {
        Mfg_Part_Num: mpn,
        Part_Desc: normDesc,
        Brand: brand,
        E1_Brand: rawBrand,
        Unilog_Brand: rawUnilogBrand,
        DIB_Brand: rawDIBBrand,
        Part_Manuf: record.Part_Manuf,
        MANUFACTURER_NAME: manufName,
        BRAND_NAME: brand,
        INVOICE_DESC: invoiceDesc,
        MOBILE_DESC: mobileDesc,
        SHORT_DESC: shortDesc,
        LONG_DESC1: longDesc,
        Product_Name: productName,
        attrList,
        dims,
      };

      addProduct(product);
      count++;
    }

    res.json({
      success: true,
      count,
      stats: {
        placeholdersRemoved,
        attributesExtracted,
        commerceReady: getCatalog().filter(p => p.status === 'commerce_ready').length,
      }
    });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// ROUTE: GET /api/hackathon/export
// Generates the delivery format CSV with all 252 columns
// ============================================================
router.get('/export', (req, res) => {
  try {
    const templatePath = path.join(__dirname, '../data/hackathonTemplate.csv');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const templateRecords = parse(templateContent, { columns: false, skip_empty_lines: true });

    const headers = templateRecords[0];
    const catalog = getCatalog();
    const outputRecords = [headers];

    for (const p of catalog) {
      const e = p.hackathonEnriched;
      if (!e) continue;

      const row = headers.map(header => {
        // ---- Identity fields ----
        if (header === 'Mfg_Part_Num') return e.Mfg_Part_Num;
        if (header === 'PART_NUMBER' || header === 'SKU - MY_PART_NUMBER' || header === 'MANUFACTURER_PART_NUMBER') return e.Mfg_Part_Num;
        if (header === 'Part_Desc') return e.Part_Desc;

        // ---- Brand fields — no placeholders ----
        if (header === 'E1_Brand') return e.E1_Brand;
        if (header === 'Unilog_Brand') return e.Unilog_Brand;
        if (header === 'DIB_Brand') return e.DIB_Brand;
        if (header === 'Part_Manuf') return e.MANUFACTURER_NAME;
        if (header === 'MANUFACTURER_NAME') return e.MANUFACTURER_NAME;
        if (header === 'BRAND_NAME') return e.BRAND_NAME;

        // ---- Description fields ----
        if (header === 'INVOICE_DESC') return e.INVOICE_DESC;
        if (header === 'MOBILE_DESC') return e.MOBILE_DESC;
        if (header === 'SHORT_DESC') return e.SHORT_DESC;
        if (header === 'LONG_DESC1') return e.LONG_DESC1;
        if (header === 'RETAIL_DESC') return e.SHORT_DESC;
        if (header === 'Product Name') return e.Product_Name;

        // ---- Dimension fields ----
        if (header === 'LENGTH' && e.dims?.length) return e.dims.length;
        if (header === 'LENGTH_UOM' && e.dims?.length) return e.dims.uom || 'in';
        if (header === 'WIDTH' && e.dims?.width) return e.dims.width;
        if (header === 'WIDTH_UOM' && e.dims?.width) return e.dims.uom || 'in';
        if (header === 'HEIGHT' && e.dims?.height) return e.dims.height;
        if (header === 'HEIGHT_UOM' && e.dims?.height) return e.dims.uom || 'in';

        // ---- Dynamic ATTRIBUTE_LABEL/VALUE/UOM columns ----
        const attrLabelMatch = header.match(/^ATTRIBUTE_LABEL (\d+)$/);
        if (attrLabelMatch) {
          const idx = parseInt(attrLabelMatch[1]) - 1;
          return e.attrList[idx]?.label || '';
        }
        const attrValueMatch = header.match(/^ATTRIBUTE_VALUE (\d+)$/);
        if (attrValueMatch) {
          const idx = parseInt(attrValueMatch[1]) - 1;
          return e.attrList[idx]?.value || '';
        }
        const attrUomMatch = header.match(/^ATTRIBUTE_UOM (\d+)$/);
        if (attrUomMatch) {
          const idx = parseInt(attrUomMatch[1]) - 1;
          return e.attrList[idx]?.uom || '';
        }

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
