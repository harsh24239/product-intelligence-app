import React from 'react';
import { Upload, ArrowRight, Cpu, CheckCircle2, Zap } from 'lucide-react';

interface PipelineHeroProps {
  onStartDemo: () => void;
}

const stats = [
  { val: '6', label: 'Input Columns', sub: 'Raw distributor rows', color: '#38BDF8' },
  { val: '252', label: 'Output Columns', sub: 'Delivery format fields', color: '#A78BFA' },
  { val: '100%', label: 'Placeholder Removal', sub: '-- Unbranded -- cleared', color: '#34D399' },
  { val: 'ISO', label: 'Unit Standardization', sub: 'UOM compliance enforced', color: '#FBBF24' },
];

const steps = [
  { num: '01', label: 'Cleanse', color: '#38BDF8' },
  { num: '02', label: 'Normalize', color: '#A78BFA' },
  { num: '03', label: 'Extract', color: '#FBBF24' },
  { num: '04', label: 'Generate', color: '#34D399' },
  { num: '05', label: 'Export', color: '#F87171' },
];

const PipelineHero: React.FC<PipelineHeroProps> = ({ onStartDemo }) => {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 20,
        background: 'linear-gradient(135deg, #0D1929 0%, #090D15 60%, #0D1F2D 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.08)',
        padding: '28px 32px',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -60, left: -60, width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -40, right: -40, width: 250, height: 250,
        background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top section: text + stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, position: 'relative', zIndex: 1 }}>

        {/* Left: headline */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 8, padding: '4px 10px', marginBottom: 14,
          }}>
            <Cpu size={12} color="#38BDF8" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Unilog Product Data Enrichment Pipeline
            </span>
          </div>

          <h1 style={{
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: '-0.5px',
            lineHeight: 1.15,
            marginBottom: 12,
            background: 'linear-gradient(90deg, #FFFFFF 0%, #93C5FD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Automated Product Content Enrichment
          </h1>

          <p style={{ fontSize: 13.5, color: '#94A3B8', lineHeight: 1.65, marginBottom: 20, maxWidth: 500 }}>
            Transforms raw distributor rows <strong style={{ color: '#E2E8F0' }}>(6 columns)</strong> into fully enriched, commerce-ready records <strong style={{ color: '#E2E8F0' }}>(252 columns)</strong> — placeholder cleansing, unit normalization, attribute extraction, and description generation.
          </p>

          <button
            id="btn-start-demo"
            onClick={onStartDemo}
            className="btn btn-primary"
            style={{ fontSize: 13, padding: '9px 18px', fontWeight: 800 }}
          >
            <Upload size={15} />
            Run Enrichment on Sample Dataset
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Right: stat mini cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, minWidth: 250 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '12px 14px',
              background: 'rgba(9, 13, 21, 0.7)',
              border: `1px solid ${s.color}28`,
              borderRadius: 12,
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px' }}>{s.val}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: s.color, marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 1, fontWeight: 500 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: 5-step pipeline strip */}
      <div style={{
        marginTop: 22,
        paddingTop: 18,
        borderTop: '1px solid rgba(56, 189, 248, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 14, whiteSpace: 'nowrap' }}>Pipeline:</span>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: `${s.color}18`,
                border: `1px solid ${s.color}45`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle2 size={11} color={s.color} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#CBD5E1' }}>
                <span style={{ color: s.color, fontWeight: 900 }}>{s.num}</span> {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: 'rgba(56, 189, 248, 0.12)', margin: '0 10px', minWidth: 12 }} />
            )}
          </React.Fragment>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 16 }}>
          <Zap size={11} color="#34D399" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399' }}>Pipeline Active</span>
        </div>
      </div>
    </div>
  );
};

export default PipelineHero;
