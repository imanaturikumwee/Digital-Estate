import React, { useState } from 'react';

interface ValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestValuation: (data: { propertyName: string; district: string; sizeSqM: number }) => Promise<any>;
}

export const ValuationModal: React.FC<ValuationModalProps> = ({
  isOpen,
  onClose,
  onRequestValuation,
}) => {
  const [propertyName, setPropertyName] = useState('Rebero Contemporary Hilltop');
  const [district, setDistrict] = useState('Rebero');
  const [sizeSqM, setSizeSqM] = useState('420');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await onRequestValuation({
        propertyName,
        district,
        sizeSqM: Number(sizeSqM),
      });
      setResult(res);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="valuation-modal-title"
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden"
      >
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">request_quote</span>
            </div>
            <div>
              <h2 id="valuation-modal-title" className="font-headline font-bold text-lg text-on-surface">
                Request Property Valuation
              </h2>
              <p className="text-xs text-on-surface-variant">
                Rwanda Land Management Authority &amp; RICS Aligned
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                Property / Plot Name
              </label>
              <input
                type="text"
                required
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                  District / Location
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface"
                >
                  <option value="Rebero">Rebero</option>
                  <option value="Nyarutarama">Nyarutarama</option>
                  <option value="Kacyiru">Kacyiru</option>
                  <option value="Gacuriro">Gacuriro</option>
                  <option value="Kibagabaga">Kibagabaga</option>
                  <option value="Bugesera">Bugesera SEZ</option>
                  <option value="Kiyovu">Kiyovu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                  Area (m²)
                </label>
                <input
                  type="number"
                  required
                  value={sizeSqM}
                  onChange={(e) => setSizeSqM(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm font-mono text-on-surface"
                />
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/15 text-xs text-on-surface-variant space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-on-surface">
                <span className="material-symbols-outlined text-sm text-primary">verified</span>
                <span>Automated Market Valuation Model</span>
              </div>
              <p>
                Calculates real-time baseline sq/m rates based on recent Q2 transactions, infrastructure grade, and topographical appreciation in Kigali.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-tertiary text-white rounded-lg text-sm font-bold shadow-lg shadow-tertiary/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
              >
                {loading ? 'Evaluating...' : 'Generate Valuation'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            <div className="p-6 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl text-center space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-widest text-primary-fixed-dim">
                Estimated Market Valuation
              </p>
              <p className="text-4xl font-headline font-extrabold tracking-tight">
                {result.formattedEstimate}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
                <span>Confidence: {result.confidenceScore}</span>
                <span>•</span>
                <span>Rate: ${result.pricePerSqM}/m²</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-on-surface-variant">
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-outline">Property</span>
                <span className="font-semibold text-on-surface">{result.propertyName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-outline">District</span>
                <span className="font-semibold text-on-surface">{result.district}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-outline">Formal Turnaround</span>
                <span className="font-semibold text-on-surface">{result.turnaround}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setResult(null)}
                className="px-4 py-2 text-sm text-primary font-semibold hover:underline"
              >
                Recalculate
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
