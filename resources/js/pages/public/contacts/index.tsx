import { PublicLayout } from "@/components/public-layout";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import { Phone, ShoppingBag, XCircle } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Contact() {
    const { paniers, utilisateur, pannier, commande, url, commande_take } = usePage().props as any;
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [sujet, setSujet] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Envoyer les données du formulaire au backend via une requête POST
        const res = axios.post('/contact', {
            nom,
            email,
            sujet,
            message
        });
        toast.promise(res, {
            loading: 'Envoi en cours...',
            success: () => {
                setNom('');
                setEmail('');
                setSujet('');
                setMessage('');
                return 'Message envoyé avec succès !';
            },
            error: 'Erreur lors de l\'envoi du message.'
        }, { duration: 5000, position: 'top-right' });
    };
    return (

        <PublicLayout>
            <Head title="Commande" />
            <Toaster />
            <h2 className="mt-0 text-4xl flex font-semibold w-full border-b bg-green-600 text-white rounded shadow p-4">
                Contact <Phone className="ml-2" size={'3%'} />
            </h2>
            {/* Mise en place des textes a coter du formulaire de contact pour un meilleur rendu et une meilleure expérience utilisateur et une image de font d'apres le logo qui est transparent bien-sur */}
            <div className="flex flex-col md:flex-row items-center justify-center mt-10">
                <div className="w-full md:w-1/2 p-4 shadow rounded bg-white">
                    <h3 className="text-2xl font-semibold mb-4">Nous contacter</h3>
                    <p className="mb-4">Vous avez des questions ou besoin d'assistance ? N'hésitez pas à nous contacter. Notre équipe est là pour vous aider.</p>
                    <p className="mb-4">Email : contact@votreentreprise.com</p>
                    <p className="mb-4">Téléphone : +261 34 24 254 02</p>
                </div>
                <div className=" flex w-full p-4">
                    <form className="w-full max-w-lg mx-auto bg-white rounded shadow p-6" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Nom
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Votre nom" onChange={(e: any) => setNom(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Adresse e-mail
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Votre adresse e-mail" onChange={(e: any) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                                Sujet
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="subject" type="text" placeholder="Sujet de votre message" onChange={(e: any) => setSujet(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                                Message
                            </label>
                            <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Votre message" onChange={(e: any) => setMessage(e.target.value)} required></textarea>
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Envoyer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PublicLayout>
    )
}