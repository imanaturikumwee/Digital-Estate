import React, { useState } from 'react';
import { Property } from '../types/index.js';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onBookViewing: (property: Property) => void;
  onOpenChat: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onBookViewing,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'floorplan' | 'investment' | 'audio'>('overview');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35);

  if (!isOpen || !property) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/60 text-white flex items-center justify-center hover:bg-slate-900 transition-colors shadow-md"
          aria-label="Close dialog"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Hero Image & Headline */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-900 shrink-0">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="absolute bottom-5 left-5 right-5 text-white flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-md bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider font-headline">
                  {property.propertyType}
                </span>
                <span className="px-3 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider font-headline flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  AI Score: {property.aiScore || 92}/100
                </span>
                {property.featured && (
                  <span className="px-3 py-1 rounded-md bg-amber-500 text-slate-950 text-[11px] font-bold uppercase tracking-wider font-headline">
                    Signature Portfolio
                  </span>
                )}
              </div>
              <h2 id="property-detail-title" className="text-2xl sm:text-4xl font-extrabold font-headline leading-tight">
                {property.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-base text-blue-400">location_on</span>
                {property.location} &middot; {property.district}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 block font-label uppercase tracking-widest">
                Asking Valuation
              </span>
              <span className="text-2xl sm:text-4xl font-extrabold font-headline text-white">
                {property.formattedPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 px-6 pt-3 bg-slate-50 dark:bg-slate-950/60 overflow-x-auto">
          {(
            [
              { id: 'overview', label: 'Overview & Specs', icon: 'info' },
              { id: 'floorplan', label: 'Floor Plan & 3D Tour', icon: 'floor' },
              { id: 'investment', label: 'Yield & Legal Title', icon: 'trending_up' },
              { id: 'audio', label: 'Architect Audio Tour', icon: 'headphones' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-bold font-headline uppercase tracking-wider flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-blue-900 dark:border-blue-400 text-blue-900 dark:text-blue-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Tab Content */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-center border border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-headline font-bold">
                    Portfolio Status
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {property.status}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-center border border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-headline font-bold">
                    Projected Growth
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {property.growthPotential || '+12.4% /yr'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-center border border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-headline font-bold">
                    Risk Classification
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                    {property.riskLevel || 'Very Low'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-center border border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-headline font-bold">
                    Land Registration
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    RLMIS Freehold
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider font-headline text-slate-400">
                  Architectural Narrative
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-body leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Highlights & Features */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider font-headline text-slate-400">
                  Engineering &amp; Infrastructure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/40">
                    <span className="material-symbols-outlined text-lg text-blue-600">verified_user</span>
                    <div>
                      <strong className="block text-slate-900 dark:text-white">UPI: 1/03/08/04/1239</strong>
                      <span className="text-[11px] text-slate-400">Digitally notarized cadastral title</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/40">
                    <span className="material-symbols-outlined text-lg text-blue-600">solar_power</span>
                    <div>
                      <strong className="block text-slate-900 dark:text-white">12kW Solar PV &amp; Storage</strong>
                      <span className="text-[11px] text-slate-400">Full off-grid autonomy with Tesla Powerwall</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/40">
                    <span className="material-symbols-outlined text-lg text-blue-600">water_drop</span>
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Rain Harvesting &amp; Filtration</strong>
                      <span className="text-[11px] text-slate-400">30,000L underground cistern &amp; UV sterilizer</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/40">
                    <span className="material-symbols-outlined text-lg text-blue-600">shield</span>
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Biometric Perimeter Security</strong>
                      <span className="text-[11px] text-slate-400">24/7 guarded compound with fiber camera mesh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'floorplan' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-headline text-base font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400">architecture</span>
                    Architectural Layout &middot; 2 Levels
                  </h3>
                  <span className="text-xs text-blue-300 font-mono">
                    Total: {property.areaSqMeters || 420} m²
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <strong className="text-blue-300 block font-headline">Level 1 &middot; Reception &amp; Pool</strong>
                    <p className="text-slate-400 text-[11px]">Open-plan living salon (90m²), Poggenpohl kitchen, heated rimless infinity pool, staff quarters.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <strong className="text-blue-300 block font-headline">Level 2 &middot; Private Suites</strong>
                    <p className="text-slate-400 text-[11px]">Primary suite with private cantilever balcony (65m²), 3 en-suite guest rooms, executive library.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <strong className="text-blue-300 block font-headline">Sub-Level &middot; Utilities</strong>
                    <p className="text-slate-400 text-[11px]">3-car underground garage, solar inverter room, wine cellar, rainwater treatment center.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">view_in_ar</span>
                  <span>Interactive 3D Matterport VR tour available on request.</span>
                </div>
                <button
                  onClick={() => onBookViewing(property)}
                  className="px-3 py-1.5 rounded-lg bg-blue-900 dark:bg-blue-600 text-white font-bold"
                >
                  Schedule VR Session
                </button>
              </div>
            </div>
          )}

          {activeTab === 'investment' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase font-headline font-bold">Estimated Monthly Rent</span>
                  <p className="text-xl font-extrabold font-headline text-blue-900 dark:text-blue-400 mt-1">
                    ${Math.round(property.price * 0.008).toLocaleString()} / mo
                  </p>
                  <span className="text-[10px] text-slate-400">Based on executive diplomatic leases</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase font-headline font-bold">Net Annual Yield</span>
                  <p className="text-xl font-extrabold font-headline text-emerald-600 dark:text-emerald-400 mt-1">
                    9.6% &ndash; 11.2%
                  </p>
                  <span className="text-[10px] text-slate-400">After maintenance &amp; notary insurance</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase font-headline font-bold">5-Year Projected Valuation</span>
                  <p className="text-xl font-extrabold font-headline text-slate-900 dark:text-white mt-1">
                    ${Math.round(property.price * 1.75).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400">+75% at 12% compound CAGR</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white font-headline uppercase text-[11px]">
                  Foreign Investor Protection &middot; Law N° 006/2021
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Under Rwandan law, international buyers enjoy 100% legal ownership rights, complete repatriation of capital and dividends in USD, and automatic exemption from capital gains tax upon holding for over 3 years.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB"
                  alt="Dany Mugisha"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
                />
                <div>
                  <h4 className="text-sm font-bold font-headline text-white">
                    Architectural Walkthrough with Dany Mugisha
                  </h4>
                  <p className="text-[11px] text-blue-300">
                    Lead Architect &amp; Partner &middot; 4 min 12 sec
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;When designing {property.title}, our primary mandate was harmonizing natural volcanic basalt stone with passive ridge cross-ventilation so you experience uncompromised mountain tranquility without relying on heavy air-conditioning.&rdquo;
              </p>

              {/* Audio Player Controls */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                    aria-label={isPlayingAudio ? 'Pause Narration' : 'Play Narration'}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {isPlayingAudio ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${audioProgress}%` }}
                        className="h-full bg-blue-400 transition-all duration-300"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>1:28</span>
                      <span>4:12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                const text = `Property Brochure: ${property.title}\nPrice: ${property.formattedPrice}\nLocation: ${property.location}\nAI Investment Score: ${property.aiScore}/100\nUPI: 1/03/08/04/1239\nContact: Emma & Dany Luxury Realty Rwanda`;
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${property.title.toLowerCase().replace(/\s+/g, '_')}_brochure.txt`;
                a.click();
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Download Dossier
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenChat(property);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold font-headline hover:bg-slate-200 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                Chat with Dany &amp; Emma
              </button>

              <button
                onClick={() => {
                  onClose();
                  onBookViewing(property);
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-900 dark:bg-blue-600 text-white text-xs font-bold font-headline uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">calendar_month</span>
                Book Viewing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
