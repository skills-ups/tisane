import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        // l'image doit etre rounde et de taille 36x36
        <img src="/logo.png" alt="Logo" srcset="" className='rounded-full w-15 h-15' />
    );
}
