import { PropsWithChildren } from 'react';
import { PublicTopbar } from '@/components/public-topbar';

export function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDFC]">
            <PublicTopbar />
            <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
