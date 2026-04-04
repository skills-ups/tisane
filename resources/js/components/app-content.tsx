import * as React from 'react';
import type { AppVariant } from '@/types';
import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'main'> & {
    variant?: AppVariant;
};

export function AppContent({ variant = 'topbar', children, ...props }: Props) {
    return (
        <main
            className={cn(
                "flex-1",
                variant === 'topbar' && 'pl-[16rem]'
            )}
            {...props}
        >
            {children}
        </main>
    );
}
