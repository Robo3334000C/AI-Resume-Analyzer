import { create } from 'zustand';
import { PuterUser } from '../types/puter';

interface AuthState {
    user: PuterUser | null;
    isAuthenticated: boolean;
    isReady: boolean;
    initialize: () => Promise<void>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

export const usePuterStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isReady: false,
    initialize: async () => {
        try {
            // Set a fallback timeout to prevent hanging the whole app
            const timeout = setTimeout(() => {
                console.warn("Puter initialization taking too long, forcing ready state.");
                set({ isReady: true });
            }, 5000);

            if (typeof window.puter !== 'undefined') {
                const user = await window.puter.auth.getUser();
                clearTimeout(timeout);
                set({ user, isAuthenticated: !!user, isReady: true });
            } else {
                clearTimeout(timeout);
                console.error("Puter script not loaded.");
                set({ isReady: true });
            }
        } catch (error) {
            console.error("Error initializing Puter:", error);
            set({ isReady: true });
        }
    },
    login: async () => {
        try {
            if (typeof window.puter !== 'undefined') {
                await window.puter.auth.signIn();
                const user = await window.puter.auth.getUser();
                set({ user, isAuthenticated: !!user });
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    },
    logout: async () => {
        try {
            if (typeof window.puter !== 'undefined') {
                await window.puter.auth.signOut();
                set({ user: null, isAuthenticated: false });
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
}));
