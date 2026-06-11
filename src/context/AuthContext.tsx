import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  socialLogin: (provider: 'google' | 'facebook') => Promise<boolean>;
}

interface RegisterData {
  knownAs: string;
  surname: string;
  email: string;
  cellphone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('simpliflow_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('simpliflow_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('simpliflow_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('simpliflow_users') || '[]');
    
    if (users.find((u: any) => u.email === data.email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      ...data,
    };

    users.push(newUser);
    localStorage.setItem('simpliflow_users', JSON.stringify(users));

    const { password, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('simpliflow_user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('simpliflow_user');
  };

  const socialLogin = async (provider: 'google' | 'facebook'): Promise<boolean> => {
    const mockUser: User = {
      id: Date.now().toString(),
      email: `user@${provider}.com`,
      knownAs: provider === 'google' ? 'Google' : 'Facebook',
      surname: 'User',
    };
    
    setUser(mockUser);
    localStorage.setItem('simpliflow_user', JSON.stringify(mockUser));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        socialLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
