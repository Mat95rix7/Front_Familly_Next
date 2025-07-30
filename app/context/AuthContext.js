"use client";
// import { createContext, useContext, useEffect, useState } from 'react';
// import { apiFetch } from '../components/FetchAPI';
// import { useRouter } from 'next/navigation';



// // Créer le contexte
// const AuthContext = createContext();

// // Hook personnalisé pour utiliser le contexte
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Provider du contexte
// export const AuthProvider = ({ children }) => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);
//   const [token, setToken] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//     // Fonction pour stocker le token et décoder le rôle
//   const storeToken = async (token) => {
//     localStorage.setItem('token', token);
//     setToken(token);

//     try {
//       const decoded = jwtDecode(token);
//       setUser({ id: decoded.id, username: decoded.username });
//       setRole(decoded.role || null);
//       setIsConnected(true);
//     } catch (error) {
//       console.error('Token invalide :', error);
//       logout();
//     }
//   };

//    // Vérifier le token au chargement de l'app
//   useEffect(() => {
//     const savedToken = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('userData');
    
//     if (savedToken && savedUser) {
//       try {
//         setToken(savedToken);
//         setUser(JSON.parse(savedUser));
//         setIsConnected(true);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des données utilisateur:', error);
//         localStorage.removeItem('token');
//         localStorage.removeItem('userData');
//       }
//     }
    
//     setIsLoading(false);
//   }, []);

//   // Fonction de connexion
//   const login = async (loginData) => {
//     try {
//       const response = await apiFetch('/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username: loginData.username, password: loginData.password })
//       });
//       const userData = await response.json();
      
//       // Vérifier que nous avons reçu un token
//       if (!userData.token) {
//         throw new Error('Token manquant dans la réponse');
//       }
      
//       // Stocker le token et les données utilisateur
//       localStorage.setItem('token', userData.token);
//       localStorage.setItem('userData', JSON.stringify(userData.user || userData));
      
//       setToken(userData.token);
//       setUser(userData.user || userData);
//       setIsConnected(true);
      
//       return { success: true, user: userData.user || userData };
//     } catch (error) {
//       console.error('Erreur de connexion:', error);
//       return { success: false, error: error.message || 'Erreur de connexion' };
//     }
//   };

//   // Fonction d'inscription
//   const register = async (registerData) => {
//     try {
//       const response = await apiFetch('/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           username: registerData.username, 
//           email: registerData.email, 
//           password: registerData.password 
//         })
//       });
//       const userData = await response.json();
      
//       // Vérifier que nous avons reçu un token
//       if (!userData.token) {
//         throw new Error('Token manquant dans la réponse');
//       }
      
//       // Stocker le token et les données utilisateur
//       localStorage.setItem('token', userData.token);
//       localStorage.setItem('userData', JSON.stringify(userData.user || userData));
      
//       setToken(userData.token);
//       setUser(userData.user || userData);
//       setIsConnected(true);
      
//       return { success: true, user: userData.user || userData };
//     } catch (error) {
//       console.error('Erreur d\'inscription:', error);
//       return { success: false, error: error.message || 'Erreur d\'inscription' };
//     }
//   };

//   // Fonction de déconnexion
//   const logout = () => {  
//     localStorage.removeItem('token');
//     localStorage.removeItem('userData');
//     setIsConnected(false);
//     setUser(null);
//     setToken(null);
//     console.log('Utilisateur déconnecté');
//     router.push('/');
//   };

//   const value = {
//     isConnected,
//     user,
//     token,
//     login,
//     register,
//     logout,
//     isLoading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

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