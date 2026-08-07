import React from 'react';
import { CatalogMetrics } from '../types/product';
import { PackageSearch, CheckCircle2, FileText, AlertTriangle, Activity, Cpu, TrendingUp } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: CatalogMetrics | null;
  loading: boolean;
  isDark?: boolean;
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics, loading, isDark = false }) => {
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
      color: '#4f46e5',
      bgGlow: isDark ? 'rgba(99,102,241,0.12)' : '#e0e7ff',
      iconColor: isDark ? '#a5b4fc' : '#4f46e5',
    },
    {
      title: 'Commerce Ready',
      value: `${metrics.commerceReadyPercent}%`,
      change: '+5.8% quality bump',
      icon: CheckCircle2,
      subtitle: 'Fully enriched & validated',
      color: '#059669',
      bgGlow: isDark ? 'rgba(16,185,129,0.12)' : '#d1fae5',
      iconColor: isDark ? '#34d399' : '#059669',
      showBar: true,
      barValue: metrics.commerceReadyPercent,
    },
    {
      title: 'Avg Completeness',
      value: `${metrics.averageCompleteness}%`,
      change: 'Target: >85%',
      icon: FileText,
      subtitle: '42 extracted attributes',
      color: '#0284c7',
      bgGlow: isDark ? 'rgba(6,182,212,0.12)' : '#e0f2fe',
      iconColor: isDark ? '#22d3ee' : '#0284c7',
      showBar: true,
      barValue: metrics.averageCompleteness,
    },
    {
      title: 'Anomalies Detected',
      value: metrics.anomaliesDetected.toLocaleString(),
      change: 'Requires review',
      icon: AlertTriangle,
      subtitle: `${metrics.anomaliesBySeverity.high} high severity`,
      color: '#d97706',
      bgGlow: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7',
      iconColor: isDark ? '#fbbf24' : '#d97706',
    },
    {
      title: 'Data Health Index',
      value: `${metrics.dataHealthScore}/100`,
      change: 'Optimal status',
      icon: Activity,
      subtitle: 'Based on ISO 8000',
      color: '#7c3aed',
      bgGlow: isDark ? 'rgba(139,92,246,0.12)' : '#ede9fe',
      iconColor: isDark ? '#c4b5fd' : '#7c3aed',
      showBar: true,
      barValue: metrics.dataHealthScore,
    },
    {
      title: 'AI Pipeline',
      value: metrics.pipelineStatus === 'running' ? 'Processing' : 'Standby',
      change: 'RAG Model Ready',
      icon: Cpu,
      subtitle: 'Ready for new ingestion',
      color: '#db2777',
      bgGlow: isDark ? 'rgba(236,72,153,0.12)' : '#fce7f3',
      iconColor: isDark ? '#f9a8d4' : '#db2777',
    },
  ];

  const cardBg = isDark ? 'linear-gradient(145deg, rgba(30,41,59,0.65) 0%, rgba(15,23,42,0.85) 100%)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const titleColor = isDark ? '#64748b' : '#64748b';
  const valueColor = isDark ? '#ffffff' : '#0f172a';
  const subtitleColor = isDark ? '#64748b' : '#64748b';
  const trackBg = isDark ? 'rgba(15,23,42,0.8)' : '#f1f5f9';

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
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              boxShadow: isDark ? 'none' : '0 2px 10px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.02)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: titleColor, marginBottom: 6 }}>
                  {card.title}
                </p>
                <div style={{ fontSize: 28, fontWeight: 800, color: valueColor, lineHeight: 1, letterSpacing: '-0.5px' }}>
                  {card.value}
                </div>
              </div>
              <div style={{
                width: 44, height: 44,
                borderRadius: 12,
                background: card.bgGlow,
                border: `1px solid ${card.color}30`,
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
                <span style={{ fontSize: 12, fontWeight: 600, color: subtitleColor }}>{card.subtitle}</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 700,
                  color: isDark ? '#22d3ee' : '#0284c7',
                  background: isDark ? 'rgba(6,182,212,0.1)' : '#f0f9ff',
                  padding: '3px 8px', borderRadius: 6,
                  border: isDark ? '1px solid rgba(6,182,212,0.2)' : '1px solid #bae6fd',
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
                  width: '100%', height: 6,
                  background: trackBg,
                  borderRadius: 4, overflow: 'hidden',
                  border: `1px solid ${cardBorder}`,
                }}>
                  <div style={{
                    height: '100%',
                    width: `${card.barValue}%`,
                    borderRadius: 4,
                    background: card.color,
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
