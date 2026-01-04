import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { Building2 } from 'lucide-react';

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;

      if (isSignUp && result.data.user) {
         setError("Account created! Please sign in.");
         setIsSignUp(false);
      } else if (!isSignUp && result.data.session) {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full">
            <Building2 className="h-8 w-8 text-blue-700 dark:text-blue-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-8">
          {isSignUp ? 'Register Admin' : t.admin.loginTitle}
        </h2>

        {error && (
          <div className={`p-3 rounded mb-4 text-sm ${error.includes('created') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : t.admin.signIn)}
          </button>
        </form>
        
        <div className="mt-4 text-center">
            <button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400"
            >
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
        </div>
      </div>
    </div>
  );
}
