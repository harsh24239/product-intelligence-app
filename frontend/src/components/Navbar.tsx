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
  isDark?: boolean;
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
  onCloseMobile,
  isDark = false
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Theme-aware color parameters
  const bg = isDark ? '#090e1c' : '#ffffff';
  const borderRight = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const headerBorder = isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9';
  const titleColor = isDark ? '#ffffff' : '#0f172a';
  const sectionLabel = isDark ? '#475569' : '#94a3b8';
  const btnBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc';
  const btnBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const btnColor = isDark ? '#94a3b8' : '#64748b';
  const userBoxBg = isDark ? 'rgba(99,102,241,0.08)' : '#f8fafc';
  const userBoxBorder = isDark ? 'rgba(99,102,241,0.2)' : '#e2e8f0';
  const userNameColor = isDark ? '#e2e8f0' : '#0f172a';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
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
        background: bg,
        borderRight: `1px solid ${borderRight}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s, border-color 0.3s',
        transform: collapsed ? 'translateX(-100%)' : (isOpenMobile ? 'translateX(0)' : undefined),
        boxShadow: isDark ? 'none' : '2px 0 12px rgba(15,23,42,0.03)',
      }}>
        
        {/* Brand */}
        <div style={{
          padding: '18px 20px',
          borderBottom: `1px solid ${headerBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
            }}>
              <Zap size={20} color="white" />
            </div>
            <span style={{
              fontWeight: 800,
              fontSize: 18,
              color: titleColor,
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
              background: btnBg,
              border: `1px solid ${btnBorder}`,
              color: btnColor,
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Nav section label */}
        <div style={{ padding: '20px 20px 8px', flexShrink: 0 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: sectionLabel,
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

            let itemBg = 'transparent';
            let itemBorder = '1px solid transparent';
            let itemLeftBorder = '3px solid transparent';
            let textColor = isDark ? '#94a3b8' : '#475569';
            let iconBoxBg = isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9';
            let iconColor = isDark ? '#64748b' : '#64748b';

            if (isActive) {
              itemBg = isDark 
                ? 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(6,182,212,0.15) 100%)' 
                : 'linear-gradient(135deg, #e0e7ff 0%, #e0f2fe 100%)';
              itemBorder = isDark ? '1px solid rgba(6,182,212,0.4)' : '1px solid #c7d2fe';
              itemLeftBorder = '3px solid #4f46e5';
              textColor = isDark ? '#ffffff' : '#4f46e5';
              iconBoxBg = isDark ? 'rgba(6,182,212,0.15)' : '#ffffff';
              iconColor = '#4f46e5';
            } else if (isHovered) {
              itemBg = isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc';
              itemBorder = isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0';
              itemLeftBorder = isDark ? '3px solid rgba(6,182,212,0.3)' : '3px solid #cbd5e1';
              textColor = isDark ? '#e2e8f0' : '#0f172a';
              iconColor = isDark ? '#67e8f9' : '#0284c7';
            }

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
                  background: itemBg,
                  border: itemBorder,
                  borderLeft: itemLeftBorder,
                  boxShadow: isActive && !isDark ? '0 2px 8px rgba(79,70,229,0.12)' : 'none',
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
                  background: iconBoxBg,
                  transition: 'all 0.18s',
                }}>
                  <Icon size={17} color={iconColor} />
                </div>

                <span style={{
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 600,
                  color: textColor,
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
                    background: '#4f46e5',
                    flexShrink: 0,
                    boxShadow: '0 0 8px rgba(79,70,229,0.5)',
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: `1px solid ${headerBorder}`,
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            background: userBoxBg,
            border: `1px solid ${userBoxBorder}`,
          }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #4f46e5, #0284c7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: '#fff',
              flexShrink: 0,
            }}>JS</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: userNameColor, whiteSpace: 'nowrap' }}>John Smith</div>
              <div style={{ fontSize: 11, color: sectionLabel, whiteSpace: 'nowrap' }}>Admin</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
