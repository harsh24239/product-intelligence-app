import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MetricsOverview from './components/MetricsOverview';
import CatalogGrid from './components/CatalogGrid';
import ProductDetailView from './components/ProductDetailView';
import IngestionStudio from './components/IngestionStudio';
import DataExportStudio from './components/DataExportStudio';
import KnowledgeGraphViewer from './components/KnowledgeGraphViewer';
import AnomalyFlagsPanel from './components/AnomalyFlagsPanel';
import { Product, CatalogMetrics } from './types/product';
import { api } from './services/api';
import { Menu, Search, Bell, Terminal, CheckCircle2, PanelLeftOpen, Sun, Moon } from 'lucide-react';

type View = 'dashboard' | 'catalog' | 'ingest' | 'validate' | 'export' | 'knowledge';

const SIDEBAR_WIDTH = 260;
const HEADER_HEIGHT = 64;

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<CatalogMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Theme state: defaults to false (Crisp Light Mode - easy on eyes!)
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Apply body theme class
    if (isDark) {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    } else {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
  }, [isDark]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedMetrics] = await Promise.all([
          api.getCatalog(),
          api.getMetrics()
        ]);
        setProducts(fetchedProducts);
        setMetrics(fetchedMetrics);
      } catch (err) {
        generateMockData();
      }
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  const generateMockData = () => {
    const mockProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
      id: `prod-${i}`,
      name: `Industrial Servo Motor MX-${1000 + i}`,
      sku: `MX-${1000 + i}-V2`,
      manufacturer: 'RoboDrives Inc',
      status: i % 3 === 0 ? 'commerce_ready' : i % 5 === 0 ? 'flagged' : 'ai_enriched',
      category: 'Motors & Drives',
      completeness: 75 + (i * 2),
      lastUpdated: new Date().toISOString(),
      specs: {
        material: 'Aluminum Alloy',
        dimensions: '120x120x250mm',
        weight: '4.5kg',
        color: null,
        voltage: '400V',
        ipRating: 'IP65',
        certification: 'CE, UL'
      },
      attributes: [
        { key: 'voltage', value: '400V', confidence: 0.95, source: 'spec_sheet.pdf', sourceQuote: 'Operating voltage: 400V AC', enrichedBy: 'llm_extraction', flagged: false },
        { key: 'ipRating', value: 'IP65', confidence: 0.88, source: 'manual.txt', sourceQuote: 'Enclosure rating IP65 dust/water', enrichedBy: 'llm_extraction', flagged: false },
        { key: 'maxTorque', value: '15 Nm', confidence: 0.45, source: 'catalog.pdf', sourceQuote: 'Peak torque approx 15-20Nm', enrichedBy: 'rag_enrichment', flagged: true, flagReason: 'Ambiguous range detected' },
      ],
      anomalies: i % 5 === 0 ? [{ field: 'maxTorque', issue: 'Value conflicts with manufacturer baseline', severity: 'medium', resolved: false }] : [],
      auditLog: [
        { timestamp: new Date().toISOString(), actor: 'System', action: 'Ingested Document', details: 'Extracted from spec_sheet.pdf' }
      ]
    }));
    setProducts(mockProducts);
    setMetrics({
      totalProducts: 12450,
      byCategory: { 'Motors': 4500, 'Sensors': 3200, 'Controllers': 4750 },
      commerceReadyPercent: 68,
      averageCompleteness: 82,
      anomaliesDetected: 142,
      anomaliesBySeverity: { high: 12, medium: 45, low: 85 },
      dataHealthScore: 88,
      pipelineStatus: 'idle'
    });
  };

  const handleSelectProduct = (product: Product) => setSelectedProduct(product);
  const handleBackToCatalog = () => setSelectedProduct(null);

  const sidebarLeft = sidebarCollapsed ? 0 : SIDEBAR_WIDTH;

  // Theme-aware styles for App layout
  const headerBg = isDark ? 'rgba(8,13,26,0.92)' : 'rgba(255,255,255,0.92)';
  const headerBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const iconBtnBg = isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc';
  const iconBtnBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const iconBtnColor = isDark ? '#94a3b8' : '#64748b';
  const searchBg = isDark ? 'rgba(15,23,42,0.8)' : '#f8fafc';
  const searchBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const searchTextColor = isDark ? '#e2e8f0' : '#0f172a';
  const headingColor = isDark ? '#ffffff' : '#0f172a';
  const subtextColor = isDark ? '#64748b' : '#64748b';
  const liveCardBg = isDark ? 'linear-gradient(145deg, rgba(30,41,59,0.65) 0%, rgba(15,23,42,0.85) 100%)' : '#ffffff';
  const logBoxBg = isDark ? 'rgba(15,23,42,0.6)' : '#f8fafc';
  const logBoxBorder = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const logTextColor = isDark ? '#cbd5e1' : '#334155';

  const renderContent = () => {
    if (selectedProduct) {
      return <ProductDetailView product={selectedProduct} onBack={handleBackToCatalog} />;
    }
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="animate-fade-in-up">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: headingColor, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  Product Intelligence Platform
                  <span className="badge badge-commerce_ready">
                    <CheckCircle2 size={11} /> Active
                  </span>
                </h1>
                <p style={{ fontSize: 14, fontWeight: 500, color: subtextColor, marginTop: 4 }}>AI-powered catalog enrichment and validation pipeline</p>
              </div>
            </div>

            <MetricsOverview metrics={metrics} loading={loading} isDark={isDark} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginTop: 32 }}>
              <AnomalyFlagsPanel onSelectProduct={(id) => {
                const p = products.find(prod => prod.id === id);
                if (p) handleSelectProduct(p);
              }} isDark={isDark} />
              
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', background: liveCardBg, border: `1px solid ${headerBorder}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: isDark ? 'rgba(6,182,212,0.15)' : '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Terminal size={16} color={isDark ? "#22d3ee" : "#0284c7"} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: headingColor }}>Live AI Extraction Stream</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { time: '17:42:01', msg: 'Parsed 42 pages from Supplier_Catalog_Q3.pdf', type: 'info' },
                    { time: '17:41:44', msg: 'Extracted 128 specs with high confidence', type: 'success' },
                    { time: '17:41:20', msg: 'Flagged anomaly on SKU: MX-1002 (Torque mismatch)', type: 'warning' },
                    { time: '17:40:55', msg: 'Knowledge Graph node mapped to ISO 60034-30-1', type: 'info' }
                  ].map((log, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: logBoxBg,
                      border: `1px solid ${logBoxBorder}`,
                    }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0, fontWeight: 600 }}>{log.time}</span>
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                        background: log.type === 'success' ? '#059669' : log.type === 'warning' ? '#d97706' : '#0284c7',
                      }} />
                      <p style={{ fontSize: 12, fontWeight: 600, color: logTextColor, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'catalog':
      case 'validate':
        return (
          <div className="animate-fade-in-up">
            <h1 style={{ fontSize: 24, fontWeight: 800, color: headingColor, marginBottom: 24, letterSpacing: '-0.5px' }}>
              {currentView === 'validate' ? 'Human-in-the-Loop Validation Studio' : 'Product Intelligence Catalog'}
            </h1>
            <CatalogGrid
              products={currentView === 'validate' ? products.filter(p => p.status === 'flagged' || p.completeness < 80) : products}
              loading={loading}
              onSelectProduct={handleSelectProduct}
              isDark={isDark}
            />
          </div>
        );
      case 'ingest':
        return <IngestionStudio onExtractSuccess={() => setCurrentView('catalog')} />;
      case 'export':
        return <DataExportStudio />;
      case 'knowledge':
        return <KnowledgeGraphViewer />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative' }}>
      {/* Top Header */}
      <header style={{
        height: HEADER_HEIGHT,
        position: 'fixed',
        top: 0,
        left: sidebarLeft,
        right: 0,
        background: headerBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${headerBorder}`,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        gap: 16,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s, border-color 0.3s',
        boxShadow: isDark ? 'none' : '0 1px 3px rgba(15,23,42,0.04)',
      }}>
        {/* Left: Toggle + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setSidebarOpenMobile(true);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 38, height: 38,
              borderRadius: 10,
              background: iconBtnBg,
              border: `1px solid ${iconBtnBorder}`,
              color: iconBtnColor,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={19} color={iconBtnColor} /> : <Menu size={19} color={iconBtnColor} />}
          </button>

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: 420 }}>
            <Search size={15} color={isDark ? "#475569" : "#94a3b8"} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search SKUs, products, attributes..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              style={{
                width: '100%',
                height: 38,
                background: searchBg,
                border: `1px solid ${searchBorder}`,
                borderRadius: 10,
                paddingLeft: 38,
                paddingRight: 14,
                fontSize: 13,
                color: searchTextColor,
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#4f46e5')}
              onBlur={e => (e.target.style.borderColor = searchBorder)}
            />
          </div>
        </div>

        {/* Right: Theme Toggle + Bell + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              height: 38, padding: '0 12px',
              borderRadius: 10,
              background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
              border: `1px solid ${iconBtnBorder}`,
              color: isDark ? '#fbbf24' : '#4f46e5',
              cursor: 'pointer',
              fontSize: 12, fontWeight: 700,
              transition: 'all 0.2s',
            }}
          >
            {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#4f46e5" />}
            <span style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
              {isDark ? 'Dark' : 'Light'}
            </span>
          </button>

          <button style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38,
            borderRadius: 10,
            background: iconBtnBg,
            border: `1px solid ${iconBtnBorder}`,
            cursor: 'pointer',
          }}>
            <Bell size={18} color={iconBtnColor} />
            <span style={{
              position: 'absolute', top: 8, right: 8,
              width: 7, height: 7,
              borderRadius: '50%',
              background: '#0284c7',
            }} />
          </button>

          <div style={{
            width: 38, height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #4f46e5, #0284c7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: '#fff',
            boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
            cursor: 'pointer',
          }}>JS</div>
        </div>
      </header>

      {/* Sidebar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setSelectedProduct(null);
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isOpenMobile={sidebarOpenMobile}
        onCloseMobile={() => setSidebarOpenMobile(false)}
        isDark={isDark}
      />

      {/* Main Content */}
      <main style={{
        marginLeft: sidebarCollapsed ? 0 : SIDEBAR_WIDTH,
        marginTop: HEADER_HEIGHT,
        flex: 1,
        padding: '32px 32px',
        minWidth: 0,
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
