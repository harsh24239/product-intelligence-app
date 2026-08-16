import React from 'react';
import { CatalogMetrics } from '../types/product';
import { Package, CheckCircle2, AlertTriangle, Activity, Cpu, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface MetricsOverviewProps {
  metrics: CatalogMetrics | null;
  loading: boolean;
}

const analyticsData = [
  { day: 'Mon', total: 8400, ready: 4800 },
  { day: 'Tue', total: 9200, ready: 5600 },
  { day: 'Wed', total: 10100, ready: 6700 },
  { day: 'Thu', total: 11000, ready: 7900 },
  { day: 'Fri', total: 11800, ready: 8600 },
  { day: 'Sat', total: 12100, ready: 9100 },
  { day: 'Sun', total: 12450, ready: 9500 },
];

const categoryChartData = [
  { name: 'Abrasives', count: 280, color: '#818CF8' },
  { name: 'Appliances', count: 210, color: '#38BDF8' },
  { name: 'Building', count: 340, color: '#34D399' },
  { name: 'Doors & Windows', count: 170, color: '#FBBF24' },
];

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics, loading }) => {
  if (loading || !metrics) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-shimmer" style={{ height: 120, borderRadius: 14, border: '1px solid var(--border)' }} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Products Ingested',
      value: (metrics.totalProducts ?? 12450).toLocaleString(),
      sub: `${Object.keys(metrics.byCategory || {}).length} categories`,
      trend: '+14.2%',
      trendUp: true,
      icon: Package,
      accentColor: '#818CF8',
      gradientStop: 'rgba(129, 140, 248, 0.12)',
    },
    {
      title: 'Commerce Ready Rate',
      value: `${metrics.commerceReadyPercent ?? 94}%`,
      sub: 'ISO validated records',
      trend: '+5.8%',
      trendUp: true,
      barValue: metrics.commerceReadyPercent ?? 94,
      barColor: '#34D399',
      icon: CheckCircle2,
      accentColor: '#34D399',
      gradientStop: 'rgba(52, 211, 153, 0.12)',
    },
    {
      title: 'Avg Completeness',
      value: `${metrics.averageCompleteness ?? 88}%`,
      sub: 'Target: >85% accuracy',
      trend: (metrics.averageCompleteness ?? 88) >= 85 ? 'On target' : 'Below target',
      trendUp: (metrics.averageCompleteness ?? 88) >= 85,
      barValue: metrics.averageCompleteness ?? 88,
      barColor: '#A78BFA',
      icon: Activity,
      accentColor: '#A78BFA',
      gradientStop: 'rgba(167, 139, 250, 0.12)',
    },
    {
      title: 'Anomalies Flagged',
      value: (metrics.anomaliesDetected ?? 142).toLocaleString(),
      sub: `${metrics.anomaliesBySeverity?.high ?? 24} high priority`,
      trend: 'Review queued',
      trendUp: false,
      icon: AlertTriangle,
      accentColor: '#FBBF24',
      gradientStop: 'rgba(251, 191, 36, 0.12)',
    },
    {
      title: 'Pipeline Status',
      value: metrics.pipelineStatus === 'running' ? 'Running' : 'Ready',
      sub: 'Cleanse → Extract → Export',
      trend: 'All systems go',
      trendUp: true,
      icon: Cpu,
      accentColor: '#38BDF8',
      gradientStop: 'rgba(56, 189, 248, 0.12)',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Top KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              style={{
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(145deg, ${card.gradientStop} 0%, rgba(9, 13, 21, 0.8) 100%)`,
                border: `1px solid ${card.accentColor}25`,
                borderRadius: 16,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLDivElement).style.borderColor = `${card.accentColor}55`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 28px rgba(0,0,0,0.3)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.borderColor = `${card.accentColor}25`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              {/* Top accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${card.accentColor}, transparent)`, borderRadius: '16px 16px 0 0' }} />

              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: card.accentColor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{card.title}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px', lineHeight: 1 }}>{card.value}</div>
                </div>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: `${card.accentColor}15`,
                  border: `1px solid ${card.accentColor}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={card.accentColor} />
                </div>
              </div>

              {/* Progress bar */}
              {card.barValue !== undefined && (
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${card.barValue}%`, background: card.barColor || card.accentColor, borderRadius: 2, transition: 'width 0.8s ease' }} />
                </div>
              )}

              {/* Footer row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{card.sub}</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  fontSize: 11, fontWeight: 700,
                  color: card.trendUp ? '#34D399' : '#FBBF24',
                  background: card.trendUp ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
                  border: `1px solid ${card.trendUp ? 'rgba(52,211,153,0.25)' : 'rgba(251,191,36,0.25)'}`,
                  padding: '2px 7px', borderRadius: 5,
                }}>
                  {card.trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {card.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>

        {/* Area Chart */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(145deg, rgba(19, 31, 50, 0.8) 0%, rgba(9, 13, 21, 0.9) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>Catalog Enrichment Progress</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Product ingestion vs. commerce-ready (7-day trend)</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#38BDF8', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', padding: '3px 8px', borderRadius: 6 }}>7-Day</span>
          </div>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradReady" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#334155" tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#334155" tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#131F32', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 10, color: '#FFF', fontSize: 12 }} />
                <Area type="monotone" dataKey="total" stroke="#818CF8" strokeWidth={2} fillOpacity={1} fill="url(#gradTotal)" name="Ingested" />
                <Area type="monotone" dataKey="ready" stroke="#34D399" strokeWidth={2} fillOpacity={1} fill="url(#gradReady)" name="Commerce Ready" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(145deg, rgba(19, 31, 50, 0.8) 0%, rgba(9, 13, 21, 0.9) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: 16,
        }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>Category Breakdown</div>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 14 }}>Products by item type</div>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="transparent" tick={{ fill: '#64748B', fontSize: 11 }} width={75} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#131F32', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 10, color: '#FFF', fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {categoryChartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MetricsOverview;
