import React, { useState } from 'react';
import { CustomSlider } from '../components/CustomSlider.js';
import { CustomToggle } from '../components/CustomToggle.js';

interface InsightsScreenProps {
  onOpenValuation: () => void;
  onNavigateToPortal: () => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  onOpenValuation,
  onNavigateToPortal,
}) => {
  // Investment simulator states
  const [purchasePrice, setPurchasePrice] = useState<number>(450000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [appreciationRate, setAppreciationRate] = useState<number>(12);
  const [monthlyRentYield, setMonthlyRentYield] = useState<number>(0.8); // 0.8% per month (~9.6% annual)
  const [holdingYears, setHoldingYears] = useState<number>(5);
  const [includeExpatTaxIncentives, setIncludeExpatTaxIncentives] = useState<boolean>(true);

  // Calculations
  const downPayment = Math.round(purchasePrice * (downPaymentPercent / 100));
  const loanAmount = purchasePrice - downPayment;
  const futureValue = Math.round(purchasePrice * Math.pow(1 + appreciationRate / 100, holdingYears));
  const capitalGain = futureValue - purchasePrice;
  const estimatedMonthlyRent = Math.round(purchasePrice * (monthlyRentYield / 100));
  const estimatedAnnualRent = estimatedMonthlyRent * 12;
  const totalRentalIncome = estimatedAnnualRent * holdingYears;
  const totalReturn = capitalGain + totalRentalIncome;
  const returnOnEquity = Math.round((totalReturn / downPayment) * 100);

  const districts = [
    {
      name: 'Rebero Ridge & Heights',
      growth: '+14.2% YoY',
      priceSqm: '$1,050 / m²',
      occupancy: '94%',
      tag: 'Luxury Residential',
      description: 'Commanding views of Kigali with high diplomatic demand and private villas.',
    },
    {
      name: 'Nyarugenge Central Business District',
      growth: '+9.8% YoY',
      priceSqm: '$2,400 / m²',
      occupancy: '91%',
      tag: 'Commercial & Retail',
      description: 'Anchor financial institutions, class-A towers, and corporate headquarters.',
    },
    {
      name: 'Bugesera Airport Corridor',
      growth: '+18.5% YoY',
      priceSqm: '$45 / m²',
      occupancy: 'High Land Uptake',
      tag: 'Industrial & Logistics',
      description: 'Adjacent to upcoming Bugesera International Airport and Special Economic Zone.',
    },
    {
      name: 'Lake Kivu Waterfront (Karongi/Rubavu)',
      growth: '+12.1% YoY',
      priceSqm: '$850 / m²',
      occupancy: '88% Peak',
      tag: 'Hospitality & Leisure',
      description: 'Boutique eco-resorts, vacation villas, and premier tourism development.',
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold font-headline uppercase tracking-widest text-blue-900 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-3 py-1 rounded-full">
            Kigali Market Intelligence &middot; 2026 Edition
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-headline text-slate-900 dark:text-white mt-2">
            Rwandan Real Estate Growth &amp; Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            Real-time capital appreciation trends, infrastructure catalysts, and interactive return simulators curated by Emma &amp; Dany.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenValuation}
            className="px-4 py-2.5 rounded-xl bg-blue-900 dark:bg-blue-600 text-white font-headline text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-sm"
          >
            Calculate Asset Valuation
          </button>
          <button
            onClick={onNavigateToPortal}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold font-headline hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Explore Listings
          </button>
        </div>
      </div>

      {/* Top 4 Macro Metric Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-headline font-bold uppercase tracking-wider">Average Kigali CAGR</span>
            <span className="material-symbols-outlined text-blue-600 text-lg">trending_up</span>
          </div>
          <div className="text-2xl font-extrabold font-headline text-slate-900 dark:text-white">
            +12.8%
          </div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">arrow_upward</span>
            +2.1% higher than 2025 benchmark
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-headline font-bold uppercase tracking-wider">Executive Rental Yield</span>
            <span className="material-symbols-outlined text-blue-600 text-lg">apartment</span>
          </div>
          <div className="text-2xl font-extrabold font-headline text-slate-900 dark:text-white">
            9.4% &ndash; 11.2%
          </div>
          <p className="text-[11px] text-slate-500 font-label">
            Driven by international organizations in Kigali
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-headline font-bold uppercase tracking-wider">Title Registration Time</span>
            <span className="material-symbols-outlined text-emerald-600 text-lg">verified</span>
          </div>
          <div className="text-2xl font-extrabold font-headline text-slate-900 dark:text-white">
            48 Hours
          </div>
          <p className="text-[11px] text-slate-500 font-label">
            100% digital via RLMIS &amp; Irembo
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-headline font-bold uppercase tracking-wider">Foreign Ownership</span>
            <span className="material-symbols-outlined text-purple-600 text-lg">public</span>
          </div>
          <div className="text-2xl font-extrabold font-headline text-slate-900 dark:text-white">
            100% Permitted
          </div>
          <p className="text-[11px] text-slate-500 font-label">
            RDB investor protections &amp; freehold rights
          </p>
        </div>
      </div>

      {/* Interactive Simulator Section */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 text-xs font-bold font-headline uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">tune</span>
            Interactive Financial Model
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-headline text-slate-900 dark:text-white">
            Rwandan Property Yield &amp; ROI Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Adjust the sliders below to forecast capital appreciation, rental yield, and equity returns over your investment horizon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders on Left */}
          <div className="lg:col-span-7 space-y-6">
            <CustomSlider
              id="sim-price"
              label="Asset Acquisition Price"
              value={purchasePrice}
              min={80000}
              max={2500000}
              step={20000}
              prefix="$"
              description="Total purchase price including registration fees"
              onChange={setPurchasePrice}
            />

            <CustomSlider
              id="sim-down"
              label="Down Payment / Equity Contribution"
              value={downPaymentPercent}
              min={10}
              max={100}
              step={5}
              unit="%"
              description={`Equity injected: $${downPayment.toLocaleString()} (Debt: $${loanAmount.toLocaleString()})`}
              onChange={setDownPaymentPercent}
            />

            <CustomSlider
              id="sim-appreciation"
              label="Projected Annual Appreciation Rate"
              value={appreciationRate}
              min={3}
              max={25}
              step={1}
              unit="% / yr"
              description="Historical Rebero &amp; Nyarugenge average is 11-14% per annum"
              onChange={setAppreciationRate}
            />

            <CustomSlider
              id="sim-years"
              label="Investment Holding Horizon"
              value={holdingYears}
              min={1}
              max={15}
              step={1}
              unit=" Years"
              description="Holding period before planned liquidation or refinancing"
              onChange={setHoldingYears}
            />

            <div className="pt-2">
              <CustomToggle
                id="expat-tax"
                label="Apply Rwanda Development Board (RDB) Investment Incentives"
                description="Includes accelerated depreciation and 0% capital gains tax for qualified long-term holdings"
                checked={includeExpatTaxIncentives}
                onChange={setIncludeExpatTaxIncentives}
              />
            </div>
          </div>

          {/* Forecast Output Bento Card on Right */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-blue-800/30 shadow-xl space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 font-headline">
                Forecasted {holdingYears}-Year Outlook
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-headline mt-1 text-white">
                ${futureValue.toLocaleString()}
              </div>
              <p className="text-xs text-blue-200/80 mt-1">
                Projected valuation in {new Date().getFullYear() + holdingYears}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 font-label uppercase">Total Capital Gain</span>
                <p className="text-base font-bold font-headline text-emerald-400 mt-0.5">
                  +${capitalGain.toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 font-label uppercase">Cumulative Rent</span>
                <p className="text-base font-bold font-headline text-blue-300 mt-0.5">
                  +${totalRentalIncome.toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 font-label uppercase">Est. Monthly Rent</span>
                <p className="text-base font-bold font-headline text-white mt-0.5">
                  ${estimatedMonthlyRent.toLocaleString()} / mo
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 font-label uppercase">Total Return on Equity</span>
                <p className="text-base font-bold font-headline text-amber-300 mt-0.5">
                  +{returnOnEquity}% ROE
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Total Combined Profits:</span>
                <span className="font-extrabold font-headline text-white text-sm">
                  +${totalReturn.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenValuation}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-headline text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
              Export Formal PDF Investment Memo
            </button>
          </div>
        </div>
      </section>

      {/* District Intelligence Breakdown */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-headline text-slate-900 dark:text-white">
          Regional Growth Corridors in Rwanda
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {districts.map((d) => (
            <div
              key={d.name}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {d.tag}
                  </span>
                  <h3 className="text-base font-bold font-headline text-slate-900 dark:text-white mt-2">
                    {d.name}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-headline">
                  {d.growth}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-body">
                {d.description}
              </p>

              <div className="flex items-center justify-between text-xs pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <span>Avg Price: <strong className="text-slate-900 dark:text-white">{d.priceSqm}</strong></span>
                <span>Occupancy: <strong className="text-slate-900 dark:text-white">{d.occupancy}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
