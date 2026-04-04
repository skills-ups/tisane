import { PublicLayout } from "@/components/public-layout";
import Modal from "@/components/Modal";
import { Head, Link, router, usePage } from "@inertiajs/react";
import axios from "axios";
import { FileQuestionIcon, ShoppingBag, ShoppingCart, Stars } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import des styles Swiper (Indispensable)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// --- Sous-composant pour chaque carte produit ---
function ProductCard({ item, url, onOrder, id }: { item: any, url: string, onOrder: (item: any) => void, id: number }) {
    const [currentImage, setCurrent] = useState(0);
    const utilisateur = usePage().props.utilisateur;
    useEffect(() => {
        if (!item.image || item.image.length <= 1) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % item.image.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [item.image]);
    const annulerPanier = (e: any) => {
        e.preventDefault;
        const res = axios.post(`/panier/${e}/annuler`, {
            user_id: utilisateur
        });

        toast.promise(res, {
            loading: 'Annultion du panier en cours...',
            success: () => {
                router.reload({ only: ['paniers', 'pannier'] });
                return 'Produit annulé du panier !';
            },
            error: 'Une erreur est survenu lors de l\'annulation du produit dans le panier '
        }, { duration: 9000, position: 'top-right' })
    }
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow m-2">
            <Toaster />
            <div className="relative h-64 bg-gray-50 overflow-hidden">
                <img
                    src={`${url}/storage/${item.image[currentImage]}`}
                    alt={item.name}
                    className="w-full h-full object-cover transition-opacity duration-500"
                />
                <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full font-bold shadow-sm text-sm">
                    {item.price} €
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                </p>

                <div className="flex gap-2 border-t pt-4 mt-auto">
                    <button
                        onClick={() => onOrder(item)}
                        className="flex-1 bg-amber-500 text-white px-2 py-2 rounded-lg font-medium hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                    >
                        Commander <ShoppingBag size={18} />
                    </button>
                    <button className="flex-1 bg-red-500 text-white px-2 py-2 rounded-lg font-medium hover:bg-red-600 transition-all flex items-center justify-center gap-2" onClick={() => confirm('Voulez vous vraiment supprimer cette article ? ') ? annulerPanier(id) : false}>Supprimer du panier</button>
                    <button className="flex-1 bg-green-50 text-green-600 px-2 py-2 rounded-lg font-medium hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2">
                        Avis <Stars size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Composant Principal ---
export default function Panier() {
    const { paniers, utilisateur, url } = usePage().props as any;
    const [email, setEmail] = useState('');
    const [nom, setNom] = useState('');
    const [nombre, setNombre] = useState(Number || null);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // Filtrer les produits du panier appartenant à l'utilisateur
    const userProducts = useMemo(() => {
        return paniers
            .filter((p: any) => p.user_id === utilisateur)
            .flatMap((p: any) => p.produit);
    }, [paniers, utilisateur]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !nom || !nombre) return toast.error("Les champs sont obligatoire");

        const res = axios.post('/commander', {
            produit_id: selectedProduct.id,
            email: email,
            nombre: nombre,
            nom: nom,
            user_id: utilisateur
        });

        toast.promise(res, {
            loading: 'Mise en commande en cours...',
            success: () => {
                setEmail('');
                setSelectedProduct(null);
                router.reload({ only: ['paniers', 'pannier', 'commande'] });
                return 'Votre commande a été envoyée !';
            },
            error: 'Une erreur est survenue'
        }, { position: 'top-right' });
    };

    return (
        <PublicLayout>
            <Head title="Mon Panier" />
            <Toaster />

            <header className=" sticky top-14 z-10 bg-green-600 text-white p-6 rounded-lg shadow-md flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    Mon Panier <ShoppingCart size={30} />
                </h2>
                <span className="bg-white text-green-600 px-4 py-1 rounded-full font-bold">
                    {userProducts.length} article(s)
                </span>
            </header>

            {userProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userProducts.map((produit: any, idx: number) => (
                        <ProductCard
                            key={`${produit.id}-${idx}`}
                            item={produit}
                            url={url}
                            id={produit.id}
                            onOrder={setSelectedProduct}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <FileQuestionIcon size={120} strokeWidth={1} />
                    <h2 className="text-2xl font-semibold mt-4">Votre panier est vide</h2>
                </div>
            )}
            {selectedProduct && (
                <Modal onClose={() => setSelectedProduct(null)} show={!!selectedProduct}>
                    <div className="p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">

                        <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={0}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 3000 }}
                                className="w-50 h-50"
                            >
                                {selectedProduct.image.map((img: string, index: number) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={`${url}/storage/${img}`}
                                            alt={`${selectedProduct.name} - ${index}`}
                                            className="w-50 h-50 object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div>
                                <p className="font-bold">{selectedProduct.name}</p>
                                <p className="text-green-600 font-semibold">{selectedProduct.price} €</p>
                                <p className="font-bold">Produit en stock : {selectedProduct.stock_number + " " + selectedProduct.stock.replace('_', ' de ')}</p>
                                <p>Categorie : {selectedProduct.category == 1 ? 'Tisane' : 'Miel'}</p>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-2 items-center ">
                                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                                    Votre nom
                                </label>
                                <input
                                    type="text"
                                    id="nom"
                                    required
                                    className="w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 p-2 border"
                                    placeholder="Entrer votre nom"
                                    onChange={(e) => setNom(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 p-2 border"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre &agrave; commander</label>
                                <input type="number" name=""
                                    required
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 p-2 border" />

                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-shadow shadow-md"
                                >
                                    Confirmer la commande
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedProduct(null)}
                                    className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </PublicLayout>
    );
}