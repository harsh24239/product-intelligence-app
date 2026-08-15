import React from 'react';
import {
  Upload,
  ArrowRight,
  GitBranch,
  Sparkles,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Scissors,
  FileText,
  Tag,
} from 'lucide-react';

interface PipelineHeroProps {
  onStartDemo: () => void;
}

// Architecture steps removed for a cleaner dashboard

const PipelineHero: React.FC<PipelineHeroProps> = ({ onStartDemo }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero Header */}
      <div
        className="card pipeline-hero-card"
        style={{
          padding: '36px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24,
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          borderRadius: 20,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow effect in background */}
        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
        
        <div style={{ flex: 1, minWidth: 300, position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 800,
              color: '#60A5FA',
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <Cpu size={15} color="#60A5FA" />
            Unilog Product Data Enrichment Pipeline
          </div>

          <h1
            style={{
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: '-1px',
              lineHeight: 1.15,
              marginBottom: 16,
              background: 'linear-gradient(90deg, #FFFFFF 0%, #93C5FD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Automated Product Content Enrichment
          </h1>

          <p style={{ fontSize: 15, color: '#E2E8F0', maxWidth: 640, lineHeight: 1.7, marginBottom: 24, fontWeight: 500 }}>
            Transforms raw distributor input rows (6 columns) into fully enriched, commerce-ready product records (252 columns). Cleanses placeholders, normalizes units, extracts attributes, generates descriptions, and produces submission-ready CSV output.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              id="btn-start-demo"
              onClick={onStartDemo}
              className="btn btn-primary"
              style={{ fontSize: 15, padding: '12px 24px', fontWeight: 800 }}
            >
              <Upload size={18} />
              Run Enrichment on Sample Dataset
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minWidth: 260 }}>
          {[
            { label: 'Input Columns', val: '6', sub: 'Raw distributor data' },
            { label: 'Output Columns', val: '252', sub: 'Delivery format fields' },
            { label: 'Placeholder Removal', val: '100%', sub: '-- Unbranded -- cleared' },
            { label: 'Unit Standardization', val: 'ISO Approved', sub: 'UOM compliance enforced' },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '16px 18px', background: '#0B0F17', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>{item.val}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#38BDF8', marginTop: 3 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>



    </div>
  );
};

export default PipelineHero;
