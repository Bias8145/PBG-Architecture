import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
  Settings,
  User
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
    // Add more admin links here in the future
    // { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white border-r border-slate-800">
      {/* Sidebar Header */}
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">Admin Panel</h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Jasa Desain</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={clsx(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={clsx("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & Actions */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center space-x-3 mb-4 px-2">
          <div className="bg-slate-800 p-2 rounded-full">
            <User className="h-5 w-5 text-slate-400" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/30 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-72 z-40 shadow-xl">
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
                className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
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
