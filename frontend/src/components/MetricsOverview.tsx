import React from 'react';
import { CatalogMetrics } from '../types/product';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Cpu,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface MetricsOverviewProps {
  metrics: CatalogMetrics | null;
  loading: boolean;
}

const analyticsData = [
  { day: 'Mon', total: 8400, enriched: 5200, ready: 4800 },
  { day: 'Tue', total: 9200, enriched: 6100, ready: 5600 },
  { day: 'Wed', total: 10100, enriched: 7300, ready: 6700 },
  { day: 'Thu', total: 11000, enriched: 8500, ready: 7900 },
  { day: 'Fri', total: 11800, enriched: 9400, ready: 8600 },
  { day: 'Sat', total: 12100, enriched: 9800, ready: 9100 },
  { day: 'Sun', total: 12450, enriched: 10200, ready: 9500 },
];

const categoryChartData = [
  { name: 'Abrasives & Cutting', count: 280, color: '#6366F1' },
  { name: 'Appliances', count: 210, color: '#06B6D4' },
  { name: 'Building & Decking', count: 340, color: '#10B981' },
  { name: 'Doors & Windows', count: 170, color: '#F59E0B' },
];

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics, loading }) => {
  if (loading || !metrics) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-shimmer" style={{ height: 130, borderRadius: 14, border: '1px solid var(--border)' }} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Products Ingested',
      tooltip: 'Total number of product records in the catalog across all suppliers',
      value: (metrics.totalProducts ?? 12450).toLocaleString(),
      sub: `${Object.keys(metrics.byCategory || {}).length} active categories`,
      trend: '+14.2% this week',
      trendUp: true,
      icon: Package,
      iconColor: '#818CF8',
      iconBg: 'rgba(99, 102, 241, 0.2)',
      iconBorder: 'rgba(99, 102, 241, 0.4)',
      barColor: '#6366F1',
    },
    {
      title: 'Commerce Ready Rate',
      tooltip: 'Products fully enriched, validated, and ready for publication',
      value: `${metrics.commerceReadyPercent ?? 94}%`,
      sub: 'Enriched & ISO validated',
      trend: '+5.8% this month',
      trendUp: true,
      icon: CheckCircle2,
      iconColor: '#34D399',
      iconBg: 'rgba(16, 185, 129, 0.2)',
      iconBorder: 'rgba(16, 185, 129, 0.4)',
      barValue: metrics.commerceReadyPercent ?? 94,
      barColor: '#10B981',
    },
    {
      title: 'Avg Data Completeness',
      tooltip: 'Average percentage of technical specification fields extracted',
      value: `${metrics.averageCompleteness ?? 88}%`,
      sub: 'Target: >85% accuracy',
      trend: (metrics.averageCompleteness ?? 88) >= 85 ? 'On target' : 'Below target',
      trendUp: (metrics.averageCompleteness ?? 88) >= 85,
      icon: Activity,
      iconColor: '#C084FC',
      iconBg: 'rgba(168, 85, 247, 0.2)',
      iconBorder: 'rgba(168, 85, 247, 0.4)',
      barValue: metrics.averageCompleteness ?? 88,
      barColor: '#A855F7',
    },
    {
      title: 'Anomalies Pending Review',
      tooltip: 'AI-detected conflicts requiring human validation',
      value: (metrics.anomaliesDetected ?? 142).toLocaleString(),
      sub: `${metrics.anomaliesBySeverity?.high ?? 24} high priority flags`,
      trend: 'Human review queued',
      trendUp: false,
      icon: AlertTriangle,
      iconColor: '#FBBF24',
      iconBg: 'rgba(245, 158, 11, 0.2)',
      iconBorder: 'rgba(245, 158, 11, 0.4)',
      barColor: '#F59E0B',
    },
    {
      title: 'Enrichment Pipeline',
      tooltip: 'Status of the 5-stage Unilog data enrichment pipeline',
      value: metrics.pipelineStatus === 'running' ? 'Active' : 'Ready',
      sub: 'Cleanse → Extract → Generate',
      trend: 'Pipeline Ready',
      trendUp: true,
      icon: Cpu,
      iconColor: '#38BDF8',
      iconBg: 'rgba(6, 182, 212, 0.2)',
      iconBorder: 'rgba(6, 182, 212, 0.4)',
      barColor: '#06B6D4',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="card"
              style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
                borderRadius: 18,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(56, 189, 248, 0.5)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(56, 189, 248, 0.2)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
              }}
              title={card.tooltip}
            >
              {/* Top Accent Bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: card.barColor, borderRadius: '16px 16px 0 0' }} />

              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                      {card.value}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      background: card.iconBg,
                      border: `1px solid ${card.iconBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} color={card.iconColor} />
                  </div>
                </div>

                <div style={{ fontSize: 15, color: '#FFFFFF', marginBottom: 14, fontWeight: 600 }}>
                  {card.sub}
                </div>
                
                {card.barValue !== undefined && (
                  <div style={{ height: 8, background: '#0B0F17', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                    <div style={{ height: '100%', width: `${card.barValue}%`, background: card.barColor, borderRadius: 4, transition: 'width 0.8s ease' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(56, 189, 248, 0.25)' }}>
                <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {card.sub}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 800, color: card.trendUp ? '#34D399' : '#FBBF24', background: card.trendUp ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', border: `1px solid ${card.trendUp ? 'rgba(16,185,129,0.35)' : 'rgba(245,158,11,0.35)'}`, padding: '4px 10px', borderRadius: 6, flexShrink: 0 }}>
                  {card.trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {card.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Interactive Recharts Visualizations Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        
        {/* Growth & Readiness Chart */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 10 }}>
                Catalog Enrichment Progress
                <span style={{ fontSize: 12, fontWeight: 800, color: '#38BDF8', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '3px 10px', borderRadius: 6 }}>
                  7-Day Trend
                </span>
              </h3>
              <p style={{ fontSize: 15, color: '#CBD5E1', marginTop: 4 }}>
                Product ingestion, AI enrichment, and commerce publication trend (7-day cumulative)
              </p>
            </div>
          </div>

          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReady" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#1F2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, color: '#FFF', fontSize: 12 }} 
                />
                <Area type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" name="Ingested Products" />
                <Area type="monotone" dataKey="ready" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorReady)" name="Commerce Ready" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', background: '#1B2433', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>Product Category Breakdown</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Enriched products by item type</p>
          </div>

          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#CBD5E1" fontSize={12} width={130} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, color: '#FFF', fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
