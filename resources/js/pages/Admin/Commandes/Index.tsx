import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { BreadcrumbItem } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import axios from "axios";
import { Send, XCircle, Package, Mail, CreditCard } from "lucide-react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function GestionCommandes() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Gérer les commandes', href: '/admin/commandes' },
    ];

    const { auth, url } = usePage().props as any;

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['auth'], preserveScroll: true });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleAccepte = (id: number) => {
        const res = axios.post('/envoyer/commande', { id });

        toast.promise(res, {
            loading: 'Expédition de la commande...',
            success: () => {
                router.reload({ only: ['auth'] });
                return 'Commande marquée comme envoyée (Mail client expédié)';
            },
            error: 'Erreur lors de l\'envoi'
        }, { position: 'top-right' });
    };

    const handleAnnule = (id: number) => {
        router.post(`/commande/${id}/annuler`, {}, {
            onSuccess: () => toast.success("Commande annulée"),
            onError: () => toast.error("Impossible d'annuler")
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administration - Commandes" />
            <Toaster />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Package className="text-green-600" /> File des commandes
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold border-b">Client / Contact</th>
                                <th className="p-4 font-semibold border-b">Détails Produits</th>
                                <th className="p-4 font-semibold border-b text-center">Total</th>
                                <th className="p-4 font-semibold border-b">Statut</th>
                                <th className="p-4 font-semibold border-b text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {auth.commande.length > 0 ? (
                                auth.commande.map((cmd: any) => (
                                    <tr key={cmd.id} className="hover:bg-gray-50/50 transition-colors">
                                        {/* Colonne Client */}
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 flex items-center gap-2">
                                                    <Mail size={14} className="text-gray-400" /> {cmd.email}
                                                </span>
                                                <span className="text-xs text-gray-400 mt-1">
                                                    ID: #{cmd.id} • {new Date(cmd.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Colonne Produits (Gestion Multi-produits) */}
                                        <td className="p-4">
                                            <div className="space-y-2">
                                                {cmd.produit.map((p: any) => (
                                                    <div key={p.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                        <img
                                                            src={`${url}/storage/${p.image[0]}`}
                                                            className="w-12 h-12 object-cover rounded shadow-sm"
                                                            alt=""
                                                        />
                                                        <div className="text-sm">
                                                            <p className="font-semibold text-gray-700">{p.name}</p>
                                                            <p className="text-green-600 text-xs">{p.price} €</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Colonne Prix Total */}
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1 font-bold text-gray-800">
                                                {cmd.produit.reduce((acc: number, curr: any) => acc + parseFloat(curr.price), 0)} €
                                            </span>
                                        </td>

                                        {/* Colonne Statut */}
                                        <td className="p-4">
                                            {cmd.status === 'pending' ? (
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold animate-pulse">
                                                    À TRAITER
                                                </span>
                                            ) : cmd.status === 'validate' ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                    EXPÉDIÉ
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                    ANNULÉ
                                                </span>
                                            )}
                                        </td>

                                        {/* Colonne Actions */}
                                        <td className="p-4 text-right">
                                            {cmd.status === 'pending' ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAccepte(cmd.id)}
                                                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
                                                        title="Valider et envoyer mail"
                                                    >
                                                        Valider <Send size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => confirm('Annuler cette commande ?') && handleAnnule(cmd.id)}
                                                        className="p-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 text-sm font-medium"
                                                        title="Annuler"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Aucune action requise</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <Package size={48} className="mx-auto text-gray-200 mb-4" />
                                        <p className="text-gray-400 font-medium">Aucune commande pour le moment.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}