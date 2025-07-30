import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onLogin }) {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(loginData);
    if (!success) {
      setError('Identifiants invalides');
    }
    onLogin(loginData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-cyan-300 mb-4 text-center">Se connecter</h3>
      
      <div>
        <label htmlFor="login-username" className="block text-cyan-200 text-sm font-medium mb-2">
          Nom d&#39;utilisateur
        </label>
        <input
          id="login-username"
          type="text"
          value={loginData.username}
          onChange={(e) => setLoginData({...loginData, username: e.target.value})}
          className="w-full px-3 py-2 bg-white/10 border border-cyan-300/30 rounded-md text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          placeholder="Votre nom d'utilisateur"
          required
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-cyan-200 text-sm font-medium mb-2">
          Mot de passe
        </label>
        <input
          id="login-password"
          type="password"
          value={loginData.password}
          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
          className="w-full px-3 py-2 bg-white/10 border border-cyan-300/30 rounded-md text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          placeholder="Votre mot de passe"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:scale-105 transition transform"
      >
        Se connecter
      </button>
    </form>
  );
}