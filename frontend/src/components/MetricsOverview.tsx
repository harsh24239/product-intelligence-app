import React from 'react';
import { CatalogMetrics } from '../types/product';
import { PackageSearch, CheckCircle2, FileText, AlertTriangle, Activity, Cpu, TrendingUp } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: CatalogMetrics | null;
  loading: boolean;
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics, loading }) => {
  if (loading || !metrics) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card animate-shimmer" style={{ height: 140, borderRadius: 16 }} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Products',
      value: metrics.totalProducts.toLocaleString(),
      change: '+14.2% this week',
      icon: PackageSearch,
      subtitle: `${Object.keys(metrics.byCategory).length} active categories`,
      color: '#6366f1',
      bgGlow: 'rgba(99,102,241,0.12)',
      iconColor: '#a5b4fc',
    },
    {
      title: 'Commerce Ready',
      value: `${metrics.commerceReadyPercent}%`,
      change: '+5.8% quality bump',
      icon: CheckCircle2,
      subtitle: 'Fully enriched & validated',
      color: '#10b981',
      bgGlow: 'rgba(16,185,129,0.12)',
      iconColor: '#34d399',
      showBar: true,
      barValue: metrics.commerceReadyPercent,
    },
    {
      title: 'Avg Completeness',
      value: `${metrics.averageCompleteness}%`,
      change: 'Target: >85%',
      icon: FileText,
      subtitle: '42 extracted attributes',
      color: '#06b6d4',
      bgGlow: 'rgba(6,182,212,0.12)',
      iconColor: '#22d3ee',
      showBar: true,
      barValue: metrics.averageCompleteness,
    },
    {
      title: 'Anomalies Detected',
      value: metrics.anomaliesDetected.toLocaleString(),
      change: 'Requires review',
      icon: AlertTriangle,
      subtitle: `${metrics.anomaliesBySeverity.high} high severity`,
      color: '#f59e0b',
      bgGlow: 'rgba(245,158,11,0.12)',
      iconColor: '#fbbf24',
    },
    {
      title: 'Data Health Index',
      value: `${metrics.dataHealthScore}/100`,
      change: 'Optimal status',
      icon: Activity,
      subtitle: 'Based on ISO 8000',
      color: '#8b5cf6',
      bgGlow: 'rgba(139,92,246,0.12)',
      iconColor: '#c4b5fd',
      showBar: true,
      barValue: metrics.dataHealthScore,
    },
    {
      title: 'AI Pipeline',
      value: metrics.pipelineStatus === 'running' ? 'Processing' : 'Standby',
      change: 'RAG Model Ready',
      icon: Cpu,
      subtitle: 'Ready for new ingestion',
      color: '#ec4899',
      bgGlow: 'rgba(236,72,153,0.12)',
      iconColor: '#f9a8d4',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="glass-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
              borderRadius: 16,
              padding: '20px 22px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
                  {card.title}
                </p>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.5px' }}>
                  {card.value}
                </div>
              </div>
              <div style={{
                width: 44, height: 44,
                borderRadius: 12,
                background: card.bgGlow,
                border: `1px solid ${card.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                marginLeft: 12,
              }}>
                <Icon size={22} color={card.iconColor} />
              </div>
            </div>

            {/* Bottom row */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: card.showBar ? 8 : 0 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>{card.subtitle}</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 700, color: '#22d3ee',
                  background: 'rgba(6,182,212,0.1)',
                  padding: '2px 8px', borderRadius: 6,
                  border: '1px solid rgba(6,182,212,0.2)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  marginLeft: 8,
                }}>
                  <TrendingUp size={10} />
                  {card.change}
                </span>
              </div>

              {card.showBar && card.barValue !== undefined && (
                <div style={{
                  width: '100%', height: 5,
                  background: 'rgba(15,23,42,0.8)',
                  borderRadius: 4, overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${card.barValue}%`,
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${card.color}, ${card.color}cc)`,
                    boxShadow: `0 0 8px ${card.color}80`,
                    transition: 'width 1s ease',
                  }} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsOverview;
