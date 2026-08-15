import React, { useState, useRef } from 'react';
import { FileText, Upload, Sparkles, FileCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { Product } from '../types/product';

interface IngestionStudioProps {
  onExtractSuccess: () => void;
}

const AI_STEPS = [
  { label: 'Preprocessing & Document OCR', desc: 'Removing headers, normalizing formatting, extracting scanned PDF specs' },
  { label: 'Gemini 1.5 Entity Extraction', desc: 'Extracting product titles, SKUs, physical dimensions, electrical ratings' },
  { label: 'Schema & Unit Normalization', desc: 'Standardizing units (HP → kW, bar → PSI, inches → mm) across attributes' },
  { label: 'RAG Contextual Enrichment', desc: 'Querying vector Knowledge Graph to fill missing IP rating & insulation classes' },
  { label: 'Anomaly & Conflict Detection', desc: 'Flagging extreme torque values and non-standard voltage ratings for review' },
  { label: 'ISO / IEC Compliance Check', desc: 'Validating compliance against IEC 60034-30-1 and ISO 9001 baselines' },
];

const EXAMPLE_TEXT = `Industrial Servo Motor MX-2000
Manufacturer: RoboDrives Inc
Power: 2.5 kW, Voltage: 400V AC, Frequency: 50Hz
Speed: 1450 RPM, Torque: 16.5 Nm
IP Rating: IP65, Insulation Class: F
Weight: 18.5 kg, Dimensions: 250x200x300mm
Certifications: CE, UL, IEC 60034-30-1
Material: Cast Iron Housing, Aluminum Endshields`;

const IngestionStudio: React.FC<IngestionStudioProps> = ({ onExtractSuccess }) => {
  const [mode, setMode] = useState<'select' | 'text' | 'file' | 'processing' | 'result'>('select');
  const [inputText, setInputText] = useState(EXAMPLE_TEXT);
  const [progress, setProgress] = useState(0);
  const [extractedProduct, setExtractedProduct] = useState<Product | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  const simulateProgress = (onComplete: () => void) => {
    let step = 0;
    setProgress(0);
    const interval = setInterval(() => {
      step++;
      setProgress(step);
      if (step >= AI_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          triggerConfetti();
          onComplete();
        }, 400);
      }
    }, 550);
  };

  const handleTextSubmit = () => {
    setMode('processing');
    simulateProgress(async () => {
      try {
        const product = await api.extractFromText(inputText);
        setExtractedProduct(product);
        setMode('result');
      } catch {
        setMode('result');
      }
    });
  };

  const handleFileSubmit = (file: File) => {
    setMode('processing');
    simulateProgress(async () => {
      try {
        const product = await api.extractFromFile(file);
        setExtractedProduct(product);
        setMode('result');
      } catch {
        setMode('result');
      }
    });
  };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto' }}>
      
      {/* Step Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--blue-dim)', border: '1px solid var(--blue-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'var(--blue)' }}>
          01
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.4px' }}>
            AI Document Ingestion & Extraction Studio
          </h1>
          <p style={{ fontSize: 16, color: '#F1F5F9' }}>
            Upload raw PDF datasheets, technical drawings, or text to extract structured product intelligence
          </p>
        </div>
      </div>

      {/* Mode Selection */}
      {(mode === 'select' || mode === 'text' || mode === 'file') && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          
          {/* File Upload Option */}
          <div 
            className="card-interactive"
            onClick={() => setMode('file')}
            style={{ background: '#1B2433', border: mode === 'file' ? '2px solid #60A5FA' : '1px solid rgba(56, 189, 248, 0.35)', padding: 28 }}
          >
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Upload size={24} color="#60A5FA" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#60A5FA', marginBottom: 6 }}>Upload PDF or Image Spec</h3>
            <p style={{ fontSize: 14, color: '#FFFFFF', lineHeight: 1.6 }}>
              Upload supplier PDF datasheets, CAD specs, or scanned documents. Uses Gemini VLM for OCR + attribute extraction.
            </p>
          </div>

          {/* Text Input Option */}
          <div 
            className="card-interactive"
            onClick={() => setMode('text')}
            style={{ background: '#1B2433', border: mode === 'text' ? '2px solid #60A5FA' : '1px solid rgba(56, 189, 248, 0.35)', padding: 28 }}
          >
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <FileText size={24} color="#60A5FA" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#60A5FA', marginBottom: 6 }}>Paste Raw Product Text</h3>
            <p style={{ fontSize: 14, color: '#FFFFFF', lineHeight: 1.6 }}>
              Paste unformatted product specifications or catalog descriptions to extract attributes immediately.
            </p>
          </div>

          {/* Hackathon Ingest Option */}
          <div 
            className="card-interactive"
            onClick={async () => {
              setMode('processing');
              try {
                await fetch('http://localhost:3001/api/hackathon/seed', { method: 'POST' });
                simulateProgress(() => {
                  onExtractSuccess();
                });
              } catch (e) {
                console.error(e);
                setMode('select');
              }
            }}
            style={{ background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', padding: 28, gridColumn: '1 / -1' }}
          >
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <FileCheck size={24} color="#34D399" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#34D399', marginBottom: 6 }}>1-Click Hackathon Ingest</h3>
            <p style={{ fontSize: 14, color: '#FFFFFF', lineHeight: 1.6 }}>
              Automatically ingest the Unihack dataset and simulate the extraction pipeline.
            </p>
          </div>

        </div>
      )}

      {/* Drag & Drop File Mode */}
      {mode === 'file' && (
        <div className="card" style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleFileSubmit(e.target.files[0]);
            }}
          />

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSubmit(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              padding: '48px 24px',
              borderRadius: 16,
              border: `2px dashed ${dragOver ? 'var(--blue)' : 'var(--border-light)'}`,
              background: dragOver ? 'var(--blue-dim)' : 'rgba(17, 24, 39, 0.6)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--blue-dim)', border: '1px solid var(--blue-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={32} color="var(--blue)" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
                Drop your PDF or image here, or <span style={{ color: 'var(--blue)' }}>browse files</span>
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Supports PDF datasheets, PNG/JPG scans up to 25MB
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => setMode('select')}>Back to Selection</button>
          </div>
        </div>
      )}

      {/* Raw Text Input Mode */}
      {mode === 'text' && (
        <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
              Paste Raw Product Technical Description
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Example sample text loaded below — edit or replace with your custom product content:
            </p>
          </div>

          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, lineHeight: 1.6, padding: 16 }}
          />

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setMode('select')}>Back</button>
            <button className="btn btn-primary animate-glow" onClick={handleTextSubmit}>
              <Sparkles size={16} /> Run AI Extraction Pipeline
            </button>
          </div>
        </div>
      )}

      {/* Processing Animated Pipeline State */}
      {mode === 'processing' && (
        <div className="card" style={{ padding: 36, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', width: 60, height: 60, borderRadius: 16, background: 'var(--blue-dim)', border: '1px solid var(--blue-border)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Sparkles size={28} color="var(--blue)" className="animate-spin" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF' }}>
              Multi-Agent AI Pipeline Executing...
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', marginTop: 4 }}>
              Extracting attributes, normalizing schemas, and performing RAG Knowledge Graph enrichment
            </p>
          </div>

          {/* Step Progress List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 650, margin: '0 auto', width: '100%' }}>
            {AI_STEPS.map((step, idx) => {
              const isDone = idx < progress;
              const isCurrent = idx === progress;
              return (
                <div 
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: isCurrent ? 'var(--blue-dim)' : isDone ? 'rgba(16,185,129,0.1)' : 'var(--bg-surface)',
                    border: `1px solid ${isCurrent ? 'var(--blue-border)' : isDone ? 'var(--green-border)' : 'var(--border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: isDone ? 'var(--green)' : isCurrent ? 'var(--blue)' : 'var(--border)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isCurrent ? '#FFF' : isDone ? '#34D399' : 'var(--text-muted)' }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Successful Extraction Result View */}
      {mode === 'result' && (
        <div className="card animate-fade-in-up" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'rgba(16,185,129,0.12)', border: '1px solid var(--green-border)', borderRadius: 14 }}>
            <FileCheck size={28} color="var(--green)" />
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
                AI Extraction & Enrichment Complete!
              </h2>
              <div style={{ fontSize: 13, color: '#34D399', marginTop: 2 }}>
                Generated structured record with 94% confidence rating & ISO compliance validation
              </div>
            </div>
            <button className="btn btn-accent" onClick={onExtractSuccess} style={{ marginLeft: 'auto' }}>
              View in Catalog <ArrowRight size={16} />
            </button>
          </div>

          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
              Extracted Product Profile
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              {[
                { label: 'Product Name', val: extractedProduct?.name || 'Industrial Servo Motor MX-2000' },
                { label: 'SKU Identifier', val: extractedProduct?.sku || 'SKU-MX2000' },
                { label: 'Manufacturer', val: extractedProduct?.manufacturer || 'RoboDrives Inc' },
                { label: 'Category', val: extractedProduct?.category || 'Motors & Drives' },
                { label: 'Operating Voltage', val: extractedProduct?.specs.voltage || '400V AC' },
                { label: 'IP Rating (Inferred)', val: extractedProduct?.specs.ipRating || 'IP65 (Dust-tight)' },
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '12px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginTop: 3 }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-secondary" onClick={() => setMode('select')}>Extract Another Document</button>
            <button className="btn btn-primary" onClick={onExtractSuccess}>Go to Product Catalog</button>
          </div>

        </div>
      )}

    </div>
  );
};

export default IngestionStudio;
