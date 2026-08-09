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
  similarity: number;
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
    bgColor: 'rgba(99, 102, 241, 0.25)',
    borderColor: '#3B82F6',
    x: 50,
    y: 50,
    cluster: 'motors',
    relLabel: 'ROOT_DOMAIN',
    similarity: 99.8,
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
    similarity: 98.4,
  },
  {
    id: 'atex',
    name: 'ATEX Explosion Proof (Zone 1/21)',
    category: 'Hazardous Compliance',
    type: 'Safety Directive',
    connectedNodes: 1240,
    standards: ['EN 60079-0', 'Directive 2014/34/EU'],
    description: 'Mandatory European Union certification for equipment operating in potentially explosive dust or gas industrial atmospheres.',
    color: '#FBBF24',
    bgColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: '#F59E0B',
    x: 78,
    y: 24,
    cluster: 'atex',
    relLabel: 'HAZARDOUS_RULE',
    similarity: 96.1,
  },
  {
    id: 'ie3-class',
    name: 'IE3 Premium Efficiency Standard',
    category: 'Energy Performance',
    type: 'Efficiency Class',
    connectedNodes: 2800,
    standards: ['IEC 60034-30-1'],
    description: 'Mandatory energy efficiency baseline for 3-phase electric motors operating within the European Economic Area.',
    color: '#34D399',
    bgColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
    x: 22,
    y: 76,
    cluster: 'electrical',
    relLabel: 'COMPLIES_WITH',
    similarity: 97.9,
  },
  {
    id: 'voltage-class',
    name: '400V 3-Phase Low Voltage Class',
    category: 'Electrical Rating',
    type: 'Grid Standard',
    connectedNodes: 3900,
    standards: ['IEC 60038'],
    description: 'Standard AC power grid supply rating across EMEA manufacturing plants for heavy machinery and continuous duty drives.',
    color: '#818CF8',
    bgColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366F1',
    x: 78,
    y: 76,
    cluster: 'electrical',
    relLabel: 'OPERATES_AT',
    similarity: 95.7,
  },
  {
    id: 'din-mount',
    name: 'DIN Flange B5 / B14 Mounting',
    category: 'Mechanical Specs',
    type: 'Physical Interface',
    connectedNodes: 2100,
    standards: ['DIN 42673', 'IEC 60072-1'],
    description: 'Standardized mounting flange bolt patterns and shaft dimensions for direct gearhead coupling.',
    color: '#38BDF8',
    bgColor: 'rgba(6, 182, 212, 0.2)',
    borderColor: '#06B6D4',
    x: 50,
    y: 16,
    cluster: 'motors',
    relLabel: 'COUPLING_STD',
    similarity: 94.2,
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
      setRagResult('Traversal Path: Industrial Motors → Ingress Protection (IP65) → IEC 60529. Inferred value: "IP65" (98.6% Cosine Similarity)');
    }, 700);
  };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Network size={24} color="#60A5FA" />
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.4px' }}>
                AI Semantic Knowledge Graph
              </h1>
              <div style={{ fontSize: 14, color: '#F1F5F9' }}>
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

      {/* RAG Banner */}
      <div style={{
        background: '#1B2433',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: 14,
        padding: '18px 22px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={20} color="#60A5FA" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            How RAG Enrichment Works in the AI Pipeline
          </div>
          <p style={{ fontSize: 14, color: '#FFFFFF', lineHeight: 1.6 }}>
            When supplier PDFs contain missing or abbreviated technical specs (e.g. <code style={{ color: '#38BDF8', fontWeight: 700 }}>"65"</code> instead of <code style={{ color: '#38BDF8', fontWeight: 700 }}>"IP65"</code>), 
            the AI Agent executes vector similarity search against this Knowledge Graph. By traversing relationships between <strong style={{ color: '#60A5FA' }}>Product Domains → Operating Voltages → IEC Safety Standards</strong>, the pipeline automatically imputes missing specifications with 94%+ verified accuracy.
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
                background: activeFilter === f.id ? 'rgba(56, 189, 248, 0.25)' : '#0B0F17',
                color: activeFilter === f.id ? '#FFFFFF' : '#94A3B8',
                border: `1px solid ${activeFilter === f.id ? '#38BDF8' : 'rgba(56, 189, 248, 0.25)'}`,
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
        <div className="card" style={{ padding: 0, position: 'relative', minHeight: 520, height: 520, overflow: 'hidden', background: '#0B0F17', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 16 }}>
          
          {/* Radial Ambient Glow */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 0%, rgba(11, 15, 23, 0.96) 80%)' }} />

          {/* SVG Connecting Lines with Vector Gradient Rays */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <line x1="50%" y1="50%" x2="22%" y2="24%" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="78%" y2="24%" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="22%" y2="76%" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="78%" y2="76%" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="50%" y2="16%" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="2" strokeDasharray="6 4" />
          </svg>

          {/* Interactive Graph Nodes */}
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
                  background: '#1B2433',
                  border: `2px solid ${isSelected ? '#FFFFFF' : node.borderColor}`,
                  boxShadow: isSelected 
                    ? `0 0 35px ${node.borderColor}, 0 0 15px #FFFFFF` 
                    : `0 0 20px rgba(0,0,0,0.5)`,
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
                <div style={{ fontSize: 10, fontWeight: 800, color: node.color, fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: 4 }}>
                  {node.connectedNodes.toLocaleString()} nodes
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Side Inspector & Interactive RAG Simulator */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 22, background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 16 }}>
          {selectedNode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: selectedNode.color, background: selectedNode.bgColor, padding: '3px 10px', borderRadius: 6, border: `1px solid ${selectedNode.borderColor}` }}>
                  {selectedNode.category}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginTop: 10, lineHeight: 1.35 }}>
                  {selectedNode.name}
                </h3>
              </div>

              <p style={{ fontSize: 14, color: '#FFFFFF', lineHeight: 1.6 }}>
                {selectedNode.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 14, borderTop: '1px solid rgba(56, 189, 248, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#94A3B8' }}>Cosine Similarity:</span>
                  <strong style={{ color: '#34D399', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {selectedNode.similarity}% Match
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#94A3B8' }}>Edge Relationship:</span>
                  <strong style={{ color: selectedNode.color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {selectedNode.relLabel}
                  </strong>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Mapped ISO / IEC Standards
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedNode.standards.map((st, i) => (
                      <span key={i} style={{ fontSize: 12, fontWeight: 700, color: '#38BDF8', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '4px 10px', borderRadius: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive RAG Vector Simulation Box */}
              <div style={{ marginTop: 10, padding: 16, background: '#0B0F17', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>
                  <Zap size={15} color="#FBBF24" />
                  RAG Vector Search Simulator
                </div>

                {/* Preset Query Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    'Infer SAB-992 IP Rating',
                    'Check IE3 Efficiency',
                    'ATEX Zone 1 Audit'
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => runSimulatedRag(q)}
                      style={{ fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 6, background: '#1B2433', color: '#60A5FA', border: '1px solid rgba(56, 189, 248, 0.35)', cursor: 'pointer' }}
                    >
                      ⚡ {q}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <input
                    type="text"
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    style={{ height: 36, fontSize: 12, padding: '0 10px' }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => runSimulatedRag(ragQuery)}
                    style={{ fontSize: 12, padding: '0 14px', height: 36 }}
                    disabled={ragRunning}
                  >
                    <Play size={13} /> Run
                  </button>
                </div>

                {ragRunning && (
                  <div style={{ fontSize: 12, color: '#60A5FA', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Activity size={14} className="animate-spin" /> Executing Vector Similarity Search...
                  </div>
                )}

                {ragResult && (
                  <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 8, fontSize: 12, color: '#34D399', lineHeight: 1.5, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
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
      <div className="card" style={{ padding: 24, background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 16 }}>
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
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(56, 189, 248, 0.25)' }}>
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
                  <td style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, color: '#38BDF8', fontSize: 14 }}>IEC 60529</td>
                  <td style={{ color: '#FFFFFF' }}>Enclosure Protection</td>
                  <td style={{ color: '#F1F5F9' }}>Defines Ingress Protection (IP) ratings for dust tightness and water jet resistance.</td>
                  <td><span className="badge badge-validated">Auto-Verified</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, color: '#38BDF8', fontSize: 14 }}>IEC 60034-30-1</td>
                  <td style={{ color: '#FFFFFF' }}>Energy Efficiency</td>
                  <td style={{ color: '#F1F5F9' }}>Standardizes IE1, IE2, IE3, IE4 efficiency classes for industrial motors.</td>
                  <td><span className="badge badge-commerce_ready">Compliance Pass</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, color: '#38BDF8', fontSize: 14 }}>Directive 2014/34/EU</td>
                  <td style={{ color: '#FFFFFF' }}>ATEX Hazardous</td>
                  <td style={{ color: '#F1F5F9' }}>Mandatory safety directive for equipment operating in explosive atmosphere zones.</td>
                  <td><span className="badge badge-flagged">Flagged for Review</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, color: '#38BDF8', fontSize: 14 }}>ISO 13849-1</td>
                  <td style={{ color: '#FFFFFF' }}>Safety Systems</td>
                  <td style={{ color: '#F1F5F9' }}>Safety-related parts of control systems (Performance Level PL a-e).</td>
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
