"use client";
import Link from "next/link";
import { useState } from "react";
import AuthContainer from "./auth/AuthContainer";
import { useAuth } from "./context/AuthContext"; 

export default function Home() {
  const { isConnected, login, register, role } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = (loginData) => {
    login(loginData);
    setShowAuthModal(false);
  };

  const handleRegister = (registerData) => {
    register(registerData);
    setShowAuthModal(false); 
  };

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (  
      <div className="relative max-h-[90vh] flex flex-col justify-center items-center overflow-hidden">
        {/* Fond animé */}
      <div className="dark-bg-animated fixed inset-0 w-full h-full -z-10" />
       <div className="container py-10">
        <div className="text-center mb-10">
          <div className="mb-2 animate-bounce flex justify-center">
            {/* Mascotte SVG */}
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="50" cy="60" rx="40" ry="30" fill="#222b3a"/>
              <ellipse cx="50" cy="60" rx="30" ry="22" fill="#0dcaf0"/>
              <circle cx="40" cy="55" r="6" fill="#6610f2"/>
              <circle cx="60" cy="55" r="6" fill="#6610f2"/>
              <ellipse cx="50" cy="75" rx="12" ry="6" fill="#20c997"/>
              <ellipse cx="50" cy="80" rx="6" ry="2" fill="#111"/>
              <ellipse cx="40" cy="53" rx="2" ry="1" fill="#fff"/>
              <ellipse cx="60" cy="53" rx="2" ry="1" fill="#fff"/>
              <path d="M44 70 Q50 78 56 70" stroke="#fff" strokeWidth="2" fill="none"/>
              <ellipse cx="50" cy="65" rx="18" ry="6" fill="#111" fillOpacity="0.12"/>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-4 drop-shadow">
            Bienvenue dans ta Généalogie Familiale !
          </h1>
          <p className="text-lg md:text-xl text-cyan-100 mb-2">
            Découvre, gère et amuse-toi avec ta grande Famille.<br/>
            Ajoute des membres, explore les arbres, et partage la joie des liens familiaux !
          </p>
        </div>

        {/* Bouton de connexion si pas connecté */}
        {!isConnected && (
          <div className="flex justify-center">
            <button 
              onClick={openAuthModal}
              className="btn bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition transform"
            >
              Se connecter / S&#39;enregistrer
            </button>
          </div>
        )}

        {/* Modal d'authentification */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-md w-full">
              {/* Bouton de fermeture */}
              <button
                onClick={closeAuthModal}
                className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold z-10 shadow-lg transition"
              >
                ×
              </button>
              
              {/* Composant d'authentification */}
              <AuthContainer onLogin={handleLogin} onRegister={handleRegister} />
            </div>
          </div>
        )}

        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-4xl mx-5 md:mx-auto">
            <Link href="/personnes">
              <div className="card bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 shadow-lg animate-pop p-4 md:p-8 flex flex-col items-center" style={{ animationDelay: '0.2s' }}>
                <h5 className="text-3xl font-bold mb-2">Personnes</h5>
                <p className="mb-4 text-center">Voir, ajouter ou modifier les membres.</p>
                <div className="btn bg-gray-200 text-cyan-700 font-bold py-2 px-6 rounded shadow hover:scale-105 transition">
                  Gérer les personnes
                </div>
              </div>
            </Link>

            <Link href="/familles">
              <div className="card bg-gradient-to-r from-cyan-400 to-blue-400 text-gray-900 shadow-lg animate-pop p-4 md:p-8 flex flex-col items-center" style={{ animationDelay: '0.4s' }}>
                <h5 className="text-3xl font-bold mb-2">Familles</h5>
                <p className="mb-4 text-center">Voir les familles.</p>
                <div className="btn bg-gray-200 text-cyan-700 font-bold py-2 px-6 rounded shadow hover:scale-105 transition">
                  Gérer les familles
                </div>
              </div>
            </Link>
          </div>
        )}
        {role === 'admin' && (
          <Link href="/admin">
            <div className="card bg-gradient-to-r from-purple-400 to-pink-400 text-gray-900 shadow-lg animate-pop p-4 md:p-8 flex flex-col items-center mt-10 max-w-4xl mx-5 md:mx-auto" style={{ animationDelay: '0.6s' }}>
              <h5 className="text-3xl font-bold mb-2">Administration</h5>
              <p className="mb-4 text-center">Gérer les utilisateurs, rôles et autres paramètres.</p>
              <div className="btn bg-gray-200 text-purple-700 font-bold py-2 px-6 rounded shadow hover:scale-105 transition">
                Administration
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}