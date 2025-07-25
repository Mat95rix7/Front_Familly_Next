"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { isConnected, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <>
      <nav className="w-full bg-gradient-to-r from-cyan-400 to-purple-700 border-b-4 border-cyan-400 shadow-lg py-3 px-6 flex items-center justify-between z-50 relative">
        <Link
          href="/"
          className="flex items-center space-x-3 group"
          onClick={closeMobileMenu}
        >
          <span className="text-white text-2xl font-bold drop-shadow-[0_0_8px_#0dcaf0] group-hover:text-cyan-300 transition">
            Généalogie
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-center space-x-6">
          {isConnected && (
            <div className="flex items-center gap-6">
              <Link
                href="/personnes"
                className="text-white font-semibold hover:text-cyan-300 transition"
              >
                Personnes
              </Link>
              <Link
                href="/familles"
                className="text-white font-semibold hover:text-cyan-300 transition"
              >
                Familles
              </Link>
              <div
                onClick={logout}
                className="text-white font-semibold hover:text-cyan-300 transition cursor-pointer"
              >
                Déconnexion
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        {isConnected && (
          <button
            onClick={toggleMobileMenu}
            className={`md:hidden transition p-1 ${
              isMobileMenuOpen
                ? "text-purple-100 hover:text-white"
                : "text-white hover:text-cyan-300"
            }`}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </nav>

      {/* Mobile Menu (absolute, above page, no overlay) */}
      {isConnected && isMobileMenuOpen && (
        <div className="absolute top-[64px] left-0 right-0 bg-purple-800 border-b-4 border-purple-400 shadow-lg z-50 md:hidden">
          <div className="flex flex-col py-4 px-6 space-y-4">
            <Link
              href="/personnes"
              className="text-white font-semibold hover:text-cyan-300 transition py-2"
              onClick={closeMobileMenu}
            >
              Personnes
            </Link>
            <Link
              href="/familles"
              className="text-white font-semibold hover:text-cyan-300 transition py-2"
              onClick={closeMobileMenu}
            >
              Familles
            </Link>
            <div
              onClick={handleLogout}
              className="text-white font-semibold hover:text-cyan-300 transition cursor-pointer py-2"
            >
              Déconnexion
            </div>
          </div>
        </div>
      )}
    </>
  );
}