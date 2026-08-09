import React from 'react';
import {
  LayoutDashboard,
  Database,
  Upload,
  ShieldCheck,
  Download,
  Network,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard Overview',
    icon: LayoutDashboard,
  },
  {
    id: 'ingest',
    label: 'AI Ingestion',
    icon: Upload,
    step: '1',
  },
  {
    id: 'catalog',
    label: 'Product Catalog',
    icon: Database,
    step: '2',
  },
  {
    id: 'validate',
    label: 'Human Review',
    icon: ShieldCheck,
    step: '3',
  },
  {
    id: 'knowledge',
    label: 'Knowledge Graph',
    icon: Network,
  },
  {
    id: 'export',
    label: 'Data Export',
    icon: Download,
  },
];

const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  collapsed = false,
  onToggleCollapse,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 35,
          }}
        />
      )}

      <nav
        style={{
          width: 250,
          height: '100vh',
          position: 'fixed',
          left: 0, top: 0,
          background: '#1B2433',
          borderRight: '1px solid rgba(56, 189, 248, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 40,
          transition: 'transform 0.25s ease',
          transform: collapsed
            ? 'translateX(-100%)'
            : isOpenMobile
            ? 'translateX(0)'
            : undefined,
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: '20px 18px',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38, height: 38,
                borderRadius: 10,
                background: '#3B82F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Zap size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                IntelliProduct
              </div>
              <div style={{ fontSize: 13, color: '#38BDF8', fontWeight: 700, marginTop: 1 }}>
                AI Data Platform
              </div>
            </div>
          </div>
          <button
            onClick={onToggleCollapse || onCloseMobile}
            style={{
              width: 30, height: 30,
              borderRadius: 6,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid #334155',
              color: '#94A3B8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav Items */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px 6px' }}>
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setCurrentView(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 12px',
                  borderRadius: 10,
                  width: '100%',
                  cursor: 'pointer',
                  background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(59, 130, 246, 0.4)' : 'transparent'}`,
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }
                }}
              >
                <div
                  style={{
                    width: 32, height: 32,
                    borderRadius: 8,
                    background: isActive ? '#3B82F6' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} color={isActive ? '#FFFFFF' : '#94A3B8'} />
                </div>

                <span
                  style={{
                    flex: 1,
                    fontSize: 15,
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#FFFFFF' : '#E2E8F0',
                  }}
                >
                  {item.label}
                </span>

                {item.step && (
                  <span
                    style={{
                      fontSize: 12, fontWeight: 800,
                      background: 'rgba(56, 189, 248, 0.2)',
                      color: '#38BDF8',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      padding: '3px 8px',
                      borderRadius: 6,
                    }}
                  >
                    S{item.step}
                  </span>
                )}

                {isActive && (
                  <ChevronRight size={16} color="#60A5FA" style={{ flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(56, 189, 248, 0.35)' }}>
          <div style={{ padding: '12px 14px', background: '#0B0F17', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase' }}>UniHack 2026</div>
            <div style={{ fontSize: 14, color: '#FFFFFF', marginTop: 3, fontWeight: 600 }}>Product Intelligence Platform</div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
