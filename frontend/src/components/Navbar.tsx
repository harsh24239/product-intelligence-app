import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Upload, 
  ShieldCheck, 
  Download, 
  Network, 
  Zap, 
  PanelLeftClose
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
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'catalog', label: 'Product Catalog', icon: Database },
  { id: 'ingest', label: 'Ingestion Studio', icon: Upload },
  { id: 'validate', label: 'HITL Validator', icon: ShieldCheck },
  { id: 'knowledge', label: 'Knowledge Graph', icon: Network },
  { id: 'export', label: 'Data Export', icon: Download },
];

const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  setCurrentView, 
  collapsed = false, 
  onToggleCollapse, 
  isOpenMobile, 
  onCloseMobile 
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 35,
          }}
        />
      )}

      <nav style={{
        width: 260,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: 'linear-gradient(180deg, #090e1c 0%, #0a1020 100%)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: collapsed ? 'translateX(-100%)' : (isOpenMobile ? 'translateX(0)' : undefined),
      }}>
        
        {/* Brand */}
        <div style={{
          padding: '20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 22px rgba(99,102,241,0.5)',
            }}>
              <Zap size={20} color="white" />
            </div>
            <span style={{
              fontWeight: 800,
              fontSize: 18,
              color: '#fff',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.5px',
            }}>IntelliProduct</span>
          </div>

          <button
            onClick={onToggleCollapse || onCloseMobile}
            title="Collapse Sidebar"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
              (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
            }}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Nav section label */}
        <div style={{ padding: '20px 20px 8px', flexShrink: 0 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#475569',
          }}>Navigation</span>
        </div>

        {/* Nav Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px 12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isHovered = hoveredId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 10,
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(6,182,212,0.15) 100%)'
                    : isHovered
                    ? 'rgba(255,255,255,0.06)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(6,182,212,0.4)'
                    : isHovered
                    ? '1px solid rgba(255,255,255,0.1)'
                    : '1px solid transparent',
                  borderLeft: isActive ? '3px solid #22d3ee' : isHovered ? '3px solid rgba(6,182,212,0.3)' : '3px solid transparent',
                  boxShadow: isActive ? '0 4px 20px rgba(6,182,212,0.12)' : 'none',
                  transform: isHovered && !isActive ? 'translateX(3px)' : 'translateX(0)',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  flexShrink: 0,
                  background: isActive
                    ? 'rgba(6,182,212,0.15)'
                    : isHovered
                    ? 'rgba(6,182,212,0.1)'
                    : 'rgba(255,255,255,0.04)',
                  transition: 'all 0.18s',
                }}>
                  <Icon
                    size={17}
                    color={isActive ? '#22d3ee' : isHovered ? '#67e8f9' : '#64748b'}
                  />
                </div>

                <span style={{
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : isHovered ? '#e2e8f0' : '#94a3b8',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  letterSpacing: '-0.1px',
                  transition: 'color 0.18s',
                }}>
                  {item.label}
                </span>

                {isActive && (
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#22d3ee',
                    flexShrink: 0,
                    boxShadow: '0 0 8px #22d3ee',
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: '#fff',
              flexShrink: 0,
            }}>JS</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap' }}>John Smith</div>
              <div style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>Admin</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
