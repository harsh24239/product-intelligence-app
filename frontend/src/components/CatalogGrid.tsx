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
    bg: 'rgba(148, 163, 184, 0.15)',
    border: 'rgba(148, 163, 184, 0.3)',
  },
  ai_enriched: {
    label: 'AI Enriched',
    desc: 'Attributes extracted',
    color: '#38BDF8',
    bg: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.4)',
  },
  validated: {
    label: 'Human Validated',
    desc: 'Approved record',
    color: '#C084FC',
    bg: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.4)',
  },
  commerce_ready: {
    label: 'Commerce Ready',
    desc: 'Validated & ready',
    color: '#34D399',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.4)',
  },
  flagged: {
    label: 'Flagged',
    desc: 'Requires review',
    color: '#F87171',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.4)',
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 18 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-shimmer" style={{ height: 240, borderRadius: 14, border: '1px solid var(--border)' }} />
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
          padding: '6px 12px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 800,
          color: cfg.color,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          whiteSpace: 'nowrap',
        }}
      >
        {status === 'ai_enriched' && <Sparkles size={14} />}
        {status === 'flagged' && <AlertCircle size={14} />}
        {status === 'commerce_ready' && <span style={{ fontSize: 13 }}>✓</span>}
        {cfg.label}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Search and Filters Header */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', background: '#1E293B' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search SKU, product name, or manufacturer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 40, height: 42, fontSize: 14 }}
          />
        </div>

        {/* Category & Status Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ height: 42, padding: '0 14px', fontSize: 14, width: 'auto', cursor: 'pointer' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ height: 42, padding: '0 14px', fontSize: 14, width: 'auto', cursor: 'pointer' }}
          >
            {['All', 'commerce_ready', 'ai_enriched', 'validated', 'flagged', 'raw'].map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? 'All Statuses' : statusConfig[st]?.label || st}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', gap: 4, background: '#0F172A', padding: 4, borderRadius: 8, border: '1px solid #334155' }}>
            {(['grid', 'list'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  width: 34,
                  height: 34,
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

      {/* Item Counter */}
      <div style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Showing <strong style={{ color: '#FFFFFF' }}>{filteredProducts.length}</strong> of {products.length} products</span>
        <span style={{ fontSize: 12, color: '#60A5FA', fontWeight: 700 }}>Click any product to inspect extracted specs & 3D model</span>
      </div>

      {/* Grid View */}
      {filteredProducts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>No products match your filters</h3>
          <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 16 }}>Try clearing search or status filters.</p>
          <button className="btn btn-secondary" onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedStatus('All'); }}>Clear Filters</button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 18 }}>
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
                  <td style={{ fontWeight: 800, color: '#FFFFFF', fontSize: 15 }}>{product.name}</td>
                  <td style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#60A5FA', fontWeight: 700 }}>{product.sku}</td>
                  <td style={{ color: '#E2E8F0' }}>{product.manufacturer} · {product.category}</td>
                  <td><StatusBadge status={product.status} /></td>
                  <td style={{ fontWeight: 800, color: '#FFFFFF' }}>{product.completeness}%</td>
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

  // Extract top 2 key specs to showcase AI intelligence on card preview
  const specPreview = Object.entries(product.specs)
    .filter(([_, v]) => v && v !== 'N/A')
    .slice(0, 2);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#1E293B',
        border: `1px solid ${hovered ? '#60A5FA' : '#334155'}`,
        borderRadius: 16,
        padding: 22,
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 12px 30px rgba(0,0,0,0.5), 0 0 15px rgba(59,130,246,0.2)' : '0 4px 12px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Top Badge Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StatusBadge status={product.status} />
        {product.anomalies.length > 0 && (
          <span style={{ fontSize: 13, fontWeight: 800, color: '#FBBF24', background: 'rgba(245, 158, 11, 0.18)', border: '1px solid rgba(245, 158, 11, 0.45)', padding: '5px 12px', borderRadius: 8 }}>
            {product.anomalies.length} Flag{product.anomalies.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Product Name & Icon */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Package size={24} color="#60A5FA" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: hovered ? '#60A5FA' : '#FFFFFF', lineHeight: 1.35, transition: 'color 0.15s' }}>
            {product.name}
          </h3>
          <div style={{ fontSize: 15, color: '#38BDF8', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, marginTop: 4 }}>
            {product.sku}
          </div>
        </div>
      </div>

      {/* Manufacturer & Category */}
      <div style={{ fontSize: 15, color: '#E2E8F0', fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
        <span>{product.manufacturer}</span>
        <span style={{ color: '#475569' }}>·</span>
        <span style={{ color: '#38BDF8', fontWeight: 700 }}>{product.category}</span>
      </div>

      {/* AI-Extracted Specs Preview Chips */}
      {specPreview.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {specPreview.map(([key, val], idx) => (
            <span
              key={idx}
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#CBD5E1',
                background: '#0B0F17',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                padding: '6px 12px',
                borderRadius: 8,
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              {key}: <strong style={{ color: '#FFFFFF' }}>{val}</strong>
            </span>
          ))}
        </div>
      )}

      {/* Completeness Bar */}
      <div style={{ paddingTop: 14, borderTop: '1px solid rgba(56, 189, 248, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
          <span style={{ color: '#94A3B8' }}>Data Completeness</span>
          <span style={{ color: product.completeness >= 80 ? '#34D399' : '#FFFFFF', fontWeight: 800, fontSize: 17 }}>
            {product.completeness}%
          </span>
        </div>
        <div style={{ height: 8, background: '#0B0F17', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${product.completeness}%`, background: product.completeness >= 80 ? '#10B981' : '#3B82F6', borderRadius: 4, transition: 'width 0.6s ease' }} />
        </div>
      </div>

    </div>
  );
}

export default CatalogGrid;
