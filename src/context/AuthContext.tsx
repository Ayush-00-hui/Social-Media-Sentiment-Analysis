import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  email: string;
  company_name: string;
  brand_keywords: string[];
  competitor_keywords: string[];
  notification_emails: string[];
  plan_tier: string;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  updateKeywords: (brand: string[], comp: string[], emails: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("traccia_token"));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem("traccia_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (newToken: string, newUser: UserProfile) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("traccia_token", newToken);
    localStorage.setItem("traccia_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("traccia_token");
    localStorage.removeItem("traccia_user");
  };

  const updateKeywords = (brand_keywords: string[], competitor_keywords: string[], notification_emails: string[]) => {
    if (user) {
      const updated = { ...user, brand_keywords, competitor_keywords, notification_emails };
      setUser(updated);
      localStorage.setItem("traccia_user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateKeywords }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
