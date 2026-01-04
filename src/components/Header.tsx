import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// Define the Navigation Interface
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

  // Handle scroll effect for glassmorphism intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  // Navigation Data
  const navItems: NavItem[] = [
    { label: t.nav.home, path: '/', icon: Home },
    { label: t.nav.services, path: '/#services', icon: Briefcase },
    { label: t.nav.portfolio, path: '/#portfolio', icon: FolderOpen },
    { label: t.nav.contact, path: '/#contact', icon: Phone },
  ];

  // Helper to check if link is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path.startsWith('/#')) return location.hash === path.substring(1);
    return false;
  };

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
              ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-slate-200/50 dark:border-slate-700/50 p-2 pl-4 pr-2" 
              : "bg-transparent border-transparent p-2"
          )}
        >
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link 
              to="/" 
              className="flex items-center gap-x-3 group"
              aria-label="Homepage"
            >
              <div className={clsx(
                "p-2 rounded-xl transition-all duration-300 transform group-hover:rotate-12 group-hover:scale-105 shadow-md",
                scrolled ? "bg-blue-600 text-white" : "bg-white/10 backdrop-blur-sm text-white border border-white/20"
              )}>
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className={clsx(
                  "text-lg font-bold tracking-tight leading-none transition-colors font-sans",
                  scrolled ? "text-slate-900 dark:text-white" : "text-white"
                )}>
                  PBG
                </span>
                <span className={clsx(
                  "text-[10px] uppercase tracking-[0.2em] font-semibold",
                  scrolled ? "text-blue-600 dark:text-blue-400" : "text-blue-200"
                )}>
                  Design
                </span>
              </div>
            </Link>

            {/* Desktop Navigation (Center) */}
            <nav className="hidden md:flex items-center gap-x-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  className={clsx(
                    "flex items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out group",
                    scrolled 
                      ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400" 
                      : "text-slate-200 hover:text-white hover:bg-white/10"
                  )}
                  aria-label={item.label}
                >
                  <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>

            {/* Right Actions (Theme, Lang, Auth) */}
            <div className="flex items-center gap-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={clsx(
                  "p-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95",
                  scrolled 
                    ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" 
                    : "text-white hover:bg-white/10"
                )}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className={clsx(
                  "flex items-center gap-x-1 px-3 py-2 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95",
                  scrolled
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                )}
                aria-label="Switch Language"
              >
                <Globe className="h-3 w-3" />
                <span>{language.toUpperCase()}</span>
              </button>

              {/* Auth Button */}
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
                  "md:hidden p-2.5 rounded-full transition-all duration-300",
                  scrolled ? "text-slate-800 dark:text-white" : "text-white"
                )}
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer (Fluid Overlay) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-4 top-24 z-40 md:hidden"
          >
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 overflow-hidden">
              <div className="grid grid-cols-4 gap-2 mb-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center gap-y-2 p-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                  >
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
                  </a>
                ))}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                {session ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-x-2 w-full py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {t.nav.dashboard}
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-x-2 w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-bold active:scale-95 transition-transform"
                    >
                      <LogOut className="h-4 w-4" />
                      {t.nav.logout}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-x-2 w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-2xl font-bold active:scale-95 transition-transform"
                  >
                    <LogIn className="h-4 w-4" />
                    {t.nav.login}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
