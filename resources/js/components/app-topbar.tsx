import AppLogoIcon from '@/components/app-logo-icon';
import { NavUser } from '@/components/nav-user';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { NavItem } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LayoutGrid, Leaf, Droplets, Info, Users2, BoxIcon, Star, ShoppingBag, Package, Menu, X } from 'lucide-react'; // Ajout de Menu et X
import { useEffect, useState } from 'react';

export function AppTopbar({ className }: { className?: string }) {
    const { url, props } = usePage();
    const auth = props.auth as any;
    const isLogged = !!props.auth?.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // État pour le menu mobile

    const { pannier, commande } = usePage().props as any;

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['auth'] });
        }, 2000);

        return () => clearInterval(interval);
    }, [commande]);

    // Fermer le menu mobile quand on change de page
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [url]);

    const mainNavItems: NavItem[] = [
        { title: 'Liste des produits', href: '/produits', icon: LayoutGrid },
        { title: 'Catégories', href: '/categories', icon: Leaf },
        { title: 'Lieux', href: '/lieux', icon: Info },
        { title: 'Panier ' + (pannier || ''), href: '/panier', icon: Droplets },
        { title: 'Commander', href: '/commande', icon: LayoutGrid },
        { title: 'Contact', href: '/contact', icon: Info },
        { title: 'À propos', href: '/about', icon: Info },
    ];

    const adminNavItems: NavItem[] = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        { title: 'Gérer les produits', href: '/admin/produits', icon: Package },
        {
            title: 'Commandes ' + (auth.commande?.length > 9 ? '(+9)' : (auth.commande?.length <= 0) ? '' : '(0' + auth.commande?.length + ')'),
            href: '/admin/commandes',
            icon: ShoppingBag
        },
        {
            title: 'Avis ' + (auth.avis?.length > 9 ? '(+9)' : (auth.avis?.length <= 0) ? '' : '(0' + auth.avis?.length + ')'),
            href: '/admin/commentaires',
            icon: Star
        },
        { title: 'Contacts', href: '/admin/contacts', icon: BoxIcon },
        { title: 'Utilisateurs', href: '/admin/users', icon: Users2 },
    ];

    const userNavItems: NavItem[] = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        { title: 'Gérer les produits', href: '/admin/produits', icon: Package },
        {
            title: 'Commandes' + (auth.commande?.length > 9 ? '(+9)' : (auth.commande?.length <= 0) ? '' : '(0' + auth.commande?.length + ')'),
            href: '/admin/commandes',
            icon: ShoppingBag
        },
        {
            title: 'Avis' + (auth.avis?.length > 9 ? '(+9)' : (auth.avis?.length <= 0) ? '' : '(0' + auth.avis?.length + ')'),
            href: '/admin/commentaires',
            icon: Star
        },
        { title: 'Contacts', href: '/admin/contacts', icon: BoxIcon },
    ];

    // Déterminer quels items afficher
    const activeNavItems = isLogged ? (auth.user?.role_id === 1 ? adminNavItems : userNavItems) : mainNavItems;

    return (
        <>
            <header className={cn("sticky top-0 z-50 w-full border-b border-amber-100 bg-white/80 backdrop-blur-md", className)}>
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* GAUCHE : Logo & Nav Desktop */}
                    <div className="flex items-center gap-8">
                        <Link href={dashboard()} className="flex items-center gap-2 group">
                            <AppLogoIcon className="h-9 w-auto text-amber-600 transition-transform group-hover:scale-110" />
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            {activeNavItems.map((item) => {
                                const isActive = url === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={String(item.href)}
                                        href={item.href}
                                        className={cn(
                                            "relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-amber-600 hover:bg-amber-50 rounded-lg",
                                            isActive ? "text-amber-700 bg-amber-100" : "text-gray-600"
                                        )}
                                    >
                                        {Icon && <Icon className="h-4 w-4" />}
                                        <span>{item.title}</span>
                                        {isActive && (
                                            <span className="absolute inset-x-3 -bottom-[1.1rem] h-0.5 bg-amber-500 rounded" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* DROITE : User & Mobile Toggle */}
                    <div className="flex items-center gap-2">
                        <NavUser />

                        {/* Bouton Menu Mobile */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="flex items-center justify-center p-2 rounded-md text-amber-600 hover:bg-amber-50 md:hidden"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* NAVIGATION MOBILE (Slide Down) */}
                <div className={cn(
                    "absolute top-16 left-0 w-full bg-white border-b border-amber-100 transition-all duration-300 md:hidden overflow-hidden",
                    isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                )}>
                    <nav className="flex flex-col p-4 gap-2">
                        {activeNavItems.map((item) => {
                            const isActive = url === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={String(item.href)}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 text-base font-medium rounded-xl transition-colors",
                                        isActive ? "bg-amber-100 text-amber-700" : "text-gray-600 hover:bg-amber-50"
                                    )}
                                >
                                    {Icon && <Icon className="h-5 w-5 text-amber-600" />}
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            {/* Overlay pour fermer le menu en cliquant à côté */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}