import React, { useState } from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';

interface AnomalyFlagsPanelProps {
  onSelectProduct: (id: string) => void;
}

const mockAnomalies = [
  { id: '1', productId: 'prod-0', name: 'Industrial Servo Motor MX-1000', sku: 'MX-1000-V2', field: 'maxTorque', issue: 'Value "150 Nm" is 10x higher than family average.', severity: 'high' },
  { id: '2', productId: 'prod-5', name: 'Sensor Array Base', sku: 'SAB-992', field: 'ipRating', issue: 'Missing standard prefix. Found "65" instead of "IP65".', severity: 'medium' },
  { id: '3', productId: 'prod-10', name: 'Control Unit C-40', sku: 'CU-40A', field: 'weight', issue: 'Unit missing — defaulting to kg.', severity: 'low' },
];

const severityConfig: Record<string, { bg: string; border: string; color: string; label: string }> = {
  high:   { bg: 'rgba(239,68,68,0.06)',  border: 'rgba(239,68,68,0.25)',   color: '#f87171',  label: 'High Priority' },
  medium: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.25)',  color: '#fbbf24',  label: 'Medium Priority' },
  low:    { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.25)',  color: '#60a5fa',  label: 'Low Priority' },
};

const AnomalyFlagsPanel: React.FC<AnomalyFlagsPanelProps> = ({ onSelectProduct }) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const filtered = filter === 'all' ? mockAnomalies : mockAnomalies.filter(a => a.severity === filter);

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            <AlertTriangle size={17} color="#fbbf24" />
            Active Anomalies
          </h3>
          <p style={{ fontSize: 12, color: '#64748b' }}>Catalog issues requiring review</p>
        </div>

        {/* Filter tabs */}
        <div style={{
          display: 'flex',
          gap: 2,
          background: 'rgba(0,0,0,0.25)',
          borderRadius: 8,
          padding: 4,
          border: '1px solid rgba(255,255,255,0.06)',
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
                background: filter === f ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: filter === f ? '#fff' : '#64748b',
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
          const cfg = severityConfig[anomaly.severity];
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
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.filter = 'brightness(1.15)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.filter = 'brightness(1)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: cfg.color }}>
                  {cfg.label}
                </span>
                <ChevronRight size={14} color="#475569" />
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{anomaly.name}</h4>
              <div style={{ fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>Field: </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#22d3ee' }}>{anomaly.field}</span>
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: 6 }}>
                {anomaly.issue}
              </p>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', fontSize: 13, color: '#475569' }}>
            No anomalies for this filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyFlagsPanel;
