import React, { useState } from 'react';
import { Product } from '../types/product';
import { Search, Grid, List, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

interface CatalogGridProps {
  products: Product[];
  loading: boolean;
  onSelectProduct: (product: Product) => void;
  isDark?: boolean;
}

const statusConfigDark: Record<string, { label: string; color: string; bg: string; border: string }> = {
  raw:            { label: 'Raw',           color: '#cbd5e1', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.3)' },
  ai_enriched:    { label: 'AI Enriched',   color: '#22d3ee', bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.35)'  },
  validated:      { label: 'Validated',     color: '#a5b4fc', bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.35)' },
  commerce_ready: { label: 'Ready',         color: '#34d399', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.35)' },
  flagged:        { label: 'Flagged',       color: '#f87171', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.35)'  },
};

const statusConfigLight: Record<string, { label: string; color: string; bg: string; border: string }> = {
  raw:            { label: 'Raw',           color: '#475569', bg: '#f1f5f9', border: '#cbd5e1' },
  ai_enriched:    { label: 'AI Enriched',   color: '#0369a1', bg: '#e0f2fe', border: '#bae6fd' },
  validated:      { label: 'Validated',     color: '#4338ca', bg: '#e0e7ff', border: '#c7d2fe' },
  commerce_ready: { label: 'Ready',         color: '#047857', bg: '#d1fae5', border: '#a7f3d0' },
  flagged:        { label: 'Flagged',       color: '#b91c1c', bg: '#fee2e2', border: '#fca5a5' },
};

const CatalogGrid: React.FC<CatalogGridProps> = ({ products, loading, onSelectProduct, isDark = false }) => {
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
    const configMap = isDark ? statusConfigDark : statusConfigLight;
    const cfg = configMap[status] || configMap.raw;
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

  const toolbarBg = isDark ? 'rgba(15,23,42,0.5)' : '#ffffff';
  const toolbarBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const textColor = isDark ? '#e2e8f0' : '#0f172a';
  const optBg = isDark ? '#090e1c' : '#ffffff';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
        background: toolbarBg,
        padding: '12px 16px',
        borderRadius: 14,
        border: `1px solid ${toolbarBorder}`,
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(15,23,42,0.04)',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} color={isDark ? "#475569" : "#94a3b8"} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by SKU, name, or manufacturer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', height: 38,
              background: inputBg,
              border: `1px solid ${inputBorder}`,
              borderRadius: 10,
              paddingLeft: 36, paddingRight: 12,
              fontSize: 13, color: textColor,
              fontFamily: 'inherit',
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = '#4f46e5')}
            onBlur={e => (e.target.style.borderColor = inputBorder)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              height: 38, padding: '0 12px',
              background: inputBg,
              border: `1px solid ${inputBorder}`,
              borderRadius: 10,
              fontSize: 12, fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569',
              fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
            }}
          >
            {categories.map(cat => <option key={cat} value={cat} style={{ background: optBg, color: isDark ? '#fff' : '#0f172a' }}>Category: {cat}</option>)}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{
              height: 38, padding: '0 12px',
              background: inputBg,
              border: `1px solid ${inputBorder}`,
              borderRadius: 10,
              fontSize: 12, fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569',
              fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
            }}
          >
            {['All', 'commerce_ready', 'ai_enriched', 'validated', 'flagged', 'raw'].map(st => (
              <option key={st} value={st} style={{ background: optBg, color: isDark ? '#fff' : '#0f172a' }}>Status: {st.replace('_', ' ')}</option>
            ))}
          </select>

          {/* View toggle */}
          <div style={{
            display: 'flex', gap: 2,
            background: isDark ? 'rgba(0,0,0,0.3)' : '#f1f5f9', padding: 4, borderRadius: 10,
            border: `1px solid ${inputBorder}`,
          }}>
            {([['grid', Grid], ['list', List]] as const).map(([mode, Icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as 'grid' | 'list')}
                style={{
                  width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 7,
                  background: viewMode === mode ? (isDark ? 'rgba(255,255,255,0.14)' : '#ffffff') : 'transparent',
                  color: viewMode === mode ? (isDark ? '#fff' : '#4f46e5') : '#64748b',
                  boxShadow: viewMode === mode && !isDark ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
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
      <p style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#64748b' : '#64748b', marginTop: -8 }}>
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Empty state */}
      {filteredProducts.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: 16, background: toolbarBg, border: `1px solid ${toolbarBorder}` }}>
          <Search size={40} color={isDark ? "#334155" : "#cbd5e1"} style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: textColor, marginBottom: 8 }}>No products match your search</h3>
          <p style={{ fontSize: 13, color: isDark ? '#64748b' : '#64748b', marginBottom: 20 }}>Try clearing filters or search for another SKU.</p>
          <button className="btn btn-secondary" onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedStatus('All'); }}>
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} StatusBadge={StatusBadge} isDark={isDark} onClick={() => onSelectProduct(product)} />
          ))}
        </div>
      ) : (
        <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${toolbarBorder}`, background: toolbarBg, boxShadow: isDark ? 'none' : '0 2px 10px rgba(15,23,42,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 600 }}>
              <thead>
                <tr>
                  {['Product', 'SKU', 'Manufacturer', 'Status', 'Completeness', ''].map((h, i) => (
                    <th key={i} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                      color: isDark ? '#475569' : '#64748b',
                      borderBottom: `1px solid ${toolbarBorder}`,
                      background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
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
                    style={{ cursor: 'pointer', background: rowIdx % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.015)' : '#f9fafb') : 'transparent' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = rowIdx % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.015)' : '#f9fafb') : 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', borderBottom: `1px solid ${toolbarBorder}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 8,
                          background: isDark ? 'rgba(99,102,241,0.15)' : '#e0e7ff',
                          border: isDark ? '1px solid rgba(99,102,241,0.3)' : '1px solid #c7d2fe',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 800, color: isDark ? '#a5b4fc' : '#4f46e5', flexShrink: 0,
                        }}>
                          {product.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: textColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: 11, color: isDark ? '#475569' : '#64748b' }}>{product.anomalies.length} anomaly flags</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: `1px solid ${toolbarBorder}`, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: isDark ? '#22d3ee' : '#0284c7', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {product.sku}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: `1px solid ${toolbarBorder}`, fontSize: 13, color: isDark ? '#94a3b8' : '#475569' }}>
                      {product.manufacturer}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: `1px solid ${toolbarBorder}` }}>
                      <StatusBadge status={product.status} />
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: `1px solid ${toolbarBorder}`, minWidth: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, height: 5, background: isDark ? 'rgba(15,23,42,0.8)' : '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${product.completeness}%`, background: 'linear-gradient(90deg, #4f46e5, #0284c7)', borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: textColor, minWidth: 34 }}>{product.completeness}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: `1px solid ${toolbarBorder}`, textAlign: 'right' }}>
                      <ChevronRight size={17} color={isDark ? "#475569" : "#94a3b8"} />
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

function ProductCard({ product, StatusBadge, isDark, onClick }: { product: Product; StatusBadge: any; isDark: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  const cardBg = isDark 
    ? 'linear-gradient(145deg, rgba(30,41,59,0.65) 0%, rgba(15,23,42,0.85) 100%)' 
    : '#ffffff';
  const cardBorder = isDark 
    ? (hovered ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)')
    : (hovered ? '#4f46e5' : '#e2e8f0');
  const textColor = isDark ? (hovered ? '#22d3ee' : '#ffffff') : (hovered ? '#4f46e5' : '#0f172a');
  const tagBg = isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9';
  const tagBorder = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: cardBg,
        backdropFilter: 'blur(16px)',
        border: `1px solid ${cardBorder}`,
        borderRadius: 16,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered 
          ? (isDark ? '0 12px 30px -10px rgba(0,0,0,0.6), 0 0 20px rgba(6,182,212,0.1)' : '0 10px 25px -5px rgba(79,70,229,0.15)')
          : (isDark ? 'none' : '0 2px 10px rgba(15,23,42,0.04)'),
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 14,
        position: 'relative' as const,
        overflow: 'hidden',
      }}
    >
      {/* Top shimmer line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: isDark ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' : 'linear-gradient(90deg, transparent, rgba(79,70,229,0.2), transparent)' }} />

      {/* Status + issues row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StatusBadge status={product.status} />
        {product.anomalies.length > 0 && (
          <span style={{
            fontSize: 10, fontWeight: 800, color: isDark ? '#fbbf24' : '#d97706',
            background: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7',
            border: isDark ? '1px solid rgba(245,158,11,0.3)' : '1px solid #fde68a',
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
          background: isDark ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2))' : 'linear-gradient(135deg, #e0e7ff, #e0f2fe)',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #c7d2fe',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, color: isDark ? '#22d3ee' : '#4f46e5',
          flexShrink: 0,
        }}>
          {product.name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{
            fontSize: 14, fontWeight: 700, color: textColor,
            lineHeight: 1.4, transition: 'color 0.2s',
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
          }}>
            {product.name}
          </h3>
          <p style={{ fontSize: 11, color: isDark ? '#475569' : '#64748b', fontFamily: 'JetBrains Mono, monospace', marginTop: 3 }}>
            {product.sku}
          </p>
        </div>
      </div>

      {/* Manufacturer + category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: isDark ? '#64748b' : '#64748b' }}>
        <span style={{ background: tagBg, border: `1px solid ${tagBorder}`, padding: '2px 8px', borderRadius: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '50%', color: isDark ? '#cbd5e1' : '#475569', fontWeight: 600 }}>
          {product.manufacturer}
        </span>
        <span>•</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{product.category}</span>
      </div>

      {/* Completeness bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
          <span style={{ color: isDark ? '#64748b' : '#64748b' }}>Completeness</span>
          <span style={{ color: isDark ? '#fff' : '#0f172a', fontWeight: 700 }}>{product.completeness}%</span>
        </div>
        <div style={{ height: 5, background: isDark ? 'rgba(15,23,42,0.8)' : '#e2e8f0', borderRadius: 4, overflow: 'hidden', border: `1px solid ${tagBorder}` }}>
          <div style={{
            height: '100%',
            width: `${product.completeness}%`,
            borderRadius: 4,
            background: product.completeness > 80
              ? 'linear-gradient(90deg, #059669, #0284c7)'
              : 'linear-gradient(90deg, #4f46e5, #0284c7)',
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>
    </div>
  );
}

export default CatalogGrid;
