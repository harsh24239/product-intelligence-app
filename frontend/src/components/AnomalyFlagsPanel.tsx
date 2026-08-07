import React, { useState } from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';

interface AnomalyFlagsPanelProps {
  onSelectProduct: (id: string) => void;
  isDark?: boolean;
}

const mockAnomalies = [
  { id: '1', productId: 'prod-0', name: 'Industrial Servo Motor MX-1000', sku: 'MX-1000-V2', field: 'maxTorque', issue: 'Value "150 Nm" is 10x higher than family average.', severity: 'high' },
  { id: '2', productId: 'prod-5', name: 'Sensor Array Base', sku: 'SAB-992', field: 'ipRating', issue: 'Missing standard prefix. Found "65" instead of "IP65".', severity: 'medium' },
  { id: '3', productId: 'prod-10', name: 'Control Unit C-40', sku: 'CU-40A', field: 'weight', issue: 'Unit missing — defaulting to kg.', severity: 'low' },
];

const severityConfigDark: Record<string, { bg: string; border: string; color: string; label: string }> = {
  high:   { bg: 'rgba(239,68,68,0.06)',  border: 'rgba(239,68,68,0.25)',   color: '#f87171',  label: 'High Priority' },
  medium: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.25)',  color: '#fbbf24',  label: 'Medium Priority' },
  low:    { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.25)',  color: '#60a5fa',  label: 'Low Priority' },
};

const severityConfigLight: Record<string, { bg: string; border: string; color: string; label: string }> = {
  high:   { bg: '#fef2f2',  border: '#fca5a5',   color: '#dc2626',  label: 'High Priority' },
  medium: { bg: '#fffbeb',  border: '#fde68a',   color: '#d97706',  label: 'Medium Priority' },
  low:    { bg: '#eff6ff',  border: '#bfdbfe',   color: '#2563eb',  label: 'Low Priority' },
};

const AnomalyFlagsPanel: React.FC<AnomalyFlagsPanelProps> = ({ onSelectProduct, isDark = false }) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const filtered = filter === 'all' ? mockAnomalies : mockAnomalies.filter(a => a.severity === filter);

  const cardBg = isDark ? 'linear-gradient(145deg, rgba(30,41,59,0.65) 0%, rgba(15,23,42,0.85) 100%)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const titleColor = isDark ? '#ffffff' : '#0f172a';
  const subtitleColor = isDark ? '#64748b' : '#64748b';
  const tabBg = isDark ? 'rgba(0,0,0,0.25)' : '#f1f5f9';
  const tabBorder = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 22px', background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? 'none' : '0 2px 10px rgba(15,23,42,0.04)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: titleColor, marginBottom: 4 }}>
            <AlertTriangle size={17} color={isDark ? "#fbbf24" : "#d97706"} />
            Active Anomalies
          </h3>
          <p style={{ fontSize: 12, color: subtitleColor }}>Catalog issues requiring review</p>
        </div>

        {/* Filter tabs */}
        <div style={{
          display: 'flex',
          gap: 2,
          background: tabBg,
          borderRadius: 8,
          padding: 4,
          border: `1px solid ${tabBorder}`,
        }}>
          {(['all', 'high', 'medium', 'low'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'capitalize',
                background: filter === f ? (isDark ? 'rgba(255,255,255,0.12)' : '#ffffff') : 'transparent',
                color: filter === f ? (isDark ? '#fff' : '#0f172a') : (isDark ? '#64748b' : '#64748b'),
                boxShadow: filter === f && !isDark ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
                cursor: 'pointer',
              }}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(anomaly => {
          const cfg = (isDark ? severityConfigDark : severityConfigLight)[anomaly.severity];
          return (
            <div
              key={anomaly.id}
              onClick={() => onSelectProduct(anomaly.productId)}
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                cursor: 'pointer',
                transition: 'filter 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.filter = isDark ? 'brightness(1.15)' : 'brightness(0.97)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.filter = 'brightness(1)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: cfg.color }}>
                  {cfg.label}
                </span>
                <ChevronRight size={14} color={isDark ? "#475569" : "#94a3b8"} />
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: titleColor, marginBottom: 4 }}>{anomaly.name}</h4>
              <div style={{ fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: subtitleColor }}>Field: </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: isDark ? '#22d3ee' : '#0284c7', fontWeight: 600 }}>{anomaly.field}</span>
              </div>
              <p style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#475569', background: isDark ? 'rgba(0,0,0,0.2)' : '#ffffff', border: isDark ? 'none' : '1px solid #e2e8f0', padding: '6px 10px', borderRadius: 6, fontWeight: 500 }}>
                {anomaly.issue}
              </p>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', fontSize: 13, color: subtitleColor }}>
            No anomalies for this filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyFlagsPanel;
