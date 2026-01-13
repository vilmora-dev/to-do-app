import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

// Local demo AuthContext for this file
const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (_value) => {},
});

export function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <LoginPageUI />
    </AuthContext.Provider>
  );
}

function LoginPageUI() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Fake "login" logic: always succeeds after small delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mark as authenticated locally and redirect
    setIsAuthenticated(true);
    navigate('/');

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-950/70 border border-white/10 rounded-3xl p-8 shadow-[0_24px_80px_rgba(15,23,42,0.85)] backdrop-blur-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-white mt-5 mb-1 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate-200/70">
              Sign in to your TaskFlow account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-start gap-3 text-sm text-red-100">
              <AlertCircle className="text-red-200 flex-shrink-0 mt-0.5" size={18} />
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-200/80 mb-2 uppercase tracking-[0.16em]">
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300/60 pointer-events-none"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-slate-300/40 shadow-[0_16px_40px_rgba(15,23,42,0.7)] focus:outline-none focus:border-indigo-300/80 focus:bg-white/10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200/80 mb-2 uppercase tracking-[0.16em]">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300/60 pointer-events-none"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-slate-300/40 shadow-[0_16px_40px_rgba(15,23,42,0.7)] focus:outline-none focus:border-indigo-300/80 focus:bg-white/10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 w-full inline-flex items-center justify-center rounded-2xl bg-slate-100 text-slate-900 text-sm font-semibold py-3 px-4 border border-slate-200/80 shadow-sm transition hover:bg-white hover:border-slate-100 active:bg-slate-200 disabled:bg-slate-300 disabled:text-slate-500 disabled:border-slate-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-300"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-slate-200/70">
            <p>Demo mode: use any email and password to log in</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
