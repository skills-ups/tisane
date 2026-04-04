import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
    Box, Filter, PackageOpen, ShoppingBag,
    ShoppingCart, Star, Stars, Search
} from "lucide-react";

import Modal from "@/components/Modal";
import { PublicLayout } from "@/components/public-layout";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import des styles Swiper indispensables
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// --- Types ---
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string[];
}

interface PageProps {
    url: string;
    produite: Product[];
    utilisateur: any;
}

export default function Produit() {
    const { url, produite, utilisateur } = usePage().props as unknown as PageProps;

    // --- States ---
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalType, setModalType] = useState<"order" | "review" | null>(null);
    const [email, setEmail] = useState("");
    const [stars, setStars] = useState(0);
    const [description, setDescription] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentImage, setCurrent] = useState(0);


    // --- Actions ---
    const handleAddToPanier = (id: number) => {
        const promise = axios.post('/panier', { produit_id: id, user_id: utilisateur });

        toast.promise(promise, {
            loading: 'Ajout au panier...',
            success: () => {
                router.reload({ only: ['paniers'] });
                return 'Produit ajouté !';
            },
            error: 'Erreur lors de l\'ajout'
        });
    };

    const [filtre, setFiltre] = useState('');
    const produitsFiltres = produite.filter((item) => {
        // On crée le regex pour la recherche textuelle

        const regex = new RegExp(searchTerm, 'i');

        // Filtre par catégorie
        const correspondCategorie = filtre == '' || item.category.toString() == filtre;

        // Filtre par texte (nom, description ou prix)
        const correspondRecherche =
            regex.test(item.name) ||
            regex.test(item.description) ||
            regex.test(item.price.toString());

        return correspondCategorie && correspondRecherche;
    });
    const [nombre, setNombre] = useState(Number);
    const [nom, setNom] = useState('');
    const handleOrder = (e: React.FormEvent) => {
        e.preventDefault();
        const promise = axios.post('/commander', {
            produit_id: selectedProduct?.id,
            email,
            nom,
            nombre,
            user_id: utilisateur
        });

        toast.promise(promise, {
            loading: 'Traitement de la commande...',
            success: () => {
                closeModal();
                router.reload({ only: ['commande'] });
                return 'Commande envoyée avec succès !';
            },
            error: 'Erreur lors de la commande'
        });
    };

    const handleReview = (e: React.FormEvent) => {
        e.preventDefault();
        const promise = axios.post('/avis', {
            produit: selectedProduct?.id,
            email,
            etoile: stars,
            description,
            user_id: utilisateur
        });

        toast.promise(promise, {
            loading: 'Publication de votre avis...',
            success: () => {
                closeModal();
                return 'Merci pour votre avis !';
            },
            error: promise.response?.data?.message || 'Erreur lors de la publications'
        });
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setModalType(null);
        setEmail("");
        setStars(0);
        setDescription("");
    };

    return (
        <PublicLayout>
            <Toaster position="top-right" />

            {/* Header */}
            <header className=" bg-green-600 text-white p-6 shadow-lg rounded-lg flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    Boutique <Box size={32} />
                </h2>
            </header>

            {/* Barre de Recherche & Filtres */}
            <div className="sticky top-14 z-10 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border mb-8 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg flex-1 min-w-[250px]">
                    <Search size={20} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        className="bg-transparent border-none focus:ring-0 w-full p-2 text-gray-700 rounded-lg"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={20} />
                    <select className="border-gray-200 rounded-lg focus:ring-green-500" onChange={(e) => setFiltre(e.target.value)}>
                        <option value="">Toutes les catégories</option>
                        <option value="1">Tisanes</option>
                        <option value="2">Miels</option>
                    </select>
                </div>
            </div>

            {/* Grille de Produits */}
            <section className="min-h-[60vh]">
                {produitsFiltres.length === 0 ? (
                    /* État Vide : Si rien ne correspond à la recherche OU à la catégorie */
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                        <PackageOpen size={80} strokeWidth={1} className="animate-pulse" />
                        <h3 className="text-2xl mt-4 font-light">Oups ! Aucun produit trouvé</h3>
                        <p className="text-gray-500 mt-2">
                            Aucun résultat pour <span className="font-bold text-gray-700">"{searchTerm || 'cette catégorie'}"</span>.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setFiltre(''); }}
                            className="mt-6 text-green-600 hover:underline font-medium"
                        >
                            Réinitialiser tous les filtres
                        </button>
                    </div>
                ) : (
                    /* Grille de produits : Si des produits existent */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {produitsFiltres.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">

                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden group">
                                    {/* Badges fixes (Z-index 10) */}
                                    <div className="absolute top-4 right-4 z-10 bg-green-600 text-white px-4 py-1 rounded-full font-bold shadow-lg text-sm">
                                        {item.price} €
                                    </div>
                                    <div className={`absolute bottom-4 z-10 ${item.stock_number <= 0 ? 'bg-red-600' : 'bg-green-600'} right-4 text-white px-4 py-1 rounded-full font-bold shadow-lg text-xs`}>
                                        {item.stock_number <= 0 ? 'Rupture de stock' : `${item.stock_number} en stock`}
                                    </div>
                                    <div className={`absolute top-4 z-10 ${item.stock_number <= 0 ? 'bg-red-600' : 'bg-blue-600'} left-4 text-white px-4 py-1 rounded-full font-bold shadow-lg text-xs uppercase`}>
                                        {item.stock_number <= 0 ? 'Inactif' : 'Actif'}
                                    </div>

                                    {/* Carrousel Swiper ou Image Unique */}
                                    {item.image && item.image.length > 1 ? (
                                        <Swiper
                                            modules={[Navigation, Pagination, Autoplay]}
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            navigation
                                            pagination={{ clickable: true }}
                                            autoplay={{ delay: 3000 }}
                                            className="w-full h-full"
                                        >
                                            {item.image.map((img, index) => (
                                                <SwiperSlide key={index}>
                                                    <img
                                                        src={`${url}/storage/${img}`}
                                                        alt={`${item.name} - ${index}`}
                                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    ) : (
                                        <img
                                            src={item.image?.[0] ? `${url}/storage/${item.image[0]}` : '/placeholder.png'}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                                    <p className="text-sm">
                                        Catégorie : <span className="text-green-600 font-semibold">{item.category == 1 ? 'Tisane' : 'Miel'}</span>
                                    </p>
                                    <p className="text-sm text-gray-600 italic">
                                        Stock : {item.stock_number > 0 ? `${item.stock_number} ${item.stock?.replace('_', ' de ')}` : 'Indisponible'}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-3 mb-6 line-clamp-2">
                                        {item.description}
                                    </p>

                                    {/* Actions (Boutons) */}
                                    <div className="mt-auto space-y-2">

                                        <div className="flex gap-2">
                                            {item.stock_number <= 0 ? ("") : (
                                                <>
                                                    <button
                                                        onClick={() => handleAddToPanier(item.id)}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2.5 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
                                                    >
                                                        <ShoppingCart size={18} /> Panier
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedProduct(item); setModalType('order'); }}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-amber-600 text-white py-2.5 rounded-xl font-semibold hover:bg-amber-700 transition-colors w-100"
                                                    >
                                                        <ShoppingBag size={18} /> Acheter
                                                    </button>
                                                </>)}

                                            <button
                                                onClick={() => { setSelectedProduct(item); setModalType('review'); }}
                                                className="w-full flex items-center justify-center gap-2 text-gray-400 py-2 hover:text-green-600 transition-colors text-xs"
                                            >
                                                <Stars size={16} /> Avis
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Modal Unique Gérée par type */}
            {
                selectedProduct && (
                    <Modal onClose={closeModal} show={!!selectedProduct}>
                        <div className="p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-4">
                                {modalType === 'order' ? 'Finaliser la commande' : 'Votre avis nous intéresse'}
                            </h2>

                            <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                {selectedProduct.image && selectedProduct.image.length > 1 ? (
                                    <Swiper
                                        modules={[Navigation, Pagination, Autoplay]}
                                        spaceBetween={0}
                                        slidesPerView={1}
                                        navigation
                                        pagination={{ clickable: true }}
                                        autoplay={{ delay: 3000 }}
                                        className="w-50 h-50"
                                    >
                                        {selectedProduct.image.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <img
                                                    src={`${url}/storage/${img}`}
                                                    alt={`${selectedProduct.name} - ${index}`}
                                                    className="w-50 h-50 object-cover transition-transform duration-500 hover:scale-105"
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    <img
                                        src={selectedProduct.image?.[0] ? `${url}/storage/${selectedProduct.image[0]}` : '/placeholder.png'}
                                        alt={selectedProduct.name}
                                        className="w-50 h-50 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                                <div>
                                    <p className="font-bold">{selectedProduct.name}</p>
                                    <p className="text-green-600 font-semibold">{selectedProduct.price} €</p>
                                    <p className="font-bold">Produit en stock : {selectedProduct.stock_number + " " + selectedProduct.stock.replace('_', ' de ')}</p>
                                    <p>Categorie : {selectedProduct.category == 1 ? 'Tisane' : 'Miel'}</p>
                                </div>
                            </div>

                            <form onSubmit={modalType === 'order' ? handleOrder : handleReview} className="space-y-4">
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

                                        className="w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 p-2 border" onChange={(e: any) => setNombre(e.target.value > Math.abs(selectedProduct.stock_number) ? 0 : e.target.value)} placeholder="Ex : 10" id="" max={selectedProduct.stock_number} min={'1'} value={nombre} />
                                    {nombre > 0 ? (<div> {nombre * selectedProduct.price}.00 &euro; </div>) : ''}
                                </div>

                                {modalType === 'review' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <Star
                                                        key={num}
                                                        size={28}
                                                        className="cursor-pointer transition-colors"
                                                        fill={stars >= num ? "#FBBF24" : "none"}
                                                        color={stars >= num ? "#FBBF24" : "#D1D5DB"}
                                                        onClick={() => setStars(num)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                                            <textarea
                                                className="w-full border-gray-300 rounded-lg focus:ring-green-500 h-24"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-shadow shadow-md"
                                    >
                                        {modalType === 'order' ? 'Confirmer la commande' : 'Publier l\'avis'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                )
            }
        </PublicLayout >
    );
}