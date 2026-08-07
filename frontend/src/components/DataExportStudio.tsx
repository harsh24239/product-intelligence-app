import React, { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, FileText, BarChart3, Check } from 'lucide-react';

const DataExportStudio: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const handleExport = (id: string) => {
    setDownloading(id);
    // Simulate export delay
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(id);
      setTimeout(() => setDownloaded(null), 3000);
    }, 1500);
  };

  const exportOptions = [
    {
      id: 'json',
      title: 'E-Commerce JSON',
      desc: 'Full structured product intelligence JSON ready for PIM integration.',
      icon: FileJson,
      format: 'JSON',
      size: '~4.2 MB',
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10'
    },
    {
      id: 'csv',
      title: 'CSV Catalog',
      desc: 'Spreadsheet-ready format for ERP import or manual review.',
      icon: FileSpreadsheet,
      format: 'CSV',
      size: '~1.8 MB',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    },
    {
      id: 'report',
      title: 'Product Deep-Dive',
      desc: 'Detailed PDF/JSON report of a single product with full traceability.',
      icon: FileText,
      format: 'PDF/JSON',
      size: 'Select Product',
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10'
    },
    {
      id: 'summary',
      title: 'Catalog Summary',
      desc: 'Key statistics, metrics, and anomaly counts for reporting.',
      icon: BarChart3,
      format: 'JSON',
      size: '~45 KB',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10'
    }
  ];

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Data Export Studio</h1>
        <p className="text-gray">Export your AI-enriched product data to your ERP, PIM, or e-commerce platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {exportOptions.map((opt) => {
          const Icon = opt.icon;
          const isDownloading = downloading === opt.id;
          const isDownloaded = downloaded === opt.id;

          return (
            <div key={opt.id} className="glass-card hover:border-[rgba(255,255,255,0.2)] transition-all flex flex-col">
              <div className="flex gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${opt.bg}`}>
                  <Icon size={24} className={opt.color} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">{opt.title}</h3>
                  <p className="text-sm text-gray leading-relaxed">{opt.desc}</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray bg-[rgba(0,0,0,0.3)] px-2 py-1 rounded">{opt.format}</span>
                  <span className="text-xs text-gray">{opt.size}</span>
                </div>
                <button 
                  className={`btn ${isDownloaded ? 'btn-secondary text-emerald-400 border-emerald-400' : 'btn-primary'}`}
                  onClick={() => handleExport(opt.id)}
                  disabled={isDownloading || isDownloaded}
                >
                  {isDownloading ? (
                    <><span className="animate-spin">⟳</span> Exporting...</>
                  ) : isDownloaded ? (
                    <><Check size={16} /> Downloaded</>
                  ) : (
                    <><Download size={16} /> Export</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card-dark p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-purple-400" />
          <h3 className="font-semibold text-white">Catalog Health Preview</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[rgba(255,255,255,0.02)] rounded-lg">
            <p className="text-xs text-gray mb-1">Total Exportable Entities</p>
            <p className="text-2xl font-bold text-white">12,450</p>
          </div>
          <div className="p-4 bg-[rgba(255,255,255,0.02)] rounded-lg">
            <p className="text-xs text-gray mb-1">Enriched Attributes</p>
            <p className="text-2xl font-bold text-cyan-400">142,890</p>
          </div>
          <div className="p-4 bg-[rgba(255,255,255,0.02)] rounded-lg">
            <p className="text-xs text-gray mb-1">PIM Readiness</p>
            <p className="text-2xl font-bold text-emerald-400">94%</p>
          </div>
          <div className="p-4 bg-[rgba(255,255,255,0.02)] rounded-lg">
            <p className="text-xs text-gray mb-1">Unresolved Anomalies</p>
            <p className="text-2xl font-bold text-amber-400">142</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExportStudio;
