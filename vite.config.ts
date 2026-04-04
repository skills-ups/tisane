import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    // Optimisation du cache pour le développement
    server: {
        watch: {
            usePolling: false, // À mettre sur true uniquement si vous êtes sur Docker/WSL2 avec des soucis de refresh
        }
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                // Le compilateur React est gourmand, on s'assure qu'il ne traite que le nécessaire
                plugins: [
                    ['babel-plugin-react-compiler', { target: '18' }]
                ],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: false,
            // Optionnel : ne générer les routes que si nécessaire
        }),
    ],
    // Force l'optimisation des dépendances lourdes au démarrage
    optimizeDeps: {
        include: ['@inertiajs/react', 'react', 'react-dom'],
    },
});
