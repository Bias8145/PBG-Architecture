import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  Building2, 
  Moon, 
  Sun,
  User,
  ArrowLeft,
  Settings,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import ConfirmationModal from '../components/ConfirmationModal';

export default function AdminLayout() {
  const { signOut, user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // GHOSTING FIX: If not authenticated, do not render the layout at all.
  // This prevents the sidebar from "sticking" around during the redirect.
  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await signOut();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800">
      {/* Sidebar Header - REDESIGNED */}
      <div className="p-6 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">PBG Admin</h1>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Control Panel</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) => clsx(
              "flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium text-sm",
              isActive 
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={clsx("h-5 w-5 transition-colors", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User & Actions */}
      <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center space-x-3 mb-4 px-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="bg-blue-100 dark:bg-slate-700 p-2 rounded-full flex-shrink-0">
            <User className="h-4 w-4 text-blue-600 dark:text-slate-300" />
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.email?.split('@')[0]}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 truncate">Administrator</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all hover:shadow-sm"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="text-xs font-medium">Theme</span>
          </button>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 transition-all hover:shadow-sm"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">PBG Admin</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Sidebar (Persistent Sticky) */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-72 z-40 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (Overlay) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent />
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        {/* Back Button Area */}
        <div className="sticky top-16 lg:top-0 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
           <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Ke Website Utama</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
             <span>v1.0.0</span>
             <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
             <span>Secure Connection</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari panel admin? Sesi Anda akan diakhiri."
        confirmText="Keluar Sekarang"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
}
