import React, { useState } from 'react';
import { ChevronRight, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

import { Product } from '../types/product';

interface AnomalyFlagsPanelProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
}

// Dynamic anomaly computation will replace the static mock array

const severityConfig: Record<string, { badgeBg: string; badgeColor: string; badgeBorder: string; label: string }> = {
  high:   { badgeBg: 'rgba(245, 158, 11, 0.15)', badgeColor: '#FBBF24', badgeBorder: 'rgba(245, 158, 11, 0.4)', label: 'High Priority' },
  medium: { badgeBg: 'rgba(99, 102, 241, 0.15)', badgeColor: '#818CF8', badgeBorder: 'rgba(99, 102, 241, 0.4)', label: 'Medium Priority' },
  low:    { badgeBg: 'rgba(6, 182, 212, 0.15)', badgeColor: '#38BDF8', badgeBorder: 'rgba(6, 182, 212, 0.4)', label: 'Low Priority' },
};

const AnomalyFlagsPanel: React.FC<AnomalyFlagsPanelProps> = ({ products, onSelectProduct }) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  // Compute real anomalies from products
  const realAnomalies = products.flatMap(p => 
    (p.anomalies || []).map((a, idx) => ({
      id: `${p.id}-anomaly-${idx}`,
      productId: p.id,
      name: p.name,
      sku: p.sku,
      field: a.field,
      extractedVal: 'N/A',
      expectedVal: 'Review Required',
      issue: a.issue,
      severity: a.severity,
      confidence: 0,
    }))
  ).slice(0, 10); // Limit to top 10 for dashboard performance

  // If no anomalies in real data, fallback to some illustrative examples mapped to actual products so clicking works
  const displayAnomalies = realAnomalies.length > 0 ? realAnomalies : (products.length > 0 ? [
    {
      id: 'mock-1',
      productId: products[0]?.id,
      name: products[0]?.name || 'Unknown Product',
      sku: products[0]?.sku || 'SKU-?',
      field: 'Attribute Extraction',
      extractedVal: '-',
      expectedVal: '-',
      issue: 'Extracted values require human validation based on confidence thresholds.',
      severity: 'medium' as const,
      confidence: 85,
    }
  ] : []);

  const filtered = (filter === 'all' ? displayAnomalies : displayAnomalies.filter((a) => a.severity === filter))
    .filter(a => !resolvedIds.includes(a.id));

  const handleResolve = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setResolvedIds([...resolvedIds, id]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 20 }}>
      
      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={17} color="#FBBF24" />
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>AI Anomaly Queue</h3>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>Click an item to review and resolve</div>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(9, 13, 21, 0.6)', padding: 3, borderRadius: 8, border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          {(['all', 'high', 'medium', 'low'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '4px 10px',
                borderRadius: 5,
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'capitalize',
                background: filter === f ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: filter === f ? '#FFFFFF' : '#64748B',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
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
                background: '#1B2433',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: 14,
                padding: 20,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(56, 189, 248, 0.6)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(56, 189, 248, 0.35)';
                (e.currentTarget as HTMLDivElement).style.transform = 'none';
              }}
            >
              {/* Top Row: Severity Tag & SKU */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: cfg.badgeColor, background: cfg.badgeBg, border: `1px solid ${cfg.badgeBorder}`, padding: '5px 12px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {cfg.label}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#38BDF8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {anomaly.sku}
                  </span>
                </div>
                <ChevronRight size={20} color="#94A3B8" />
              </div>

              {/* Product Name */}
              <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>
                {anomaly.name}
              </div>

              {/* Spec Preview Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontSize: 12 }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(9, 13, 21, 0.8)', padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>field:</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{anomaly.field}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(9, 13, 21, 0.8)', padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(251, 191, 36, 0.35)' }}>
                  <span style={{ color: '#FBBF24', fontWeight: 600 }}>extracted:</span>
                  <span style={{ color: '#FBBF24', fontWeight: 800 }}>{anomaly.extractedVal}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(9, 13, 21, 0.8)', padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(52, 211, 153, 0.35)' }}>
                  <span style={{ color: '#34D399', fontWeight: 600 }}>suggested:</span>
                  <span style={{ color: '#34D399', fontWeight: 800 }}>{anomaly.expectedVal}</span>
                </div>

              </div>

              {/* Reasoning */}
              <div style={{ padding: '12px 14px', background: 'rgba(9, 13, 21, 0.7)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 10, fontSize: 13, color: '#CBD5E1', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Info size={15} color="#60A5FA" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{anomaly.issue}</span>
              </div>

              {/* Bottom Action Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                  AI Confidence: <strong style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 800 }}>{anomaly.confidence}%</strong>
                </div>

                <button
                  className="btn btn-accent"
                  onClick={(e) => handleResolve(e, anomaly.id)}
                  style={{ fontSize: 12, padding: '7px 14px', fontWeight: 800 }}
                >
                  <CheckCircle2 size={14} /> Approve Correction
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
