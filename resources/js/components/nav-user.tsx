import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';

export function NavUser() {
    const { auth } = usePage().props;

    return (
        /* On retire SidebarMenu et SidebarMenuItem qui sont inutiles ici */
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center gap-2 rounded-lg p-2 text-left text-sm transition-hover hover:bg-amber-50 focus:outline-none"
                    data-test="topbar-user-button"
                >
                    {/* On garde UserInfo pour l'avatar et le nom */}
                    <UserInfo user={auth.user} />
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56 mt-2 rounded-xl shadow-lg border-amber-100"
                align="end"
                side="bottom"
                sideOffset={8}
            >
                {/* On réutilise le contenu existant pour garder la logique de déconnexion/profil */}
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}