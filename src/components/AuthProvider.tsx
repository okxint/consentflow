"use client";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: { email: string } | null;
  session: unknown;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);

  const signInWithEmail = async (email: string, _password: string) => {
    setUser({ email });
    return { error: null };
  };

  const signUpWithEmail = async (email: string, _password: string) => {
    setUser({ email });
    return { error: null };
  };

  const signInWithGoogle = async () => {
    setUser({ email: "doctor@hospital.com" });
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session: null, loading: false, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
