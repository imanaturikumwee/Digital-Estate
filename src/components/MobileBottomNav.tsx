import React from 'react';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSettings: () => void;
  onOpenAdd: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  onOpenAdd,
}) => {
  return (
    <>
      {/* Floating Action Button for quick actions */}
      <button
        onClick={onOpenAdd}
        title="Add New Listing"
        aria-label="Add New Listing"
        className="fixed bottom-20 right-5 w-13 h-13 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform md:hidden"
      >
        <span className="material-symbols-outlined text-2xl font-bold">add</span>
      </button>

      {/* Bottom Nav Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden"
      >
        <button
          onClick={() => onSelectTab('estates')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            currentTab === 'estates'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200'
              : 'text-slate-400 dark:text-slate-500 hover:text-blue-700'
          }`}
        >
          <span
            className="material-symbols-outlined text-xl mb-0.5"
            style={{ fontVariationSettings: currentTab === 'estates' ? "'FILL' 1" : "'FILL' 0" }}
          >
            dashboard
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Portfolio</span>
        </button>

        <button
          onClick={() => onSelectTab('portal')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            currentTab === 'portal'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200'
              : 'text-slate-400 dark:text-slate-500 hover:text-blue-700'
          }`}
        >
          <span
            className="material-symbols-outlined text-xl mb-0.5"
            style={{ fontVariationSettings: currentTab === 'portal' ? "'FILL' 1" : "'FILL' 0" }}
          >
            explore
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Discover</span>
        </button>

        <button
          onClick={() => onSelectTab('messages')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            currentTab === 'messages'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200'
              : 'text-slate-400 dark:text-slate-500 hover:text-blue-700'
          }`}
        >
          <span
            className="material-symbols-outlined text-xl mb-0.5"
            style={{ fontVariationSettings: currentTab === 'messages' ? "'FILL' 1" : "'FILL' 0" }}
          >
            chat
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Chats</span>
        </button>

        <button
          onClick={() => onSelectTab('growth')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            currentTab === 'growth'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200'
              : 'text-slate-400 dark:text-slate-500 hover:text-blue-700'
          }`}
        >
          <span
            className="material-symbols-outlined text-xl mb-0.5"
            style={{ fontVariationSettings: currentTab === 'growth' ? "'FILL' 1" : "'FILL' 0" }}
          >
            trending_up
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Growth</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 dark:text-slate-500 hover:text-blue-700 transition-all"
        >
          <span className="material-symbols-outlined text-xl mb-0.5">settings</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
        </button>
      </nav>
    </>
  );
};
