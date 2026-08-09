import React, { useState } from 'react';
import { Network, Database, Sparkles, Filter, Zap, ShieldCheck, Cpu, Search, Activity, CheckCircle2, Play } from 'lucide-react';

interface NodeDetail {
  id: string;
  name: string;
  category: string;
  type: string;
  connectedNodes: number;
  standards: string[];
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  x: number; // % from left
  y: number; // % from top
  cluster: 'motors' | 'atex' | 'certs' | 'electrical';
  relLabel: string;
}

const nodesList: NodeDetail[] = [
  {
    id: 'motor-root',
    name: 'Industrial Motors & Drives',
    category: 'Root Taxonomy Domain',
    type: 'Core Domain',
    connectedNodes: 4500,
    standards: ['IEC 60034-30-1', 'NEMA MG1', 'ISO 13849-1'],
    description: 'Central taxonomy node mapping electric motors, drive units, power envelopes, and safety compliance schemas across global industrial catalogs.',
    color: '#60A5FA',
    bgColor: 'rgba(59, 130, 246, 0.25)',
    borderColor: '#3B82F6',
    x: 50,
    y: 50,
    cluster: 'motors',
    relLabel: 'ROOT_DOMAIN',
  },
  {
    id: 'ip-rating',
    name: 'Ingress Protection (IP65 / IP67)',
    category: 'Enclosure Standard',
    type: 'Safety Spec',
    connectedNodes: 3200,
    standards: ['IEC 60529', 'DIN 40050-9'],
    description: 'Standardized seal protection ratings defining dust tightness and water jet resistance capabilities under heavy industrial washdown.',
    color: '#38BDF8',
    bgColor: 'rgba(6, 182, 212, 0.2)',
    borderColor: '#06B6D4',
    x: 22,
    y: 24,
    cluster: 'certs',
    relLabel: 'GOVERNED_BY',
  },
  {
    id: 'atex',
    name: 'ATEX Explosion Proof (Zone 1/21)',
    category: 'Hazardous Compliance',
    type: 'Safety Directive',
    connectedNodes: 1240,
    standards: ['EN 60079-0', 'Directive 2014/34/EU'],
    description: 'Mandatory European safety standard for electrical equipment operating in volatile, flammable, or explosive dust/gas atmospheres.',
    color: '#F87171',
    bgColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
    x: 78,
    y: 24,
    cluster: 'atex',
    relLabel: 'ENFORCES_SAFETY',
  },
  {
    id: 'voltage',
    name: 'Operating Voltage (400V 3-Phase)',
    category: 'Electrical Specification',
    type: 'Primary Attribute',
    connectedNodes: 4100,
    standards: ['IEEE 1584', 'UL 508A'],
    description: 'Input voltage rating specifications defining 3-Phase AC power grid compatibility, frequency tolerances, and surge protection ratings.',
    color: '#FBBF24',
    bgColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: '#F59E0B',
    x: 22,
    y: 76,
    cluster: 'electrical',
    relLabel: 'INHERITS_SPEC',
  },
  {
    id: 'efficiency',
    name: 'Energy Efficiency (IE3 / IE4)',
    category: 'Eco Efficiency Class',
    type: 'Classification',
    connectedNodes: 2900,
    standards: ['IEC 60034-30-1'],
    description: 'International energy efficiency class benchmarks defining premium operating power loss reductions for electric motors.',
    color: '#C084FC',
    bgColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
    x: 78,
    y: 76,
    cluster: 'certs',
    relLabel: 'VERIFIES_CLASS',
  },
  {
    id: 'torque',
    name: 'Peak Shaft Torque (15 Nm - 150 Nm)',
    category: 'Mechanical Attribute',
    type: 'Performance Spec',
    connectedNodes: 1850,
    standards: ['ISO 8608', 'DIN 743'],
    description: 'Rotary shaft power torque transmission specs mapped to motor frame size and gearbox gear ratio relationships.',
    color: '#34D399',
    bgColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
    x: 50,
    y: 16,
    cluster: 'motors',
    relLabel: 'MAPPED_PERFORMANCE',
  },
  {
    id: 'insulation',
    name: 'Insulation Class H (180°C)',
    category: 'Thermal Resistance',
    type: 'Material Spec',
    connectedNodes: 1120,
    standards: ['IEC 60085'],
    description: 'Thermal classification for motor winding insulation systems capable of continuous 180°C operating temperature without breakdown.',
    color: '#F472B6',
    bgColor: 'rgba(244, 114, 182, 0.2)',
    borderColor: '#EC4899',
    x: 14,
    y: 50,
    cluster: 'electrical',
    relLabel: 'THERMAL_RATING',
  },
  {
    id: 'mounting',
    name: 'Flange Mount (B5 / B14)',
    category: 'Mechanical Interface',
    type: 'Dimension Spec',
    connectedNodes: 2150,
    standards: ['DIN 42677'],
    description: 'Standardized mechanical motor mounting flange bolt circles and shaft extension dimensions for direct machine integration.',
    color: '#A78BFA',
    bgColor: 'rgba(167, 139, 250, 0.2)',
    borderColor: '#8B5CF6',
    x: 86,
    y: 50,
    cluster: 'motors',
    relLabel: 'INTERFACE_STD',
  },
];

