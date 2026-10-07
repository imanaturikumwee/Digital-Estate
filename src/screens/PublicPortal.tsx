import React, { useState } from 'react';
import { Property } from '../types/index.js';
import { CustomSlider } from '../components/CustomSlider.js';
import { RwandaDistrictMap } from '../components/RwandaDistrictMap.js';
import { MortgageCalculator } from '../components/MortgageCalculator.js';

interface PublicPortalProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  onOpenValuation: () => void;
  onOpenChatWithProperty: (property: Property) => void;
  onOpenComparison: (properties: Property[]) => void;
  currency?: 'USD' | 'RWF' | 'EUR';
  onSetCurrency?: (curr: 'USD' | 'RWF' | 'EUR') => void;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({
  properties,
  onSelectProperty,
  onBookViewing,
  onOpenValuation,
  onOpenChatWithProperty,
  onOpenComparison,
  currency = 'USD',
  onSetCurrency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000000);
  const [minAiScore, setMinAiScore] = useState<number>(80);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'score' | 'growth'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showMortgageTool, setShowMortgageTool] = useState<boolean>(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  // Format price based on currency
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

  // Filter and sort listings
  const filtered = properties
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict =
        selectedDistrict === 'all' ||
        item.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchesType =
        selectedType === 'all' ||
        item.propertyType.toLowerCase() === selectedType.toLowerCase();
      const matchesPrice = item.price <= maxPrice;
      const matchesAi = (item.aiScore || 0) >= minAiScore;

      return matchesSearch && matchesDistrict && matchesType && matchesPrice && matchesAi;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'score') return (b.aiScore || 0) - (a.aiScore || 0);
      if (sortBy === 'growth') {
        const valA = parseFloat(a.growthPotential?.replace(/[^0-9.]/g, '') || '0');
        const valB = parseFloat(b.growthPotential?.replace(/[^0-9.]/g, '') || '0');
        return valB - valA;
      }
      // default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  // Toggle property for comparison (max 3)
  const toggleComparison = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 properties simultaneously.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleLaunchComparison = () => {
    const selectedProps = properties.filter((p) => selectedForComparison.includes(p.id));
    onOpenComparison(selectedProps);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300 relative">
      {/* Luxury Editorial Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white min-h-[380px] sm:min-h-[440px] flex items-center p-6 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqWz3SlViR7Ll3TPo1pk7UyIlc5ixxcyhdje3zzQGZvLkgSW8TcZR7Z1EeMY2YGkDiXu0i1J5YoOMvebjNpKrM4_Gk3S1LuK2z6eT9OFcLVAUm3HfWPoDZfyKPkOrGcZkyYgREduu7sVbGHVOVGhc-fb63-H921dxhyhp6PrR8vrBJ0FDC1Aw6RBpu96Ld-C5zeAELKSDMep_c1jDsuEVtdZ4CoUD43GN5MKAfC-WjxV7VxC1CUgjhUmn7PAyPDFNeQY-TwtydZawP"
            alt="Luxury Architectural Estate in Kigali"
            className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-headline uppercase tracking-widest font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            Emma &amp; Dany Luxury Realty &middot; Kigali
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight text-white leading-tight">
            Curated Architectural Sanctuaries in Rwanda.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base font-body leading-relaxed max-w-xl">
            Explore exclusive private villas in Rebero, blue-chip commercial towers in Nyarugenge, prime industrial land near Bugesera Airport, and lakefront estates on Lake Kivu.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onOpenValuation}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-headline text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-900/40 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">calculate</span>
              Request AI Valuation
            </button>
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-headline text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/15 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">map</span>
              {showMap ? 'Hide District Map' : 'Explore Rwanda Map'}
            </button>
            <button
              onClick={() => setShowMortgageTool(!showMortgageTool)}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-headline text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/15 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">account_balance</span>
              Financing &amp; Loans
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Rwanda Map (Collapsible) */}
      {showMap && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <RwandaDistrictMap
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(dist) => setSelectedDistrict(dist)}
          />
        </div>
      )}

      {/* Interactive Mortgage Calculator (Collapsible) */}
      {showMortgageTool && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <MortgageCalculator initialPrice={450000} />
        </div>
      )}

      {/* Interactive Search & Filter Deck */}
      <section id="listings" className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by neighborhood, property name, or keywords (e.g., Rebero, Infinity pool)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-body text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* District selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="district-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              District:
            </label>
            <select
              id="district-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold font-headline text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="all">All Regions (Rwanda)</option>
              <option value="Rebero">Rebero Ridge</option>
              <option value="Nyarugenge">Nyarugenge (CBD)</option>
              <option value="Nyarutarama">Nyarutarama Estate</option>
              <option value="Bugesera">Bugesera Airport Hub</option>
              <option value="Karongi">Lake Kivu (Karongi)</option>
              <option value="Gasabo">Gasabo / Kigali Heights</option>
              <option value="Gishushu">Gishushu Manor</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Sort By:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold font-headline text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="featured">Signature &amp; Featured</option>
              <option value="score">Highest AI Score</option>
              <option value="growth">Highest Capital Growth</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>
          </div>

          {/* Currency Switcher */}
          {onSetCurrency && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['USD', 'RWF', 'EUR'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => onSetCurrency(curr)}
                  className={`px-2.5 py-1 text-xs font-bold font-headline rounded-lg transition-all ${
                    currency === curr
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          )}

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('compact')}
              aria-label="Compact List View"
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'compact'
                  ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-lg">view_agenda</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {(['all', 'Residential', 'Commercial', 'Land', 'Investment'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-headline transition-all ${
                selectedType.toLowerCase() === type.toLowerCase()
                  ? 'bg-blue-900 dark:bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {type === 'all' ? 'All Portfolios' : type}
            </button>
          ))}

          <span className="ml-auto text-xs text-slate-400 font-label">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filtered.length}</strong> of {properties.length} Estates
          </span>
        </div>

        {/* Interactive Sliders Drawer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <CustomSlider
            id="price-range"
            label="Maximum Price"
            value={maxPrice}
            min={100000}
            max={3000000}
            step={50000}
            prefix={currency === 'EUR' ? '€' : '$'}
            description="Filter listings within your investment target"
            onChange={setMaxPrice}
          />
          <CustomSlider
            id="ai-score"
            label="Minimum AI Investment Score"
            value={minAiScore}
            min={50}
            max={99}
            step={1}
            unit="/100"
            description="Algorithmic rating combining rental yield, capital growth, and legal clarity"
            onChange={setMinAiScore}
          />
        </div>
      </section>

      {/* Listing Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3">
            search_off
          </span>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-headline">
            No properties match your filter criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Try adjusting your maximum price slider, AI score filter, or selecting "All Regions".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDistrict('all');
              setSelectedType('all');
              setMaxPrice(3000000);
              setMinAiScore(80);
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-900 dark:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {filtered.map((item) => {
            const isComparing = selectedForComparison.includes(item.id);
            return (
              <article
                key={item.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-300 group flex ${
                  isComparing
                    ? 'border-blue-600 ring-2 ring-blue-600 shadow-lg'
                    : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl'
                } ${viewMode === 'compact' ? 'flex-col sm:flex-row' : 'flex-col'}`}
              >
                {/* Image banner */}
                <div
                  className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${
                    viewMode === 'compact' ? 'sm:w-80 h-56 sm:h-auto shrink-0' : 'h-64 w-full'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Floating pill tags */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-slate-950/75 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider font-headline">
                      {item.propertyType}
                    </span>
                    {item.featured && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider font-headline">
                        Signature
                      </span>
                    )}
                  </div>

                  {/* Compare Checkbox Button on Image */}
                  <button
                    onClick={(e) => toggleComparison(item.id, e)}
                    className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-headline backdrop-blur-md transition-all flex items-center gap-1 ${
                      isComparing
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-900/80 text-white/90 hover:bg-slate-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {isComparing ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    {isComparing ? 'Selected' : 'Compare'}
                  </button>

                  {/* AI Score Badge */}
                  {item.aiScore && (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-md shadow-md backdrop-blur-md flex items-center gap-1 text-[11px] font-bold">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      AI {item.aiScore}/100
                    </div>
                  )}

                  {/* Growth Potential Overlay */}
                  {item.growthPotential && (
                    <div className="absolute bottom-3 left-3 bg-blue-900/85 backdrop-blur-md text-blue-100 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-blue-300">trending_up</span>
                      {item.growthPotential}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-headline group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h2>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-xs text-slate-400">location_on</span>
                          {item.location}
                        </p>
                      </div>
                      <span className="text-lg font-extrabold text-blue-900 dark:text-blue-400 font-headline">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2.5 font-body">
                      {item.description}
                    </p>

                    {/* Attributes */}
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                      {item.beds && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">bed</span>
                          {item.beds} Beds
                        </span>
                      )}
                      {item.baths && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">bathtub</span>
                          {item.baths} Baths
                        </span>
                      )}
                      {item.areaSqMeters && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">straighten</span>
                          {item.areaSqMeters} m²
                        </span>
                      )}
                      {item.areaHectares && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">landscape</span>
                          {item.areaHectares} Ha
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onBookViewing(item)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-blue-900 dark:bg-blue-600 text-white font-headline text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all text-center"
                    >
                      Book Viewing
                    </button>
                    <button
                      onClick={() => onOpenChatWithProperty(item)}
                      title="Inquire with Agent / AI Concierge"
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                    </button>
                    <button
                      onClick={() => onSelectProperty(item)}
                      title="View Full Specifications"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">info</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Floating Comparison Tray */}
      {selectedForComparison.length > 0 && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-lg w-[90%] sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400">compare_arrows</span>
            <span className="text-xs font-bold font-headline">
              {selectedForComparison.length} {selectedForComparison.length === 1 ? 'property' : 'properties'} selected
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setSelectedForComparison([])}
              className="text-[11px] text-slate-400 hover:text-white underline font-medium"
            >
              Clear
            </button>
            <button
              onClick={handleLaunchComparison}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-headline uppercase tracking-wider shadow-md active:scale-95 transition-all"
            >
              Compare Matrix
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
