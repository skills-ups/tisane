import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { AppTopbar } from '@/components/app-topbar';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="topbar">
            {/* le app top bar ne dois pas prendre toute la hauteur */}
            <AppTopbar className="w-full h-16" />
            {/* le contenue doit etre au milieu de la page et ne pas prendre toute la hauteur */}
            <div className="flex flex-col h-full">
                <div className="flex flex-1 overflow-hidden">
                    <AppContent
                        variant="topbar"
                        className="overflow-x-hidden flex-1 p-6  justify-center items-start gap-6"
                    >
                        {children}
                    </AppContent>
                </div>
            </div>
        </AppShell>
    );
}
