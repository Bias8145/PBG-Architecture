import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  FolderOpen, 
  Phone, 
  LayoutDashboard, 
  LogIn, 
  LogOut, 
  Globe, 
  Sun, 
  Moon, 
  Building2,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { session, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  const handleLogout = async () => {
    // 1. Close menu immediately to prevent double clicks
    setMobileMenuOpen(false);
    
    // 2. Perform sign out
    await signOut();
    
    // 3. HARD REDIRECT to Landing Page ('/')
    // Ensures clean state and history
    window.location.replace('/');
  };

  const navItems: NavItem[] = [
    { label: t.nav.home, path: '/', icon: Home },
    { label: t.nav.services, path: '/#services', icon: Briefcase },
    { label: t.nav.portfolio, path: '/#portfolio', icon: FolderOpen },
    { label: t.nav.contact, path: '/#contact', icon: Phone },
  ];

  return (
    <>
      <header 
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 sm:px-6 lg:px-8",
          scrolled ? "py-3" : "py-5"
        )}
      >
        <div 
          className={clsx(
            "mx-auto max-w-7xl rounded-full transition-all duration-500 border",
            scrolled 
              ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border-slate-200/50 dark:border-slate-700/50 p-2 pl-4 pr-2" 
              : "bg-transparent border-transparent p-2"
          )}
        >
          <div className="flex items-center justify-between">
            {/* BRANDING */}
            <Link 
              to="/" 
              className="flex items-center gap-x-3 group"
              aria-label="Homepage"
            >
              <div className={clsx(
                "p-2.5 rounded-xl transition-all duration-300 transform group-hover:rotate-6 shadow-lg",
                scrolled 
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white" 
                  : "bg-white/10 backdrop-blur-md text-white border border-white/20"
              )}>
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className={clsx(
                  "text-xl font-extrabold tracking-tight leading-none font-sans",
                  scrolled ? "text-slate-900 dark:text-white" : "text-white"
                )}>
                  PBG
                </span>
                <span className={clsx(
                  "text-[9px] uppercase tracking-[0.25em] font-medium mt-0.5",
                  scrolled ? "text-slate-500 dark:text-slate-400" : "text-blue-100/80"
                )}>
                  Architecture
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  className={clsx(
                    "flex items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out group relative overflow-hidden",
                    scrolled 
                      ? "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400" 
                      : "text-slate-200 hover:text-white"
                  )}
                >
                  <span className={clsx(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    scrolled ? "bg-slate-100 dark:bg-slate-800" : "bg-white/10"
                  )} />
                  
                  <item.icon className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative z-10">{item.label}</span>
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-x-2">
              <button
                onClick={toggleTheme}
                className={clsx(
                  "p-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95",
                  scrolled 
                    ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" 
                    : "text-white hover:bg-white/10"
                )}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <button
                onClick={toggleLanguage}
                className={clsx(
                  "flex items-center gap-x-1 px-3 py-2 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95",
                  scrolled
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                )}
              >
                <Globe className="h-3 w-3" />
                <span>{language.toUpperCase()}</span>
              </button>

              {session ? (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{t.nav.dashboard}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={clsx(
                    "hidden md:flex items-center gap-x-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 border",
                    scrolled
                      ? "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600"
                      : "border-white/30 text-white hover:bg-white/10"
                  )}
                >
                  <LogIn className="h-4 w-4" />
                  <span>{t.nav.login}</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={clsx(
                  "md:hidden p-2.5 rounded-full transition-all duration-300 active:scale-90",
                  scrolled ? "text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800" : "text-white bg-white/10"
                )}
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[90] md:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
              className="fixed inset-x-4 top-24 z-[100] md:hidden"
            >
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 grid grid-cols-4 gap-3">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center gap-y-2 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 active:scale-95"
                    >
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-sm">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-center leading-tight">{item.label}</span>
                    </a>
                  ))}
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 border-t border-slate-100 dark:border-slate-800">
                  {session ? (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between w-full p-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
                      >
                        <div className="flex items-center gap-3">
                          <LayoutDashboard className="h-5 w-5" />
                          <span>{t.nav.dashboard}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-x-2 w-full py-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 rounded-2xl font-bold active:scale-95 transition-transform"
                      >
                        <LogOut className="h-4 w-4" />
                        {t.nav.logout}
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-x-2 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
                    >
                      <LogIn className="h-4 w-4" />
                      {t.nav.login}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
