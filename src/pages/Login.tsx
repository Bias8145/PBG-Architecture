import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { Building2, ArrowLeft, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

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
        result = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: {
                    role: 'admin' // Optional metadata
                }
            }
        });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;

      if (isSignUp && result.data.user) {
         // Check if email confirmation is required by Supabase settings
         if (result.data.user.identities?.length === 0) {
             setError("Account already registered. Please sign in.");
         } else {
             setError("Account created! Please check your email or sign in.");
             setIsSignUp(false);
         }
      } else if (!isSignUp && result.data.session) {
        navigate('/admin');
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message === "Invalid login credentials" 
        ? "Email atau kata sandi salah. Silakan coba lagi." 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 py-12 transition-colors duration-300 relative overflow-hidden">
      <SEO title={isSignUp ? 'Register Admin' : t.admin.loginTitle} />
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-slate-900 skew-y-3 transform -translate-y-20 z-0"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl z-0"></div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-xl shadow-lg shadow-blue-600/30 transform rotate-3">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">
            {isSignUp ? 'Create Admin Account' : t.admin.loginTitle}
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-8">
            Enter your credentials to access the dashboard
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-4 rounded-xl mb-6 text-sm flex items-start space-x-3 ${
                error.includes('created') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30'
              }`}
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                {t.admin.email}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                {t.admin.password}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                isSignUp ? 'Create Account' : t.admin.signIn
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-700">
            <button 
                type="button" 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : 'Need an account? Create one'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
