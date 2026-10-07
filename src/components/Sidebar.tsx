import React from 'react';
import { User } from '../types/index.js';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAddProperty: () => void;
  onOpenSettings: () => void;
  currentUser: User | null;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddProperty,
  onOpenSettings,
  currentUser,
  collapsed = false,
}) => {
  const owner = currentUser || {
    name: 'Emma Mugisha',
    role: 'Estate Manager',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
  };

  return (
    <aside
      className={`h-full flex flex-col py-8 px-4 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className={`mb-8 ${collapsed ? 'px-0 text-center' : 'px-4'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-900 dark:bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
            <span className="material-symbols-outlined text-2xl fill-1">domain</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-blue-900 dark:text-blue-100 font-headline uppercase tracking-tight">
                The Estate
              </h1>
              <p className="text-[10px] font-headline uppercase tracking-widest text-slate-400">
                Premium Portfolio
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-2">
        <button
          onClick={() => onSelectTab('estates')}
          title="My Estates"
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left font-headline text-xs uppercase tracking-wider font-bold ${
            currentTab === 'estates'
              ? 'bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-300 border-r-4 border-blue-900 dark:border-blue-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: currentTab === 'estates' ? "'FILL' 1" : "'FILL' 0" }}>
            domain
          </span>
          {!collapsed && <span>My Estates</span>}
        </button>

        <button
          onClick={() => onSelectTab('portal')}
          title="Public Discovery Gallery"
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left font-headline text-xs uppercase tracking-wider font-bold ${
            currentTab === 'portal'
              ? 'bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-300 border-r-4 border-blue-900 dark:border-blue-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: currentTab === 'portal' ? "'FILL' 1" : "'FILL' 0" }}>
            explore
          </span>
          {!collapsed && <span>Public Gallery</span>}
        </button>

        <button
          onClick={() => onSelectTab('messages')}
          title="Messages & Concierge"
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left font-headline text-xs uppercase tracking-wider font-bold ${
            currentTab === 'messages'
              ? 'bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-300 border-r-4 border-blue-900 dark:border-blue-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <span className="material-symbols-outlined text-xl">chat_bubble</span>
          {!collapsed && <span>Messages</span>}
        </button>

        <button
          onClick={() => onSelectTab('growth')}
          title="Insights & Growth"
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left font-headline text-xs uppercase tracking-wider font-bold ${
            currentTab === 'growth'
              ? 'bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-300 border-r-4 border-blue-900 dark:border-blue-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <span className="material-symbols-outlined text-xl">insights</span>
          {!collapsed && <span>Insights</span>}
        </button>
      </nav>

      {/* Bottom Area */}
      <div className="mt-auto space-y-4">
        {/* Add Property Button */}
        <button
          onClick={onOpenAddProperty}
          title="Add New Property"
          className="w-full bg-blue-900 dark:bg-blue-600 text-white py-3 rounded-xl font-headline font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base">add</span>
          {!collapsed && <span>Add New Property</span>}
        </button>

        <div className="space-y-1">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-4 px-4 py-2 text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors text-xs uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
            {!collapsed && <span>Settings</span>}
          </button>
        </div>

        {/* Profile Card */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 px-2">
          <img
            src={owner.avatarUrl}
            alt={owner.name}
            className="w-10 h-10 rounded-full object-cover border border-blue-900/20 shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-blue-900 dark:text-blue-100 truncate font-headline">
                {owner.name}
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate">
                {owner.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