const KnowledgeGraphViewer: React.FC = () => {
  const [expandedBase, setExpandedBase] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'atex' | 'motors' | 'certs' | 'electrical'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(nodesList[0]);
  const [ragQuery, setRagQuery] = useState('Infer missing IP rating for motor SAB-992');
  const [ragRunning, setRagRunning] = useState(false);
  const [ragResult, setRagResult] = useState<string | null>(null);

  const filteredNodes = nodesList.filter(node => {
    const matchCluster = activeFilter === 'all' || node.cluster === activeFilter;
    const matchSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        node.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCluster && matchSearch;
  });

  const runSimulatedRag = (queryText: string) => {
    setRagQuery(queryText);
    setRagRunning(true);
    setRagResult(null);
    setTimeout(() => {
      setRagRunning(false);
      setRagResult('Traversal path: Motors → Ingress Protection (IP65) → IEC 60529. Inferred value: "IP65" (98.6% Cosine Similarity)');
    }, 800);
  };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139, 92, 246, 0.18)', border: '1px solid rgba(139, 92, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Network size={24} color="#C084FC" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.4px' }}>
                AI Semantic Knowledge Graph
              </h1>
              <div style={{ fontSize: 14, color: '#CBD5E1' }}>
                Multi-relational industrial taxonomy, ISO/IEC standards, and RAG attribute inference engine
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Activity size={18} color="#38BDF8" />
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Taxonomy Nodes</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>14,250 Nodes</div>
            </div>
          </div>
          <div style={{ background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShieldCheck size={18} color="#34D399" />
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>ISO Standards</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>48 Mapped</div>
            </div>
          </div>
        </div>
      </div>

      {/* RAG Annotation Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(59, 130, 246, 0.12) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        borderRadius: 14,
        padding: '18px 22px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={20} color="#C084FC" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#C084FC', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            How RAG Enrichment Works in the AI Pipeline
          </div>
          <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6 }}>
            When supplier PDFs contain missing or abbreviated technical specs (e.g. <code style={{ color: '#38BDF8', fontWeight: 700 }}>"65"</code> instead of <code style={{ color: '#38BDF8', fontWeight: 700 }}>"IP65"</code>), 
            the AI Agent executes vector similarity search against this Knowledge Graph. By traversing relationships between <strong style={{ color: '#FFFFFF' }}>Product Domains → Operating Voltages → IEC Safety Standards</strong>, the pipeline automatically imputes missing specifications with 94%+ verified accuracy.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '14px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 14, background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Filter size={16} color="#94A3B8" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 4 }}>Cluster Filter:</span>
          {[
            { id: 'all', label: 'All Clusters' },
            { id: 'motors', label: 'Motor Taxonomy' },
            { id: 'certs', label: 'ISO / IEC Certs' },
            { id: 'atex', label: 'ATEX Safety' },
            { id: 'electrical', label: 'Electrical Specs' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                background: activeFilter === f.id ? '#3B82F6' : '#0F172A',
                color: activeFilter === f.id ? '#FFFFFF' : '#CBD5E1',
                border: `1px solid ${activeFilter === f.id ? '#3B82F6' : '#334155'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 260 }}>
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search nodes or standards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 38, height: 38, fontSize: 13 }}
          />
        </div>
      </div>

      {/* Main Graph Visualization Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        
        {/* Visual Graph Canvas Container */}
        <div className="card" style={{ padding: 0, position: 'relative', minHeight: 520, height: 520, overflow: 'hidden', background: '#070B18', border: '1px solid #334155' }}>
          
          {/* Radial Ambient Glow */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.18) 0%, rgba(7, 11, 24, 0.96) 80%)' }} />

          {/* SVG Connecting Lines with Animated Pulsing Data Rays */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="grad-violet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="grad-pink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Relationship Lines */}
            <line x1="50%" y1="50%" x2="22%" y2="24%" stroke="url(#grad-cyan)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="78%" y2="24%" stroke="url(#grad-red)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="22%" y2="76%" stroke="url(#grad-amber)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="78%" y2="76%" stroke="url(#grad-violet)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="50%" y2="16%" stroke="rgba(16, 185, 129, 0.7)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="14%" y2="50%" stroke="url(#grad-pink)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="86%" y2="50%" stroke="url(#grad-violet)" strokeWidth="2" strokeDasharray="6 4" />
          </svg>

          {/* Interactive Graph Node Circles */}
          {filteredNodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            const isRoot = node.id === 'motor-root';
            
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{
                  position: 'absolute',
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: isRoot ? 146 : 112,
                  height: isRoot ? 146 : 112,
                  borderRadius: '50%',
                  background: node.bgColor,
                  border: `2px solid ${isSelected ? '#FFFFFF' : node.borderColor}`,
                  boxShadow: isSelected 
                    ? `0 0 40px ${node.borderColor}, 0 0 15px #FFFFFF` 
                    : `0 0 24px ${node.bgColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  cursor: 'pointer',
                  zIndex: isSelected ? 20 : 10,
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translate(-50%, -50%) scale(1.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translate(-50%, -50%) scale(1)';
                }}
              >
                {isRoot ? (
                  <Network size={32} color={node.color} style={{ marginBottom: 4 }} />
                ) : (
                  <Cpu size={22} color={node.color} style={{ marginBottom: 4 }} />
                )}

                <div style={{ fontSize: isRoot ? 13 : 11, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25 }}>
                  {node.name.split(' (')[0]}
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: node.color, fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>
                  {node.connectedNodes.toLocaleString()} nodes
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Side Inspector & RAG Simulator */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 22, background: '#1E293B' }}>
          {selectedNode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: selectedNode.color, textTransform: 'uppercase', letterSpacing: '0.06em', background: selectedNode.bgColor, padding: '3px 10px', borderRadius: 6, border: `1px solid ${selectedNode.borderColor}` }}>
                  {selectedNode.category}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginTop: 10, lineHeight: 1.35 }}>
                  {selectedNode.name}
                </h3>
              </div>

              <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6 }}>
                {selectedNode.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 14, borderTop: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#94A3B8' }}>Connected Nodes:</span>
                  <strong style={{ color: '#FFFFFF', fontFamily: 'JetBrains Mono, monospace' }}>
                    {selectedNode.connectedNodes.toLocaleString()}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#94A3B8' }}>Edge Relationship:</span>
                  <strong style={{ color: selectedNode.color, fontFamily: 'JetBrains Mono, monospace' }}>
                    {selectedNode.relLabel}
                  </strong>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Mapped ISO / IEC Standards
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedNode.standards.map((st, i) => (
                      <span key={i} style={{ fontSize: 12, fontWeight: 700, color: '#38BDF8', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '4px 10px', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace' }}>
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive RAG Vector Simulation Box */}
              <div style={{ marginTop: 10, padding: 14, background: '#0F172A', border: '1px solid #334155', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase' }}>
                  <Zap size={15} color="#F59E0B" />
                  RAG Vector Search Simulator
                </div>

                <div style={{ fontSize: 12, color: '#94A3B8' }}>Test Gemini vector inference against this node:</div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    style={{ height: 36, fontSize: 12, padding: '0 10px' }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => runSimulatedRag(ragQuery)}
                    style={{ fontSize: 12, padding: '0 12px', height: 36 }}
                    disabled={ragRunning}
                  >
                    <Play size={13} /> Run
                  </button>
                </div>

                {ragRunning && (
                  <div style={{ fontSize: 12, color: '#60A5FA', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Activity size={14} className="animate-spin" /> Executing Cosine Similarity Vector Search...
                  </div>
                )}

                {ragResult && (
                  <div style={{ padding: 10, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 8, fontSize: 12, color: '#34D399', lineHeight: 1.5, fontFamily: 'JetBrains Mono, monospace' }}>
                    <CheckCircle2 size={14} color="#34D399" style={{ marginBottom: 2 }} /> {ragResult}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94A3B8', padding: '40px 0', fontSize: 14 }}>
              Select any graph node to inspect its ontology links and mapped standards.
            </div>
          )}
        </div>
      </div>

      {/* ISO / IEC Standards Matrix Table */}
      <div className="card" style={{ padding: 24, background: '#1E293B' }}>
        <div 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setExpandedBase(!expandedBase)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Database size={22} color="#38BDF8" />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
              ISO / IEC Industrial Standards Rule Matrix
            </h3>
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#60A5FA' }}>
            {expandedBase ? 'Collapse Matrix ▲' : 'Expand Matrix ▼'}
          </span>
        </div>

        {expandedBase && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #334155' }}>
            <table>
              <thead>
                <tr>
                  <th>Standard Code</th>
                  <th>Category</th>
                  <th>Description & Technical Mandate</th>
                  <th>AI Validation Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#38BDF8', fontSize: 14 }}>IEC 60529</td>
                  <td style={{ color: '#E2E8F0' }}>Enclosure Protection</td>
                  <td style={{ color: '#CBD5E1' }}>Defines Ingress Protection (IP) ratings for dust tightness and water jet resistance.</td>
                  <td><span className="badge badge-validated">Auto-Verified</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#38BDF8', fontSize: 14 }}>IEC 60034-30-1</td>
                  <td style={{ color: '#E2E8F0' }}>Energy Efficiency</td>
                  <td style={{ color: '#CBD5E1' }}>Standardizes IE1, IE2, IE3, IE4 efficiency classes for industrial motors.</td>
                  <td><span className="badge badge-commerce_ready">Compliance Pass</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#38BDF8', fontSize: 14 }}>Directive 2014/34/EU</td>
                  <td style={{ color: '#E2E8F0' }}>ATEX Hazardous</td>
                  <td style={{ color: '#CBD5E1' }}>Mandatory safety directive for equipment operating in explosive atmosphere zones.</td>
                  <td><span className="badge badge-flagged">Flagged for Review</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#38BDF8', fontSize: 14 }}>ISO 13849-1</td>
                  <td style={{ color: '#E2E8F0' }}>Safety Systems</td>
                  <td style={{ color: '#CBD5E1' }}>Safety-related parts of control systems (Performance Level PL a-e).</td>
                  <td><span className="badge badge-validated">Auto-Verified</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeGraphViewer;
