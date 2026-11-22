import { supabase, isSupabaseConfigured } from './supabase';

const ADMIN_SESSION_KEY = 'dilip_grocery_admin_session';
const DEFAULT_ADMIN_EMAIL = 'goutamdas8562001@gmail.com';
const DEFAULT_ADMIN_PASS = 'gautam123@G';

export const authService = {
  async login(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. If Supabase Auth is connected, try Supabase login
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (data?.session && !error) {
          const userSession = {
            id: data.user.id,
            email: data.user.email,
            role: 'admin',
            token: data.session.access_token,
            provider: 'supabase'
          };
          localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(userSession));
          return { success: true, user: userSession };
        }
      } catch (err) {
        console.warn('Supabase auth attempt failed, checking designated store admin credentials', err);
      }
    }

    // 2. Verified admin credentials fallback
    if (cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() && password === DEFAULT_ADMIN_PASS) {
      const userSession = {
        id: 'admin-goutam',
        email: DEFAULT_ADMIN_EMAIL,
        name: 'Goutam Das (Store Owner)',
        role: 'admin',
        token: `mock-admin-token-${Date.now()}`,
        provider: 'local-store-admin'
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(userSession));
      return { success: true, user: userSession };
    }

    throw new Error('Invalid email or password. Please check your credentials.');
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem(ADMIN_SESSION_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  async logout() {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase logout error', err);
      }
    }
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return true;
  },

  isAuthenticated() {
    const user = this.getCurrentUser();
    return Boolean(user && user.role === 'admin');
  }
};
