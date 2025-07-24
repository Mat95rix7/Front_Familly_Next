"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext"; // Ajustez le chemin selon votre structure

export default function Navbar() {
  const { isConnected, logout } = useAuth();

  return (
    <nav className="w-full bg-gradient-to-r from-cyan-400 to-purple-700 border-b-4 border-cyan-400 shadow-lg py-3 px-6 flex items-center justify-between z-50">
      <Link href="/" className="flex items-center space-x-3 group">
        <span className="text-white text-2xl font-bold drop-shadow-[0_0_8px_#0dcaf0] group-hover:text-cyan-300 transition">
          Généalogie
        </span>
      </Link>
      
      <div className="flex items-center justify-center space-x-6">
        {/* Liens visibles seulement si connecté */}
        {isConnected && (
          <div className="flex items-center gap-6">
            <Link href="/personnes" className="text-white font-semibold hover:text-cyan-300 transition">
              Personnes
            </Link>
            <Link href="/familles" className="text-white font-semibold hover:text-cyan-300 transition">
              Familles
            </Link>
            {/* Bouton de déconnexion */}
            <div
              onClick={logout}
              className="text-white font-semibold hover:text-cyan-300 transition cursor-pointer"
            >
              Déconnexion
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}