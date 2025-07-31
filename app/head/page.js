'use client';
import React, { useState, useCallback, useEffect } from 'react';
import  { useAuth }  from '../context/AuthContext';
import { Button } from '../../components/ui/button';
import { GiHamburgerMenu } from "react-icons/gi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger, 
} from '../../components/ui/dropdown-menu';
import { IoHomeOutline, IoPeopleOutline, IoPersonCircleOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const HeaderComponent = () => {

    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { logout, user } = useAuth();

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            setUser(null);
            toast.success('Déconnexion réussie');
            router.push('/');
        } catch (error) {
            toast.error('Erreur lors de la déconnexion');
            console.error(error);
        }
    }, [logout, router]);

    const menuItems = user
        ? [
            // { label: "Mon Espace", onClick: () => router.push('/profile') },
            // ...(isAdmin ? [{ label: "Administration", onClick: () => router.push('/admin') }] : []),
            { label: "Déconnexion", onClick: handleLogout }
          ]
        : [
            { label: "Connexion", onClick: () => router.push('/auth/login') },
            { label: "Inscription", onClick: () => router.push('/auth/register') }
          ];

    const navItems = [
        { href: "/", label: "Accueil", icon: <IoHomeOutline className="w-6 h-6 text-amber-600" /> },
        { href: "/personnes", label: "Personnes", icon: <IoPersonCircleOutline className="w-6 h-6 text-amber-600" /> },
        { href: "/familles", label: "Familles", icon: <IoPeopleOutline className="w-6 h-6 text-amber-600" /> }
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

                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image 
                            src='/arbre.png'
                            width={48}
                            height={48} 
                            alt='logo'
                            className='w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded object-contain'
                        />
                        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-amber-600'>Genealogy</h1>
                    </Link>
                </div>

                {/* Desktop Navigation */}

                <div className="hidden md:flex items-center justify-center flex-1 gap-[clamp(1rem,3.5vw,5rem)]">
                    {[
                        { to: "/", text: "Accueil" },
                        { to: "/personnes", text: "Personnes" },
                        { to: "/familles", text: "Familles" },
                    ].map(link => (
                        <Link 
                            key={link.to}
                            href={link.to} 
                            className={`text-[clamp(1.5rem,2vw,1.3rem)] font-bold transition-colors relative
                                ${router.pathname === link.to 
                                ? "!text-amber-600  after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[3px] after:bg-amber-600" 
                                : "!text-gray-300  hover:!text-amber-600"}`}
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
                                        <span className="font-bold block text-amber-600 sm:hidden">
                                            {(user.username)}
                                        </span>
                                </button>
                            ) : (
                                <Button variant="ghost" className="p-2">
                                    <Image 
                                        src='/user.png'
                                        width={48}
                                        height={48} 
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
                                className="w-48 bg-gray-800 text-amber-600 border-none rounded-lg shadow-lg"
                            >
                                {navItems.map((item, index) => (
                                    <Link 
                                        key={index} 
                                        href={item.href} 
                                        className="flex items-center gap-2 p-3 hover:bg-gray-600 hover:text-gray-200 rounded-lg m-1"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.icon}
                                        <span className="text-lg font-bold">{item.label}</span>
                                    </Link>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
            </div>
        </header>
    );
};

const Header = React.memo(HeaderComponent);
Header.displayName = 'Header';

export default Header;