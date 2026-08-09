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
  const byStatus = { raw: 0, ai_enriched: 0, validated: 0, commerce_ready: 0, flagged: 0 };
  const byCategory = {};
  const anomaliesBySeverity = { high: 0, medium: 0, low: 0 };
  let totalCompleteness = 0;
  let totalAnomalies = 0;
  let unresolvedAnomalies = 0;

  if (!products || products.length === 0) {
    return {
      totalProducts: 0,
      byCategory: {},
      byStatus,
      averageCompleteness: 0,
      anomaliesDetected: 0,
      anomaliesBySeverity,
      dataHealthScore: 0,
      commerceReadyPercent: 0,
      pipelineStatus: 'idle'
    };
  }

  products.forEach(p => {
    if (p.status && byStatus[p.status] !== undefined) {
      byStatus[p.status]++;
    }
    
    if (p.category) {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    }

    totalCompleteness += (p.completeness || 0);

    if (p.anomalies && Array.isArray(p.anomalies)) {
      totalAnomalies += p.anomalies.length;
      p.anomalies.forEach(a => {
        if (!a.resolved) unresolvedAnomalies++;
        const sev = (a.severity || 'low').toLowerCase();
        if (anomaliesBySeverity[sev] !== undefined) {
          anomaliesBySeverity[sev]++;
        } else {
          anomaliesBySeverity.low++;
        }
      });
    }
  });

  const averageCompleteness = Math.round(totalCompleteness / products.length);
  const commerceReadyPercent = Math.round((byStatus.commerce_ready / products.length) * 100);
  const healthObj = computeDataHealthScore(products);

  return {
    totalProducts: products.length,
    byCategory,
    byStatus,
    averageCompleteness,
    anomaliesDetected: totalAnomalies,
    anomaliesBySeverity,
    dataHealthScore: healthObj.score,
    commerceReadyPercent,
    pipelineStatus: 'idle'
  };
}
