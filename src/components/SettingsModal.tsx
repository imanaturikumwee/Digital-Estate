import React from 'react';
import { UserPreferences } from '../types/index.js';
import { CustomToggle } from './CustomToggle.js';
import { CustomSlider } from './CustomSlider.js';

interface SettingsModalProps {
  isOpen: boolean;
  preferences: UserPreferences;
  onClose: () => void;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onResetPreferences: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  preferences,
  onClose,
  onUpdatePreferences,
  onResetPreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
        className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">settings</span>
            </div>
            <div>
              <h2 id="settings-dialog-title" className="font-headline font-bold text-xl text-on-surface">
                User Preferences &amp; Settings
              </h2>
              <p className="text-xs text-on-surface-variant">
                Personalize display modes, accessibility aids, and algorithmic property filters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1 divide-y divide-outline-variant/10">
          {/* Section 1: Visual Theme & Appearance */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-outline">
              Appearance &amp; Dark Mode
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onUpdatePreferences({ theme: 'light' })}
                className={`p-3.5 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${
                  preferences.theme === 'light'
                    ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                    : 'border-outline-variant/30 text-on-surface-variant hover:border-outline'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">light_mode</span>
                <span className="text-xs">Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdatePreferences({ theme: 'dark' })}
                className={`p-3.5 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${
                  preferences.theme === 'dark'
                    ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                    : 'border-outline-variant/30 text-on-surface-variant hover:border-outline'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">dark_mode</span>
                <span className="text-xs">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdatePreferences({ theme: 'system' })}
                className={`p-3.5 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${
                  preferences.theme === 'system'
                    ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                    : 'border-outline-variant/30 text-on-surface-variant hover:border-outline'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">devices</span>
                <span className="text-xs">System Auto</span>
              </button>
            </div>

            <CustomToggle
              id="high-contrast-toggle"
              label="High Contrast Mode (WCAG AAA)"
              description="Boost text contrast, strengthen card borders, and enforce pure black/white backdrops for maximum legibility."
              checked={preferences.highContrast}
              onChange={(checked) => onUpdatePreferences({ highContrast: checked })}
            />

            <CustomToggle
              id="reduced-motion-toggle"
              label="Reduce Motion &amp; Transitions"
              description="Eliminates parallax effects and optimizes animations for users sensitive to motion."
              checked={preferences.reducedMotion}
              onChange={(checked) => onUpdatePreferences({ reducedMotion: checked })}
            />
          </div>

          {/* Section 2: Interactive Sliders */}
          <div className="pt-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-outline">
              Interactive Filter Sliders
            </h3>

            <CustomSlider
              id="price-range-slider"
              label="Maximum Budget Ceiling"
              description="Caps displayed luxury residential & commercial listings."
              value={preferences.priceRangeMax}
              min={100000}
              max={3000000}
              step={50000}
              prefix="$"
              onChange={(val) => onUpdatePreferences({ priceRangeMax: val })}
            />

            <CustomSlider
              id="min-roi-slider"
              label="Minimum Target Yield / Annual ROI"
              description="Filters assets where projected capital appreciation meets this benchmark."
              value={preferences.minRoiPercent}
              min={4}
              max={24}
              step={1}
              unit="%"
              onChange={(val) => onUpdatePreferences({ minRoiPercent: val })}
            />

            <CustomSlider
              id="distance-slider"
              label="Maximum Distance to Kigali CBD"
              description="Radius around City Center / Nyarugenge business district."
              value={preferences.maxDistanceKm}
              min={2}
              max={40}
              step={2}
              unit=" km"
              onChange={(val) => onUpdatePreferences({ maxDistanceKm: val })}
            />

            <CustomSlider
              id="font-size-slider"
              label="Accessibility Text Scale"
              description="Scales UI text sizes dynamically for improved readability."
              value={preferences.fontSizeMultiplier}
              min={90}
              max={125}
              step={5}
              unit="%"
              onChange={(val) => onUpdatePreferences({ fontSizeMultiplier: val })}
            />
          </div>

          {/* Section 3: Notification & Algorithmic Preferences */}
          <div className="pt-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-outline">
              System &amp; Alerts
            </h3>

            <CustomToggle
              id="push-notifs-toggle"
              label="Real-time Concierge &amp; Lead Alerts"
              description="Receive immediate server push notifications when agents or buyers respond."
              checked={preferences.notificationsEnabled}
              onChange={(checked) => onUpdatePreferences({ notificationsEnabled: checked })}
            />

            <CustomToggle
              id="ai-engine-toggle"
              label="Proprietary AI Matching Engine"
              description="Synthesize over 50 data points (soil, elevation, diplomatic proximity) to tailor property suggestions."
              checked={preferences.aiRecommendationsEnabled}
              onChange={(checked) => onUpdatePreferences({ aiRecommendationsEnabled: checked })}
            />

            <div className="flex items-center justify-between pt-2">
              <div>
                <label className="text-sm font-semibold text-on-surface">Base Currency</label>
                <p className="text-xs text-on-surface-variant">Used for pricing, yields, and report exports.</p>
              </div>
              <div className="flex gap-1 p-1 bg-surface-container-high rounded-lg">
                {(['USD', 'RWF', 'EUR'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => onUpdatePreferences({ currency: curr })}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      preferences.currency === curr
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-outline-variant/10 bg-surface-container-low/40 flex justify-between items-center">
          <button
            type="button"
            onClick={onResetPreferences}
            className="text-xs font-semibold text-outline hover:text-error transition-colors"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
          >
            Save &amp; Apply
          </button>
        </div>
      </div>
    </div>
  );
};
