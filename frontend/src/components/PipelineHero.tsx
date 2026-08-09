import React from 'react';
import {
  Upload,
  ArrowRight,
  GitBranch,
  Sparkles,
  Search,
  ShieldCheck,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

interface PipelineHeroProps {
  onStartDemo: () => void;
}

const pipelineSteps = [
  {
    step: '01',
    agent: 'Agent 1: Extraction Engine',
    model: 'Gemini 1.5 VLM',
    title: 'Multi-Modal Document Parsing',
    desc: 'Extracts tables, technical dimensions, electrical ratings, and raw product text from supplier PDFs and spec sheets.',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    icon: Search,
  },
  {
    step: '02',
    agent: 'Agent 2: RAG Enrichment',
    model: 'Knowledge Graph Vector Search',
    title: 'Semantic Attribute Normalization',
    desc: 'Traverses ISO/IEC industrial standards knowledge graph to impute missing IP ratings, frame sizes, and voltage classes.',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    icon: Sparkles,
  },
  {
    step: '03',
    agent: 'Agent 3: Quality Validator',
    model: 'Rule Guard & Anomaly Detector',
    title: 'ISO Compliance & Anomaly Flagging',
    desc: 'Flags unit mismatches, out-of-range torque values, and non-standard certifications before queueing for human approval.',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    icon: ShieldCheck,
  },
];

const PipelineHero: React.FC<PipelineHeroProps> = ({ onStartDemo }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero Header */}
      <div
        className="card"
        style={{
          padding: '32px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24,
          background: '#1B2433',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: 16,
        }}
      >
        <div style={{ flex: 1, minWidth: 300 }}>
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
            Autonomous Product Data Pipeline
          </div>

          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.8px',
              lineHeight: 1.25,
              marginBottom: 14,
            }}
          >
            AI-Powered Product Intelligence Platform
          </h1>

          <p style={{ fontSize: 15, color: '#E2E8F0', maxWidth: 640, lineHeight: 1.7, marginBottom: 24, fontWeight: 500 }}>
            Automates end-to-end industrial commerce catalog enrichment. Parses unstructured supplier PDFs, normalizes technical specifications via ISO/IEC knowledge graph RAG, and flags data anomalies for high-velocity publishing.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              id="btn-start-demo"
              onClick={onStartDemo}
              className="btn btn-primary"
              style={{ fontSize: 15, padding: '12px 24px', fontWeight: 800 }}
            >
              <Upload size={18} />
              Ingest & Extract New Document
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary"
              style={{ fontSize: 14, padding: '12px 20px' }}
              onClick={() => {
                const el = document.getElementById('pipeline-flow');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <GitBranch size={16} />
              View Multi-Agent Architecture
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minWidth: 260 }}>
          {[
            { label: 'Extraction Accuracy', val: '94.8%', sub: 'ISO/IEC validated' },
            { label: 'Catalog Velocity', val: '10x Faster', sub: 'vs manual entry' },
            { label: 'RAG Enrichment', val: '48 Standards', sub: 'Knowledge Graph' },
            { label: 'Data Quality Index', val: '98 / 100', sub: 'Audited records' },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '14px 16px', background: '#0F172A', border: '1px solid #334155', borderRadius: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>{item.val}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', marginTop: 2 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Agent Architecture Flow */}
      <div id="pipeline-flow" className="card" style={{ padding: 28, background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              System Architecture
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>
              3-Agent Autonomous Execution Pipeline
            </h3>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 12px', borderRadius: 8 }}>
            ● Pipeline Active
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                style={{
                  background: '#0F172A',
                  border: `1px solid ${step.borderColor}`,
                  borderRadius: 14,
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: step.bgColor, border: `1px solid ${step.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={step.color} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: step.color }}>
                    {step.step}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {step.agent}
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', marginTop: 3 }}>
                    {step.title}
                  </h4>
                </div>

                <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.6 }}>
                  {step.desc}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: step.color, fontFamily: 'JetBrains Mono, monospace' }}>
                  <CheckCircle2 size={13} /> {step.model}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default PipelineHero;
