import React from 'react';
import {
  Brain,
  CheckCircle,
  ShoppingBag,
  ArrowRight,
  Zap,
  Upload,
  GitBranch,
} from 'lucide-react';

interface PipelineHeroProps {
  onStartDemo: () => void;
}

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Ingest Raw Data',
    desc: 'Upload PDF catalogs, spec sheets, or paste raw product text. Supports scanned images via Vision AI.',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.08)',
    border: 'rgba(59, 130, 246, 0.2)',
    examples: ['Supplier PDFs', 'Scanned images', 'Raw text specs'],
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI Extracts & Enriches',
    desc: '3-stage AI agent pipeline: extract attributes → normalize units → validate against ISO standards.',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.08)',
    border: 'rgba(139, 92, 246, 0.2)',
    examples: ['Gemini 1.5 VLM', 'RAG Enrichment', 'ISO Compliance Check'],
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Human Validation',
    desc: 'AI flags anomalies and low-confidence extractions for human review. Approve or correct with one click.',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.2)',
    examples: ['Anomaly alerts', 'Confidence scores', 'Audit trail'],
  },
  {
    number: '04',
    icon: ShoppingBag,
    title: 'Commerce Ready',
    desc: 'Push structured product data to Shopify, SAP IDoc, Akeneo PIM, or download a PDF datasheet with QR verification.',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.2)',
    examples: ['Shopify / SAP push', 'PDF Datasheet + QR', 'Akeneo / Magento'],
  },
];

const metrics = [
  { label: 'Attributes extracted per product', value: '42 avg' },
  { label: 'AI extraction accuracy', value: '92%' },
  { label: 'Time saved vs. manual entry', value: '85%' },
  { label: 'Catalog data health score', value: '88/100' },
];

const PipelineHero: React.FC<PipelineHeroProps> = ({ onStartDemo }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero header */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 6,
              padding: '3px 10px',
              fontSize: 11,
              fontWeight: 600,
              color: '#3B82F6',
              marginBottom: 14,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            <Zap size={11} />
            UniHack 2025 · AI Product Intelligence Challenge
          </div>

          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.5px',
              lineHeight: 1.25,
              marginBottom: 10,
            }}
          >
            AI-Powered Product Intelligence
            <br />
            <span style={{ color: '#3B82F6' }}>for Industrial Commerce</span>
          </h1>

          <p style={{ fontSize: 14, color: 'var(--text-sub)', maxWidth: 560, lineHeight: 1.65, marginBottom: 20 }}>
            Industrial companies manage thousands of product records across scattered
            catalogs, supplier PDFs, and spec sheets. This system uses a{' '}
            <strong style={{ color: 'var(--text)' }}>3-agent AI pipeline</strong> to
            automatically extract, enrich, and validate product data — turning raw,
            unstructured text into commerce-ready structured records.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              id="btn-start-demo"
              onClick={onStartDemo}
              className="btn btn-primary"
              style={{ fontSize: 14, padding: '10px 20px' }}
            >
              <Upload size={16} />
              Try Live Demo — Upload a Document
              <ArrowRight size={16} />
            </button>
            <button
              className="btn btn-secondary"
              style={{ fontSize: 13 }}
              onClick={() => {
                const el = document.getElementById('pipeline-flow');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <GitBranch size={15} />
              View AI Pipeline
            </button>
          </div>
        </div>

        {/* Key metrics quick view */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            minWidth: 260,
          }}
        >
          {metrics.map((m, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '12px 14px',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                {m.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Flow */}
      <div id="pipeline-flow">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <GitBranch size={16} color="var(--text-muted)" />
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
            How it works — End-to-End AI Pipeline
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
                {/* Connector arrow (not last) */}
                {i < steps.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 28,
                      right: -10,
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    className="hide-md"
                  >
                    <ArrowRight size={16} color="var(--border-light)" />
                  </div>
                )}

                <div
                  style={{
                    background: step.bg,
                    border: `1px solid ${step.border}`,
                    borderRadius: 12,
                    padding: 18,
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 36, height: 36,
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.06)',
                        border: `1px solid ${step.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} color={step.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: step.color, letterSpacing: '0.06em' }}>
                        STEP {step.number}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginTop: 1 }}>
                        {step.title}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 12, color: 'var(--text-sub)', lineHeight: 1.55, marginBottom: 12 }}>
                    {step.desc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {step.examples.map((ex, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: 10, fontWeight: 600,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'var(--text-sub)',
                          padding: '2px 7px',
                          borderRadius: 4,
                        }}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech stack footer */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
          Tech Stack
        </div>
        {['Gemini 1.5 Flash VLM', 'Node.js / Express', 'React + TypeScript', 'Three.js WebGL', 'jsPDF + QR Code', 'Cosine Similarity Search', 'RAG Enrichment'].map((t, i) => (
          <span
            key={i}
            style={{
              fontSize: 11, fontWeight: 600,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-sub)',
              padding: '3px 10px',
              borderRadius: 5,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PipelineHero;
