import React, { useState } from 'react';
import { Product } from '../types/product';
import {
  Search,
  Grid,
  List,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Package,
} from 'lucide-react';

interface CatalogGridProps {
  products: Product[];
  loading: boolean;
  onSelectProduct: (product: Product) => void;
}

const statusConfig: Record<
  string,
  { label: string; desc: string; color: string; bg: string; border: string }
> = {
  raw: {
    label: 'Raw',
    desc: 'Unprocessed data',
    color: '#E2E8F0',
    bg: 'rgba(148,163,184,0.15)',
    border: 'rgba(148,163,184,0.3)',
  },
  ai_enriched: {
    label: 'AI Enriched',
    desc: 'Attributes extracted',
    color: '#38BDF8',
    bg: 'rgba(6,182,212,0.15)',
    border: 'rgba(6,182,212,0.4)',
  },
  validated: {
    label: 'Human Validated',
    desc: 'Approved record',
    color: '#C084FC',
    bg: 'rgba(139,92,246,0.15)',
    border: 'rgba(139,92,246,0.4)',
  },
  commerce_ready: {
    label: 'Commerce Ready',
    desc: 'Validated & ready',
    color: '#34D399',
    bg: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.4)',
  },
  flagged: {
    label: 'Flagged',
    desc: 'Requires review',
    color: '#F87171',
    bg: 'rgba(239,68,68,0.15)',
    border: 'rgba(239,68,68,0.4)',
  },
};

const CatalogGrid: React.FC<CatalogGridProps> = ({
  products,
  loading,
  onSelectProduct,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-shimmer" style={{ height: 200, borderRadius: 12, border: '1px solid var(--border)' }} />
        ))}
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.manufacturer.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = statusConfig[status] || statusConfig.raw;
    return (
      <span
        title={cfg.desc}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 700,
          color: cfg.color,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          whiteSpace: 'nowrap',
        }}
      >
        {status === 'ai_enriched' && <Sparkles size={12} />}
        {status === 'flagged' && <AlertCircle size={12} />}
        {status === 'commerce_ready' && <span style={{ fontSize: 11 }}>✓</span>}
        {cfg.label}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      
      {/* Header Bar & Filters */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search SKU, product name, or manufacturer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 38, height: 40, fontSize: 14 }}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ height: 40, padding: '0 14px', fontSize: 14, width: 'auto', cursor: 'pointer' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ height: 40, padding: '0 14px', fontSize: 14, width: 'auto', cursor: 'pointer' }}
          >
            {['All', 'commerce_ready', 'ai_enriched', 'validated', 'flagged', 'raw'].map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? 'All Statuses' : statusConfig[st]?.label || st}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div style={{ display: 'flex', gap: 4, background: '#0F172A', padding: 4, borderRadius: 8, border: '1px solid #334155' }}>
            {(['grid', 'list'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  background: viewMode === mode ? '#334155' : 'transparent',
                  color: viewMode === mode ? '#FFFFFF' : '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                {mode === 'grid' ? <Grid size={16} /> : <List size={16} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Counter */}
      <div style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>
        Showing <strong style={{ color: '#FFFFFF' }}>{filteredProducts.length}</strong> of {products.length} products
      </div>

      {/* Grid View */}
      {filteredProducts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>No products match your filters</h3>
          <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 16 }}>Try searching for a different product or clearing filters.</p>
          <button className="btn btn-secondary" onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedStatus('All'); }}>Clear Filters</button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              StatusBadge={StatusBadge}
              onClick={() => onSelectProduct(product)}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Manufacturer & Category</th>
                <th>Status</th>
                <th>Completeness</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} onClick={() => onSelectProduct(product)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 15 }}>{product.name}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', color: '#60A5FA', fontWeight: 600 }}>{product.sku}</td>
                  <td>{product.manufacturer} · {product.category}</td>
                  <td><StatusBadge status={product.status} /></td>
                  <td style={{ fontWeight: 700, color: '#FFFFFF' }}>{product.completeness}%</td>
                  <td style={{ textAlign: 'right' }}><ChevronRight size={18} color="#94A3B8" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

function ProductCard({
  product,
  StatusBadge,
  onClick,
}: {
  product: Product;
  StatusBadge: any;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#1E293B',
        border: `1px solid ${hovered ? '#3B82F6' : '#334155'}`,
        borderRadius: 14,
        padding: 20,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 10px 25px rgba(0,0,0,0.4)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Badge & Anomaly Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StatusBadge status={product.status} />
        {product.anomalies.length > 0 && (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', padding: '3px 8px', borderRadius: 6 }}>
            {product.anomalies.length} Flag{product.anomalies.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Icon + Product Name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Package size={20} color="#60A5FA" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: hovered ? '#60A5FA' : '#FFFFFF', lineHeight: 1.35, transition: 'color 0.15s' }}>
            {product.name}
          </h3>
          <div style={{ fontSize: 13, color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, marginTop: 4 }}>
            {product.sku}
          </div>
        </div>
      </div>

      {/* Manufacturer & Category */}
      <div style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
        <span>{product.manufacturer}</span>
        <span style={{ color: '#475569' }}>·</span>
        <span style={{ color: '#94A3B8' }}>{product.category}</span>
      </div>

      {/* Completeness Bar */}
      <div style={{ paddingTop: 10, borderTop: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
          <span style={{ color: '#94A3B8' }}>Data Completeness</span>
          <span style={{ color: product.completeness >= 80 ? '#34D399' : '#FFFFFF', fontWeight: 800 }}>
            {product.completeness}%
          </span>
        </div>
        <div style={{ height: 6, background: '#0F172A', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${product.completeness}%`, background: product.completeness >= 80 ? '#10B981' : '#3B82F6', borderRadius: 3 }} />
        </div>
      </div>
    </div>
  );
}

export default CatalogGrid;
