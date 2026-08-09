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
    label: 'Dashboard',
    icon: LayoutDashboard,
    desc: 'Overview & live pipeline status',
  },
  {
    id: 'ingest',
    label: 'AI Ingestion',
    icon: Upload,
    desc: 'Upload docs & extract product data',
    step: '1',
  },
  {
    id: 'catalog',
    label: 'Product Catalog',
    icon: Database,
    desc: 'Browse all enriched products',
    step: '2',
  },
  {
    id: 'validate',
    label: 'Human Validation',
    icon: ShieldCheck,
    desc: 'Review AI flags & approve records',
    step: '3',
  },
  {
    id: 'knowledge',
    label: 'Knowledge Graph',
    icon: Network,
    desc: 'Visual product relationships',
  },
  {
    id: 'export',
    label: 'Export & Integrate',
    icon: Download,
    desc: 'Push to Shopify, SAP, PDF export',
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
          width: 240,
          height: '100vh',
          position: 'fixed',
          left: 0, top: 0,
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)',
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
            padding: '18px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34, height: 34,
                borderRadius: 8,
                background: 'var(--blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Zap size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>
                IntelliProduct
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                UniHack 2026 · AI Challenge
              </div>
            </div>
          </div>
          <button
            onClick={onToggleCollapse || onCloseMobile}
            style={{
              width: 28, height: 28,
              borderRadius: 6,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Demo flow hint */}
        <div
          style={{
            margin: '12px 12px 0',
            padding: '8px 12px',
            background: 'rgba(59, 130, 246, 0.06)',
            border: '1px solid var(--blue-border)',
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
            👆 Judge Quick-Start
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-sub)', lineHeight: 1.5 }}>
            Follow Steps 1→2→3 to see the full AI pipeline in action
          </div>
        </div>

        {/* Nav Items */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
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
                  gap: 10,
                  padding: '9px 10px',
                  borderRadius: 8,
                  width: '100%',
                  cursor: 'pointer',
                  background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--blue-border)' : 'transparent'}`,
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
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
                    width: 30, height: 30,
                    borderRadius: 6,
                    background: isActive ? 'var(--blue-dim)' : 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    border: isActive ? '1px solid var(--blue-border)' : '1px solid transparent',
                  }}
                >
                  <Icon size={15} color={isActive ? 'var(--blue)' : 'var(--text-muted)'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--text)' : 'var(--text-sub)',
                        transition: 'color 0.15s',
                      }}
                    >
                      {item.label}
                    </span>
                    {item.step && (
                      <span
                        style={{
                          fontSize: 9, fontWeight: 700,
                          background: 'var(--blue-dim)',
                          color: 'var(--blue)',
                          border: '1px solid var(--blue-border)',
                          padding: '1px 5px',
                          borderRadius: 4,
                        }}
                      >
                        STEP {item.step}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      marginTop: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
                {isActive && (
                  <ChevronRight size={14} color="var(--blue)" style={{ flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer — Challenge info */}
        <div
          style={{
            padding: '12px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 2 }}>
              UniHack Challenge
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              AI-Powered Product Intelligence for Industrial Commerce
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
