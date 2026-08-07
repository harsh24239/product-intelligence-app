import { inferMissingSpecs } from './standardsKnowledgeBase.js';

export function enrichFromKnowledgeBase(product) {
  const inferred = inferMissingSpecs(product);
  const enrichmentLog = [];
  
  if (inferred.length > 0) {
    inferred.forEach(inf => {
      product.specs[inf.key] = inf.value;
      product.attributes.push(inf);
      enrichmentLog.push(`Added ${inf.key}: ${inf.value} from Standards KB`);
    });

    product.auditLog.push({
      timestamp: new Date().toISOString(),
      action: 'KB Enrichment',
      actor: 'RAG_Enricher',
      details: enrichmentLog.join(', ')
    });
  }
  
  return { product, addedAttributes: inferred, enrichmentLog };
}

export function suggestRelatedProducts(product, allProducts) {
  if (!allProducts || allProducts.length === 0) return [];
  
  const related = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3)
    .map(p => p.sku);
    
  return related;
}

export function normalizeCertifications(rawCerts) {
  if (!rawCerts || !Array.isArray(rawCerts)) return [];
  
  const mapping = {
    'ce mark': 'CE',
    'ce': 'CE',
    'ul listed': 'UL',
    'ul': 'UL',
    'atex': 'ATEX',
    'iso 9001': 'ISO 9001'
  };

  return [...new Set(rawCerts.map(c => {
    const normalized = mapping[c.toLowerCase().trim()];
    return normalized || c.toUpperCase();
  }))];
}

export function generateProductDescription(product) {
  const keySpecs = [];
  if (product.specs.power) keySpecs.push(`${product.specs.power} power`);
  if (product.specs.voltage) keySpecs.push(`${product.specs.voltage} operating voltage`);
  if (product.specs.pressure) keySpecs.push(`${product.specs.pressure} pressure rating`);
  
  let specStr = keySpecs.length > 0 ? ` featuring ${keySpecs.join(', ')}` : '';
  
  return `The ${product.name} from ${product.manufacturer || 'our trusted brand'} is a premium ${product.category} product${specStr}. Built for high reliability and performance in industrial applications.`;
}
