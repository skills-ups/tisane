import React, { useEffect, useState } from 'react';
import { ChevronDown, Leaf, Hexagon } from 'lucide-react'; // Optionnel: pour les icônes
import { PublicLayout } from '@/components/public-layout';
import { Link, router, usePage } from '@inertiajs/react';

interface FAQItem {
    question: string;
    answer: string;
    category: 'miel' | 'tisane' | 'livraison';
}
const faqData: FAQItem[] = [
    {
        category: 'miel',
        question: "Votre miel est-il pur et non chauffé ?",
        answer: "Absolument. Nos miels sont extraits à froid et mis en pot sans aucun processus de pasteurisation afin de préserver tous les enzymes et nutriments naturels."
    },
    {
        category: 'tisane',
        question: "Comment conserver mes tisanes pour garder leur arôme ?",
        answer: "L'idéal est de les conserver dans un endroit sec, à l'abri de la lumière et de la chaleur. Nos sachets refermables sont conçus pour maintenir la fraîcheur pendant 12 mois."
    },
    {
        category: 'miel',
        question: "Pourquoi mon miel a-t-il cristallisé ?",
        answer: "La cristallisation est un phénomène naturel et un gage de qualité ! Cela prouve que le miel n'a pas été sur-transformé. Pour lui redonner sa texture liquide, placez le pot au bain-marie à moins de 40°C."
    },
    {
        category: 'livraison',
        question: "Quels sont les délais de livraison ?",
        answer: "Nous expédions vos commandes sous 48h. Comptez ensuite 2 à 4 jours ouvrés pour la livraison à domicile ou en point relais."
    }
];

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const { faqDatas } = usePage().props as any;
    const [openId, setOpenId] = useState(Number);
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['faqDatas'] });
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    return (
        <PublicLayout>
            <div className="max-w-3xl mx-auto px-4 py-12 font-sans">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-amber-900 mb-4">Questions Fréquentes</h2>
                    <p className="text-gray-600">Tout ce que vous devez savoir sur nos trésors de la ruche et nos plantes.</p>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className="border border-amber-100 rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-amber-50/50 transition-colors"
                            >
                                <span className="flex items-center gap-3 font-semibold text-amber-950">

                                    {item.question}
                                </span>
                                <ChevronDown
                                    className={`text-amber-700 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-5 pt-0 text-gray-700 leading-relaxed border-t border-amber-50">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                    {faqDatas.map((e: any, ind: number) => (
                        <div
                            key={ind * 10}
                            className="border border-amber-100 rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === (e.id * 10) ? null : (e.id * 10))}
                                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-amber-50/50 transition-colors"
                            >
                                <span className="flex items-center gap-3 font-semibold text-amber-950">

                                    {e.message}
                                </span>
                                <ChevronDown
                                    className={`text-amber-700 transition-transform duration-300 ${openIndex === (e.id * 10) ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === (e.id * 10) ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-5 pt-0 text-gray-700 leading-relaxed border-t border-amber-50">
                                    {e.reponse}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-amber-50 rounded-2xl text-center">
                    <p className="text-amber-900 font-medium mb-4">Vous ne trouvez pas votre réponse ?</p>
                    <Link href={'/contact'} className="mt-8 px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors">
                        Contactez-nous
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
};

export default FAQPage;