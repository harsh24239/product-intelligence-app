import { validateAndFlagAnomalies } from './standardsKnowledgeBase.js';

export function detectAnomalies(product) {
  return validateAndFlagAnomalies(product);
}

export function computeDataHealthScore(products) {
  if (!products || products.length === 0) return { score: 0, breakdown: { completeness: 0, anomalyPenalty: 0, flaggedPenalty: 0 } };

  const avgCompleteness = products.reduce((acc, p) => acc + (p.completeness || 0), 0) / products.length;
  
  let totalAnomalies = 0;
  let flaggedCount = 0;

  products.forEach(p => {
    if (p.anomalies) {
      totalAnomalies += p.anomalies.filter(a => !a.resolved).length;
    }
    if (p.status === 'flagged') {
      flaggedCount++;
    }
  });

  const anomalyPenalty = Math.min(totalAnomalies * 2, 30); // max 30 points penalty
  const flaggedPenalty = Math.min(flaggedCount * 5, 20); // max 20 points penalty

  let score = avgCompleteness - anomalyPenalty - flaggedPenalty;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    breakdown: {
      completeness: Math.round(avgCompleteness),
      anomalyPenalty,
      flaggedPenalty
    }
  };
}

export function getCatalogMetrics(products) {
  const metrics = {
    total: products.length,
    byStatus: { raw: 0, ai_enriched: 0, validated: 0, commerce_ready: 0, flagged: 0 },
    byCategory: {},
    avgCompleteness: 0,
    anomalyCount: 0,
    unresolvedAnomalies: 0,
    healthScore: computeDataHealthScore(products),
    commerceReadyPct: 0
  };

  if (products.length === 0) return metrics;

  let totalCompleteness = 0;

  products.forEach(p => {
    if (p.status && metrics.byStatus[p.status] !== undefined) {
      metrics.byStatus[p.status]++;
    }
    
    if (p.category) {
      metrics.byCategory[p.category] = (metrics.byCategory[p.category] || 0) + 1;
    }

    totalCompleteness += (p.completeness || 0);

    if (p.anomalies) {
      metrics.anomalyCount += p.anomalies.length;
      metrics.unresolvedAnomalies += p.anomalies.filter(a => !a.resolved).length;
    }
  });

  metrics.avgCompleteness = Math.round(totalCompleteness / products.length);
  metrics.commerceReadyPct = Math.round((metrics.byStatus.commerce_ready / products.length) * 100);

  return metrics;
}
