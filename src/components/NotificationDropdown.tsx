import React from 'react';
import { NotificationItem } from '../types/index.js';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onTriggerTest: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onTriggerTest,
}) => {
  if (!isOpen) return null;

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => !n?.read).length;

  return (
    <div
      role="region"
      aria-label="Notifications panel"
      className="absolute right-0 top-14 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/20 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/50">
        <div className="flex items-center gap-2">
          <span className="font-headline font-bold text-sm text-on-surface">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerTest}
            title="Simulate live lead or valuation ping"
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            + Test Ping
          </button>
          <button
            onClick={onClose}
            aria-label="Close notifications"
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-md"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/10">
        {safeNotifications.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant text-xs">
            No notifications at this time
          </div>
        ) : (
          safeNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkRead(notif.id)}
              className={`p-3.5 hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3 ${
                !notif.read ? 'bg-primary/5' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm ${
                  notif.type === 'lead'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : notif.type === 'valuation'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {notif.type === 'lead' ? 'person_add' : notif.type === 'valuation' ? 'analytics' : 'notifications'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <p className={`text-xs ${!notif.read ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'} truncate`}>
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-outline shrink-0 font-mono">{notif.time}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 self-center" />
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-surface-container-low text-center border-t border-outline-variant/10 text-[11px] text-outline flex items-center justify-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Connected to Real-time SSE Stream</span>
      </div>
    </div>
  );
};
