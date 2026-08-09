import React, { useState } from 'react';
import { ChevronRight, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

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
    extractedVal: '150 Nm',
    expectedVal: '15.0 Nm',
    issue: 'Extracted value "150 Nm" is 10× higher than motor family average (14.2 Nm). Unit conversion typo detected in source PDF.',
    severity: 'high',
    confidence: 42,
  },
  {
    id: '2',
    productId: 'prod-5',
    name: 'Hydraulic Pressure Relief Valve',
    sku: 'SAB-992',
    field: 'ipRating',
    extractedVal: '65',
    expectedVal: 'IP65',
    issue: 'Found raw value "65" missing standard prefix. AI inferred "IP65" based on washdown enclosure context.',
    severity: 'medium',
    confidence: 68,
  },
  {
    id: '3',
    productId: 'prod-10',
    name: 'Control Unit C-40',
    sku: 'CU-40A',
    field: 'weight',
    extractedVal: '12.5',
    expectedVal: '12.5 kg',
    issue: 'Weight extracted without unit specification. Imputed kg based on DIN EN unit standard.',
    severity: 'low',
    confidence: 85,
  },
];

/* Harmonious 3-Color Palette Matching Dark Slate UI */
const severityConfig: Record<string, { bg: string; color: string; border: string; label: string }> = {
  high:   { bg: 'rgba(248, 113, 113, 0.1)', color: '#F87171', border: 'rgba(248, 113, 113, 0.3)', label: 'High Priority' },
  medium: { bg: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: 'rgba(56, 189, 248, 0.3)', label: 'Medium Priority' },
  low:    { bg: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: 'rgba(56, 189, 248, 0.3)', label: 'Low Priority' },
};

const AnomalyFlagsPanel: React.FC<AnomalyFlagsPanelProps> = ({ onSelectProduct }) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const filtered = (filter === 'all' ? mockAnomalies : mockAnomalies.filter((a) => a.severity === filter))
    .filter(a => !resolvedIds.includes(a.id));

  const handleResolve = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setResolvedIds([...resolvedIds, id]);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 24, background: '#1B2433', borderRadius: 16 }}>
      
      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={20} color="#38BDF8" />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>AI Anomaly Queue</h3>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 1 }}>Requires human validation before publishing</div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 4, background: '#0B0F17', padding: 4, borderRadius: 8, border: '1px solid rgba(56, 189, 248, 0.25)' }}>
          {(['all', 'high', 'medium', 'low'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'capitalize',
                background: filter === f ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: filter === f ? '#FFFFFF' : '#94A3B8',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((anomaly) => {
          const cfg = severityConfig[anomaly.severity];
          return (
            <div
              key={anomaly.id}
              onClick={() => onSelectProduct(anomaly.productId)}
              style={{
                background: '#0B0F17',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 12,
                padding: 20,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#38BDF8';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(56, 189, 248, 0.25)';
                (e.currentTarget as HTMLDivElement).style.transform = 'none';
              }}
            >
              {/* Top Row: Tag & SKU */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: '3px 9px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {cfg.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#38BDF8', fontFamily: 'JetBrains Mono, monospace' }}>
                    {anomaly.sku}
                  </span>
                </div>
                <ChevronRight size={18} color="#94A3B8" />
              </div>

              {/* Product Name */}
              <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
                {anomaly.name}
              </div>

              {/* Harmonious 3-Color Spec Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, fontSize: 14 }}>
                
                {/* 1. Primary Blue (Field Name) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(56, 189, 248, 0.1)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  <span style={{ color: '#94A3B8', fontWeight: 600 }}>Field:</span>
                  <span style={{ color: '#38BDF8', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                    {anomaly.field}
                  </span>
                </div>

                {/* 2. Soft Red (AI Extracted Value) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(248, 113, 113, 0.1)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(248, 113, 113, 0.3)' }}>
                  <span style={{ color: '#F87171', fontWeight: 600 }}>AI Extracted:</span>
                  <span style={{ color: '#F87171', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                    {anomaly.extractedVal}
                  </span>
                </div>

                {/* 3. Soft Green (Suggested Value) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(52, 211, 153, 0.1)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                  <span style={{ color: '#34D399', fontWeight: 600 }}>Suggested:</span>
                  <span style={{ color: '#34D399', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                    {anomaly.expectedVal}
                  </span>
                </div>

              </div>

              {/* Reasoning Description */}
              <div style={{ padding: '12px 16px', background: '#141C2E', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 8, fontSize: 14, color: '#E2E8F0', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Info size={16} color="#94A3B8" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{anomaly.issue}</span>
              </div>

              {/* Bottom Action Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 2 }}>
                <div style={{ fontSize: 13, color: '#94A3B8' }}>
                  AI Confidence: <strong style={{ color: '#FFFFFF' }}>{anomaly.confidence}%</strong>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={(e) => handleResolve(e, anomaly.id)}
                  style={{ fontSize: 13, padding: '7px 16px', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.35)', background: 'rgba(52, 211, 153, 0.1)' }}
                >
                  <CheckCircle2 size={15} color="#34D399" /> Approve Correction
                </button>
              </div>

            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '28px 0', fontSize: 14, color: '#34D399', fontWeight: 700 }}>
            ✓ All anomalies resolved in this queue
          </div>
        )}
      </div>

    </div>
  );
};

export default AnomalyFlagsPanel;
