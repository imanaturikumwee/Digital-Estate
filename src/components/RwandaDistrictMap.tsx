import React from 'react';

interface DistrictInfo {
  id: string;
  name: string;
  region: string;
  averagePriceSqm: string;
  propertiesCount: number;
  growth: string;
  highlights: string;
  cx: number;
  cy: number;
}

interface RwandaDistrictMapProps {
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
}

export const RwandaDistrictMap: React.FC<RwandaDistrictMapProps> = ({
  selectedDistrict,
  onSelectDistrict,
}) => {
  const districts: DistrictInfo[] = [
    {
      id: 'Rebero',
      name: 'Rebero Ridge',
      region: 'Kicukiro District, Kigali',
      averagePriceSqm: '$1,050 / m²',
      propertiesCount: 3,
      growth: '+14.2% /yr',
      highlights: 'Panoramic hilltop villas, diplomatic residences & infinity views',
      cx: 240,
      cy: 230,
    },
    {
      id: 'Nyarugenge',
      name: 'Nyarugenge CBD',
      region: 'Kigali City Center',
      averagePriceSqm: '$2,400 / m²',
      propertiesCount: 1,
      growth: '+9.8% /yr',
      highlights: 'Commercial high-rises, headquarters & banking district',
      cx: 210,
      cy: 195,
    },
    {
      id: 'Nyarutarama',
      name: 'Nyarutarama Estate',
      region: 'Gasabo District, Kigali',
      averagePriceSqm: '$1,550 / m²',
      propertiesCount: 1,
      growth: '+13.5% /yr',
      highlights: 'Golf course perimeter, luxury embassies & ultra-prime estates',
      cx: 260,
      cy: 175,
    },
    {
      id: 'Gasabo',
      name: 'Gasabo / Kigali Heights',
      region: 'Northern Kigali',
      averagePriceSqm: '$1,400 / m²',
      propertiesCount: 1,
      growth: '+11.2% /yr',
      highlights: 'Architectural cantilever residences & innovation hubs',
      cx: 250,
      cy: 140,
    },
    {
      id: 'Bugesera',
      name: 'Bugesera Airport Hub',
      region: 'Eastern Province',
      averagePriceSqm: '$45 / m²',
      propertiesCount: 1,
      growth: '+18.5% /yr',
      highlights: 'Special Economic Zone & upcoming Bugesera International Airport',
      cx: 310,
      cy: 280,
    },
    {
      id: 'Karongi',
      name: 'Lake Kivu (Karongi)',
      region: 'Western Waterfront',
      averagePriceSqm: '$850 / m²',
      propertiesCount: 1,
      growth: '+14.2% /yr',
      highlights: 'Private pontoon retreats, hospitality compounds & eco-resorts',
      cx: 90,
      cy: 190,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest font-headline text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-md">
            Interactive GIS Explorer
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold font-headline text-slate-900 dark:text-white mt-1.5">
            Rwanda &amp; Kigali Investment Corridors
          </h2>
          <p className="text-xs text-slate-500">
            Click on any geographical hotspot or district pill below to filter properties and view micro-market statistics.
          </p>
        </div>

        {selectedDistrict !== 'all' && (
          <button
            onClick={() => onSelectDistrict('all')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold font-headline hover:bg-slate-200 transition-colors"
          >
            Show All Rwanda
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Interactive Map */}
        <div className="lg:col-span-7 relative flex justify-center bg-slate-950/5 dark:bg-slate-950/40 p-4 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <svg
            viewBox="0 0 400 340"
            className="w-full max-w-[420px] h-auto drop-shadow-md select-none"
            aria-label="Map of Rwanda and Kigali investment districts"
            role="img"
          >
            {/* Abstract Rwanda Border Silhouette */}
            <path
              d="M 60,110 C 100,60 180,50 260,70 C 320,85 360,130 370,190 C 375,250 330,310 260,320 C 190,325 140,300 110,260 C 80,240 50,180 60,110 Z"
              fill="currentColor"
              className="text-slate-200 dark:text-slate-800 transition-colors"
            />
            {/* Lake Kivu Water body silhouette on West */}
            <path
              d="M 50,130 C 70,170 85,210 75,260 C 60,280 40,230 45,170 Z"
              fill="#38bdf8"
              opacity="0.35"
            />
            <text x="50" y="220" className="text-[10px] fill-sky-600 dark:fill-sky-400 font-bold tracking-wider" transform="rotate(-70 50 220)">
              LAKE KIVU
            </text>

            {/* Kigali Core Zone Marker */}
            <circle
              cx="235"
              cy="185"
              r="45"
              fill="none"
              stroke="#2563eb"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              className="animate-pulse"
            />
            <text x="215" y="160" className="text-[9px] font-extrabold fill-blue-900 dark:fill-blue-300 font-headline uppercase tracking-wider">
              Kigali Urban Zone
            </text>

            {/* District Hotspot Points */}
            {districts.map((d) => {
              const isSelected = selectedDistrict.toLowerCase() === d.id.toLowerCase();
              return (
                <g
                  key={d.id}
                  onClick={() => onSelectDistrict(d.id)}
                  className="cursor-pointer group"
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${d.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onSelectDistrict(d.id);
                  }}
                >
                  {/* Ping animation when selected */}
                  {isSelected && (
                    <circle
                      cx={d.cx}
                      cy={d.cy}
                      r="16"
                      fill="#2563eb"
                      opacity="0.25"
                      className="animate-ping"
                    />
                  )}
                  {/* Outer circle */}
                  <circle
                    cx={d.cx}
                    cy={d.cy}
                    r={isSelected ? 10 : 8}
                    fill={isSelected ? '#1e3a8a' : '#2563eb'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="transition-all duration-300 group-hover:scale-125"
                  />
                  {/* Label tag */}
                  <rect
                    x={d.cx + 12}
                    y={d.cy - 12}
                    width={d.name.length * 6.5 + 16}
                    height="20"
                    rx="6"
                    fill={isSelected ? '#0f172a' : '#ffffff'}
                    stroke={isSelected ? '#3b82f6' : '#cbd5e1'}
                    strokeWidth="1"
                    className="transition-colors shadow-sm"
                  />
                  <text
                    x={d.cx + 18}
                    y={d.cy + 1}
                    className={`text-[9px] font-bold font-headline ${
                      isSelected ? 'fill-white' : 'fill-slate-800'
                    }`}
                  >
                    {d.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* District Detail Cards Column */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-headline">
            District Intelligence Highlights:
          </span>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {districts.map((d) => {
              const isSelected = selectedDistrict.toLowerCase() === d.id.toLowerCase();
              return (
                <div
                  key={d.id}
                  onClick={() => onSelectDistrict(d.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold font-headline text-slate-900 dark:text-white flex items-center gap-1.5">
                        {d.name}
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </h3>
                      <p className="text-[10px] text-slate-500">{d.region}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-300 font-headline">
                        {d.growth}
                      </span>
                      <p className="text-[10px] text-slate-400">{d.averagePriceSqm}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 font-body leading-normal">
                    {d.highlights}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 text-[10px]">
                    <span className="text-slate-500 font-medium">
                      Available: <strong className="text-slate-800 dark:text-slate-200">{d.propertiesCount} listings</strong>
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                      Filter to this zone &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
