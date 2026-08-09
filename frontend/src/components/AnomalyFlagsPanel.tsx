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

const severityConfig: Record<string, { badgeBg: string; badgeColor: string; badgeBorder: string; label: string }> = {
  high:   { badgeBg: 'rgba(248, 113, 113, 0.1)', badgeColor: '#F87171', badgeBorder: 'rgba(248, 113, 113, 0.35)', label: 'High Priority' },
  medium: { badgeBg: 'rgba(251, 191, 36, 0.1)', badgeColor: '#FBBF24', badgeBorder: 'rgba(251, 191, 36, 0.35)', label: 'Medium Priority' },
  low:    { badgeBg: 'rgba(56, 189, 248, 0.1)', badgeColor: '#38BDF8', badgeBorder: 'rgba(56, 189, 248, 0.35)', label: 'Low Priority' },
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
    <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 24, background: '#161B22', borderRadius: 12 }}>
      
      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={20} color="#FBBF24" />
          </div>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#F0F6FC' }}>AI Anomaly Queue</h3>
            <div style={{ fontSize: 13, color: '#8B949E', marginTop: 1 }}>Requires human validation before publishing</div>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div style={{ display: 'flex', gap: 4, background: '#0D1117', padding: 3, borderRadius: 8, border: '1px solid #30363D' }}>
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
                background: filter === f ? '#21262D' : 'transparent',
                color: filter === f ? '#F0F6FC' : '#8B949E',
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
                background: '#0D1117',
                border: '1px solid #30363D',
                borderRadius: 10,
                padding: 18,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#484F58';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#30363D';
                (e.currentTarget as HTMLDivElement).style.transform = 'none';
              }}
            >
              {/* Top Row: Severity Tag & SKU */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cfg.badgeColor, background: cfg.badgeBg, border: `1px solid ${cfg.badgeBorder}`, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {cfg.label}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace' }}>
                    {anomaly.sku}
                  </span>
                </div>
                <ChevronRight size={18} color="#8B949E" />
              </div>

              {/* Product Name */}
              <div style={{ fontSize: 17, fontWeight: 800, color: '#F0F6FC' }}>
                {anomaly.name}
              </div>

              {/* Clean Monospace Attribute Comparison Line */}
              <div style={{ fontSize: 13, color: '#C9D1D9', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ color: '#8B949E' }}>field: <strong style={{ color: '#38BDF8', fontFamily: 'JetBrains Mono, monospace' }}>{anomaly.field}</strong></span>
                <span style={{ color: '#484F58' }}>·</span>
                <span style={{ color: '#F87171', fontFamily: 'JetBrains Mono, monospace' }}>Found: {anomaly.extractedVal}</span>
                <span style={{ color: '#34D399', fontWeight: 800 }}>→</span>
                <span style={{ color: '#34D399', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>Suggested: {anomaly.expectedVal}</span>
              </div>

              {/* Reasoning Description */}
              <div style={{ padding: '12px 14px', background: '#161B22', border: '1px solid #30363D', borderRadius: 8, fontSize: 13, color: '#C9D1D9', lineHeight: 1.55, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Info size={16} color="#8B949E" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{anomaly.issue}</span>
              </div>

              {/* Bottom Action Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 2 }}>
                <div style={{ fontSize: 12, color: '#8B949E' }}>
                  AI Confidence: <strong style={{ color: '#F0F6FC' }}>{anomaly.confidence}%</strong>
                </div>

                <button
                  className="btn btn-accent"
                  onClick={(e) => handleResolve(e, anomaly.id)}
                  style={{ fontSize: 12, padding: '6px 14px', fontWeight: 700 }}
                >
                  <CheckCircle2 size={14} /> Approve Correction
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
