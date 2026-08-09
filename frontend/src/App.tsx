import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MetricsOverview from './components/MetricsOverview';
import CatalogGrid from './components/CatalogGrid';
import ProductDetailView from './components/ProductDetailView';
import IngestionStudio from './components/IngestionStudio';
import DataExportStudio from './components/DataExportStudio';
import KnowledgeGraphViewer from './components/KnowledgeGraphViewer';
import AnomalyFlagsPanel from './components/AnomalyFlagsPanel';
import PipelineHero from './components/PipelineHero';
import { Product, CatalogMetrics } from './types/product';
import { api } from './services/api';
import { Menu, Search, Bell, PanelLeftOpen } from 'lucide-react';

type View = 'dashboard' | 'catalog' | 'ingest' | 'validate' | 'export' | 'knowledge';

const SIDEBAR_WIDTH = 250;
const HEADER_HEIGHT = 60;

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<CatalogMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedMetrics] = await Promise.all([
          api.getCatalog(),
          api.getMetrics(),
        ]);
        setProducts(fetchedProducts);
        setMetrics(fetchedMetrics);
      } catch {
        generateMockData();
      }
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  const generateMockData = () => {
    const categories = ['Motors & Drives', 'Sensors & Controls', 'Hydraulics', 'Pneumatics'];
    const manufacturers = ['Parker Hannifin', 'Bosch Rexroth', 'Siemens', 'ABB', 'Schneider Electric'];
    const statuses: Array<Product['status']> = ['commerce_ready', 'ai_enriched', 'validated', 'flagged', 'raw'];

    const mockProducts: Product[] = Array.from({ length: 16 }).map((_, i) => ({
      id: `prod-${i}`,
      name: [
        'Industrial Servo Motor MX-1000',
        'Hydraulic Pressure Relief Valve V-2200',
        'Proximity Sensor PS-400 Series',
        'AC Motor Drive VFD-750',
        'Pneumatic Cylinder PCP-150',
        'Digital Pressure Transmitter DPT-3000',
        'Gearbox GB-220 Helical Series',
        'Power Supply Module PSM-24V',
      ][i % 8],
      sku: `SKU-${String(1000 + i).padStart(4, '0')}`,
      manufacturer: manufacturers[i % manufacturers.length],
      status: statuses[i % statuses.length],
      category: categories[i % categories.length],
      completeness: Math.min(98, 60 + i * 3),
      lastUpdated: new Date(Date.now() - i * 3600000).toISOString(),
      specs: {
        material: i % 3 === 0 ? 'Cast Iron' : 'Aluminum Alloy',
        dimensions: `${120 + i * 5}x${100 + i * 3}x${200 + i * 8}mm`,
        weight: `${3 + i * 0.5}kg`,
        color: null,
        voltage: i % 2 === 0 ? '400V AC' : '24V DC',
        ipRating: i % 3 === 0 ? 'IP65' : i % 3 === 1 ? 'IP54' : 'IP67',
        certification: 'CE, UL',
      },
      attributes: [
        {
          key: 'voltage',
          value: i % 2 === 0 ? '400V AC' : '24V DC',
          confidence: 0.95,
          source: 'datasheet.pdf',
          sourceQuote: 'Operating voltage: 400V AC three-phase',
          enrichedBy: 'llm_extraction',
          flagged: false,
        },
        {
          key: 'ipRating',
          value: 'IP65',
          confidence: 0.88,
          source: 'manual.pdf',
          sourceQuote: 'Enclosure protection rating: IP65 (dust-tight, water-jet resistant)',
          enrichedBy: 'llm_extraction',
          flagged: false,
        },
        {
          key: 'maxTorque',
          value: '15 Nm',
          confidence: 0.45,
          source: 'catalog.pdf',
          sourceQuote: 'Peak torque approximately 15-20Nm',
          enrichedBy: 'rag_enrichment',
          flagged: i % 5 === 0,
          flagReason: 'Ambiguous range detected — needs clarification',
        },
      ],
      anomalies:
        i % 5 === 0
          ? [
              {
                field: 'maxTorque',
                issue:
                  'Extracted value of 15 Nm is ambiguous (source says "15-20Nm"). Median value used. Please verify against nameplate data.',
                severity: 'medium' as const,
                resolved: false,
              },
            ]
          : [],
      auditLog: [
        {
          timestamp: new Date(Date.now() - i * 3600000).toISOString(),
          actor: 'Extraction Agent (Gemini 1.5)',
          action: 'Document Ingested',
          details: `Parsed datasheet.pdf — extracted ${8 + i} product attributes with avg confidence 88%`,
        },
        {
          timestamp: new Date(Date.now() - i * 3600000 + 2000).toISOString(),
          actor: 'Enrichment Agent (RAG)',
          action: 'Schema Enrichment Applied',
          details: 'Normalized voltage units, filled missing IP rating via similar product lookup',
        },
        {
          timestamp: new Date(Date.now() - i * 3600000 + 4000).toISOString(),
          actor: 'Compliance Guard Agent',
          action: 'ISO Validation Passed',
          details: 'Checked against IEC 60034-30-1 and ISO 9001 baselines. No critical violations.',
        },
      ],
    }));

    setProducts(mockProducts);
    setMetrics({
      totalProducts: 12450,
      byCategory: {
        'Motors & Drives': 4500,
        'Sensors & Controls': 3200,
        Hydraulics: 2500,
        Pneumatics: 2250,
      },
      commerceReadyPercent: 68,
      averageCompleteness: 82,
      anomaliesDetected: 142,
      anomaliesBySeverity: { high: 12, medium: 45, low: 85 },
      dataHealthScore: 88,
      pipelineStatus: 'idle',
    });
  };

  const handleSelectProduct = (product: Product) => setSelectedProduct(product);
  const handleBackToCatalog = () => setSelectedProduct(null);

  const navigateTo = (view: View) => {
    setCurrentView(view);
    setSelectedProduct(null);
  };

  const renderContent = () => {
    if (selectedProduct) {
      return <ProductDetailView product={selectedProduct} onBack={handleBackToCatalog} />;
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Pipeline Hero — the "what is this?" section */}
            <PipelineHero onStartDemo={() => navigateTo('ingest')} />

            {/* KPI Metrics */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#FFFFFF',
                  }}
                >
                  Live Catalog Metrics
                </span>
                <div
                  style={{
                    width: 6, height: 6,
                    borderRadius: '50%',
                    background: 'var(--green)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live</span>
              </div>
              <MetricsOverview metrics={metrics} loading={loading} />
            </div>

            {/* Dashboard panels */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                gap: 16,
              }}
            >
              {/* Anomaly panel */}
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#FFFFFF',
                    marginBottom: 12,
                  }}
                >
                  Active Anomalies — Items Needing Human Review
                </div>
                <AnomalyFlagsPanel
                  onSelectProduct={(id) => {
                    const p = products.find((prod) => prod.id === id);
                    if (p) handleSelectProduct(p);
                  }}
                />
              </div>

              {/* Live AI stream */}
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#FFFFFF',
                    marginBottom: 12,
                  }}
                >
                  AI Extraction Stream — Recent Pipeline Events
                </div>
                <div
                  className="card"
                  style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12, background: '#1E293B', borderRadius: 16 }}
                >
                  {[
                    {
                      time: 'just now',
                      tag: 'OCR PARSED',
                      msg: 'Parsed 42 pages from Supplier_Catalog_Q3.pdf',
                      sub: 'Extracted 128 attributes across 6 product lines with Gemini VLM',
                      color: '#38BDF8',
                      bg: 'rgba(56, 189, 248, 0.1)',
                      border: 'rgba(56, 189, 248, 0.3)',
                    },
                    {
                      time: '17s ago',
                      tag: 'RAG ENRICHED',
                      msg: 'AI RAG Enrichment: 12 missing specs filled',
                      sub: 'Inferred missing IP rating & insulation class from Knowledge Graph lookup',
                      color: '#34D399',
                      bg: 'rgba(52, 211, 153, 0.1)',
                      border: 'rgba(52, 211, 153, 0.3)',
                    },
                    {
                      time: '41s ago',
                      tag: 'FLAGGED',
                      msg: 'Anomaly Flagged: MX-1002 Torque mismatch',
                      sub: 'Value 150 Nm exceeds family average 14.2 Nm — queued for review',
                      color: '#FBBF24',
                      bg: 'rgba(251, 191, 36, 0.1)',
                      border: 'rgba(251, 191, 36, 0.3)',
                    },
                    {
                      time: '66s ago',
                      tag: 'COMPLIANCE',
                      msg: 'ISO 60034-30-1 check passed for 8 motors',
                      sub: 'Knowledge Graph verified energy efficiency IE3/IE4 compliance',
                      color: '#818CF8',
                      bg: 'rgba(129, 140, 248, 0.1)',
                      border: 'rgba(129, 140, 248, 0.3)',
                    },
                  ].map((log, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        padding: '14px 16px',
                        borderRadius: 10,
                        background: '#0D1117',
                        border: '1px solid #30363D',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: log.color, background: log.bg, border: `1px solid ${log.border}`, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {log.tag}
                        </span>
                        <span style={{ fontSize: 12, color: '#8B949E', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                          {log.time}
                        </span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#F0F6FC', marginTop: 2 }}>
                        {log.msg}
                      </div>
                      <div style={{ fontSize: 13, color: '#C9D1D9', lineHeight: 1.5 }}>
                        {log.sub}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick action cards */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  marginBottom: 12,
                }}
              >
              Start Here — Try the AI Pipeline
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                {[
                  {
                    view: 'ingest' as View,
                    label: 'Step 1: Upload & Extract',
                    desc: 'Upload a product PDF or spec sheet',
                    color: 'var(--blue)',
                    bg: 'var(--blue-dim)',
                    border: 'var(--blue-border)',
                  },
                  {
                    view: 'catalog' as View,
                    label: 'Step 2: Browse Catalog',
                    desc: 'View AI-enriched product records',
                    color: '#8B5CF6',
                    bg: 'var(--violet-dim)',
                    border: 'var(--violet-border)',
                  },
                  {
                    view: 'validate' as View,
                    label: 'Step 3: Human Validation',
                    desc: 'Review anomalies and approve records',
                    color: 'var(--amber)',
                    bg: 'var(--amber-dim)',
                    border: 'var(--amber-border)',
                  },
                  {
                    view: 'knowledge' as View,
                    label: 'Knowledge Graph',
                    desc: 'Visual product & standard relationships',
                    color: 'var(--green)',
                    bg: 'var(--green-dim)',
                    border: 'var(--green-border)',
                  },
                ].map((action) => (
                  <button
                    key={action.view}
                    onClick={() => navigateTo(action.view)}
                    style={{
                      background: action.bg,
                      border: `1px solid ${action.border}`,
                      borderRadius: 10,
                      padding: '14px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: action.color, marginBottom: 4 }}>
                      {action.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{action.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'catalog':
      case 'validate':
        return (
          <div className="animate-fade-in-up">
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                {currentView === 'validate'
                  ? 'Human Validation Queue — Step 3 of 3'
                  : 'Product Catalog — Step 2 of 3'}
              </h2>
              {currentView === 'validate' && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Showing products with AI anomaly flags or low completeness scores that require human review before publishing.
                </p>
              )}
            </div>
            <CatalogGrid
              products={
                currentView === 'validate'
                  ? products.filter((p) => p.status === 'flagged' || p.completeness < 80)
                  : products
              }
              loading={loading}
              onSelectProduct={handleSelectProduct}
            />
          </div>
        );

      case 'ingest':
        return <IngestionStudio onExtractSuccess={() => navigateTo('catalog')} />;

      case 'export':
        return <DataExportStudio />;

      case 'knowledge':
        return <KnowledgeGraphViewer />;

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Top header */}
      <header
        style={{
          height: HEADER_HEIGHT,
          position: 'fixed',
          top: 0,
          left: sidebarCollapsed ? 0 : SIDEBAR_WIDTH,
          right: 0,
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          gap: 16,
          transition: 'left 0.25s ease',
        }}
      >
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <button
            id="btn-toggle-sidebar"
            onClick={() => {
              if (window.innerWidth < 768) {
                setSidebarOpenMobile(true);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34, borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={17} />
            ) : (
              <Menu size={17} />
            )}
          </button>

          <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
            <Search
              size={13}
              color="var(--text-muted)"
              style={{
                position: 'absolute', left: 10, top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              id="global-search"
              placeholder="Search products, SKUs, attributes..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              style={{ paddingLeft: 32, height: 34, fontSize: 12 }}
            />
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Live status */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px',
              background: 'var(--green-dim)',
              border: '1px solid var(--green-border)',
              borderRadius: 6,
              fontSize: 11, fontWeight: 600, color: 'var(--green)',
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />
            AI Pipeline Ready
          </div>

          <button
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34, borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <Bell size={16} />
            <span
              style={{
                position: 'absolute', top: 8, right: 8,
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--amber)',
              }}
            />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          navigateTo(view);
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isOpenMobile={sidebarOpenMobile}
        onCloseMobile={() => setSidebarOpenMobile(false)}
      />

      {/* Main content */}
      <main
        style={{
          marginLeft: sidebarCollapsed ? 0 : SIDEBAR_WIDTH,
          marginTop: HEADER_HEIGHT,
          flex: 1,
          padding: '28px 28px',
          minWidth: 0,
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          transition: 'margin-left 0.25s ease',
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
