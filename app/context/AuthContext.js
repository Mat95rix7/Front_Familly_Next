"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../components/FetchAPI';
import { useRouter } from 'next/navigation';



// Créer le contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider du contexte
export const AuthProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

   // Vérifier le token au chargement de l'app
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('userData');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsConnected(true);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Fonction de connexion
  const login = async (loginData) => {
    try {
      console.log('Login:', loginData);
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginData.username, password: loginData.password })
      });
      const userData = await response.json();
      
      // Vérifier que nous avons reçu un token
      if (!userData.token) {
        throw new Error('Token manquant dans la réponse');
      }
      
      // Stocker le token et les données utilisateur
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userData', JSON.stringify(userData.user || userData));
      
      setToken(userData.token);
      setUser(userData.user || userData);
      setIsConnected(true);
      
      return { success: true, user: userData.user || userData };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: error.message || 'Erreur de connexion' };
    }
  };

  // Fonction d'inscription
  const register = async (registerData) => {
    try {
      console.log('Register:', registerData);
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: registerData.username, 
          email: registerData.email, 
          password: registerData.password 
        })
      });
      const userData = await response.json();
      
      // Vérifier que nous avons reçu un token
      if (!userData.token) {
        throw new Error('Token manquant dans la réponse');
      }
      
      // Stocker le token et les données utilisateur
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userData', JSON.stringify(userData.user || userData));
      
      setToken(userData.token);
      setUser(userData.user || userData);
      setIsConnected(true);
      
      return { success: true, user: userData.user || userData };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return { success: false, error: error.message || 'Erreur d\'inscription' };
    }
  };

  // Fonction de déconnexion
  const logout = () => {  
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsConnected(false);
    setUser(null);
    setToken(null);
    console.log('Utilisateur déconnecté');
    router.push('/');
  };

  const value = {
    isConnected,
    user,
    token,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};