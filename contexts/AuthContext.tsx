// contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth, googleProvider } from '../services/firebaseService.ts';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import * as authService from '../services/authService.ts';
import { AppUser, CloneUser, PlanTier } from '../types.ts';

interface AuthContextType {
    user: AppUser | null;
    isLoading: boolean;
    // Keep mock functions for non-Firebase logins
    loginAsClone: (email: string, password: string) => Promise<void>;
    registerWithEmail: (name: string, email: string, password: string) => Promise<{ user: CloneUser, message: string }>;
    verifyEmailCode: (user: CloneUser, code: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<string>;
    verifyProcheIdentity: (name: string, phone: string) => Promise<{ success: boolean, message: string }>;
    verifyProcheToken: (token: string) => Promise<void>;
    loginAsAdmin: (email: string, password: string) => Promise<void>;
    // Add real Firebase functions
    signInWithGoogle: () => Promise<void>;
    logout: () => void;
    updateUser: (updatedUser: AppUser) => void;
    connectGoogleDrive: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Firebase auth is temporarily disabled for testing.
        // We only check for a user in session storage (for mock logins).
        try {
            const storedUser = sessionStorage.getItem('authUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse auth user from session storage", error);
            sessionStorage.removeItem('authUser');
        } finally {
            setIsLoading(false);
        }
        
        /*
        // --- Original Firebase implementation (temporarily disabled) ---
        // Use Firebase's observer to manage auth state
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                // User is signed in via Firebase
                const appUser: CloneUser = {
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || 'Utilisateur Google',
                    email: firebaseUser.email || '',
                    role: 'CLONE',
                    plan: PlanTier.PREMIUM, // Default plan for new Google users
                    googleDriveConnected: false,
                    avatarUrl: firebaseUser.photoURL || undefined,
                };
                sessionStorage.setItem('authUser', JSON.stringify(appUser));
                setUser(appUser);
            } else {
                // User is signed out or using a mock login
                const storedUser = sessionStorage.getItem('authUser');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(null);
                }
            }
            setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
        */
    }, []);

    const handleLogin = (userData: AppUser) => {
        sessionStorage.setItem('authUser', JSON.stringify(userData));
        setUser(userData);
    };
    
    // --- Real Firebase Methods ---
    const signInWithGoogle = async () => {
        // Temporarily disabled
        console.log("Google Sign-In is temporarily disabled for testing.");
        alert("La connexion Google est temporairement désactivée pour les tests.");
        return Promise.resolve();
    };
    
    const logout = async () => {
        // Temporarily disabled Firebase logout.
        /*
        // Check if the user was a Firebase user
        if (auth.currentUser) {
            await signOut(auth);
        }
        */
        // Always clear session storage for mock users
        sessionStorage.removeItem('authUser');
        setUser(null);
        window.location.href = '/';
    };

    // --- Mock Methods (unchanged) ---
    const loginAsClone = async (email: string, password: string) => {
        const userData = await authService.loginAsClone(email, password);
        handleLogin(userData);
    };

    const registerWithEmail = async (name: string, email: string, password: string) => {
        return await authService.registerWithEmail(name, email, password);
    };
    
    const verifyEmailCode = async (userToVerify: CloneUser, code: string) => {
        const userData = await authService.verifyEmailCode(userToVerify, code);
        handleLogin(userData);
    };
    
    const forgotPassword = async (email: string) => {
        return await authService.forgotPassword(email);
    };
    
    const verifyProcheIdentity = async (name: string, phone: string) => {
        return await authService.verifyProcheIdentity(name, phone);
    };

    const verifyProcheToken = async (token: string) => {
        const userData = await authService.verifyProcheToken(token);
        handleLogin(userData);
    };

    const loginAsAdmin = async (email: string, password: string) => {
        const userData = await authService.loginAsAdmin(email, password);
        handleLogin(userData);
    };
    
    // --- Utility Methods ---
    const updateUser = (updatedUser: AppUser) => {
         sessionStorage.setItem('authUser', JSON.stringify(updatedUser));
         setUser(updatedUser);
    };
    
    const connectGoogleDrive = async (): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                if(user && user.role === 'CLONE') {
                    const updatedUser = {...user, googleDriveConnected: true} as CloneUser;
                    updateUser(updatedUser);
                }
                resolve();
            }, 1000);
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            loginAsClone,
            registerWithEmail,
            verifyEmailCode,
            forgotPassword,
            signInWithGoogle, // Real function
            verifyProcheIdentity,
            verifyProcheToken,
            loginAsAdmin,
            logout, // Real function
            updateUser,
            connectGoogleDrive,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
