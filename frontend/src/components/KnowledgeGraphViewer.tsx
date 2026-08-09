import React, { useState } from 'react';
import { Network, Database, Sparkles, Filter, Zap, ShieldCheck, Cpu, Search, Activity } from 'lucide-react';

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
    bgColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
    x: 50,
    y: 50,
    cluster: 'motors'
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
    x: 24,
    y: 26,
    cluster: 'certs'
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
    x: 76,
    y: 26,
    cluster: 'atex'
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
    x: 24,
    y: 74,
    cluster: 'electrical'
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
    x: 76,
    y: 74,
    cluster: 'certs'
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
    y: 18,
    cluster: 'motors'
  }
];

const KnowledgeGraphViewer: React.FC = () => {
  const [expandedBase, setExpandedBase] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'atex' | 'motors' | 'certs' | 'electrical'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(nodesList[0]);

  const filteredNodes = nodesList.filter(node => {
    const matchCluster = activeFilter === 'all' || node.cluster === activeFilter;
    const matchSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        node.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCluster && matchSearch;
  });

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--violet-dim)', border: '1px solid var(--violet-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Network size={22} color="var(--violet)" />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.4px' }}>
                AI Semantic Knowledge Graph
              </h1>
              <div style={{ fontSize: 13, color: 'var(--text-sub)' }}>
                Multi-relational industrial taxonomy, ISO/IEC standards, and RAG attribute inference engine
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={16} color="var(--cyan)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Taxonomy Nodes</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>14,250 Nodes</div>
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={16} color="var(--green)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>ISO Standards</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>48 Mapped</div>
            </div>
          </div>
        </div>
      </div>

      {/* RAG Annotation Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
        border: '1px solid var(--violet-border)',
        borderRadius: 14,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--violet-dim)', border: '1px solid var(--violet-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={18} color="var(--violet)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--violet)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
            How RAG Enrichment Works in the AI Pipeline
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6 }}>
            When supplier PDFs contain missing or abbreviated technical specs (e.g. <code style={{ color: 'var(--cyan)' }}>"65"</code> instead of <code style={{ color: 'var(--cyan)' }}>"IP65"</code>), 
            the AI Agent executes vector similarity search against this Knowledge Graph. By traversing relationships between <strong style={{ color: 'var(--text)' }}>Product Domains → Operating Voltages → IEC Safety Standards</strong>, the pipeline automatically imputes missing specifications with 94%+ verified accuracy.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '14px 18px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Filter size={15} color="var(--text-muted)" />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 4 }}>Cluster Filter:</span>
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
                fontSize: 12,
                fontWeight: 700,
                background: activeFilter === f.id ? 'var(--blue)' : 'var(--bg-surface)',
                color: activeFilter === f.id ? '#FFF' : 'var(--text-sub)',
                border: `1px solid ${activeFilter === f.id ? 'var(--blue)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 240 }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search nodes or standards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 34, height: 36, fontSize: 12 }}
          />
        </div>
      </div>

      {/* Main Graph Visualization Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        
        {/* Visual Graph Canvas Container */}
        <div className="card" style={{ padding: 0, position: 'relative', minHeight: 480, height: 480, overflow: 'hidden', background: '#070B18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Radial Grid & Glowing Ambient Ring */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.12) 0%, rgba(7, 11, 24, 0.95) 75%)' }} />

          {/* Connected SVG Lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="grad-violet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Connecting lines from root node to peripheral nodes */}
            <line x1="50%" y1="50%" x2="24%" y2="26%" stroke="url(#grad-cyan)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="76%" y2="26%" stroke="url(#grad-red)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="24%" y2="74%" stroke="url(#grad-amber)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="76%" y2="74%" stroke="url(#grad-violet)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="50%" y2="18%" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="2" strokeDasharray="6 4" />
          </svg>

          {/* Interactive Graph Node Elements */}
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
                  width: isRoot ? 140 : 110,
                  height: isRoot ? 140 : 110,
                  borderRadius: '50%',
                  background: node.bgColor,
                  border: `2px solid ${isSelected ? '#FFF' : node.borderColor}`,
                  boxShadow: isSelected 
                    ? `0 0 35px ${node.borderColor}, 0 0 10px #FFF` 
                    : `0 0 20px ${node.bgColor}`,
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
                  <Network size={28} color={node.color} style={{ marginBottom: 4 }} />
                ) : (
                  <Cpu size={20} color={node.color} style={{ marginBottom: 4 }} />
                )}

                <div style={{ fontSize: isRoot ? 12 : 11, fontWeight: 800, color: '#FFF', lineHeight: 1.25 }}>
                  {node.name.split(' (')[0]}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: node.color, fontFamily: 'JetBrains Mono, monospace', marginTop: 3 }}>
                  {node.connectedNodes.toLocaleString()} nodes
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Side Inspector */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 22 }}>
          {selectedNode ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: selectedNode.color, textTransform: 'uppercase', letterSpacing: '0.06em', background: selectedNode.bgColor, padding: '2px 8px', borderRadius: 4, border: `1px solid ${selectedNode.borderColor}` }}>
                    {selectedNode.category}
                  </span>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginTop: 8, lineHeight: 1.3 }}>
                    {selectedNode.name}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: 16 }}>
                {selectedNode.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Connected Nodes:</span>
                  <strong style={{ color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {selectedNode.connectedNodes.toLocaleString()}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Cluster Group:</span>
                  <strong style={{ color: selectedNode.color, textTransform: 'capitalize' }}>
                    {selectedNode.cluster}
                  </strong>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Mapped ISO / IEC Standards
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedNode.standards.map((st, i) => (
                      <span key={i} style={{ fontSize: 11, fontWeight: 700, color: 'var(--cyan)', background: 'var(--cyan-dim)', border: '1px solid var(--cyan-border)', padding: '4px 10px', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace' }}>
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={14} color="var(--amber)" />
                  <span>Used by Gemini RAG engine to infer missing catalog parameters.</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: 13 }}>
              Select any graph node to inspect its ontology links and mapped standards.
            </div>
          )}
        </div>
      </div>

      {/* ISO / IEC Standards Matrix Table */}
      <div className="card" style={{ padding: 22 }}>
        <div 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setExpandedBase(!expandedBase)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Database size={20} color="var(--cyan)" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>
              ISO / IEC Industrial Standards Rule Matrix
            </h3>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)' }}>
            {expandedBase ? 'Collapse Matrix ▲' : 'Expand Matrix ▼'}
          </span>
        </div>

        {expandedBase && (
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
            <table>
              <thead>
                <tr>
                  <th>Standard Code</th>
                  <th>Category</th>
                  <th>Description & Technical Mandate</th>
                  <th>AI Validation Check</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--cyan)' }}>IEC 60529</td>
                  <td>Enclosure Protection</td>
                  <td>Defines Ingress Protection (IP) ratings for dust and water resistance.</td>
                  <td><span className="badge badge-validated">Auto-Verified</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--cyan)' }}>IEC 60034-30-1</td>
                  <td>Energy Efficiency</td>
                  <td>Standardizes IE1, IE2, IE3, IE4 efficiency classes for industrial motors.</td>
                  <td><span className="badge badge-commerce_ready">Compliance Pass</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--cyan)' }}>Directive 2014/34/EU</td>
                  <td>ATEX Hazardous</td>
                  <td>Mandatory safety directive for equipment in explosive atmosphere zones.</td>
                  <td><span className="badge badge-flagged">Flagged for Review</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--cyan)' }}>ISO 13849-1</td>
                  <td>Safety Systems</td>
                  <td>Safety-related parts of control systems (Performance Level PL a-e).</td>
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
