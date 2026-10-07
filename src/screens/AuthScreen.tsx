import React, { useState } from 'react';
import { User, UserRole } from '../types/index.js';

interface AuthScreenProps {
  onLoginSuccess: (user: User, token: string) => void;
  onCancel?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>('owner');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister
      ? { name, email, phone, role, password }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      // Successful login/register
      localStorage.setItem('digital_estate_jwt', data.token);
      localStorage.setItem('digital_estate_user', JSON.stringify(data.user));
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click demo logins
  const handleQuickDemoLogin = async (demoEmail: string, demoRole: UserRole, demoName: string) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password123' }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('digital_estate_jwt', data.token);
        localStorage.setItem('digital_estate_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
        return;
      }
    } catch {
      // Fallback local mock if backend offline
    }

    // Mock fallback user
    const mockUser: User = {
      id: `usr-${Date.now()}`,
      name: demoName,
      email: demoEmail,
      role: demoRole,
      avatarUrl:
        demoRole === 'owner'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB'
          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNnsM2qZznMr2bOd5Lfw9M6QQq4uZDif7lwv_ggpnimoXxrTK49IyLITqtdfYzMIZrtjY_zUbhwbyCjLCfK6fegHP0E8UeVVTiSERIltCQACEIbuybdiohJHocQ0Tt3VdoWtEg2l5djKg3LPFHNSbeXi6upWW7oaXwvNUqbW29i-2TPcWRdGvrYKjXB2c4g8cj-AJNO0Lyiv_OCg3XcOQkbmlfHnQ82Fs2KxWO8qyTNDjVIdbwloCefmkBkq1nK4UOJTwC334WmHoV',
      token: 'jwt-demo-token-rwanda-2026',
    };

    localStorage.setItem('digital_estate_jwt', mockUser.token!);
    localStorage.setItem('digital_estate_user', JSON.stringify(mockUser));
    onLoginSuccess(mockUser, mockUser.token!);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Brand Header Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-8 text-center relative">
          <div className="w-14 h-14 bg-white/10 rounded-2xl mx-auto flex items-center justify-center backdrop-blur-md border border-white/20 mb-3 shadow-md">
            <span className="material-symbols-outlined text-3xl text-blue-300 fill-1">
              domain
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-headline uppercase tracking-wider">
            The Digital Estate
          </h1>
          <p className="text-xs text-blue-200 mt-1 font-label">
            Emma &amp; Dany Luxury Rwandan Realty &middot; Secure JWT Portal
          </p>

          {onCancel && (
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>

        {/* Quick Demo Login Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-b border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 text-center font-headline">
            One-Click Demo Instant Access
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner@digitalestate.rw', 'owner', 'Emma Mugisha')}
              className="px-3 py-1.5 rounded-lg bg-blue-900 text-white text-[11px] font-bold hover:bg-blue-800 transition-colors shadow-xs"
            >
              👑 Login as Owner (Emma)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('buyer@digitalestate.rw', 'buyer', 'Jean-Luc Habimana')}
              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold hover:bg-slate-300 transition-colors shadow-xs"
            >
              💼 Login as Buyer (Jean-Luc)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('agent@digitalestate.rw', 'agent', 'Dany Mugisha')}
              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold hover:bg-slate-300 transition-colors shadow-xs"
            >
              📐 Login as Agent (Dany)
            </button>
          </div>
        </div>

        {/* Auth Mode Toggle */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold font-headline uppercase tracking-wider rounded-lg transition-all ${
                !isRegister
                  ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold font-headline uppercase tracking-wider rounded-lg transition-all ${
                isRegister
                  ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-headline">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Emma Mugisha"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-headline">
                    Your Primary Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-600 outline-hidden font-headline font-bold"
                  >
                    <option value="owner">Property Owner / Estate Manager</option>
                    <option value="buyer">Accredited Buyer / Investor</option>
                    <option value="tenant">Executive Tenant</option>
                    <option value="agent">Licensed Notary / Broker</option>
                    <option value="staff">Emma &amp; Dany Operational Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-headline">
                    Phone (WhatsApp Enabled)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 788 000 000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-headline">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-headline">
                  Password
                </label>
                {!isRegister && (
                  <span className="text-[10px] text-slate-400">Default demo: password123</span>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-900 dark:bg-blue-600 text-white font-headline text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2 mt-4"
            >
              {loading && (
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
              )}
              {isRegister ? 'Register & Generate JWT' : 'Secure JWT Sign In'}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center">
            By signing in you agree to Emma &amp; Dany Luxury Realty Terms of Service and data privacy compliance under the Rwandan Data Protection Law (Law N° 058/2021).
          </p>
        </div>
      </div>
    </div>
  );
};
