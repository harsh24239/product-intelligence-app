import { parseRawText, preprocessText, detectDocumentType } from './ingestionService.js';
import { STANDARDS_KB, inferMissingSpecs, normalizeUnits, validateAndFlagAnomalies } from './standardsKnowledgeBase.js';
import { v4 as uuidv4 } from 'uuid';

// Try to import Gemini SDK - graceful degradation if not configured
let GoogleGenerativeAI;
try {
  const module = await import('@google/generative-ai');
  GoogleGenerativeAI = module.GoogleGenerativeAI;
} catch (e) {}

export function computeCompletenessScore(product) {
  const specKeys = Object.keys(product.specs || {});
  if (specKeys.length === 0) return 0;
  let filled = 0;
  specKeys.forEach(k => {
    if (product.specs[k] !== null && product.specs[k] !== undefined && product.specs[k] !== '') {
      filled++;
    }
  });
  
  const totalFields = specKeys.length + 5;
  let otherFilled = 0;
  if (product.name) otherFilled++;
  if (product.category) otherFilled++;
  if (product.manufacturer) otherFilled++;
  if (product.status) otherFilled++;
  if (product.price !== null) otherFilled++;

  return Math.round(((filled + otherFilled) / totalFields) * 100);
}

/**
 * Use Gemini AI to extract structured product data from raw text.
 * Falls back to regex extraction if no API key.
 */
async function extractWithGemini(rawText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !GoogleGenerativeAI) {
    return null; // Fall back to regex
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an industrial product data extraction expert. Extract structured product information from the following technical text.

Return ONLY a valid JSON object with this exact schema (use null for missing fields):
{
  "name": "Product name",
  "manufacturer": "Manufacturer name or 'Unknown'",
  "category": "Product category (e.g., Electric Motors, Hydraulic Valves, Sensors, CNC Tooling)",
  "certifications": ["CE", "UL", "etc"],
  "specs": {
    "power": "e.g. 2.5 kW",
    "voltage": "e.g. 400V",
    "current": "e.g. 5.2A",
    "frequency": "e.g. 50Hz",
    "speed": "e.g. 1450 RPM",
    "torque": "e.g. 16.5 Nm",
    "efficiency": "e.g. IE3",
    "ipRating": "e.g. IP65",
    "insulationClass": "e.g. Class F",
    "weight": "e.g. 18.5 kg",
    "dimensions": "e.g. 250x200x300mm",
    "material": "e.g. Aluminum Alloy",
    "temperature": "e.g. -20 to 80C",
    "pressure": null,
    "flowRate": null,
    "threadSize": null,
    "mounting": "e.g. Foot mounted (B3)",
    "shaft": null
  }
}

Technical text to extract from:
---
${rawText.substring(0, 3000)}
---

Return ONLY the JSON object, no markdown, no explanation.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Strip markdown code blocks if present
    const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.warn('Gemini extraction failed, falling back to regex:', e.message);
    return null;
  }
}

export async function structureProductFromText(rawText, options = {}) {
  const cleanedText = preprocessText(rawText);
  const docType = detectDocumentType(cleanedText);
  const { extracted } = parseRawText(cleanedText);

  // Try Gemini first
  const geminiResult = await extractWithGemini(rawText);

  const product = {
    id: `prod_${uuidv4().split('-')[0]}`,
    name: geminiResult?.name || options.productName || `Structured Product (${docType.type})`,
    sku: `SKU-${Math.floor(Math.random() * 10000)}`,
    category: geminiResult?.category || (docType.type !== 'Unknown' ? docType.type : 'Electric Motors'),
    manufacturer: geminiResult?.manufacturer || 'Unknown',
    status: 'ai_enriched',
    completeness: 0,
    rawInput: rawText,
    extractedAt: new Date().toISOString(),
    extractionMethod: geminiResult ? 'gemini-1.5-flash' : 'regex-fallback',
    specs: geminiResult?.specs || {
      power: extracted.power?.value || null,
      voltage: extracted.voltage?.value || null,
      current: extracted.current?.value || null,
      frequency: extracted.frequency?.value || null,
      speed: extracted.speed?.value || null,
      torque: extracted.torque?.value || null,
      efficiency: extracted.efficiency?.value || null,
      ipRating: extracted.ipRating?.value || null,
      insulationClass: extracted.insulationClass?.value || null,
      weight: extracted.weight?.value || null,
      dimensions: extracted.dimensions?.value || null,
      material: extracted.material?.value || null,
      temperature: extracted.temperature?.value || null,
      pressure: extracted.pressure?.value || null,
      flowRate: extracted.flowRate?.value || null,
      threadSize: extracted.threadSize?.value || null,
      mounting: extracted.mounting?.value || null,
      shaft: extracted.shaft?.value || null,
    },
    attributes: [],
    certifications: geminiResult?.certifications || [],
    applications: [],
    relatedProducts: [],
    anomalies: [],
    auditLog: [
      {
        timestamp: new Date().toISOString(),
        action: 'Initial Extraction',
        actor: geminiResult ? 'Gemini AI' : 'Regex Engine',
        details: geminiResult
          ? 'Extracted structured attributes using Gemini 1.5 Flash LLM'
          : 'Extracted base specs from raw text using pattern matching'
      }
    ],
    price: null,
    currency: 'USD',
    leadTime: null,
    tags: []
  };

  // Build attributes array from specs
  for (const [key, value] of Object.entries(product.specs)) {
    if (value !== null && value !== undefined) {
      const regexAttr = extracted[key];
      product.attributes.push({
        key,
        value,
        confidence: geminiResult ? 0.92 : (regexAttr?.confidence || 70) / 100,
        source: geminiResult ? 'AI Extraction (Gemini)' : 'Raw Text (Regex)',
        sourceQuote: regexAttr?.rawMatch || value,
        enrichedBy: geminiResult ? 'gemini_extraction' : 'llm_extraction',
        flagged: false,
        flagReason: null
      });
    }
  }

  product.completeness = computeCompletenessScore(product);
  return product;
}

export async function enrichProductWithRAG(product) {
  const inferred = inferMissingSpecs(product);
  
  if (inferred.length > 0) {
    inferred.forEach(inf => {
      product.specs[inf.key] = inf.value;
      product.attributes.push(inf);
    });

    product.auditLog.push({
      timestamp: new Date().toISOString(),
      action: 'RAG Enrichment',
      actor: 'RAG_Enricher',
      details: `Inferred ${inferred.length} specs from Knowledge Base`
    });
  }

  product.completeness = computeCompletenessScore(product);
  return product;
}

export async function validateProduct(product) {
  const anomalies = validateAndFlagAnomalies(product);
  product.anomalies = anomalies;
  
  let hasHighSeverity = anomalies.some(a => a.severity === 'high' && !a.resolved);
  
  const reqFields = [product.name, product.category];
  const specCount = Object.values(product.specs).filter(v => v !== null && v !== undefined).length;
  const certCount = product.certifications?.length || 0;

  if (product.completeness > 85 && !hasHighSeverity && reqFields.every(f => !!f) && specCount >= 5 && certCount >= 1) {
    product.status = 'validated';
  } else if (hasHighSeverity) {
    product.status = 'flagged';
  } else if (product.status !== 'commerce_ready') {
    if (product.completeness > 95 && !hasHighSeverity) {
      product.status = 'commerce_ready';
    }
  }

  product.auditLog.push({
    timestamp: new Date().toISOString(),
    action: 'Validation',
    actor: 'AI_Engine',
    details: `Validation complete. Found ${anomalies.length} anomalies.`
  });

  return product;
}
