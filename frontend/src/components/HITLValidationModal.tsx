import React, { useState } from 'react';
import { Product } from '../types/product';
import { X, Check, FileQuestion, Save } from 'lucide-react';
import { api } from '../services/api';

interface HITLValidationModalProps {
  product: Product;
  onClose: (validated?: boolean) => void;
}

const HITLValidationModal: React.FC<HITLValidationModalProps> = ({ product, onClose }) => {
  const [edits, setEdits] = useState<Record<string, string>>({});
  const itemsToReview = product.attributes.filter(a => a.confidence < 0.7 || a.flagged);

  const handleOverride = (key: string, val: string) => {
    setEdits(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in-up">
        <div className="p-6 border-b border-[rgba(255,255,255,0.08)] flex justify-between items-center bg-[rgba(0,0,0,0.2)]">
          <div>
            <h2 className="text-xl font-bold text-white">Human-in-the-Loop Validation</h2>
            <p className="text-sm text-gray mt-1">{itemsToReview.length} attributes require review for <span className="text-white font-medium">{product.name}</span></p>
          </div>
          <button onClick={() => onClose()} className="text-gray hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {itemsToReview.length === 0 ? (
            <div className="text-center py-10">
              <Check size={48} className="mx-auto mb-4 text-emerald-400 opacity-50" />
              <p className="text-lg text-white">All attributes have high confidence!</p>
              <p className="text-gray text-sm mt-2">No manual validation required.</p>
            </div>
          ) : (
            itemsToReview.map((attr) => (
              <div key={attr.key} className="glass-card-dark p-4 border border-[rgba(245,158,11,0.2)]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 bg-[rgba(34,211,238,0.1)] px-2 py-1 rounded text-sm">
                      {attr.key}
                    </span>
                    {attr.flagged && <span className="badge badge-flagged">Flagged</span>}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray block">AI Confidence</span>
                    <span className="text-amber-400 font-bold">{Math.round(attr.confidence * 100)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[rgba(255,255,255,0.02)] p-3 rounded-lg border border-[rgba(255,255,255,0.05)]">
                    <p className="text-xs text-gray mb-2 flex items-center gap-1"><FileQuestion size={14}/> Source Context</p>
                    <p className="text-sm text-white italic">"{attr.sourceQuote}"</p>
                    <p className="text-xs text-gray mt-2 text-right">— {attr.source}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray mb-2 block">Validated Value</label>
                    <input 
                      type="text" 
                      value={edits[attr.key] ?? attr.value} 
                      onChange={(e) => handleOverride(attr.key, e.target.value)}
                      className="w-full bg-[rgba(0,0,0,0.3)] border-[rgba(255,255,255,0.1)] focus:border-emerald-400"
                    />
                    <div className="flex gap-2 mt-3">
                      <button 
                        className="btn btn-secondary text-xs flex-1 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400"
                        onClick={() => handleOverride(attr.key, attr.value)}
                      >
                        Accept AI Value
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.2)] flex justify-end gap-3">
          <button className="btn btn-secondary" onClick={() => onClose()}>Cancel</button>
          <button 
            className="btn btn-primary" 
            onClick={async () => {
              try {
                await api.updateStatus(product.id, 'validated');
                onClose(true);
              } catch (e) {
                console.error(e);
                onClose(true);
              }
            }}
          >
            <Save size={16} /> Save & Mark Validated
          </button>
        </div>
      </div>
    </div>
  );
};

export default HITLValidationModal;
