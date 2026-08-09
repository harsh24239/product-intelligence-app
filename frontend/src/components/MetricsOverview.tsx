import React from 'react';
import { CatalogMetrics } from '../types/product';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Cpu,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface MetricsOverviewProps {
  metrics: CatalogMetrics | null;
  loading: boolean;
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics, loading }) => {
  if (loading || !metrics) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-shimmer" style={{ height: 110, borderRadius: 10, border: '1px solid var(--border)' }} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Products',
      tooltip: 'Total number of product records in the catalog (raw + enriched)',
      value: metrics.totalProducts.toLocaleString(),
      sub: `${Object.keys(metrics.byCategory).length} product categories`,
      trend: '+14.2% this week',
      trendUp: true,
      icon: Package,
      iconColor: '#3B82F6',
      iconBg: 'var(--blue-dim)',
      iconBorder: 'var(--blue-border)',
      barColor: '#3B82F6',
    },
    {
      title: 'Commerce Ready',
      tooltip: 'Products fully enriched, validated, and ready to publish on a commerce platform',
      value: `${metrics.commerceReadyPercent}%`,
      sub: 'Enriched & validated',
      trend: '+5.8% this month',
      trendUp: true,
      icon: CheckCircle2,
      iconColor: '#10B981',
      iconBg: 'var(--green-dim)',
      iconBorder: 'var(--green-border)',
      barValue: metrics.commerceReadyPercent,
      barColor: '#10B981',
    },
    {
      title: 'Avg Data Completeness',
      tooltip: 'Average % of required fields successfully extracted from source documents',
      value: `${metrics.averageCompleteness}%`,
      sub: 'Target: >85%',
      trend: metrics.averageCompleteness >= 85 ? 'On target' : 'Below target',
      trendUp: metrics.averageCompleteness >= 85,
      icon: Activity,
      iconColor: '#8B5CF6',
      iconBg: 'var(--violet-dim)',
      iconBorder: 'var(--violet-border)',
      barValue: metrics.averageCompleteness,
      barColor: '#8B5CF6',
    },
    {
      title: 'Anomalies to Review',
      tooltip: 'AI-flagged data issues (conflicts, out-of-range values) requiring human validation',
      value: metrics.anomaliesDetected.toLocaleString(),
      sub: `${metrics.anomaliesBySeverity.high} high priority`,
      trend: 'Needs review',
      trendUp: false,
      icon: AlertTriangle,
      iconColor: '#F59E0B',
      iconBg: 'var(--amber-dim)',
      iconBorder: 'var(--amber-border)',
      barColor: '#F59E0B',
    },
    {
      title: 'AI Pipeline',
      tooltip: 'Status of the multi-agent extraction and enrichment pipeline',
      value: metrics.pipelineStatus === 'running' ? 'Running' : 'Ready',
      sub: 'Gemini 1.5 · RAG · Guard',
      trend: 'Model loaded',
      trendUp: true,
      icon: Cpu,
      iconColor: '#06B6D4',
      iconBg: 'var(--cyan-dim)',
      iconBorder: 'var(--cyan-border)',
      barColor: '#06B6D4',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="card"
            style={{ padding: 18 }}
            title={card.tooltip}
          >
            {/* Icon + title row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 6,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: 'var(--text)',
                    letterSpacing: '-0.5px',
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </div>
              </div>
              <div
                style={{
                  width: 36, height: 36,
                  borderRadius: 8,
                  background: card.iconBg,
                  border: `1px solid ${card.iconBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color={card.iconColor} />
              </div>
            </div>

            {/* Progress bar */}
            {card.barValue !== undefined && (
              <div
                style={{
                  height: 3,
                  background: 'var(--border)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${card.barValue}%`,
                    background: card.barColor,
                    borderRadius: 2,
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>
            )}

            {/* Sub + trend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {card.sub}
              </span>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  fontSize: 10,
                  fontWeight: 600,
                  color: card.trendUp ? 'var(--green)' : 'var(--amber)',
                  background: card.trendUp ? 'var(--green-dim)' : 'var(--amber-dim)',
                  border: `1px solid ${card.trendUp ? 'var(--green-border)' : 'var(--amber-border)'}`,
                  padding: '2px 7px',
                  borderRadius: 4,
                  flexShrink: 0,
                }}
              >
                {card.trendUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                {card.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsOverview;
