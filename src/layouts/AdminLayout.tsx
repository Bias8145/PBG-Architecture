import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import ConfirmationModal from '../components/ConfirmationModal';

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    // Add more admin links here if needed
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800">
      {/* Sidebar Header */}
      <div className="p-6 flex items-center space-x-3 border-b border-gray-200 dark:border-slate-800">
        <div className="bg-primary-600 p-2 rounded-lg shadow-lg shadow-primary-600/20">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Jasa Desain</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) => clsx(
              "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group font-medium",
              isActive 
                ? "bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400" 
                : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={clsx("h-5 w-5", isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-slate-300")} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User & Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
        <div className="flex items-center space-x-3 mb-4 px-2">
          <div className="bg-gray-200 dark:bg-slate-800 p-2 rounded-full">
            <User className="h-5 w-5 text-gray-500 dark:text-slate-400" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
            <p className="text-xs text-gray-500 dark:text-slate-500">Administrator</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-600 p-1.5 rounded-lg">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white">Admin Panel</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-600 dark:text-slate-300"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Sidebar (Persistent Sticky) */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 z-40 shadow-sm">
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent />
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        {/* Back Button Area */}
        <div className="sticky top-16 lg:top-0 z-20 bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200/50 dark:border-slate-800/50">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </button>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of the admin panel?"
        confirmText="Sign Out"
        type="danger"
      />
    </div>
  );
}
