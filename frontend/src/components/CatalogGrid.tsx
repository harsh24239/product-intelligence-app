import React, { useState } from 'react';
import { Product } from '../types/product';
import { Search, Grid, List, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

interface CatalogGridProps {
  products: Product[];
  loading: boolean;
  onSelectProduct: (product: Product) => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  raw:            { label: 'Raw',           color: '#cbd5e1', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.3)' },
  ai_enriched:    { label: 'AI Enriched',   color: '#22d3ee', bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.35)'  },
  validated:      { label: 'Validated',     color: '#a5b4fc', bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.35)' },
  commerce_ready: { label: 'Ready',         color: '#34d399', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.35)' },
  flagged:        { label: 'Flagged',       color: '#f87171', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.35)'  },
};

const CatalogGrid: React.FC<CatalogGridProps> = ({ products, loading, onSelectProduct }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="glass-card animate-shimmer" style={{ height: 200, borderRadius: 16 }} />
        ))}
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.manufacturer.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = statusConfig[status] || statusConfig.raw;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 10px',
        borderRadius: 9999,
        fontSize: 10, fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        whiteSpace: 'nowrap',
      }}>
        {status === 'ai_enriched' && <Sparkles size={9} />}
        {status === 'flagged' && <AlertCircle size={9} />}
        {cfg.label}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
        background: 'rgba(15,23,42,0.5)',
        padding: '12px 16px',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by SKU, name, or manufacturer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', height: 38,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              paddingLeft: 36, paddingRight: 12,
              fontSize: 13, color: '#e2e8f0',
              fontFamily: 'inherit',
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = '#06b6d4')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              height: 38, padding: '0 12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              fontSize: 12, fontWeight: 600, color: '#cbd5e1',
              fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
            }}
          >
            {categories.map(cat => <option key={cat} value={cat} style={{ background: '#090e1c' }}>Category: {cat}</option>)}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{
              height: 38, padding: '0 12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              fontSize: 12, fontWeight: 600, color: '#cbd5e1',
              fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
            }}
          >
            {['All', 'commerce_ready', 'ai_enriched', 'validated', 'flagged', 'raw'].map(st => (
              <option key={st} value={st} style={{ background: '#090e1c' }}>Status: {st.replace('_', ' ')}</option>
            ))}
          </select>

          {/* View toggle */}
          <div style={{
            display: 'flex', gap: 2,
            background: 'rgba(0,0,0,0.3)', padding: 4, borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {([['grid', Grid], ['list', List]] as const).map(([mode, Icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as 'grid' | 'list')}
                style={{
                  width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 7,
                  background: viewMode === mode ? 'rgba(255,255,255,0.14)' : 'transparent',
                  color: viewMode === mode ? '#fff' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Count */}
      <p style={{ fontSize: 12, color: '#64748b', marginTop: -8 }}>
        {filteredProducts.length} of {products.length} products
      </p>

      {/* Empty state */}
      {filteredProducts.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: 16 }}>
          <Search size={40} color="#334155" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>No products match your search</h3>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Try clearing filters or search for another SKU.</p>
          <button className="btn btn-secondary" onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedStatus('All'); }}>
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} StatusBadge={StatusBadge} onClick={() => onSelectProduct(product)} />
          ))}
        </div>
      ) : (
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(9,14,28,0.8)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 600 }}>
              <thead>
                <tr>
                  {['Product', 'SKU', 'Manufacturer', 'Status', 'Completeness', ''].map((h, i) => (
                    <th key={i} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                      color: '#475569',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.02)',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, rowIdx) => (
                  <tr
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    style={{ cursor: 'pointer', background: rowIdx % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = rowIdx % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 8,
                          background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 800, color: '#a5b4fc', flexShrink: 0,
                        }}>
                          {product.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#475569' }}>{product.anomalies.length} anomaly flags</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#22d3ee', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {product.sku}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13, color: '#94a3b8' }}>
                      {product.manufacturer}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <StatusBadge status={product.status} />
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', minWidth: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, height: 5, background: 'rgba(15,23,42,0.8)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${product.completeness}%`, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', minWidth: 34 }}>{product.completeness}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'right' }}>
                      <ChevronRight size={17} color="#475569" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

function ProductCard({ product, StatusBadge, onClick }: { product: Product; StatusBadge: any; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'linear-gradient(145deg, rgba(30,41,59,0.65) 0%, rgba(15,23,42,0.85) 100%)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${hovered ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 16,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 30px -10px rgba(0,0,0,0.6), 0 0 20px rgba(6,182,212,0.1)' : 'none',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 14,
        position: 'relative' as const,
        overflow: 'hidden',
      }}
    >
      {/* Top shimmer line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />

      {/* Status + issues row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StatusBadge status={product.status} />
        {product.anomalies.length > 0 && (
          <span style={{
            fontSize: 10, fontWeight: 800, color: '#fbbf24',
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
            padding: '3px 8px', borderRadius: 9999,
          }}>
            {product.anomalies.length} Issue{product.anomalies.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Icon + name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2))',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, color: '#22d3ee',
          flexShrink: 0,
        }}>
          {product.name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{
            fontSize: 14, fontWeight: 700, color: hovered ? '#22d3ee' : '#fff',
            lineHeight: 1.4, transition: 'color 0.2s',
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
          }}>
            {product.name}
          </h3>
          <p style={{ fontSize: 11, color: '#475569', fontFamily: 'JetBrains Mono, monospace', marginTop: 3 }}>
            {product.sku}
          </p>
        </div>
      </div>

      {/* Manufacturer + category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
        <span style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '50%' }}>
          {product.manufacturer}
        </span>
        <span>•</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.category}</span>
      </div>

      {/* Completeness bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
          <span style={{ color: '#64748b' }}>Completeness</span>
          <span style={{ color: '#fff' }}>{product.completeness}%</span>
        </div>
        <div style={{ height: 5, background: 'rgba(15,23,42,0.8)', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{
            height: '100%',
            width: `${product.completeness}%`,
            borderRadius: 4,
            background: product.completeness > 80
              ? 'linear-gradient(90deg, #10b981, #06b6d4)'
              : product.completeness > 50
              ? 'linear-gradient(90deg, #6366f1, #06b6d4)'
              : 'linear-gradient(90deg, #8b5cf6, #ec4899)',
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>
    </div>
  );
}

export default CatalogGrid;
