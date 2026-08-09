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
  high:   { leftBorder: '#EF4444', color: '#F87171', label: 'High Priority — Review Immediately' },
  medium: { leftBorder: '#F59E0B', color: '#FBBF24', label: 'Medium Priority — Review Soon' },
  low:    { leftBorder: '#3B82F6', color: '#60A5FA', label: 'Low Priority — Optional Review' },
};

const AnomalyFlagsPanel: React.FC<AnomalyFlagsPanelProps> = ({ onSelectProduct }) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const filtered =
    filter === 'all' ? mockAnomalies : mockAnomalies.filter((a) => a.severity === filter);

  return (
    <div
      className="card"
      style={{ display: 'flex', flexDirection: 'column', padding: 20 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={18} color="#F59E0B" />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>
            AI Anomaly Flags
          </span>
        </div>

        {/* Severity filter */}
        <div
          style={{
            display: 'flex', gap: 4,
            background: '#0F172A', padding: 4,
            borderRadius: 8, border: '1px solid #334155',
          }}
        >
          {(['all', 'high', 'medium', 'low'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'capitalize',
                background: filter === f ? '#334155' : 'transparent',
                color: filter === f ? '#FFFFFF' : '#94A3B8',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Anomaly items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((anomaly) => {
          const cfg = severityConfig[anomaly.severity];
          return (
            <div
              key={anomaly.id}
              onClick={() => onSelectProduct(anomaly.productId)}
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                background: '#0F172A',
                border: '1px solid #334155',
                borderLeft: `4px solid ${cfg.leftBorder}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = cfg.leftBorder;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#334155';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: cfg.color }}>
                  {cfg.label}
                </span>
                <ChevronRight size={16} color="#94A3B8" />
              </div>

              <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
                {anomaly.name}
              </div>

              <div style={{ fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#94A3B8' }}>Flagged Field:</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#60A5FA', fontWeight: 700 }}>
                  {anomaly.field}
                </span>
                <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>
                  ({anomaly.sku})
                </span>
              </div>

              <p
                style={{
                  fontSize: 13, color: '#E2E8F0', lineHeight: 1.55,
                  background: '#1E293B',
                  border: '1px solid #334155',
                  padding: '8px 12px', borderRadius: 8,
                }}
              >
                <Info size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: '#94A3B8' }} />
                {anomaly.issue}
              </p>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 13, color: '#94A3B8' }}>
            No anomalies for this severity filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyFlagsPanel;
