import React, { useState } from 'react';

interface BookViewingModalProps {
  isOpen: boolean;
  propertyTitle?: string;
  onClose: () => void;
  onConfirm: (booking: { date: string; time: string; chauffeur: boolean; notes: string }) => void;
}

export const BookViewingModal: React.FC<BookViewingModalProps> = ({
  isOpen,
  propertyTitle = 'Kigali View Heights',
  onClose,
  onConfirm,
}) => {
  const [date, setDate] = useState('2026-10-10');
  const [time, setTime] = useState('10:00 AM');
  const [chauffeur, setChauffeur] = useState(true);
  const [notes, setNotes] = useState('Interested in viewing structural foundation & solar battery system.');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ date, time, chauffeur, notes });
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden"
      >
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">calendar_today</span>
            </div>
            <div>
              <h2 id="booking-modal-title" className="font-headline font-bold text-lg text-on-surface">
                Book a Private Viewing
              </h2>
              <p className="text-xs text-on-surface-variant">{propertyTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {!confirmed ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                Preferred Viewing Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                Time Slot
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface"
              >
                <option value="09:00 AM">09:00 AM - Morning Sunlight</option>
                <option value="10:00 AM">10:00 AM - Prime Daylight</option>
                <option value="02:30 PM">02:30 PM - Afternoon Inspection</option>
                <option value="05:00 PM">05:00 PM - Sunset View Experience</option>
              </select>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-surface-container-low rounded-xl">
              <input
                type="checkbox"
                id="chauffeur"
                checked={chauffeur}
                onChange={(e) => setChauffeur(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <label htmlFor="chauffeur" className="text-xs font-medium text-on-surface cursor-pointer">
                Request Executive Chauffeur (Kigali City Center pickup)
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                Special Requests
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">
                Viewing Scheduled!
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Agent Dany will meet you on <strong>{date}</strong> at <strong>{time}</strong>. An itinerary and security access pass has been transmitted to your email.
              </p>
            </div>
            <button
              onClick={() => {
                setConfirmed(false);
                onClose();
              }}
              className="w-full py-3 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20"
            >
              Back to Conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
