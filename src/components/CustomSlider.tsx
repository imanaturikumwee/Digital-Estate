import React from 'react';

interface CustomSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  prefix?: string;
  description?: string;
  onChange: (value: number) => void;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  prefix = '',
  description,
  onChange,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="py-3">
      <div className="flex justify-between items-baseline mb-2">
        <div>
          <label htmlFor={id} className="text-sm font-semibold text-on-surface">
            {label}
          </label>
          {description && (
            <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
          )}
        </div>
        <span className="text-sm font-mono font-bold text-primary tabular-nums">
          {prefix}{value.toLocaleString()}{unit}
        </span>
      </div>

      <div className="relative flex items-center select-none touch-none w-full h-6">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          style={{
            background: `linear-gradient(to right, var(--color-primary, #00236f) 0%, var(--color-primary, #00236f) ${percentage}%, var(--color-surface-container-highest, #e1e3e4) ${percentage}%, var(--color-surface-container-highest, #e1e3e4) 100%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-[11px] font-mono text-outline mt-1 tabular-nums">
        <span>{prefix}{min.toLocaleString()}{unit}</span>
        <span>{prefix}{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
};
