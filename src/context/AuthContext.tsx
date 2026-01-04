import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// 1. Strict Type Definitions
interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setState({
            session,
            user: session?.user ?? null,
            loading: false,
            isAuthenticated: !!session,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setState({
          session,
          user: session?.user ?? null,
          loading: false,
          isAuthenticated: !!session,
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 2. Comprehensive Logout Logic
  const signOut = useCallback(async () => {
    try {
      // A. Immediate State Reset (Optimistic UI update)
      setState({
        session: null,
        user: null,
        loading: false,
        isAuthenticated: false,
      });

      // B. Supabase Sign Out
      // We use 'global' scope to ensure it clears everything
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;

      // C. Aggressive Local Storage Clearing
      // Specifically target Supabase keys to prevent "Ghost Sessions"
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Also clear sessionStorage just in case
      sessionStorage.clear();

    } catch (error) {
      console.error('Error signing out:', error);
      // Force state clear even on error
      setState({
        session: null,
        user: null,
        loading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
