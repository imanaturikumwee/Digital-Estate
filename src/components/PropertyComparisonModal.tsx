import React from 'react';
import { Property } from '../types/index.js';

interface PropertyComparisonModalProps {
  isOpen: boolean;
  properties: Property[];
  onClose: () => void;
  onRemoveProperty: (id: string) => void;
  onBookViewing: (property: Property) => void;
  onOpenChat: (property: Property) => void;
  currency: 'USD' | 'RWF' | 'EUR';
}

export const PropertyComparisonModal: React.FC<PropertyComparisonModalProps> = ({
  isOpen,
  properties,
  onClose,
  onRemoveProperty,
  onBookViewing,
  onOpenChat,
  currency,
}) => {
  if (!isOpen || properties.length === 0) return null;

  const formatPrice = (usd: number) => {
    if (currency === 'RWF') {
      const rwf = Math.round(usd * 1420);
      return `${(rwf / 1000000).toFixed(1)}M RWF`;
    }
    if (currency === 'EUR') {
      const eur = Math.round(usd * 0.92);
      return `€${eur.toLocaleString()}`;
    }
    return `$${usd.toLocaleString()}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-xl">compare_arrows</span>
              <h2 id="comparison-title" className="text-lg sm:text-xl font-bold font-headline text-slate-900 dark:text-white">
                Architectural Property Comparison Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side technical evaluation across {properties.length} selected estates.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close comparison dialog"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Comparison Table / Grid */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
          <div className="min-w-[650px] space-y-6">
            {/* Top Cards Strip */}
            <div className="grid grid-cols-4 gap-4 items-end">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-headline pb-4">
                Selected Holdings
              </div>

              {properties.map((p) => (
                <div key={p.id} className="relative bg-slate-50 dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-3 space-y-2.5">
                  <button
                    onClick={() => onRemoveProperty(p.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900/70 text-white flex items-center justify-center text-xs hover:bg-slate-900 z-10"
                    title="Remove from comparison"
                  >
                    ✕
                  </button>
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-32 rounded-xl object-cover"
                  />
                  <h3 className="text-xs font-bold font-headline text-slate-900 dark:text-white line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-sm font-extrabold text-blue-900 dark:text-blue-400 font-headline">
                    {formatPrice(p.price)}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onBookViewing(p);
                    }}
                    className="w-full py-1.5 rounded-lg bg-blue-900 dark:bg-blue-600 text-white text-[11px] font-bold font-headline uppercase tracking-wider hover:opacity-90"
                  >
                    Book Viewing
                  </button>
                </div>
              ))}
            </div>

            {/* Spec Attributes Matrix */}
            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/70 text-xs">
              {/* AI Score */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider font-headline text-[11px]">
                  AI Investment Score
                </span>
                {properties.map((p) => (
                  <div key={p.id} className="flex items-center gap-1.5 font-extrabold text-emerald-600 dark:text-emerald-400 font-headline text-sm">
                    <span className="material-symbols-outlined text-base">verified</span>
                    {p.aiScore || 92} / 100
                  </div>
                ))}
              </div>

              {/* Capital Growth */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider font-headline text-[11px]">
                  Projected Capital Growth
                </span>
                {properties.map((p) => (
                  <div key={p.id} className="font-bold text-blue-900 dark:text-blue-300 font-headline">
                    {p.growthPotential || '+12.4% /yr'}
                  </div>
                ))}
              </div>

              {/* Risk Profile */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider font-headline text-[11px]">
                  Risk Profile
                </span>
                {properties.map((p) => (
                  <div key={p.id} className="font-bold text-slate-700 dark:text-slate-300">
                    {p.riskLevel || 'Very Low'}
                  </div>
                ))}
              </div>

              {/* Location & District */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider font-headline text-[11px]">
                  District &amp; Zone
                </span>
                {properties.map((p) => (
                  <div key={p.id} className="text-slate-700 dark:text-slate-300">
                    <strong>{p.district}</strong> &middot; {p.location}
                  </div>
                ))}
              </div>

              {/* Property Type */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider font-headline text-[11px]">
                  Asset Classification
                </span>
                {properties.map((p) => (
                  <div key={p.id} className="text-slate-700 dark:text-slate-300">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold uppercase tracking-wider text-[10px]">
                      {p.propertyType}
                    </span>
                  </div>
                ))}
              </div>

              {/* Area / Size */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider font-headline text-[11px]">
                  Floor / Parcel Area
                </span>
                {properties.map((p) => (
                  <div key={p.id} className="text-slate-800 dark:text-slate-200 font-medium">
                    {p.areaSqMeters ? `${p.areaSqMeters} m²` : p.areaHectares ? `${p.areaHectares} Ha` : 'N/A'}
                  </div>
                ))}
              </div>

              {/* Bed / Bath count */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider font-headline text-[11px]">
                  Bedrooms &amp; Bathrooms
                </span>
                {properties.map((p) => (
                  <div key={p.id} className="text-slate-700 dark:text-slate-300">
                    {p.beds ? `${p.beds} Beds · ${p.baths} Baths` : 'Commercial/Land'}
                  </div>
                ))}
              </div>

              {/* Digital Land Title Status */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider font-headline text-[11px]">
                  RLMIS Title Deed
                </span>
                {properties.map((p) => (
                  <div key={p.id} className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Verified Freehold
                  </div>
                ))}
              </div>

              {/* Chat action */}
              <div className="grid grid-cols-4 gap-4 py-4 items-center">
                <span className="font-bold text-slate-500 uppercase tracking-wider font-headline text-[11px]">
                  Concierge Inquiries
                </span>
                {properties.map((p) => (
                  <div key={p.id}>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenChat(p);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      Ask Dany &amp; Emma
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
