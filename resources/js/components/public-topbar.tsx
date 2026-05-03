import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { LayoutGrid, Leaf, Droplets, Info, ShoppingCart, Phone, Menu as MenuIcon, X as CloseIcon, LogIn, UserPlus, MapPinHouse, ShoppingBag, Send, MailQuestion, LucideBox } from 'lucide-react';
import { login, register, dashboard } from '@/routes';
import AppLogoIcon from './app-logo-icon';

export function PublicTopbar() {

    const { pannier, commande } = usePage().props as any;

    const publicNavItems = [
        {
            title: '',
            href: '/produits',
            icon: LucideBox,

        },
        {
            title: pannier.length > 0 ? '(' + pannier.length + ')' : null,
            href: '/panier',
            icon: ShoppingCart,
        },
        {
            title: commande.length > 0 ? '(' + commande.length + ')' : null,
            href: '/commande',
            icon: ShoppingBag,
        },
        {
            title: '',
            href: '/contact',
            icon: Phone,
        },

        {
            title: '',
            href: '/faq',
            icon: MailQuestion,
        },
        {
            title: 'A propos',
            href: '/about',
            icon: Info,
        },
    ];
    const adminNavItems = [
        { title: 'Dashboard', href: dashboard().url, icon: LayoutGrid },
        { title: 'Produits', href: '/produits', icon: LayoutGrid },
        { title: 'Commandes', href: '/admin/commandes', icon: ShoppingCart },
        { title: 'Avis', href: '/admin/commentaires', icon: Info },
        { title: 'Contacts', href: '/admin/contacts', icon: Phone },
    ];
    const { url, props } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);
    const isLogged = !!props.auth?.user;
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['pannier', 'commande'] });
        }, 2000);

        return () => clearInterval(interval);
    }, [pannier, commande]);
    return (
        <header className="sticky top-0 z-50 w-full border-b border-amber-200 bg-white/80 backdrop-blur-xl shadow-lg">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
                <div className="flex items-center gap-8 w-full">
                    <Link href="/" className="flex items-center gap-2 group select-none min-w-max">
                        <AppLogoIcon className="h-9 w-auto text-amber-600 transition-transform group-hover:scale-110" />
                    </Link>
                    {/* Menu desktop */}
                    <nav className="hidden md:flex items-center gap-3 flex-1 justify-center">
                        {(isLogged ? adminNavItems : publicNavItems).map((item) => {
                            const isActive = url === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={String(item.href)}
                                    href={item.href}
                                    className={cn(
                                        "relative flex items-center gap-2 px-2 py-2 text-base font-medium rounded-xl transition-all duration-200 hover:text-amber-700 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300",
                                        isActive ? "text-amber-900 bg-amber-100 shadow" : "text-gray-700"
                                    )}
                                >
                                    {Icon && <Icon className="h-5 w-5" />}
                                    <span>{item.title}</span>
                                    {isActive && (
                                        <span className="absolute inset-x-4 -bottom-1 h-0.5 bg-amber-500 rounded" />
                                    )}
                                </Link>
                            );
                        })}
                        {/* Auth links desktop */}
                        {!isLogged && (
                            <>
                                <Link href={login().url} className="flex items-center gap-1 px-3 py-1 text-base font-medium rounded-xl text-amber-700 border border-amber-200 bg-white shadow hover:bg-amber-50 transition-all min-w-[120px] justify-center ml-0">
                                    <LogIn className="h-5 w-5" />
                                    <span>Se connecter</span>
                                </Link>
                                <Link href={register().url} className="flex items-center gap-1 px-3 py-1 text-base font-medium rounded-xl text-white bg-amber-700 shadow hover:bg-amber-800 transition-all min-w-[120px] justify-center ml-0">
                                    <UserPlus className="h-5 w-5" />
                                    <span>Créer un compte</span>
                                </Link>
                            </>
                        )}
                        {/* Déconnexion admin */}
                        {isLogged && (
                            <Link href="/logout" method="post" as="button" className="flex items-center gap-2 px-4 py-2 text-base font-medium rounded-xl text-amber-700 border border-amber-200 bg-white shadow hover:bg-amber-50 transition-all ml-2">
                                <LogIn className="h-5 w-5 rotate-180" />
                                Déconnexion
                            </Link>
                        )}
                    </nav>
                    {/* Menu mobile hamburger */}
                    <button
                        className="md:hidden ml-2 p-2 rounded-xl border border-amber-100 bg-white/70 shadow hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 fixed right-0 mr-4"
                        aria-label="Ouvrir le menu"
                        onClick={() => setMobileOpen(true)}
                    >
                        <MenuIcon className="h-8 w-8 text-amber-800" />
                    </button>
                </div>
            </div>
            {/* Overlay mobile menu */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[100] flex md:hidden h-100">
                    {/* Overlay noir semi-transparent et blur sur tout le body, désactive le scroll */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px] transition-opacity " onClick={() => setMobileOpen(false)} style={{ WebkitBackdropFilter: 'blur(6px)' }} />
                    <nav className="relative ml-auto my-auto w-[90vw] max-w-xs h-[90vh] bg-white shadow-2xl rounded-3xl p-8 flex flex-col items-center gap-6 animate-slide-in border-l border-amber-100 overflow-y-auto">
                        <button
                            className="self-end mb-4 p-2 rounded-full hover:bg-amber-50 focus:outline-none"
                            aria-label="Fermer le menu"
                            onClick={() => setMobileOpen(false)}
                        ><CloseIcon className="h-8 w-8 text-amber-800" />
                        </button>

                        {(isLogged ? adminNavItems : publicNavItems).map((item) => {
                            const isActive = url === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={String(item.href)}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-5 py-3 rounded-2xl text-lg font-semibold transition-all duration-200 hover:text-amber-700 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 w-full justify-start shadow-sm",
                                        isActive ? "text-amber-900 bg-amber-100 shadow" : "text-gray-800"
                                    )}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {Icon && <Icon className="h-6 w-6" />}
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}
                        {/* Auth links mobile */}
                        {!isLogged && (
                            <>
                                <Link href={login().url} className="flex items-center gap-4 px-5 py-3 rounded-2xl text-lg font-semibold text-amber-700 border border-amber-200 bg-white shadow hover:bg-amber-50 transition-all w-full justify-start mt-2" onClick={() => setMobileOpen(false)}>
                                    <LogIn className="h-6 w-6" />
                                    Se connecter
                                </Link>
                                <Link href={register().url} className="flex items-center gap-4 px-5 py-3 rounded-2xl text-lg font-semibold text-white bg-amber-700 shadow hover:bg-amber-800 transition-all w-full justify-start mt-2" onClick={() => setMobileOpen(false)}>
                                    <UserPlus className="h-6 w-6" />
                                    Créer un compte
                                </Link>
                            </>
                        )}
                        {/* Déconnexion mobile */}
                        {isLogged && (
                            <Link href="/logout" method="post" as="button" className="flex items-center gap-4 px-5 py-3 rounded-2xl text-lg font-semibold text-amber-700 border border-amber-200 bg-white shadow hover:bg-amber-50 transition-all w-full justify-start mt-2" onClick={() => setMobileOpen(false)}>
                                <LogIn className="h-6 w-6 rotate-180" />
                                Déconnexion
                            </Link>
                        )}
                    </nav>
                    {/* Désactive le scroll du body quand le menu est ouvert */}
                    <style>{`body { overflow: hidden !important; blur:()  }`}</style>
                </div>
            )}
        </header>
    );
}

export default PublicTopbar;
