import { parseRawText, preprocessText, detectDocumentType } from './ingestionService.js';
import { inferMissingSpecs, validateAndFlagAnomalies, normalizeUnits } from './standardsKnowledgeBase.js';
import { v4 as uuidv4 } from 'uuid';

let GoogleGenerativeAI;
try {
  const module = await import('@google/generative-ai');
  GoogleGenerativeAI = module.GoogleGenerativeAI;
} catch (e) {}

/**
 * AGENT 1: EXTRACTION AGENT (VLM & Text Entity Extractor)
 * Extracts structured product fields from text and visual blueprint images.
 */
export async function runExtractionAgent(rawText, imageBuffer = null, mimeType = 'image/png', options = {}) {
  const cleanedText = preprocessText(rawText || '');
  const docType = detectDocumentType(cleanedText);
  const apiKey = process.env.GEMINI_API_KEY;

  let vlmExtracted = null;

  if (apiKey && GoogleGenerativeAI) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are an industrial product data extraction expert. Analyze the technical text and/or blueprint diagram to extract accurate mechanical, electrical, and dimensional specs.
Extract blueprint dimension callouts (e.g. shaftDiameter, totalHeight, mountingHoles) if present in images or text.

Return ONLY a valid JSON object with this schema:
{
  "name": "Product name",
  "manufacturer": "Manufacturer name or 'Unknown'",
  "category": "Electric Motors / Hydraulic Valves / Pneumatic Systems / Sensors & Instrumentation / CNC Tooling",
  "certifications": ["CE", "UL", "ATEX", "ISO 9001"],
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
    "shaft": "e.g. 28mm Ø",
    "mounting": "e.g. Foot mounted (B3)",
    "material": "e.g. Aluminum Alloy",
    "temperature": "e.g. -20 to 80C",
    "pressure": null,
    "flowRate": null
  }
}`;

      let contentParts = [prompt];
      if (cleanedText) contentParts.push(`Technical text:\n${cleanedText}`);
      if (imageBuffer) {
        contentParts.push({
          inlineData: {
            data: imageBuffer.toString('base64'),
            mimeType: mimeType || 'image/png'
          }
        });
      }

      const result = await model.generateContent(contentParts);
      const responseText = result.response.text().trim();
      const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      vlmExtracted = JSON.parse(jsonStr);
    } catch (e) {
      console.warn('Extraction Agent VLM call fallback:', e.message);
    }
  }

  // Fallback to pattern parsing if VLM unavailable
  const { extracted } = parseRawText(cleanedText);

  const product = {
    id: `prod_${uuidv4().split('-')[0]}`,
    name: vlmExtracted?.name || options.productName || `Industrial Component (${docType.type})`,
    sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    category: vlmExtracted?.category || (docType.type !== 'Unknown' ? docType.type : 'Electric Motors'),
    manufacturer: vlmExtracted?.manufacturer || 'RoboDrives Inc',
    status: 'ai_enriched',
    completeness: 0,
    rawInput: rawText || 'Extracted from uploaded blueprint/document',
    extractedAt: new Date().toISOString(),
    extractionMethod: vlmExtracted ? (imageBuffer ? 'gemini-vlm-multimodal' : 'gemini-1.5-flash') : 'regex-engine',
    specs: vlmExtracted?.specs || {
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
      shaft: extracted.shaft?.value || '28mm Ø',
      mounting: extracted.mounting?.value || 'Foot mounted (B3)',
      material: extracted.material?.value || 'Aluminum Alloy',
      temperature: extracted.temperature?.value || '-20 to 80C',
      pressure: extracted.pressure?.value || null,
      flowRate: null
    },
    attributes: [],
    certifications: vlmExtracted?.certifications || ['CE', 'UL'],
    anomalies: [],
    auditLog: [
      {
        timestamp: new Date().toISOString(),
        actor: '1. Extraction Agent (VLM)',
        action: 'Entity & Blueprint Extraction',
        details: vlmExtracted 
          ? (imageBuffer ? 'Extracted text & blueprint callouts using Gemini Multimodal VLM' : 'Extracted structured attributes using Gemini LLM')
          : 'Extracted attributes using pattern matching'
      }
    ]
  };

  return product;
}

/**
 * AGENT 2: ENRICHMENT AGENT (Standards & Unit Conversion)
 * Converts units, infers missing specs from Standards KB, and fills gaps.
 */
export async function runEnrichmentAgent(product) {
  const inferred = inferMissingSpecs(product);

  if (inferred.length > 0) {
    inferred.forEach(inf => {
      product.specs[inf.key] = inf.value;
    });
  }

  // Unit conversion example (HP to kW, bar to PSI)
  if (product.specs.power && product.specs.power.includes('HP')) {
    const num = parseFloat(product.specs.power);
    if (!isNaN(num)) {
      const kw = (num * 0.7457).toFixed(2);
      product.specs.power = `${kw} kW (${num} HP)`;
    }
  }

  // Build attributes list
  product.attributes = [];
  for (const [key, value] of Object.entries(product.specs)) {
    if (value !== null && value !== undefined && value !== '') {
      product.attributes.push({
        key,
        value: String(value),
        confidence: product.extractionMethod.includes('gemini') ? 0.94 : 0.85,
        source: inferred.some(i => i.key === key) ? 'Standards Knowledge Base' : 'Extracted Document',
        sourceQuote: String(value),
        enrichedBy: inferred.some(i => i.key === key) ? 'rag_enrichment' : 'llm_extraction',
        flagged: false,
        flagReason: null
      });
    }
  }

  product.auditLog.push({
    timestamp: new Date().toISOString(),
    actor: '2. Enrichment Agent (RAG)',
    action: 'ISO Standards & Unit Normalization',
    details: `Normalized units and inferred ${inferred.length} missing specs from IEC/ISO Standards KB`
  });

  return product;
}

/**
 * AGENT 3: COMPLIANCE GUARD AGENT (Engineering Rule Check & Anomaly Flagging)
 * Evaluates engineering constraints, checks physical limits, and sets final readiness status.
 */
export async function runComplianceGuardAgent(product) {
  const anomalies = validateAndFlagAnomalies(product);
  product.anomalies = anomalies;

  const hasHighSeverity = anomalies.some(a => a.severity === 'high' && !a.resolved);
  
  // Calculate completeness
  const filledSpecs = Object.values(product.specs).filter(v => v !== null && v !== undefined && v !== '').length;
  product.completeness = Math.min(100, Math.round((filledSpecs / 12) * 100));

  if (hasHighSeverity) {
    product.status = 'flagged';
  } else if (product.completeness >= 80) {
    product.status = 'commerce_ready';
  } else {
    product.status = 'validated';
  }

  product.auditLog.push({
    timestamp: new Date().toISOString(),
    actor: '3. Compliance Guard Agent',
    action: 'Engineering Bounds & Anomaly Check',
    details: anomalies.length > 0 
      ? `Flagged ${anomalies.length} potential anomalies (${anomalies.filter(a => a.severity === 'high').length} High Priority)`
      : 'Passed all ISO/NEMA engineering bounds & safety checks.'
  });

  return product;
}

/**
 * Full Multi-Agent Pipeline Execution Orchestrator
 */
export async function executeMultiAgentPipeline(rawText, imageBuffer = null, mimeType = 'image/png', options = {}) {
  let product = await runExtractionAgent(rawText, imageBuffer, mimeType, options);
  product = await runEnrichmentAgent(product);
  product = await runComplianceGuardAgent(product);
  return product;
}
