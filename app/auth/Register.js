import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register({ onRegister }) {
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
  const { register } = useAuth();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const success = await register(registerData);
    if (!success) {
      console.error('Inscription echouee');
      return;
    }
    onRegister(registerData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-cyan-300 mb-4 text-center">S&#39;inscrire</h3>
      
      <div>
        <label htmlFor="register-username" className="block text-cyan-200 text-sm font-medium mb-2">
          Nom d&#39;utilisateur
        </label>
        <input
          id="register-username"
          type="text"
          value={registerData.username}
          onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
          className="w-full px-3 py-2 bg-white/10 border border-cyan-300/30 rounded-md text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          placeholder="Choisissez un nom d'utilisateur"
          required
        />
      </div>

      <div>
        <label htmlFor="register-email" className="block text-cyan-200 text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          value={registerData.email}
          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
          className="w-full px-3 py-2 bg-white/10 border border-cyan-300/30 rounded-md text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          placeholder="Votre adresse email"
          required
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-cyan-200 text-sm font-medium mb-2">
          Mot de passe
        </label>
        <input
          id="register-password"
          type="password"
          value={registerData.password}
          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
          className="w-full px-3 py-2 bg-white/10 border border-cyan-300/30 rounded-md text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          placeholder="Choisissez un mot de passe"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:scale-105 transition transform"
      >
        S&#39;inscrire
      </button>
    </form>
  );
}