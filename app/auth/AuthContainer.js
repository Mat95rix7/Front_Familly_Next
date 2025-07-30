import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthContainer({ onLogin, onRegister }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8">
      {/* Affichage conditionnel des formulaires */}
      {showLogin ? (
        <div>
          <Login onLogin={onLogin} /> 
          {/* Lien vers inscription */}
          <div className="mt-6 text-center">
            <p className="text-cyan-200 text-sm">
              Vous n&#39;vez pas de compte ?{" "}
              <button
                onClick={() => setShowLogin(false)}
                className="!text-amber-500 !bg-gray-900 hover:!text-white font-medium underline transition"
              >
                S&#39;inscrire
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <Register onRegister={onRegister} />
          
          {/* Lien vers connexion */}
          <div className="mt-6 text-center">
            <p className="text-cyan-200 text-sm">
              Vous avez déjà un compte ?{" "}
              <button
                onClick={() => setShowLogin(true)}
                className="!text-amber-500 !bg-gray-900 hover:!text-white font-medium underline transition"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}