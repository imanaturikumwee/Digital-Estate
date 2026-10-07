import React, { useState } from 'react';
import { User, NotificationItem } from '../types/index.js';
import { NotificationDropdown } from './NotificationDropdown.js';

interface HeaderProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  deviceMode: 'fluid' | 'desktop' | 'tablet' | 'mobile';
  onSetDeviceMode: (mode: 'fluid' | 'desktop' | 'tablet' | 'mobile') => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenSettings: () => void;
  onOpenDocs: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onTriggerTestNotification: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  currentUser,
  onLogout,
  deviceMode,
  onSetDeviceMode,
  isDark,
  onToggleDark,
  onOpenSettings,
  onOpenDocs,
  notifications,
  onMarkNotificationRead,
  onTriggerTestNotification,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => !n?.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Device & Accessibility Utility Bar */}
      <div className="bg-slate-100 dark:bg-slate-950 px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-900 dark:text-blue-400 font-headline">Preview Device:</span>
          <div className="flex gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
            {(
              [
                { mode: 'fluid', label: 'Fluid Screen', icon: 'fit_screen' },
                { mode: 'desktop', label: 'Desktop 1440px', icon: 'desktop_windows' },
                { mode: 'tablet', label: 'Tablet 768px', icon: 'tablet_mac' },
                { mode: 'mobile', label: 'Mobile 390px', icon: 'smartphone' },
              ] as const
            ).map((item) => (
              <button
                key={item.mode}
                onClick={() => onSetDeviceMode(item.mode)}
                title={`Switch to ${item.label}`}
                aria-label={item.label}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                  deviceMode === item.mode
                    ? 'bg-blue-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1 hover:text-blue-900 dark:hover:text-blue-300 transition-colors text-slate-500 hover:underline"
          >
            <span className="material-symbols-outlined text-sm">terminal</span>
            <span>Docs &amp; Tests</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <button
            onClick={onToggleDark}
            className="flex items-center gap-1 hover:text-blue-900 dark:hover:text-blue-300 transition-colors text-slate-500"
            title="Toggle Light / Dark mode"
            aria-label={`Toggle theme, current is ${isDark ? 'Dark' : 'Light'}`}
          >
            <span className="material-symbols-outlined text-sm">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 hover:text-blue-900 dark:hover:text-blue-300 transition-colors text-slate-500"
            title="Open user preferences & filters"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 h-16 max-w-screen-2xl mx-auto">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('portal')}
            className="text-left group cursor-pointer focus:outline-hidden"
          >
            <span className="text-xl font-headline font-extrabold tracking-tight text-blue-900 dark:text-white uppercase">
              Emma &amp; Dany
            </span>
            <span className="block text-[9px] font-headline font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
              The Digital Estate &middot; Rwanda
            </span>
          </button>

          {/* Primary Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 font-headline text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => onNavigate('portal')}
              className={`pb-1 transition-colors ${
                currentScreen === 'portal'
                  ? 'text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white'
              }`}
            >
              Public Gallery
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`pb-1 transition-colors ${
                currentScreen === 'dashboard'
                  ? 'text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white'
              }`}
            >
              Estate Manager
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className={`pb-1 transition-colors ${
                currentScreen === 'chat'
                  ? 'text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white'
              }`}
            >
              Concierge Chat
            </button>
            <button
              onClick={() => onNavigate('insights')}
              className={`pb-1 transition-colors ${
                currentScreen === 'insights'
                  ? 'text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white'
              }`}
            >
              Market Insights
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 relative">
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative flex items-center justify-center"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
              )}
            </button>

            <NotificationDropdown
              notifications={safeNotifications}
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              onMarkRead={onMarkNotificationRead}
              onTriggerTest={onTriggerTestNotification}
            />
          </div>

          {/* Chat shortcut button */}
          <button
            onClick={() => onNavigate('chat')}
            className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
            title="Open Concierge Chat"
            aria-label="Concierge Chat"
          >
            <span className="material-symbols-outlined text-xl">chat</span>
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
            title="User Preferences & Sliders"
            aria-label="Settings"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>

          {/* User Profile / Auth State */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="User account menu"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-blue-900/20"
                />
                <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 capitalize font-headline">
                  {currentUser.role}
                </span>
                <span className="material-symbols-outlined text-sm text-slate-400">arrow_drop_down</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate font-headline">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('dashboard');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">dashboard</span>
                    <span>My Estates</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenSettings();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">tune</span>
                    <span>Preferences</span>
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 font-bold"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('auth')}
                className="px-3.5 py-1.5 text-xs font-bold text-blue-900 dark:text-blue-300 hover:underline font-headline"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-1.5 bg-blue-900 dark:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all font-headline"
              >
                Join Estate
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
