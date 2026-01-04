import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Building2, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { session, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Check if we are on the home page
  const isHome = location.pathname === '/';

  // Handle scroll effect
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

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.services, path: '/#services' },
    { name: t.nav.portfolio, path: '/#portfolio' },
    { name: t.nav.contact, path: '/#contact' },
  ];

  // Determine styles based on state
  const isTransparent = isHome && !scrolled;

  return (
    <header 
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isTransparent 
          ? "py-6 bg-transparent border-b border-transparent" 
          : "py-3 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md backdrop-saturate-150 shadow-lg border-b border-slate-200/50 dark:border-slate-800/50"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={clsx(
              "p-2.5 rounded-xl transform group-hover:rotate-12 transition-transform duration-300 shadow-lg border border-white/10",
              isTransparent ? "bg-white/10 backdrop-blur-sm" : "bg-blue-600 shadow-blue-500/30"
            )}>
              <Building2 className={clsx("h-6 w-6", isTransparent ? "text-white" : "text-white")} />
            </div>
            <div className="flex flex-col">
              <span className={clsx(
                "text-xl font-bold tracking-tight leading-none transition-colors font-sans", 
                isTransparent ? "text-white" : "text-slate-900 dark:text-white"
              )}>
                Jasa Desain PBG
              </span>
              <span className={clsx(
                "text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors mt-0.5", 
                isTransparent ? "text-blue-300" : "text-blue-600 dark:text-blue-400"
              )}>
                Engineering
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <div className={clsx(
              "flex items-center space-x-1 px-2 py-1.5 rounded-full transition-all duration-300",
              !isTransparent && "bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800"
            )}>
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.path} 
                  className={clsx(
                    "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative group overflow-hidden",
                    isTransparent 
                      ? "text-slate-100 hover:text-white hover:bg-white/10" 
                      : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow-md"
                  )}
                >
                  <span className="relative z-10">{link.name}</span>
                </a>
              ))}
            </div>
            
            <div className={clsx("h-6 w-px mx-4 opacity-30", isTransparent ? "bg-white" : "bg-slate-400 dark:bg-slate-600")}></div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className={clsx(
                  "p-2.5 rounded-full transition-all duration-300 border",
                  isTransparent 
                    ? "border-white/20 text-white hover:bg-white/10" 
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <button
                onClick={toggleLanguage}
                className={clsx(
                  "flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-bold transition-all border",
                  isTransparent 
                    ? "border-white/20 text-white bg-white/10 hover:bg-white/20"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 bg-white/50 dark:bg-slate-800/50"
                )}
              >
                <Globe className="h-3 w-3" />
                <span>{language.toUpperCase()}</span>
              </button>

              {session ? (
                <Link to="/admin" className="ml-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50 flex items-center">
                  {t.nav.dashboard}
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className={clsx(
                    "ml-2 text-sm font-bold transition-colors px-5 py-2.5 rounded-full border", 
                    isTransparent 
                      ? "border-white/30 text-white hover:bg-white/10" 
                      : "border-slate-200 dark:border-slate-700 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {t.nav.login}
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
             <button
                onClick={toggleTheme}
                className={clsx("p-2 rounded-full", isTransparent ? "text-white" : "text-slate-800 dark:text-white")}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={clsx("focus:outline-none p-2", isTransparent ? "text-white" : "text-slate-800 dark:text-white")}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-xl animate-slide-up">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="block px-4 py-3 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            
            <div className="border-t border-slate-100 dark:border-slate-800 my-4 pt-4 flex items-center justify-between px-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium"
              >
                <Globe className="h-5 w-5" />
                <span>Switch to {language === 'id' ? 'English' : 'Indonesia'}</span>
              </button>
            </div>

            {session ? (
              <div className="px-4 pt-2">
                <Link
                  to="/admin"
                  className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-500/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.dashboard}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center mt-3 px-4 py-3 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg font-medium"
                >
                  {t.nav.logout}
                </button>
              </div>
            ) : (
              <div className="px-4 pt-2">
                 <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.login}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
