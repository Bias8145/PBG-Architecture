import React from 'react';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'info' | 'success' | 'warning';
  mode?: 'confirm' | 'alert'; // 'confirm' has 2 buttons, 'alert' has 1 (OK)
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  mode = 'confirm',
  confirmText = 'OK',
  cancelText = 'Cancel',
  isLoading = false,
}: ConfirmationModalProps) {
  // Prevent closing if loading
  const handleClose = () => {
    if (!isLoading) onClose();
  };

  // Handle confirm action
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  // Determine styles based on type
  const getIcon = () => {
    switch (type) {
      case 'danger': return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'success': return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      default: return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'danger': 
        return {
          btn: 'bg-red-600 hover:bg-red-700 shadow-red-500/20',
          iconBg: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
          border: 'border-red-100 dark:border-red-900/30'
        };
      case 'success': 
        return {
          btn: 'bg-green-600 hover:bg-green-700 shadow-green-500/20',
          iconBg: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
          border: 'border-green-100 dark:border-green-900/30'
        };
      case 'warning': 
        return {
          btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20',
          iconBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
          border: 'border-amber-100 dark:border-amber-900/30'
        };
      default: 
        return {
          btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
          iconBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
          border: 'border-blue-100 dark:border-blue-900/30'
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className={`relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden border ${colors.border} ring-1 ring-white/10`}
          >
            {/* Close Button (Top Right) */}
            {!isLoading && (
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row sm:space-x-5">
                {/* Icon Wrapper */}
                <div className={`flex-shrink-0 p-3 rounded-xl mb-4 sm:mb-0 ${colors.iconBg}`}>
                  {getIcon()}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="bg-slate-50 dark:bg-slate-950/50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              {mode === 'confirm' && (
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl transition-all disabled:opacity-50 shadow-sm hover:shadow"
                >
                  {cancelText}
                </button>
              )}
              
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center ${colors.btn} disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                )}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
