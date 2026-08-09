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

/* 3 Distinct Light Colors: Red (High/Error), Yellow (Medium/Warning), Blue (Low/Info/Field) */
const severityConfig: Record<string, { badgeBg: string; badgeColor: string; badgeBorder: string; leftBorder: string; label: string }> = {
  high:   { badgeBg: 'rgba(239, 68, 68, 0.2)', badgeColor: '#F87171', badgeBorder: 'rgba(239, 68, 68, 0.45)', leftBorder: '#EF4444', label: 'High Priority' },
  medium: { badgeBg: 'rgba(245, 158, 11, 0.2)', badgeColor: '#FBBF24', badgeBorder: 'rgba(245, 158, 11, 0.45)', leftBorder: '#F59E0B', label: 'Medium Priority' },
  low:    { badgeBg: 'rgba(59, 130, 246, 0.2)', badgeColor: '#60A5FA', badgeBorder: 'rgba(59, 130, 246, 0.45)', leftBorder: '#3B82F6', label: 'Low Priority' },
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
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245, 158, 11, 0.18)', border: '1px solid rgba(245, 158, 11, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={20} color="#FBBF24" />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>AI Anomaly Queue</h3>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 1 }}>Requires human validation before catalog publishing</div>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div style={{ display: 'flex', gap: 6, background: '#0B0F17', padding: 4, borderRadius: 8, border: '1px solid rgba(59, 130, 246, 0.35)' }}>
          {(['all', 'high', 'medium', 'low'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'capitalize',
                background: filter === f ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map((anomaly) => {
          const cfg = severityConfig[anomaly.severity];
          return (
            <div
              key={anomaly.id}
              onClick={() => onSelectProduct(anomaly.productId)}
              style={{
                background: '#0B0F17',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                borderLeft: `5px solid ${cfg.leftBorder}`,
                borderRadius: 14,
                padding: 20,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = cfg.leftBorder;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(59, 130, 246, 0.35)';
                (e.currentTarget as HTMLDivElement).style.transform = 'none';
              }}
            >
              {/* Top Row: Severity Tag & SKU */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: cfg.badgeColor, background: cfg.badgeBg, border: `1px solid ${cfg.badgeBorder}`, padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {cfg.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#38BDF8', fontFamily: 'JetBrains Mono, monospace' }}>
                    {anomaly.sku}
                  </span>
                </div>
                <ChevronRight size={20} color="#94A3B8" />
              </div>

              {/* Product Name */}
              <div style={{ fontSize: 18, fontWeight: 800, color: '#60A5FA' }}>
                {anomaly.name}
              </div>

              {/* 3 Distinct Light Color Chips: Blue (Field), Red (Extracted), Green/Yellow (Suggested) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, fontSize: 14 }}>
                
                {/* 1. LIGHT BLUE PILL (Field Name) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(56, 189, 248, 0.18)', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(56, 189, 248, 0.45)' }}>
                  <span style={{ color: '#94A3B8', fontWeight: 600 }}>Field:</span>
                  <span style={{ color: '#38BDF8', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>
                    {anomaly.field}
                  </span>
                </div>

                {/* 2. LIGHT RED PILL (AI Extracted Value) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239, 68, 68, 0.18)', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.45)' }}>
                  <span style={{ color: '#F87171', fontWeight: 700 }}>AI Extracted:</span>
                  <span style={{ color: '#F87171', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>
                    {anomaly.extractedVal}
                  </span>
                </div>

                {/* 3. LIGHT EMERALD/GREEN PILL (Suggested Value) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16, 185, 129, 0.18)', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.45)' }}>
                  <span style={{ color: '#34D399', fontWeight: 700 }}>Suggested:</span>
                  <span style={{ color: '#34D399', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>
                    {anomaly.expectedVal}
                  </span>
                </div>

              </div>

              {/* Reasoning Description */}
              <div style={{ padding: '14px 18px', background: '#1B2433', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 10, fontSize: 14, color: '#E2E8F0', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Info size={18} color="#94A3B8" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{anomaly.issue}</span>
              </div>

              {/* Bottom Action Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
                <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>
                  AI Confidence: <strong style={{ color: anomaly.confidence > 70 ? '#34D399' : '#FBBF24', fontSize: 14, fontWeight: 800 }}>{anomaly.confidence}%</strong>
                </div>

                <button
                  className="btn btn-accent"
                  onClick={(e) => handleResolve(e, anomaly.id)}
                  style={{ fontSize: 13, padding: '8px 18px', fontWeight: 800 }}
                >
                  <CheckCircle2 size={16} /> Approve Correction
                </button>
              </div>

            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '36px 0', fontSize: 15, color: '#34D399', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontWeight: 700 }}>
            <CheckCircle2 size={36} color="#34D399" />
            <span>All anomalies resolved in this queue!</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default AnomalyFlagsPanel;
