'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './utils/api';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  decodedToken: DecodedToken | null;
}

interface DecodedToken {
  username: string;
  email: string;
  groups: string[];
  is_staff: boolean;
  is_active: boolean;
  user_id: number;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  setTokens: () => {},
  decodedToken: null,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

    useEffect(() => {
      const storedAccessToken = localStorage.getItem('accessToken');
      if (storedAccessToken) {
        const decoded = jwtDecode(storedAccessToken);
        const { username, email, groups, is_staff, is_active, user_id } = decoded as DecodedToken;
        setAccessToken(storedAccessToken);
        setDecodedToken({ username, email, groups, is_staff, is_active, user_id });
      }
    }, []);

    const setTokens = (accessToken: string, refreshToken: string) => {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      if (accessToken) {
        const decoded = jwtDecode(accessToken) as DecodedToken;
        setDecodedToken(decoded);
      } else {
        setDecodedToken(null);
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    };
  
    return (
      <AuthContext.Provider value={{ accessToken, refreshToken, setTokens, decodedToken}}>
        {children}
      </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
