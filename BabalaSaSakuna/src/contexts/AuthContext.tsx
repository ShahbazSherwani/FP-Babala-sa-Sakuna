import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, UserProfile } from '../services/AuthService';
import { firebaseService } from '../services/FirebaseService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Initialize Firebase (will use stub mode if in Expo Go)
      await firebaseService.initialize();

      // Initialize AuthService after Firebase is ready
      await authService.initialize();

      // Check if running in stub mode
      if (firebaseService.isStubMode()) {
        console.log('🔥 Auth: Guest mode active (Expo Go) - Build with EAS for full authentication');
        setLoading(false);
        return;
      }

      // Try to load cached user
      const cachedUser = await authService.getCachedUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      // Auth state will be handled by AuthService's onAuthStateChanged
      const checkInterval = setInterval(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      }, 1000);

      setLoading(false);

      return () => clearInterval(checkInterval);
    } catch (error) {
      console.error('Error initializing auth:', error);
      console.log('📱 Continuing in guest mode');
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const result = await authService.signUp(email, password, displayName);
    if (result.success) {
      setUser(authService.getCurrentUser());
    }
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (result.success) {
      setUser(authService.getCurrentUser());
    }
    return result;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    return authService.resetPassword(email);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const result = await authService.updateProfile(updates);
    if (result.success) {
      setUser(authService.getCurrentUser());
    }
    return result;
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: user !== null,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
