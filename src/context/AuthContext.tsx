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

      // B. Supabase Sign Out (Clears server session & local storage tokens)
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // C. Extra Safety: Manually clear Supabase-specific keys from LocalStorage
      // We iterate to find keys starting with 'sb-' (Supabase default) or specific project keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
      
      // Note: We intentionally do NOT clear 'theme' or 'language' preferences
      
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if API fails, we enforce client-side logout state
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
