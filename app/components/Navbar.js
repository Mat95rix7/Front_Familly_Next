//   return (
//       <nav className="w-full bg-gradient-to-r from-cyan-400 to-purple-700 border-b-4 border-cyan-400 shadow-lg py-2 px-6 flex items-center justify-between z-50 relative">
//         <Link
//           href="/"
//           className="flex items-center space-x-3 group"
//         >
//           <span className="text-white text-2xl font-bold drop-shadow-[0_0_8px_#0dcaf0] group-hover:text-cyan-300 transition">
//             Généalogie
//           </span>
//         </Link>
//         <div className="flex items-center justify-center space-x-6">
//           {isConnected && (
//             <div className="flex items-center gap-6">


//                 <div
                  
//                   className="text-white font-semibold hover:text-cyan-300 transition"
//                 >
//                   Bonjour, <span className="font-bold text-amber-400">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</span> 👋
//                 </div>

//               <div
//                 onClick={logout}
//                 className="text-white font-semibold hover:text-cyan-300 transition cursor-pointer"
//               >
//                 Déconnexion
//               </div>
//             </div>
//           )}
//         </div>
//     </nav>
//   );
// }
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
import { IoHomeOutline, IoLogOutOutline, IoPeopleOutline, IoPersonCircleOutline, IoShield, IoShieldOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {

    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const {logout, user, role } = useAuth();

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            setIsMobileMenuOpen(false)
            router.push('/');
        } catch (error) {
            toast.error('Erreur lors de la déconnexion');
            console.error(error);
        }
    }, [logout, router]);

    const navItemsMobile = [
        { href: "/", label: "Accueil", icon: <IoHomeOutline className="w-6 h-6 text-amber-600" /> },
        { href: "/personnes", label: "Personnes", icon: <IoPersonCircleOutline className="w-6 h-6 text-amber-600" /> },
        { href: "/familles", label: "Familles", icon: <IoPeopleOutline className="w-6 h-6 text-amber-600" /> },
    ];

    const navItemsDesktop = [
                        { to: "/", text: "Accueil" },
                        { to: "/personnes", text: "Personnes" },
                        { to: "/familles", text: "Familles" },
                       ]

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
        <header className='w-full bg-gradient-to-r from-cyan-400 to-purple-700 border-b-4 border-cyan-400 shadow-lg py-2 px-6 flex items-center justify-between z-50 relative'>
            <div className='container mx-auto px-2 sm:px-3 max-w-7xl flex items-center h-full'>
                {/* Première section: Burger + Logo */}
                <div className="flex items-center flex-shrink-0 mr-auto">

                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image 
                            src='/arbre.png'
                            width={56}
                            height={56} 
                            alt='logo'
                            className='w-10 h-10 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded object-cover'
                        />
                        <span className='!text-white text-2xl font-bold drop-shadow-[0_0_8px_#0dcaf0] group-hover:text-cyan-300 transition hidden md:block'>Genealogy</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}

                {user && (
                  <div className="hidden md:flex items-center justify-center flex-1 gap-[clamp(1rem,3.5vw,5rem)]">
                    {navItemsDesktop.map(link => (
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
                    {role === 'admin' && (
                      <Link 
                          href="/admin" 
                          className={`text-[clamp(1.5rem,2vw,1.3rem)] font-bold transition-colors relative bg-gray-800 px-4 py-1 rounded-xl 
                              ${router.pathname === '/admin' 
                              ? "!text-amber-600  after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[3px] after:bg-amber-600" 
                              : "!text-gray-300  hover:!text-amber-600"}`}
                      >
                          Administration
                      </Link>
                    )}  
                  </div>
                )}

                
                {/* Right Section */}
                <div className="flex items-center gap-2 ml-auto">
                    {user &&  (
                      <>
                        <div className='hidden md:block'>
                          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                            <DropdownMenuTrigger asChild>
                                {user &&  (
                                    <div className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">     
                                      Bonjour, <span className="font-bold text-amber-400">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</span> 👋
                                    </div>
                                )}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 dark:bg-gray-100 bg-gray-900 text-amber-600 border-none rounded-lg shadow-lg">
                              <DropdownMenuItem
                                  onClick={handleLogout}
                                  className="flex justify-center py-2 text-lg font-bold cursor-pointer rounded-lg"
                              >
                                  Déconnexion
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className='block md:hidden'>
                            <div className=" flex items-center gap-2 px-2 py-1 rounded-full transition-colors">
                                Bonjour, <span className="font-bold text-amber-400">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</span> 👋
                            </div>
                        </div>
        
                        
                        {/* Burger Menu */}
                        <div className="md:hidden mr-1 ">
                            <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="p-1 m-2 !bg-gray-800">
                                        <GiHamburgerMenu  size={48} className="text-amber-600 stroke-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    className="w-48 bg-gray-800 text-amber-600 border-none rounded-lg shadow-lg"
                                >
                                    {navItemsMobile.map((item, index) => (
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
                                    { role === 'admin' && (
                                        <Link 
                                            href="/admin" 
                                            className="flex items-center gap-2 p-3 hover:bg-gray-600 hover:text-gray-200 rounded-lg m-1"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                          <IoShieldOutline className="w-6 h-6 text-amber-600"/>
                                            <span className="text-lg font-bold">Administration</span>
                                        </Link>
                                    )}
                                    <Link 
                                      href="/" 
                                      className="flex items-center gap-2 p-3 hover:bg-gray-600 hover:text-gray-200 rounded-lg m-1"
                                      onClick={handleLogout}
                                      >
                                        <IoLogOutOutline className="w-6 h-6 text-amber-600"/>                                      
                                      <span className="text-lg font-bold">Déconnexion</span>
                                  </Link>             
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                      </>
                    )}
                </div>
            </div>
        </header>
    );
};

// 'use client';
// import React, { useState, useCallback, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import Image from 'next/image';
// import { toast } from 'react-hot-toast'; // Assurez-vous d'avoir installé react-hot-toast

// import { useAuth } from '../context/AuthContext';
// import { Button } from '../../components/ui/button';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger, 
// } from '../../components/ui/dropdown-menu';

// // Icons
// import { GiHamburgerMenu } from "react-icons/gi";
// import { 
//     IoHomeOutline, 
//     IoLogOutOutline, 
//     IoPeopleOutline, 
//     IoPersonCircleOutline, 
//     IoShieldOutline 
// } from "react-icons/io5";

// // Configuration des liens de navigation
// const NAVIGATION_LINKS = [
//     { href: "/", label: "Accueil", icon: IoHomeOutline },
//     { href: "/personnes", label: "Personnes", icon: IoPersonCircleOutline },
//     { href: "/familles", label: "Familles", icon: IoPeopleOutline },
// ];

// const ADMIN_LINK = { href: "/admin", label: "Administration", icon: IoShieldOutline };

// export default function Navbar() {
//     // Hooks
//     const router = useRouter();
//     const pathname = usePathname();
//     const { logout, user, role } = useAuth();

//     // États locaux
//     const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//     // Handlers
//     const handleLogout = useCallback(async () => {
//         try {
//             await logout();
//             setIsMobileMenuOpen(false);
//             setIsDesktopMenuOpen(false);
//             toast.success('Déconnexion réussie');
//             router.push('/');
//         } catch (error) {
//             toast.error('Erreur lors de la déconnexion');
//             console.error('Erreur de déconnexion:', error);
//         }
//     }, [logout, router]);

//     const closeMobileMenu = useCallback(() => {
//         setIsMobileMenuOpen(false);
//     }, []);

//     // Effet pour fermer le menu mobile sur redimensionnement
//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth >= 768) {
//                 setIsMobileMenuOpen(false);
//             }
//         };

//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // Composants internes
//     const Logo = () => (
//         <Link href="/" className="flex items-center gap-2 group">
//             <Image 
//                 src='/arbre.png'
//                 width={40}
//                 height={40} 
//                 alt='Logo Généalogie'
//                 className='w-10 h-10 rounded object-cover transition-transform group-hover:scale-105'
//             />
//             <span className='text-white text-2xl font-bold drop-shadow-[0_0_8px_#0dcaf0] group-hover:text-cyan-300 transition-colors hidden md:block'>
//                 Généalogie
//             </span>
//         </Link>
//     );

//     const DesktopNavigation = () => (
//         <div className="hidden md:flex items-center justify-center flex-1 gap-8">
//             {NAVIGATION_LINKS.map(link => (
//                 <Link 
//                     key={link.href}
//                     href={link.href} 
//                     className={`text-lg font-bold transition-colors relative py-2 ${
//                         pathname === link.href 
//                             ? "text-amber-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-amber-400 after:rounded-full" 
//                             : "text-gray-200 hover:text-amber-300"
//                     }`}
//                 >
//                     {link.label}
//                 </Link>
//             ))}
            
//             {role === 'admin' && (
//                 <Link 
//                     href={ADMIN_LINK.href}
//                     className={`text-lg font-bold transition-colors relative bg-gray-800/50 px-4 py-2 rounded-xl backdrop-blur-sm ${
//                         pathname === ADMIN_LINK.href 
//                             ? "text-amber-400 bg-gray-800/80" 
//                             : "text-gray-200 hover:text-amber-300 hover:bg-gray-800/70"
//                     }`}
//                 >
//                     {ADMIN_LINK.label}
//                 </Link>
//             )}
//         </div>
//     );

//     const UserGreeting = ({ isMobile = false }) => (
//         <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
//             !isMobile ? 'hover:bg-white/10' : ''
//         }`}>
//             <span className="text-white">Bonjour,</span>
//             <span className="font-bold text-amber-400">
//                 {user?.username?.charAt(0).toUpperCase() + user?.username?.slice(1)}
//             </span>
//             <span>👋</span>
//         </div>
//     );

//     const DesktopUserMenu = () => (
//         <div className='hidden md:block'>
//             <DropdownMenu open={isDesktopMenuOpen} onOpenChange={setIsDesktopMenuOpen}>
//                 <DropdownMenuTrigger asChild>
//                     <button className="focus:outline-none">
//                         <UserGreeting />
//                     </button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent 
//                     align="end" 
//                     className="w-48 bg-gray-900 text-amber-400 border-gray-700 rounded-lg shadow-xl"
//                 >
//                     <DropdownMenuItem
//                         onClick={handleLogout}
//                         className="flex items-center justify-center gap-2 py-3 text-lg font-bold cursor-pointer hover:bg-gray-800 focus:bg-gray-800 rounded-lg"
//                     >
//                         <IoLogOutOutline className="w-5 h-5" />
//                         Déconnexion
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         </div>
//     );

//     const MobileUserInfo = () => (
//         <div className='block md:hidden'>
//             <UserGreeting isMobile />
//         </div>
//     );

//     const MobileMenu = () => (
//         <div className="md:hidden">
//             <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
//                 <DropdownMenuTrigger asChild>
//                     <Button 
//                         variant="ghost" 
//                         size="icon" 
//                         className="p-2 bg-gray-800/50 hover:bg-gray-800/70 backdrop-blur-sm rounded-lg"
//                         aria-label="Menu de navigation"
//                     >
//                         <GiHamburgerMenu size={24} className="text-amber-400" />
//                     </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                     align="end"
//                     className="w-56 bg-gray-900 text-amber-400 border-gray-700 rounded-lg shadow-xl"
//                 >
//                     {NAVIGATION_LINKS.map((item) => {
//                         const IconComponent = item.icon;
//                         return (
//                             <DropdownMenuItem
//                                 key={item.href}
//                                 asChild
//                                 className="p-0 hover:bg-gray-800 focus:bg-gray-800 rounded-lg mx-1 my-1"
//                             >
//                                 <Link 
//                                     href={item.href} 
//                                     className="flex items-center gap-3 p-3 w-full text-lg font-medium"
//                                     onClick={closeMobileMenu}
//                                 >
//                                     <IconComponent className="w-5 h-5" />
//                                     {item.label}
//                                 </Link>
//                             </DropdownMenuItem>
//                         );
//                     })}
                    
//                     {role === 'admin' && (
//                         <DropdownMenuItem
//                             asChild
//                             className="p-0 hover:bg-gray-800 focus:bg-gray-800 rounded-lg mx-1 my-1"
//                         >
//                             <Link 
//                                 href={ADMIN_LINK.href}
//                                 className="flex items-center gap-3 p-3 w-full text-lg font-medium"
//                                 onClick={closeMobileMenu}
//                             >
//                                 <IoShieldOutline className="w-5 h-5" />
//                                 {ADMIN_LINK.label}
//                             </Link>
//                         </DropdownMenuItem>
//                     )}
                    
//                     <div className="border-t border-gray-700 my-1" />
                    
//                     <DropdownMenuItem
//                         onClick={handleLogout}
//                         className="flex items-center gap-3 p-3 hover:bg-red-900/30 focus:bg-red-900/30 rounded-lg mx-1 my-1 cursor-pointer"
//                     >
//                         <IoLogOutOutline className="w-5 h-5 text-red-400" />
//                         <span className="text-lg font-medium text-red-400">Déconnexion</span>
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         </div>
//     );

//     // Rendu conditionnel pour utilisateurs non connectés
//     if (!user) {
//         return (
//             <header className='w-full bg-gradient-to-r from-cyan-400 to-purple-700 border-b-4 border-cyan-400 shadow-lg py-3 px-6'>
//                 <div className='container mx-auto max-w-7xl flex items-center justify-between'>
//                     <Logo />
//                     <div className="flex items-center gap-4">
//                         <Link 
//                             href="/auth/login"
//                             className="text-white font-semibold hover:text-cyan-300 transition-colors"
//                         >
//                             Connexion
//                         </Link>
//                         <Link 
//                             href="/auth/register"
//                             className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
//                         >
//                             Inscription
//                         </Link>
//                     </div>
//                 </div>
//             </header>
//         );
//     }

//     // Rendu principal pour utilisateurs connectés
//     return (
//         <header className='w-full bg-gradient-to-r from-cyan-400 to-purple-700 border-b-4 border-cyan-400 shadow-lg py-3 px-6 relative z-50'>
//             <div className='container mx-auto max-w-7xl flex items-center justify-between h-full'>
//                 {/* Logo */}
//                 <div className="flex-shrink-0">
//                     <Logo />
//                 </div>

//                 {/* Navigation Desktop */}
//                 <DesktopNavigation />

//                 {/* Section Utilisateur */}
//                 <div className="flex items-center gap-4 flex-shrink-0">
//                     <DesktopUserMenu />
//                     <MobileUserInfo />
//                     <MobileMenu />
//                 </div>
//             </div>
//         </header>
//     );
// }