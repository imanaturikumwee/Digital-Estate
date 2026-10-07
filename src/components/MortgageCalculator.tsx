import React, { useState } from 'react';
import { CustomSlider } from './CustomSlider.js';

interface MortgageCalculatorProps {
  initialPrice?: number;
  onApplyForFinancing?: (details: any) => void;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  initialPrice = 450000,
  onApplyForFinancing,
}) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(initialPrice);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(25);
  const [loanCurrency, setLoanCurrency] = useState<'USD' | 'RWF'>('USD');
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5% for USD, or 16% for RWF
  const [loanTermYears, setLoanTermYears] = useState<number>(20);
  const [selectedBank, setSelectedBank] = useState<string>('Bank of Kigali (BK)');

  // Calculations
  const downPaymentAmount = Math.round(propertyPrice * (downPaymentPct / 100));
  const principal = propertyPrice - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  const monthlyPayment =
    monthlyRate > 0
      ? Math.round(
          (principal *
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
        )
      : Math.round(principal / numberOfPayments);

  const totalCost = monthlyPayment * numberOfPayments + downPaymentAmount;
  const totalInterest = totalCost - propertyPrice;

  // Convert to RWF for reference
  const monthlyPaymentRWF = Math.round(monthlyPayment * 1420);

  const handleCurrencySwitch = (curr: 'USD' | 'RWF') => {
    setLoanCurrency(curr);
    if (curr === 'USD') {
      setInterestRate(8.5);
    } else {
      setInterestRate(16.0);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 text-xs font-bold font-headline uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">account_balance</span>
            Rwandan Banking &amp; Mortgage Partner Desk
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-headline text-slate-900 dark:text-white mt-2">
            Mortgage &amp; Financing Estimator
          </h2>
          <p className="text-xs text-slate-500">
            Model loan terms pre-vetted with major commercial banks in Rwanda (Bank of Kigali, Equity Bank, I&amp;M).
          </p>
        </div>

        {/* Currency Switch */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => handleCurrencySwitch('USD')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              loanCurrency === 'USD'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            USD Loan (7.5-9%)
          </button>
          <button
            onClick={() => handleCurrencySwitch('RWF')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              loanCurrency === 'RWF'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            RWF Loan (15-17%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders on Left */}
        <div className="lg:col-span-7 space-y-5">
          <CustomSlider
            id="mortgage-price"
            label="Property Purchase Price"
            value={propertyPrice}
            min={100000}
            max={3000000}
            step={25000}
            prefix="$"
            description="Agreed acquisition price"
            onChange={setPropertyPrice}
          />

          <CustomSlider
            id="mortgage-down"
            label="Down Payment / Cash Equity"
            value={downPaymentPct}
            min={15}
            max={60}
            step={5}
            unit="%"
            description={`Cash deposit required: $${downPaymentAmount.toLocaleString()}`}
            onChange={setDownPaymentPct}
          />

          <CustomSlider
            id="mortgage-interest"
            label="Annual Interest Rate (APR)"
            value={interestRate}
            min={loanCurrency === 'USD' ? 6.0 : 13.0}
            max={loanCurrency === 'USD' ? 12.0 : 20.0}
            step={0.25}
            unit="%"
            description={
              loanCurrency === 'USD'
                ? 'Prime USD expatriate and diaspora mortgage rate'
                : 'Local currency bank prime lending rate'
            }
            onChange={setInterestRate}
          />

          <CustomSlider
            id="mortgage-term"
            label="Amortization Term"
            value={loanTermYears}
            min={5}
            max={25}
            step={5}
            unit=" Years"
            description="Total repayment horizon"
            onChange={setLoanTermYears}
          />

          {/* Bank Partner Selection */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-headline">
              Preferred Rwandan Lending Institution:
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold font-headline focus:ring-2 focus:ring-blue-600 outline-hidden"
            >
              <option value="Bank of Kigali (BK)">Bank of Kigali (BK) &middot; Prime Expatriate Facility</option>
              <option value="Equity Bank Rwanda">Equity Bank Rwanda &middot; Diaspora Mortgage Program</option>
              <option value="I&M Bank Rwanda">I&amp;M Bank Rwanda &middot; Private Wealth Services</option>
              <option value="BPR Bank Rwanda">BPR Bank Rwanda (part of Atlas Mara)</option>
            </select>
          </div>
        </div>

        {/* Output Card on Right */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-blue-800/30 shadow-xl space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 font-headline">
              Estimated Monthly Repayment
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-headline mt-1 text-white">
              ${monthlyPayment.toLocaleString()}
              <span className="text-xs font-normal text-slate-300 font-body"> / month</span>
            </div>
            <p className="text-xs text-blue-200/80 mt-1">
              &approx; {(monthlyPaymentRWF / 1000000).toFixed(2)}M RWF / month at current rate
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Required Down Payment ({downPaymentPct}%):</span>
              <strong className="text-white">${downPaymentAmount.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Principal Loan Amount:</span>
              <strong className="text-white">${principal.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Total Interest over {loanTermYears} yrs:</span>
              <strong className="text-amber-300">${totalInterest.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Selected Bank Partner:</span>
              <strong className="text-blue-300">{selectedBank}</strong>
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] text-slate-300 leading-normal">
            💡 <strong>Emma &amp; Dany Advantage:</strong> Our dedicated notary liaisons fast-track mortgage registration with the Rwanda Development Board (RDB) and guarantee clear title deed endorsement within 48 hours.
          </div>

          <button
            onClick={() => {
              if (onApplyForFinancing) {
                onApplyForFinancing({
                  propertyPrice,
                  downPaymentAmount,
                  principal,
                  monthlyPayment,
                  selectedBank,
                  loanTermYears,
                });
              }
            }}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-headline text-xs font-bold uppercase tracking-wider shadow-lg transition-all text-center flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">verified_user</span>
            Apply for Bank Pre-Approval
          </button>
        </div>
      </div>
    </div>
  );
};
