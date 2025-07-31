import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import  { useAuth }  from '../context/AuthContext';
import { toast } from 'react-toastify';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/Logo.jpg';
import userIcon from '../assets/user.png';
import { Button } from './ui/button';
import { GiHamburgerMenu } from "react-icons/gi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger, 
} from './ui/dropdown-menu';
import { IoCompassOutline, IoHomeOutline, IoInformationCircleOutline, IoMailOutline, IoSearchOutline } from "react-icons/io5";

const HeaderComponent = () => {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, setUser, isAdmin } = useAuth();
    const handleLogout = useCallback(async () => {
        try {
            await logout();
            setUser(null);
            toast.success('Déconnexion réussie');
            navigate('/');
        } catch (error) {
            toast.error('Erreur lors de la déconnexion');
            console.error(error);
        }
    }, [logout, navigate]);

    const menuItems = user
        ? [
            { label: "Mon Espace", onClick: () => navigate('/profile') },
            ...(isAdmin ? [{ label: "Administration", onClick: () => navigate('/admin') }] : []),
            { label: "Déconnexion", onClick: handleLogout }
          ]
        : [
            { label: "Connexion", onClick: () => navigate('/login') },
            { label: "Inscription", onClick: () => navigate('/register') }
          ];

    const navItems = [
        { to: "/", label: "Accueil", icon: <IoHomeOutline className="w-6 h-6 text-amber-600" /> },
        { to: "/explore", label: "Explorer", icon: <IoCompassOutline className="w-6 h-6 text-amber-600" /> },
        { to: "/search", label: "Rechercher", icon: <IoSearchOutline className="w-6 h-6 text-amber-600" /> },
        { to: "/about", label: "À propos", icon: <IoInformationCircleOutline className="w-6 h-6 text-amber-600" /> },
        { to: "/contact", label: "Contact", icon: <IoMailOutline className="w-6 h-6 text-amber-600" /> },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 767) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <header className='fixed top-0 w-full min-w-[320px] h-14 sm:h-16 px-4 sm:px-6 lg:px-8 bg-gray-300 bg-opacity-50 dark:bg-black dark:bg-opacity-50 z-40 backdrop-blur-sm transition-all duration-300 ease-in-out'>
            <div className='container mx-auto px-2 sm:px-3 max-w-7xl flex items-center h-full'>
                {/* Première section: Burger + Logo */}
                <div className="flex items-center flex-shrink-0 mr-auto">
                    {/* Burger Menu */}
                    <div className="md:hidden mr-1">
                        <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="p-1 m-2">
                                    <GiHamburgerMenu  size={48} className="text-amber-600 stroke-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className="w-48 dark:bg-gray-100 bg-gray-900 dark:text-gray-800 text-gray-300 border-none rounded-lg shadow-lg"
                            >
                                {navItems.map((item, index) => (
                                    <Link 
                                        key={index} 
                                        to={item.to} 
                                        className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-800 rounded-lg m-1"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.icon}
                                        <span className="text-lg font-bold">{item.label}</span>
                                    </Link>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-2">
                        <img 
                            src={logo} 
                            alt='logo'
                            className='w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded object-contain'
                        />
                        <span className="text-[clamp(1.5rem,2vw,2.5rem)] font-bernard text-amber-600"> 
                            NextMovie
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}

                <div className="hidden md:flex items-center justify-center flex-1 gap-[clamp(1rem,3.5vw,5rem)]">
                    {[
                        { to: "/explore", text: "Explorer" },
                        { to: "/search", text: "Rechercher" },
                        { to: "/about", text: "À propos" },
                        { to: "/contact", text: "Contact" }
                    ].map(link => (
                        <Link 
                            key={link.to}
                            to={link.to} 
                            className={`text-[clamp(1rem,2vw,1.3rem)] font-bold transition-colors relative
                                ${location.pathname === link.to 
                                ? "text-amber-600 dark:text-amber-600 after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[3px] after:bg-amber-600" 
                                : "text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-600"}`}
                        >
                            {link.text}
                        </Link>
                    ))}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 ml-auto">
                    {/* User Menu */}
                    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                        <DropdownMenuTrigger asChild>
                            {user ? (
                                <button className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                    {user.photoURL ? (
                                        <img 
                                            src={user.photoURL} 
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="font-bold block text-amber-600 sm:hidden">
                                            {(user.displayName || user.email?.split('@')[0])}
                                        </span>
                                    )}
                                    <span className="hidden sm:block text-amber-600 font-bold">
                                        {user.displayName || user.email?.split('@')[0]}
                                    </span>
                                </button>
                            ) : (
                                <Button variant="ghost" className="p-2">
                                    <img 
                                        src={userIcon} 
                                        alt="User" 
                                        className="w-8 h-8"
                                    />
                                </Button>
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 dark:bg-gray-100 bg-gray-900 text-amber-600 border-none rounded-lg shadow-lg">
                            {menuItems.map((item, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    onClick={item.onClick}
                                    className="flex justify-center py-2 text-lg font-bold cursor-pointer rounded-lg"
                                >
                                    {item.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

const Header = React.memo(HeaderComponent);
Header.displayName = 'Header';

export default Header;