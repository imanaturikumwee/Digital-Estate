import React, { useState } from 'react';
import { Property } from '../types/index.js';

interface DashboardProps {
  properties: Property[];
  onOpenAddProperty: () => void;
  onOpenValuation: () => void;
  onOpenChat: () => void;
  onSelectProperty?: (property: Property) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  properties,
  onOpenAddProperty,
  onOpenValuation,
  onOpenChat,
  onSelectProperty,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trendRange, setTrendRange] = useState<'30days' | '6months'>('30days');
  const [activeFilter, setActiveFilter] = useState<'all' | 'residential' | 'land' | 'commercial'>('all');
  const [downloadingReport, setDownloadingReport] = useState(false);

  // Filtered properties
  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === 'all' || p.propertyType.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDownloadReport = async () => {
    setDownloadingReport(true);
    try {
      const response = await fetch('/api/reports/portfolio?format=csv');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `digital_estate_portfolio_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Fallback local CSV creation
      const csv =
        'Title,Price,Location,Type,Status\n' +
        properties.map(p => `"${p.title}",${p.price},"${p.location}","${p.propertyType}","${p.status}"`).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'estate_portfolio.csv';
      a.click();
    } finally {
      setTimeout(() => setDownloadingReport(false), 500);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Dashboard Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search portfolio by name or district..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(
            [
              { id: 'all', label: 'All Assets' },
              { id: 'residential', label: 'Residential' },
              { id: 'land', label: 'Land Plots' },
              { id: 'commercial', label: 'Commercial' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all font-headline ${
                activeFilter === tab.id
                  ? 'bg-blue-900 dark:bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Portfolio Overview Bento */}
      <section>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Total Value Stat Card */}
          <div className="flex-grow bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-end min-h-[280px] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 font-headline">
              Total Portfolio Asset Value
            </span>
            <h2 className="font-headline text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums">
              $1.2M
            </h2>
            <div className="flex items-center gap-2 mt-4 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <span className="material-symbols-outlined text-base">trending_up</span>
              <span>+4.2% from last month</span>
              <span className="text-slate-400 font-normal">· (+12.4% yearly pace)</span>
            </div>
          </div>

          {/* Split Stats Column */}
          <div className="w-full lg:w-96 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-l-4 border-amber-600 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-[10px] font-headline uppercase tracking-widest text-slate-400 mb-3 font-bold">
                Inventory Mix
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-headline text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                    {properties.length || 12}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Total Properties</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">4 Houses</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">8 Land Plots</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-950 text-white p-6 rounded-3xl shadow-lg border border-blue-900 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-headline uppercase tracking-widest text-blue-300 mb-2 font-bold">
                  Total Monthly Investor Leads
                </p>
                <div className="flex justify-between items-center">
                  <h3 className="font-headline text-4xl font-extrabold tabular-nums">192</h3>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-blue-300">groups</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-blue-400" />
                </div>
                <div className="flex justify-between text-[10px] text-blue-200/80 mt-1.5 font-mono">
                  <span>Target: 250</span>
                  <span>76.8% of monthly goal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Performance & Yield Analysis Bento */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Growth Bar Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
            <div>
              <h3 className="font-headline text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Capital Growth Performance
              </h3>
              <p className="text-xs text-slate-500">
                Asset appreciation index across Kigali (Jan – Jun 2026)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-900 dark:bg-blue-500" />
              <span className="text-xs text-slate-500 font-medium">Realized</span>
              <span className="h-3 w-3 rounded-full bg-blue-300 ml-2" />
              <span className="text-xs text-slate-500 font-medium">Projected</span>
            </div>
          </div>

          {/* Interactive Chart Visual */}
          <div className="flex items-end justify-between h-48 gap-3 sm:gap-4 px-2 pt-6">
            {[
              { month: 'Jan', height: '40%', val: '+4.0%' },
              { month: 'Feb', height: '55%', val: '+5.5%' },
              { month: 'Mar', height: '45%', val: '+4.5%' },
              { month: 'Apr', height: '70%', val: '+7.0%' },
              { month: 'May', height: '85%', val: '+8.5%' },
              { month: 'Jun', height: '100%', val: '+12.4%', peak: true },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                {bar.peak && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-full mb-1 animate-pulse">
                    Peak
                  </span>
                )}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative h-40 overflow-hidden flex items-end">
                  <div
                    style={{ height: bar.height }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      bar.peak
                        ? 'bg-blue-900 dark:bg-blue-500 group-hover:bg-blue-700'
                        : 'bg-blue-600/60 dark:bg-blue-600/70 group-hover:bg-blue-600'
                    }`}
                  />
                </div>
                <span className={`text-[11px] font-mono font-bold uppercase tracking-widest ${bar.peak ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Yield Analysis Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-amber-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col justify-between overflow-hidden relative shadow-md border border-amber-800/30">
          <div className="z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 font-headline block mb-1">
              Quarterly Portfolio Health
            </span>
            <h3 className="font-headline text-xl font-bold uppercase tracking-tight mb-2">
              Yield Analysis
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body">
              Your residential portfolio in Kigali is outperforming commercial assets by 4.2% this quarter due to diaspora executive demand in Nyarutarama and Rebero.
            </p>
          </div>

          <div className="z-10 mt-8 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-amber-400 text-base">analytics</span>
              <span className="font-headline text-xs font-bold uppercase tracking-widest text-amber-200">
                Efficiency Rating
              </span>
            </div>
            <p className="font-headline text-3xl sm:text-4xl font-extrabold text-amber-300 tracking-tight">
              OPTIMAL
            </p>
          </div>

          <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* Main Workspace: My Estates Grid & Quick Actions Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Properties Grid */}
        <div className="flex-grow space-y-6 w-full">
          <div className="flex justify-between items-baseline">
            <div>
              <h2 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                My Estates Portfolio
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Active listings and developmental holdings across Rwanda
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 font-bold">
              {filtered.length} properties showing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
                        item.status === 'Active'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="bg-slate-950/80 text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                      {item.propertyType}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <button
                        onClick={() => onSelectProperty?.(item)}
                        className="text-left font-headline text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors hover:underline"
                      >
                        {item.title}
                      </button>
                      <p className="text-blue-900 dark:text-blue-400 font-extrabold text-base sm:text-lg tabular-nums whitespace-nowrap font-headline">
                        {item.formattedPrice}
                      </p>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">location_on</span>
                      <span>{item.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div className="flex items-center gap-4 text-slate-400 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span className="tabular-nums">{item.views} views</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">chat</span>
                        <span className="tabular-nums">{item.leads} leads</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectProperty?.(item)}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold text-xs"
                      >
                        Specs &rarr;
                      </button>
                      <button
                        onClick={onOpenChat}
                        className="text-blue-900 dark:text-blue-400 font-bold text-xs underline decoration-2 underline-offset-4 hover:opacity-80"
                      >
                        Consult Agent
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Portfolio View Trends Chart Section */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="font-headline text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Portfolio Investor Engagement Trends
                </h3>
                <p className="text-xs text-slate-500">
                  Aggregate visitor engagement across all properties
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setTrendRange('30days')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    trendRange === '30days'
                      ? 'bg-blue-900 dark:bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => setTrendRange('6months')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    trendRange === '6months'
                      ? 'bg-blue-900 dark:bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Last 6 Months
                </button>
              </div>
            </div>

            {/* Trends Bars */}
            <div className="h-44 flex items-end justify-between gap-2 px-2">
              {[40, 60, 45, 75, 90, 65, 55, 85, 100, 70].map((height, idx) => (
                <div
                  key={idx}
                  style={{ height: `${height}%` }}
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    idx === 8 ? 'bg-blue-900 dark:bg-blue-500' : 'bg-blue-200 dark:bg-blue-950 hover:bg-blue-400'
                  }`}
                  title={`Period ${idx + 1}: ${height * 2} views`}
                />
              ))}
            </div>

            <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-mono uppercase tracking-wider px-2">
              <span>Day 1</span>
              <span>Day 10</span>
              <span>Day 20</span>
              <span>Today (Peak 200 views)</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl lg:sticky lg:top-24 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-headline text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <button
                onClick={onOpenAddProperty}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/60 dark:border-slate-700/60 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-900 dark:text-blue-300 shrink-0">
                    <span className="material-symbols-outlined text-xl">add_business</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Add New Listing</p>
                    <p className="text-[11px] text-slate-500">Post home or land parcel</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-sm text-slate-300 group-hover:text-blue-600 transition-colors">
                  chevron_right
                </span>
              </button>

              <button
                onClick={onOpenValuation}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/60 dark:border-slate-700/60 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0">
                    <span className="material-symbols-outlined text-xl">request_quote</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Request Valuation</p>
                    <p className="text-[11px] text-slate-500">RLMIS market analysis</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-sm text-slate-300 group-hover:text-amber-600 transition-colors">
                  chevron_right
                </span>
              </button>

              <button
                onClick={handleDownloadReport}
                disabled={downloadingReport}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/60 dark:border-slate-700/60 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-900 dark:text-blue-300 shrink-0">
                    <span className="material-symbols-outlined text-xl">file_present</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Portfolio Report</p>
                    <p className="text-[11px] text-slate-500">
                      {downloadingReport ? 'Exporting...' : 'Export CSV Ledger'}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-sm text-slate-300 group-hover:text-blue-600 transition-colors">
                  download
                </span>
              </button>
            </div>

            {/* Need Help Box */}
            <div className="p-6 bg-gradient-to-br from-blue-950 to-slate-900 rounded-2xl text-white relative overflow-hidden shadow-md border border-blue-900/40">
              <div className="relative z-10 space-y-3">
                <p className="text-[10px] font-headline uppercase tracking-widest text-blue-300 font-bold">
                  VIP Concierge Desk
                </p>
                <p className="text-xs sm:text-sm font-bold leading-snug">
                  Speak directly with Dany Mugisha &amp; Emma Umutoni in Kigali.
                </p>
                <button
                  onClick={onOpenChat}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  Connect Now
                </button>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full pointer-events-none" />
            </div>
          </div>
        </aside>
      </div>

      {/* Financial Outlook 2026 Section */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border-l-4 border-blue-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
          <div className="space-y-2 max-w-lg">
            <h3 className="font-headline text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Financial Outlook 2026
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-body">
              Your portfolio is projected to hit $1.5M by year-end based on current market appreciation in the East African region. We recommend strategically diversifying into commercial leases.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-[150px]">
              <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-400 mb-1">
                Q2 Revenue
              </p>
              <p className="font-headline text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                $124,500
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-[150px]">
              <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-400 mb-1">
                Occupancy
              </p>
              <p className="font-headline text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                94%
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
