"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { apiFetch } from '../components/FetchAPI';

const AuthContext = createContext();
export default AuthContext;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fonction pour stocker le token et décoder le rôle
  const storeToken = async (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    setToken(token);

    try {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, username: decoded.username });
      setRole(decoded.role || null);
      setIsConnected(true);
    } catch (error) {
      console.error('Token invalide :', error);
      await logout(); // Nettoyage si token corrompu
    }
  };

  // Vérifier token au démarrage
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        if (typeof window !== 'undefined') {
          const savedToken = localStorage.getItem('token');
          if (savedToken) {
            await storeToken(savedToken);
          }
        }
      } catch (e) {
        console.error('Erreur chargement token:', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // 🔐 Login
  const login = async ({ username, password }) => {
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {       
        const errorData = await res.json();
        throw new Error('Login failed', errorData.message);
      } 
      const data = await res.json();
      if (!data.token) throw new Error('Token manquant');
      await storeToken(data.token);
      return true;
    } catch (error) {
      console.error('Login échoué :', error);
      return false;
    }
  };

  // 📝 Register
  const register = async ({ username, email, password }) => {
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error('Register failed', errorData.message);
      }

      const data = await res.json();
      if (!data.token) throw new Error('Token manquant');

      await storeToken(data.token);
      return true;
    } catch (error) {
        console.error('Register échoué :', error);
      return false;
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setUser(null);
      setToken(null);
      setRole(null);
      setIsConnected(false);
      router.push('/');
    } catch (error) {
      console.error('Erreur logout :', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isConnected,
        isLoading,
        user,
        role,
        token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};