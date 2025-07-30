"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";


export default function Navbar() {
  const { isConnected, logout, user } = useAuth();

  return (
      <nav className="w-full bg-gradient-to-r from-cyan-400 to-purple-700 border-b-4 border-cyan-400 shadow-lg py-2 px-6 flex items-center justify-between z-50 relative">
        <Link
          href="/"
          className="flex items-center space-x-3 group"
        >
          <span className="text-white text-2xl font-bold drop-shadow-[0_0_8px_#0dcaf0] group-hover:text-cyan-300 transition">
            Généalogie
          </span>
        </Link>
        <div className="flex items-center justify-center space-x-6">
          {isConnected && (
            <div className="flex items-center gap-6">


                <div
                  
                  className="text-white font-semibold hover:text-cyan-300 transition"
                >
                  Bonjour, <span className="font-bold text-amber-400">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</span> 👋
                </div>

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