import React from 'react';
import { Heart, ShieldCheck, Sprout, MapPin } from 'lucide-react';
import { PublicLayout } from '@/components/public-layout';

const AboutPage = () => {
    return (
        <PublicLayout >
            <div className="bg-white">
                {/* Hero Section - L'accroche */}
                <section className="relative py-20 bg-amber-50">
                    <div className="max-w-5xl mx-auto px-4 text-center">
                        <span className="text-amber-600 font-semibold tracking-wide uppercase text-sm">Notre Histoire</span>
                        <h1 className="mt-2 text-4xl md:text-5xl font-serif font-bold text-amber-900">
                            De la fleur au flacon, <br /> le respect du cycle naturel.
                        </h1>
                        <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                            Depuis trois générations, notre famille cultive la passion de l'apiculture
                            et de l'herboristerie au cœur de nos régions préservées.
                        </p>
                    </div>
                </section>

                {/* Section Image & Texte - Le Storytelling */}
                <section className="py-16 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-amber-200 rounded-2xl rotate-2 transition-transform group-hover:rotate-1"></div>
                        <img
                            src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800"
                            alt="Nos ruches en plein air"
                            className="relative rounded-2xl shadow-xl object-cover h-[400px] w-full"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-amber-950 mb-6">Une passion héritée</h2>
                        <p className="text-gray-700 mb-4">
                            Tout a commencé dans un petit jardin de plantes médicinales. Notre fondateur,
                            passionné par les bienfaits des abeilles, a décidé d'allier le pouvoir sucré du miel
                            à la force tranquille des plantes infusées.
                        </p>
                        <p className="text-gray-700">
                            Aujourd'hui, nous travaillons avec des producteurs locaux qui partagent notre vision :
                            une production à échelle humaine, sans pesticides, pour une pureté inégalée.
                        </p>
                    </div>
                </section>

                {/* Section Valeurs - Les Icones */}
                <section className="bg-stone-50 py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-center text-3xl font-bold text-amber-950 mb-12">Ce qui nous anime</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Sprout className="text-green-600" size={32} />,
                                    title: "100% Naturel",
                                    desc: "Aucun arôme artificiel, aucun conservateur. Rien que le produit brut."
                                },
                                {
                                    icon: <ShieldCheck className="text-amber-600" size={32} />,
                                    title: "Qualité Certifiée",
                                    desc: "Chaque récolte est analysée pour garantir un taux d'humidité et de pureté optimal."
                                },
                                {
                                    icon: <MapPin className="text-orange-600" size={32} />,
                                    title: "Local & Éthique",
                                    desc: "Nous privilégions les circuits courts pour soutenir nos apiculteurs de proximité."
                                }
                            ].map((value, i) => (
                                <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 hover:-translate-y-1 transition-transform">
                                    <div className="mb-4">{value.icon}</div>
                                    <h3 className="text-xl font-bold text-amber-900 mb-2">{value.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to action final */}
                <section className="py-20 text-center">
                    <div className="inline-block p-4 rounded-full bg-amber-100 mb-6">
                        <Heart className="text-amber-600 fill-amber-600" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-amber-950 mb-6">Envie de goûter la différence ?</h2>
                    <button className="bg-amber-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-900 transition-colors shadow-lg">
                        Découvrir notre boutique
                    </button>
                </section>
            </div>
        </PublicLayout>
    );
};

export default AboutPage;