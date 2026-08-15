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

const pipelineSteps = [
  {
    step: '01',
    agent: 'Step 1: Data Cleansing',
    model: 'Rules-Based Engine',
    title: 'Placeholder Removal & Brand Normalization',
    desc: 'Strips out invalid placeholder values (-- Unbranded --, -- No DIB Brand --) and extracts clean brand/manufacturer names from raw Part_Desc strings.',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    icon: Scissors,
  },
  {
    step: '02',
    agent: 'Step 2: Unit Normalization',
    model: 'UOM Standards Engine',
    title: 'Standardized Units & Dimension Extraction',
    desc: 'Converts raw dimension strings (2", 12IN, 16 inches) to the approved format (2 in, 12 in, 16 in). Extracts LENGTH, WIDTH, HEIGHT into dedicated columns.',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    icon: Sparkles,
  },
  {
    step: '03',
    agent: 'Step 3: Attribute Extraction',
    model: 'Pattern Recognition AI',
    title: 'Color, Material, Grit & Feature Parsing',
    desc: 'Extracts structured attributes from Part_Desc abbreviations: WH → White, SS → Stainless Steel, P150 → Abrasive Grit P150. Maps them into ATTRIBUTE_LABEL/VALUE columns.',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    icon: Tag,
  },
  {
    step: '04',
    agent: 'Step 4: Content Generation',
    model: 'Formulaic Title Builder',
    title: 'Descriptions Across All Required Formats',
    desc: 'Generates all 4 required description fields: INVOICE_DESC (≤40 chars, ALL CAPS), MOBILE_DESC (60-80 chars), SHORT_DESC (full sentence), and LONG_DESC1.',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    icon: FileText,
  },
  {
    step: '05',
    agent: 'Step 5: Validation & Export',
    model: 'Quality Guard & CSV Builder',
    title: 'ISO-Compliant Output Delivery Format',
    desc: 'Validates all enriched fields, flags items needing human review, then exports a submission-ready CSV matching the exact 252-column delivery format.',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
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
            Unilog Product Data Enrichment Pipeline
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
            <button
              className="btn btn-secondary"
              style={{ fontSize: 14, padding: '12px 20px' }}
              onClick={() => {
                const el = document.getElementById('pipeline-flow');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <GitBranch size={16} />
              View Pipeline Architecture
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

      {/* 5-Step Pipeline Architecture */}
      <div id="pipeline-flow" className="card" style={{ padding: 28, background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Enrichment Architecture
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>
              5-Stage Automated Data Enrichment Pipeline
            </h3>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 12px', borderRadius: 8 }}>
            ● Pipeline Active
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                style={{
                  background: '#0F172A',
                  border: `1px solid ${step.borderColor}`,
                  borderRadius: 14,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: step.bgColor, border: `1px solid ${step.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={step.color} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif', color: step.color }}>
                    {step.step}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: step.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {step.agent}
                  </div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', marginTop: 4, lineHeight: 1.3 }}>
                    {step.title}
                  </h4>
                </div>

                <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>
                  {step.desc}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid rgba(56, 189, 248, 0.25)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: step.color }}>
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
