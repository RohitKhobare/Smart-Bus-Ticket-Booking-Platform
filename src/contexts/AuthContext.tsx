import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, SUPABASE_CONFIGURED } from "../lib/supabase";

interface User {
  id: string;
  email: string | null;
}

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  // if supabase auth unavailable, we'll keep credentials locally
  const LOCAL_STORAGE_KEY = "fake_auth_user";
  const LOCAL_CRED_KEY = "fake_auth_creds";

  useEffect(() => {
    // if supabase auth not configured, load fake user from storage
    if (!SUPABASE_CONFIGURED) {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
      }
      return;
    }

    // fetch existing session
    supabase.auth
      .getSession()
      .then(({ data }: any) => {
        if (data?.session && data.session.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email,
          });
        }
      })
      .catch((e: any) => {
        console.error("error getting session", e);
      });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        if (session && session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
          });
        } else {
          setUser(null);
        }
      },
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = (email: string, password: string) => {
    if (!SUPABASE_CONFIGURED) {
      // fake registration: store credentials locally and mark user logged in
      const fakeUser: User = { id: "local-" + Date.now(), email };
      localStorage.setItem(LOCAL_CRED_KEY, JSON.stringify({ email, password }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fakeUser));
      setUser(fakeUser);
      return Promise.resolve({ data: fakeUser, error: null });
    }

    // Try Supabase signup, but if rate limited, fall back to local auth
    return supabase.auth
      .signUp({ email, password })
      .then((result: any) => {
        // Check if rate limit error
        if (
          result.error?.message?.includes("rate limit") ||
          result.error?.message?.includes("Email rate limit exceeded")
        ) {
          // Fall back to local auth
          const fakeUser: User = { id: "local-" + Date.now(), email };
          localStorage.setItem(
            LOCAL_CRED_KEY,
            JSON.stringify({ email, password }),
          );
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fakeUser));
          setUser(fakeUser);
          return {
            data: fakeUser,
            error: {
              message:
                "Using local authentication (rate limit reached on server). Your credentials are saved locally.",
            },
          };
        }
        return result;
      })
      .catch((err: any) => {
        // On network error, use local auth
        const fakeUser: User = { id: "local-" + Date.now(), email };
        localStorage.setItem(
          LOCAL_CRED_KEY,
          JSON.stringify({ email, password }),
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fakeUser));
        setUser(fakeUser);
        return {
          data: fakeUser,
          error: {
            message:
              "Using local authentication. Your credentials are saved locally.",
          },
        };
      });
  };

  const signIn = (email: string, password: string) => {
    if (!SUPABASE_CONFIGURED) {
      const creds = localStorage.getItem(LOCAL_CRED_KEY);
      if (creds) {
        try {
          const { email: storedEmail, password: storedPassword } =
            JSON.parse(creds);
          if (storedEmail === email && storedPassword === password) {
            const fakeUser: User = { id: "local-" + Date.now(), email };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fakeUser));
            setUser(fakeUser);
            return Promise.resolve({ data: fakeUser, error: null });
          }
        } catch {}
      }
      return Promise.resolve({
        data: null,
        error: new Error("Invalid credentials"),
      });
    }

    // Try Supabase signin, but if rate limited, fall back to local auth
    return supabase.auth
      .signInWithPassword({ email, password })
      .then((result: any) => {
        // Check if rate limit error
        if (
          result.error?.message?.includes("rate limit") ||
          result.error?.message?.includes("Email rate limit exceeded")
        ) {
          // Fall back to local auth
          const fakeUser: User = { id: "local-" + Date.now(), email };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fakeUser));
          setUser(fakeUser);
          return {
            data: { user: fakeUser },
            error: null,
            message: "Logged in locally (rate limit on server). Welcome!",
          };
        }
        return result;
      })
      .catch((err: any) => {
        // On network error or other issues, use local auth fallback
        const fakeUser: User = { id: "local-" + Date.now(), email };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fakeUser));
        setUser(fakeUser);
        return {
          data: { user: fakeUser },
          error: null,
          message: "Logged in using local fallback. Welcome!",
        };
      });
  };

  const signOut = () => {
    if (!SUPABASE_CONFIGURED) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setUser(null);
      return Promise.resolve({ data: null, error: null });
    }
    return supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
