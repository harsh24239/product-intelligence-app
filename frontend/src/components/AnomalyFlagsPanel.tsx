import React, { useState } from 'react';
import { AlertTriangle, ChevronRight, Info } from 'lucide-react';

interface AnomalyFlagsPanelProps {
  onSelectProduct: (id: string) => void;
}

const mockAnomalies = [
  {
    id: '1',
    productId: 'prod-0',
    name: 'Industrial Servo Motor MX-1000',
    sku: 'MX-1000-V2',
    field: 'maxTorque',
    issue: 'Extracted value "150 Nm" is 10× higher than the family average (14 Nm). Likely a unit error — may be "15.0 Nm" or source data typo.',
    severity: 'high',
  },
  {
    id: '2',
    productId: 'prod-5',
    name: 'Hydraulic Pressure Relief Valve',
    sku: 'SAB-992',
    field: 'ipRating',
    issue: 'Found "65" instead of standard format "IP65". AI inferred the correct value but confidence is low (54%).',
    severity: 'medium',
  },
  {
    id: '3',
    productId: 'prod-10',
    name: 'Control Unit C-40',
    sku: 'CU-40A',
    field: 'weight',
    issue: 'Weight value extracted without unit. Defaulted to kg based on context, but original text said "12.5" with no unit specified.',
    severity: 'low',
  },
];

const severityConfig: Record<string, { leftBorder: string; color: string; label: string }> = {
  high:   { leftBorder: 'var(--red)',   color: 'var(--red)',   label: 'High — Review Immediately' },
  medium: { leftBorder: 'var(--amber)', color: 'var(--amber)', label: 'Medium — Review Soon' },
  low:    { leftBorder: 'var(--blue)',  color: 'var(--blue)',  label: 'Low — Review When Possible' },
};

const AnomalyFlagsPanel: React.FC<AnomalyFlagsPanelProps> = ({ onSelectProduct }) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const filtered =
    filter === 'all' ? mockAnomalies : mockAnomalies.filter((a) => a.severity === filter);

  return (
    <div
      className="card"
      style={{ display: 'flex', flexDirection: 'column', padding: '16px 18px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <AlertTriangle size={15} color="var(--amber)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
              AI Anomaly Flags
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Data quality issues detected by the AI that need human review before publishing
          </p>
        </div>

        {/* Severity filter */}
        <div
          style={{
            display: 'flex', gap: 2,
            background: 'var(--bg)', padding: 3,
            borderRadius: 7, border: '1px solid var(--border)',
          }}
        >
          {(['all', 'high', 'medium', 'low'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '3px 8px',
                borderRadius: 5,
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'capitalize',
                background: filter === f ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: filter === f ? 'var(--text)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Anomaly items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((anomaly) => {
          const cfg = severityConfig[anomaly.severity];
          return (
            <div
              key={anomaly.id}
              id={`anomaly-${anomaly.id}`}
              onClick={() => onSelectProduct(anomaly.productId)}
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${cfg.leftBorder}`,
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = cfg.leftBorder;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span
                  style={{
                    fontSize: 10, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    color: cfg.color,
                  }}
                >
                  {cfg.label}
                </span>
                <ChevronRight size={13} color="var(--text-muted)" />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>
                {anomaly.name}
              </div>
              <div style={{ fontSize: 11, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>Field:</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--blue)', fontWeight: 600 }}>
                  {anomaly.field}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                  · {anomaly.sku}
                </span>
              </div>
              <p
                style={{
                  fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  padding: '6px 10px', borderRadius: 5,
                }}
              >
                <Info size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                {anomaly.issue}
              </p>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: 'var(--text-muted)' }}>
            No anomalies for this severity filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyFlagsPanel;
