
import { Head } from '@inertiajs/react';
import { PublicLayout } from '@/components/public-layout';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <>
            <PublicLayout>
                <section className="relative flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-amber-50 via-white to-amber-100 px-2 py-8 sm:py-16">
                    {/* Section décorative d'arrière-plan */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-50 via-white to-amber-100" />

                    <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center gap-12 px-4 sm:px-8">
                        {/* Texte et Appel à l'action */}
                        <div className="w-full max-w-xl flex flex-col items-start lg:items-start">
                            <span className="mb-6 inline-block rounded-full bg-amber-100 px-4 py-1.5 text-base font-semibold text-amber-800 ring-1 ring-inset ring-amber-200 shadow-sm">
                                Nouveauté : Miel de Lavande Bio
                            </span>
                            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-amber-900 font-serif drop-shadow-lg mb-6">
                                Le secret de la nature,<br />
                                <span className="text-amber-600">infusé pour votre bien-être.</span>
                            </h1>
                            <p className="mb-8 text-lg sm:text-xl leading-8 text-gray-700">
                                Découvrez notre sélection exclusive de tisanes artisanales et de miels purs récoltés durablement.<br />
                                Une alliance parfaite entre tradition apicole et vertus des plantes.
                            </p>
                            <div className="flex flex-wrap gap-4 mb-10">
                                <a href="#" className="rounded-xl bg-amber-700 px-8 py-3 text-base font-bold text-white shadow-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400">
                                    Explorer la boutique
                                </a>
                                <a href="#" className="text-base font-semibold leading-6 text-amber-900 flex items-center gap-2 hover:underline">
                                    Nos rituels de dégustation <span aria-hidden="true">→</span>
                                </a>
                            </div>
                            {/* Stats / Réassurance */}
                            <div className="mt-6 grid grid-cols-3 gap-6 border-t border-amber-100 pt-8 w-full">
                                <div className="text-center">
                                    <p className="text-3xl font-extrabold text-amber-900">100%</p>
                                    <p className="text-base text-gray-500">Naturel</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-extrabold text-amber-900">Eco</p>
                                    <p className="text-base text-gray-500">Responsable</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-extrabold text-amber-900">Local</p>
                                    <p className="text-base text-gray-500">Artisanal</p>
                                </div>
                            </div>
                        </div>
                        {/* Image / Visuel */}
                        <div className="w-full max-w-md flex justify-center lg:justify-end">
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800"
                                    alt="Miel et infusion"
                                    className="w-[350px] h-[450px] sm:w-[400px] sm:h-[500px] rounded-3xl object-cover shadow-2xl border-4 border-white/80 hover:rotate-0 transition-transform duration-500 rotate-2"
                                />
                                {/* Badge décoratif flottant */}
                                <div className="absolute -bottom-7 -left-7 bg-white/90 px-6 py-3 rounded-2xl shadow-xl border border-amber-100 hidden md:block">
                                    <p className="text-amber-600 font-bold text-lg text-center italic">Récolte 2024</p>
                                    <p className="text-gray-400 text-xs">Direct producteur</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </PublicLayout>
        </>
    );
}
