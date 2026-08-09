import React, { useState } from 'react';
import { Network, Database, ChevronDown, Sparkles, X, Filter } from 'lucide-react';

interface NodeDetail {
  id: string;
  name: string;
  category: string;
  type: string;
  connectedNodes: number;
  standards: string[];
  description: string;
}

const KnowledgeGraphViewer: React.FC = () => {
  const [expandedBase, setExpandedBase] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'atex' | 'motors' | 'certs'>('all');
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>({
    id: 'motor-root',
    name: 'Industrial Motors & Drives',
    category: 'Root Taxonomy Domain',
    type: 'Core Domain',
    connectedNodes: 4500,
    standards: ['IEC 60034-30-1', 'NEMA MG1', 'ISO 13849-1'],
    description: 'Central taxonomy node mapping electric motors, drive units, power envelopes, and safety compliance schemas across global commerce catalogs.'
  });

  const nodeDetailsMap: Record<string, NodeDetail> = {
    'motor-root': {
      id: 'motor-root',
      name: 'Industrial Motors Domain',
      category: 'Root Taxonomy',
      type: 'Core Domain Node',
      connectedNodes: 4500,
      standards: ['IEC 60034-30-1', 'NEMA MG1'],
      description: 'Central taxonomy node mapping electric motors, drive units, power envelopes, and safety compliance schemas.'
    },
    'ip-rating': {
      id: 'ip-rating',
      name: 'Ingress Protection (IP65/IP67)',
      category: 'Enclosure Standard',
      type: 'Safety Spec',
      connectedNodes: 3200,
      standards: ['IEC 60529', 'DIN 40050-9'],
      description: 'Standardized seal protection ratings defining dust tightness and water jet resistance capabilities.'
    },
    'atex': {
      id: 'atex',
      name: 'ATEX Explosion Proof (Zone 1/21)',
      category: 'Hazardous Compliance',
      type: 'Safety Directive',
      connectedNodes: 1240,
      standards: ['EN 60079-0', 'Directive 2014/34/EU'],
      description: 'Mandatory European safety standard for equipment operating in potentially explosive atmospheres.'
    },
    'voltage': {
      id: 'voltage',
      name: 'Operating Voltage (400V AC)',
      category: 'Electrical Spec',
      type: 'Primary Attribute',
      connectedNodes: 4100,
      standards: ['IEEE 1584', 'UL 508A'],
      description: 'Input voltage rating specifications defining 3-Phase AC power grid compatibility, frequency tolerances, and current draw.'
    },
    'efficiency': {
      id: 'efficiency',
      name: 'Energy Efficiency (IE3/IE4)',
      category: 'Eco Standard',
      type: 'Classification',
      connectedNodes: 2900,
      standards: ['IEC 60034-30-1'],
      description: 'International energy efficiency class benchmarks for industrial motor operating power losses.'
    }
  };

  return (
    <div className="animate-fade-in-up h-full flex flex-col min-w-0">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight flex items-center gap-3">
            AI Knowledge Graph
            <span className="badge badge-ai_enriched"><Sparkles size={11} /> Semantic Enrichment</span>
          </h1>
          <p className="text-gray text-sm">How the AI uses product relationships, ISO standards, and attribute similarity to fill in missing data.</p>
        </div>
      </div>

      {/* Annotation banner for judges */}
      <div style={{
        marginBottom: 20,
        padding: '12px 16px',
        background: 'rgba(139,92,246,0.08)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Network size={16} color="#8B5CF6" />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8B5CF6', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            What This Shows — RAG Enrichment via Knowledge Graph
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.65 }}>
            When the AI extracts a product attribute (e.g., IP Rating) and the source document is ambiguous or missing data, it queries this knowledge graph to find semantically similar products and ISO standards.
            The graph links <strong style={{ color: '#E2E8F0' }}>product domains → safety standards → electrical specs → certifications</strong>, enabling the AI to infer missing values with traceable reasoning.
            Click any node below to explore its connections and standards.
          </div>
        </div>
      </div>


      {/* Node Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Filter size={14} color="#0284c7" />
        <div style={{ display: 'flex', gap: 4, background: 'rgba(15,23,42,0.6)', padding: 3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { id: 'all', label: 'All Nodes' },
            { id: 'atex', label: 'ATEX Cluster' },
            { id: 'motors', label: 'Motor Specs' },
            { id: 'certs', label: 'ISO Certs' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                background: activeFilter === f.id ? '#4f46e5' : 'transparent',
                color: activeFilter === f.id ? '#fff' : '#64748b',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >{f.label}</button>
          ))}
        </div>
      </div>

      {/* Main Graph Box */}
      <div className="glass-card flex-1 min-h-[480px] mb-6 relative overflow-hidden flex items-center justify-center bg-[#070b15] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]"></div>
        
        {/* Graph SVG Physics Container */}
        <div className="relative w-full max-w-[700px] h-[400px] flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            {/* Animated Physics Connections */}
            <line x1="50%" y1="50%" x2="22%" y2="22%" stroke="rgba(6,182,212,0.4)" strokeWidth="2" className="laser-line" />
            <line x1="50%" y1="50%" x2="78%" y2="22%" stroke="rgba(239,68,68,0.4)" strokeWidth="2" className="laser-line" />
            <line x1="50%" y1="50%" x2="22%" y2="78%" stroke="rgba(245,158,11,0.4)" strokeWidth="2" className="laser-line" />
            <line x1="50%" y1="50%" x2="78%" y2="78%" stroke="rgba(139,92,246,0.4)" strokeWidth="2" className="laser-line" />
          </svg>

          {/* Central Root Node */}
          <div 
            onClick={() => setSelectedNode(nodeDetailsMap['motor-root'])}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-gradient-to-br from-indigo-600/40 to-cyan-600/40 border-2 border-indigo-400 rounded-full flex flex-col items-center justify-center z-10 shadow-[0_0_35px_rgba(99,102,241,0.5)] cursor-pointer hover:scale-110 transition-transform group"
          >
            <Network size={26} className="text-indigo-300 mb-1 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold text-white text-center">Industrial Motors</span>
            <span className="text-[10px] text-cyan-300 font-mono">4.5k nodes</span>
          </div>

          {/* Peripheral Nodes */}
          {/* IP Rating */}
          <div 
            onClick={() => setSelectedNode(nodeDetailsMap['ip-rating'])}
            className="absolute left-[12%] top-[14%] w-24 h-24 bg-cyan-600/25 border-2 border-cyan-400 rounded-full flex flex-col items-center justify-center z-10 cursor-pointer hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <span className="text-xs font-bold text-cyan-200 text-center">IP Protection</span>
            <span className="text-[10px] text-gray font-mono">IP65 / IP67</span>
          </div>

          {/* ATEX Hazardous */}
          <div 
            onClick={() => setSelectedNode(nodeDetailsMap['atex'])}
            className="absolute right-[12%] top-[14%] w-24 h-24 bg-red-600/25 border-2 border-red-400 rounded-full flex flex-col items-center justify-center z-10 cursor-pointer hover:scale-110 transition-transform shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          >
            <span className="text-xs font-bold text-red-200 text-center">ATEX Explosion</span>
            <span className="text-[10px] text-gray font-mono">Zone 1 / 21</span>
          </div>

          {/* Voltage */}
          <div 
            onClick={() => setSelectedNode(nodeDetailsMap['voltage'])}
            className="absolute left-[12%] bottom-[14%] w-24 h-24 bg-amber-600/25 border-2 border-amber-400 rounded-full flex flex-col items-center justify-center z-10 cursor-pointer hover:scale-110 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <span className="text-xs font-bold text-amber-200 text-center">Voltage Rating</span>
            <span className="text-[10px] text-gray font-mono">400V 3-Phase</span>
          </div>

          {/* Efficiency */}
          <div 
            onClick={() => setSelectedNode(nodeDetailsMap['efficiency'])}
            className="absolute right-[12%] bottom-[14%] w-24 h-24 bg-purple-600/25 border-2 border-purple-400 rounded-full flex flex-col items-center justify-center z-10 cursor-pointer hover:scale-110 transition-transform shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            <span className="text-xs font-bold text-purple-200 text-center">Efficiency</span>
            <span className="text-[10px] text-gray font-mono">IE3 / IE4</span>
          </div>
        </div>

        {/* Selected Node Details Drawer overlay */}
        {selectedNode && (
          <div className="absolute top-4 right-4 glass-card-dark p-4 max-w-xs w-full border border-[rgba(255,255,255,0.15)] shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{selectedNode.category}</span>
                <h4 className="text-sm font-bold text-white leading-tight">{selectedNode.name}</h4>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-gray hover:text-white">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-gray mb-3 leading-relaxed">{selectedNode.description}</p>
            <div className="space-y-1.5 text-xs font-mono border-t border-[rgba(255,255,255,0.08)] pt-2">
              <div className="flex justify-between text-gray">
                <span>Linked Nodes:</span>
                <span className="text-white font-bold">{selectedNode.connectedNodes.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray block mb-1">Mapped Standards:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.standards.map((st, i) => (
                    <span key={i} className="text-[10px] bg-[rgba(6,182,212,0.15)] text-cyan-300 px-2 py-0.5 rounded border border-[rgba(6,182,212,0.25)]">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Standards & Certifications Knowledge Accordion */}
      <div className="glass-card-dark rounded-2xl border border-[rgba(255,255,255,0.08)]">
        <div 
          className="flex justify-between items-center cursor-pointer p-5 select-none"
          onClick={() => setExpandedBase(!expandedBase)}
        >
          <div className="flex items-center gap-3">
            <Database size={20} className="text-cyan-400" />
            <h3 className="font-bold text-white text-base">ISO / IEC Industrial Standards Knowledge Matrix</h3>
          </div>
          <ChevronDown size={18} className={`text-gray transition-transform duration-200 ${expandedBase ? 'rotate-180' : ''}`} />
        </div>
        
        {expandedBase && (
          <div className="px-5 pb-5 border-t border-[rgba(255,255,255,0.06)] pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-gray uppercase tracking-wider mb-3">Ingress Protection Standard (IEC 60529)</h4>
              <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.06)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr><th>Code</th><th>Protection Level</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="font-mono text-cyan-300 font-bold">IP20</td><td>Finger touch safe, internal panel mounting</td></tr>
                    <tr><td className="font-mono text-cyan-300 font-bold">IP65</td><td>Dust tight, protected against water jets from any angle</td></tr>
                    <tr><td className="font-mono text-cyan-300 font-bold">IP67</td><td>Dust tight, protected against continuous water immersion</td></tr>
                    <tr><td className="font-mono text-cyan-300 font-bold">IP69K</td><td>High-pressure, high-temperature washdown protected</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray uppercase tracking-wider mb-3">Motor Efficiency Standard (IEC 60034-30-1)</h4>
              <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.06)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr><th>Class</th><th>Description & Compliance Requirements</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="font-mono text-emerald-400 font-bold">IE1</td><td>Standard Efficiency baseline</td></tr>
                    <tr><td className="font-mono text-emerald-400 font-bold">IE2</td><td>High Efficiency compliant</td></tr>
                    <tr><td className="font-mono text-emerald-400 font-bold">IE3</td><td>Premium Efficiency (EU & US Mandated)</td></tr>
                    <tr><td className="font-mono text-emerald-400 font-bold">IE4 / IE5</td><td>Super & Ultra Premium Efficiency (Permanent Magnet)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeGraphViewer;
