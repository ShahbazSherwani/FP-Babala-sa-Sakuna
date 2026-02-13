import { firebaseService } from './FirebaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@babala_user';
const AUTH_TOKEN_KEY = '@babala_auth_token';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  location?: {
    city: string;
    province: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  preferences: {
    language: 'en' | 'tl';
    notifications: {
      alerts: boolean;
      weather: boolean;
      missions: boolean;
      community: boolean;
    };
  };
  createdAt: string;
  lastLogin: string;
}

export class AuthService {
  private static instance: AuthService;
  private auth: any = null;
  private firestore: any = null;
  private currentUser: UserProfile | null = null;
  private stubMode: boolean = true; // Default to stub mode
  private initialized: boolean = false;

  private constructor() {
    // Don't initialize Firebase here - wait for explicit init() call
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize AuthService after Firebase is ready
   * Must be called before using any auth methods
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Check if Firebase is in stub mode
      this.stubMode = firebaseService.isStubMode();
      
      if (!this.stubMode) {
        this.auth = firebaseService.getAuth();
        this.firestore = firebaseService.getFirestore();
        
        // Listen to auth state changes
        this.auth.onAuthStateChanged(this.handleAuthStateChanged.bind(this));
        console.log('🔥 AuthService: Initialized with Firebase');
      } else {
        console.log('🔥 AuthService: Running in stub mode (guest access only)');
      }

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing AuthService:', error);
      console.log('🔥 AuthService: Falling back to stub mode');
      this.stubMode = true;
      this.initialized = true;
    }
  }

  /**
   * Check if running in stub mode
   */
  isStubMode(): boolean {
    return this.stubMode;
  }

  /**
   * Handle auth state changes
   */
  private async handleAuthStateChanged(user: any | null): Promise<void> {
    if (this.stubMode) return;
    
    if (user) {
      // User signed in
      console.log('User authenticated:', user.uid);
      await this.loadUserProfile(user.uid);
    } else {
      // User signed out
      console.log('User signed out');
      this.currentUser = null;
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<{ success: boolean; error?: string }> {
    if (this.stubMode) {
      return {
        success: false,
        error: 'Authentication requires a development build. Use guest mode in Expo Go.',
      };
    }
    
    try {
      // Create user account
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update display name
      await user.updateProfile({ displayName });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        photoURL: user.photoURL || undefined,
        phoneNumber: user.phoneNumber || undefined,
        preferences: {
          language: 'en',
          notifications: {
            alerts: true,
            weather: true,
            missions: true,
            community: true,
          },
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      await this.firestore
        .collection('users')
        .doc(user.uid)
        .set(userProfile);

      this.currentUser = userProfile;
      await this.cacheUserData(userProfile);

      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    if (this.stubMode) {
      return {
        success: false,
        error: 'Authentication requires a development build. Use guest mode in Expo Go.',
      };
    }
    
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update last login
      await this.firestore
        .collection('users')
        .doc(user.uid)
        .update({
          lastLogin: new Date().toISOString(),
        });

      await this.loadUserProfile(user.uid);

      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    if (this.stubMode) {
      // In stub mode, just clear local state
      this.currentUser = null;
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      return;
    }
    
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (this.stubMode) {
      return {
        success: false,
        error: 'Password reset requires a development build. Use guest mode in Expo Go.',
      };
    }
    
    try {
      await this.auth.sendPasswordResetEmail(email);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
    if (this.stubMode) {
      return {
        success: false,
        error: 'Profile updates require a development build. Use guest mode in Expo Go.',
      };
    }
    
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return { success: false, error: 'No user signed in' };
      }

      // Update Firestore
      await this.firestore
        .collection('users')
        .doc(user.uid)
        .update(updates);

      // Update local cache
      this.currentUser = { ...this.currentUser!, ...updates };
      await this.cacheUserData(this.currentUser);

      // Update Firebase Auth profile if display name or photo changed
      if (updates.displayName || updates.photoURL) {
        await user.updateProfile({
          displayName: updates.displayName,
          photoURL: updates.photoURL,
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (this.stubMode) {
      return false;
    }
    try {
      return this.auth.currentUser !== null;
    } catch {
      return false;
    }
  }

  /**
   * Load user profile from Firestore
   */
  private async loadUserProfile(uid: string): Promise<void> {
    if (this.stubMode) return;
    
    try {
      const doc = await this.firestore
        .collection('users')
        .doc(uid)
        .get();

      if (doc.exists) {
        this.currentUser = doc.data() as UserProfile;
        await this.cacheUserData(this.currentUser);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  /**
   * Cache user data locally
   */
  private async cacheUserData(user: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error caching user data:', error);
    }
  }

  /**
   * Get cached user data
   */
  async getCachedUser(): Promise<UserProfile | null> {
    try {
      const cached = await AsyncStorage.getItem(USER_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error getting cached user:', error);
      return null;
    }
  }

  /**
   * Convert Firebase error codes to friendly messages
   */
  private getErrorMessage(code: string): string {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password is too weak',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many failed attempts. Try again later',
      'auth/network-request-failed': 'Network error. Check your connection',
    };

    return errorMessages[code] || 'An error occurred. Please try again';
  }
}

export const authService = AuthService.getInstance();
