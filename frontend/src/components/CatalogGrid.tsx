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
    desc: 'Not yet processed by AI',
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.1)',
    border: 'rgba(148,163,184,0.25)',
  },
  ai_enriched: {
    label: 'AI Enriched',
    desc: 'AI has extracted and structured attributes',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.1)',
    border: 'rgba(6,182,212,0.25)',
  },
  validated: {
    label: 'Human Validated',
    desc: 'Reviewed and approved by a human expert',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.25)',
  },
  commerce_ready: {
    label: 'Commerce Ready',
    desc: 'Fully enriched, validated — ready to publish',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.25)',
  },
  flagged: {
    label: 'Flagged',
    desc: 'AI detected anomalies requiring review',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.25)',
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="animate-shimmer"
            style={{ height: 180, borderRadius: 10, border: '1px solid var(--border)' }}
          />
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
          gap: 4,
          padding: '3px 8px',
          borderRadius: 5,
          fontSize: 10,
          fontWeight: 600,
          color: cfg.color,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          whiteSpace: 'nowrap',
          cursor: 'default',
        }}
      >
        {status === 'ai_enriched' && <Sparkles size={9} />}
        {status === 'flagged' && <AlertCircle size={9} />}
        {status === 'commerce_ready' && <span style={{ fontSize: 9 }}>✓</span>}
        {cfg.label}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Section description + Status Legend */}
      <div
        style={{
          padding: '14px 16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
        }}
      >
        <div style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.5, marginBottom: 12 }}>
          <strong style={{ color: 'var(--text)' }}>AI-Enriched Product Catalog</strong> — Every product below was processed by the multi-agent AI pipeline: extracted from source documents, attribute-normalized, validated against ISO standards, and anomaly-checked. Click any card to see the full extraction detail, confidence scores, and 3D model.
        </div>
        {/* Status legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 4 }}>Status Legend:</span>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <span key={key} title={cfg.desc} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 5, fontSize: 10, fontWeight: 600, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, cursor: 'default' }}>
              {cfg.label} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 9 }}>— {cfg.desc}</span>
            </span>
          ))}
        </div>
      </div>


      {/* Filters toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
          background: 'var(--bg-card)',
          padding: '10px 14px',
          borderRadius: 10,
          border: '1px solid var(--border)',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search
            size={14}
            color="var(--text-muted)"
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search SKU, product name, or manufacturer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 32, height: 34, fontSize: 12 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ height: 34, padding: '0 10px', fontSize: 12, width: 'auto', cursor: 'pointer' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} style={{ background: 'var(--bg-card)' }}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ height: 34, padding: '0 10px', fontSize: 12, width: 'auto', cursor: 'pointer' }}
          >
            {['All', 'commerce_ready', 'ai_enriched', 'validated', 'flagged', 'raw'].map(
              (st) => (
                <option key={st} value={st} style={{ background: 'var(--bg-card)' }}>
                  {st === 'All'
                    ? 'All Statuses'
                    : statusConfig[st]?.label || st}
                </option>
              )
            )}
          </select>

          <div
            style={{
              display: 'flex',
              gap: 2,
              background: 'var(--bg)',
              padding: 3,
              borderRadius: 7,
              border: '1px solid var(--border)',
            }}
          >
            {(['grid', 'list'] as const).map((mode) => (
              <button
                key={mode}
                title={mode === 'grid' ? 'Card view' : 'Table view'}
                onClick={() => setViewMode(mode)}
                style={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  background:
                    viewMode === mode ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: viewMode === mode ? 'var(--text)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {mode === 'grid' ? <Grid size={14} /> : <List size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Count */}
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: -4 }}>
        Showing <strong style={{ color: 'var(--text)' }}>{filteredProducts.length}</strong> of{' '}
        {products.length} products
      </p>

      {/* Empty state */}
      {filteredProducts.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '48px 24px' }}
        >
          <Search
            size={36}
            color="var(--text-muted)"
            style={{ margin: '0 auto 12px' }}
          />
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
            No products match your search
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            Try clearing filters or search for a different SKU.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: 12,
          }}
        >
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
        <div
          style={{
            borderRadius: 10,
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  {[
                    'Product Name',
                    'SKU',
                    'Manufacturer',
                    'Status',
                    'Data Completeness',
                    '',
                  ].map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, rowIdx) => (
                  <tr
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    style={{
                      cursor: 'pointer',
                      background:
                        rowIdx % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        'rgba(59,130,246,0.04)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        rowIdx % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent';
                    }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 6,
                            background: 'var(--blue-dim)',
                            border: '1px solid var(--blue-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 700,
                            color: 'var(--blue)',
                            flexShrink: 0,
                          }}
                        >
                          {product.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: 'var(--text)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 200,
                            }}
                          >
                            {product.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {product.anomalies.length > 0
                              ? `${product.anomalies.length} anomaly flag${product.anomalies.length > 1 ? 's' : ''}`
                              : 'No issues'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 11,
                          color: 'var(--blue)',
                          fontWeight: 600,
                        }}
                      >
                        {product.sku}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-sub)' }}>{product.manufacturer}</td>
                    <td>
                      <StatusBadge status={product.status} />
                    </td>
                    <td style={{ minWidth: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            flex: 1,
                            height: 4,
                            background: 'var(--bg)',
                            borderRadius: 2,
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${product.completeness}%`,
                              background:
                                product.completeness >= 80 ? '#10B981' : 'var(--blue)',
                              borderRadius: 2,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: 'var(--text)',
                            minWidth: 32,
                          }}
                        >
                          {product.completeness}%
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <ChevronRight size={15} color="var(--text-muted)" />
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
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--blue-border)' : 'var(--border)'}`,
        borderRadius: 10,
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 12,
      }}
    >
      {/* Status + issues */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StatusBadge status={product.status} />
        {product.anomalies.length > 0 && (
          <span
            title={`${product.anomalies.length} AI-flagged data issue(s) need review`}
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--amber)',
              background: 'var(--amber-dim)',
              border: '1px solid var(--amber-border)',
              padding: '2px 7px',
              borderRadius: 4,
              cursor: 'default',
            }}
          >
            {product.anomalies.length} Issue{product.anomalies.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Icon + name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'var(--blue-dim)',
            border: '1px solid var(--blue-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Package size={16} color="var(--blue)" />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: hovered ? 'var(--blue)' : 'var(--text)',
              lineHeight: 1.4,
              transition: 'color 0.15s',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
            }}
          >
            {product.name}
          </h3>
          <p
            style={{
              fontSize: 10,
              color: 'var(--text-muted)',
              fontFamily: 'JetBrains Mono, monospace',
              marginTop: 2,
            }}
          >
            {product.sku}
          </p>
        </div>
      </div>

      {/* Manufacturer + category */}
      <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span>{product.manufacturer}</span>
        <span>·</span>
        <span>{product.category}</span>
      </div>

      {/* Completeness bar */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            fontWeight: 600,
            marginBottom: 5,
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>
            Data Completeness
            <span
              style={{
                marginLeft: 5,
                fontSize: 9,
                color: 'var(--text-muted)',
                fontWeight: 400,
              }}
            >
              (% of fields extracted)
            </span>
          </span>
          <span
            style={{
              color: product.completeness >= 80 ? 'var(--green)' : 'var(--text)',
              fontWeight: 700,
            }}
          >
            {product.completeness}%
          </span>
        </div>
        <div
          style={{
            height: 4,
            background: 'var(--bg)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${product.completeness}%`,
              background: product.completeness >= 80 ? '#10B981' : 'var(--blue)',
              borderRadius: 2,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CatalogGrid;
