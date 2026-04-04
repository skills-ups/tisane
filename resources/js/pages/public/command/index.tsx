import { PublicLayout } from "@/components/public-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { ShoppingBag, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Commande() {
    const { url, commande_take } = usePage().props as any;

    // Rafraîchissement automatique pour suivre l'état de la commande côté admin
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['commande_take'], preserveScroll: true });
        }, 10000); // 10s est suffisant et moins lourd pour le serveur

        return () => clearInterval(interval);
    }, []);

    const handleCancel = (id: number) => {
        if (confirm("Voulez-vous vraiment annuler cette commande ?")) {
            router.post(`/commande/${id}/annuler`, {}, {
                onSuccess: () => toast.success("Commande annulée"),
                onError: () => toast.error("Impossible d'annuler")
            });
        }
    };

    return (
        <PublicLayout>
            <Head title="Mes Commandes" />
            <Toaster />

            <h2 className="sticky top-14 z-10 text-3xl md:text-4xl flex items-center font-bold w-full border-b bg-green-600 text-white rounded-xl shadow-lg p-6 mb-8">
                Mes Commandes <ShoppingBag className="ml-3" size={32} />
            </h2>

            {commande_take.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {commande_take.map((cmd: any) => (
                        // On part du principe que cmd.produit est un tableau
                        cmd.produit.map((prod: any) => (
                            <div key={`${cmd.id}-${prod.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all">

                                {/* Header de la carte : Status */}
                                <div className={`p-3 text-center text-sm font-bold uppercase tracking-wider ${cmd.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                    cmd.status === 'validate' ? 'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {cmd.status === 'pending' && "⏳ En attente de validation"}
                                    {cmd.status === 'validate' && "✅ Commande validée"}
                                    {cmd.status === 'cancelled' && "❌ Commande annulée"}
                                </div>

                                <div className="p-5 flex gap-4">
                                    <img
                                        src={`${url}/storage/${prod.image[0]}`}
                                        alt={prod.name}
                                        className="w-20 h-20 object-cover rounded-lg shadow-inner"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 leading-tight capitalize">{prod.name}</h3>
                                        <p>Commande : {cmd.nombre} {prod.stock.replace('_', ' de ')}</p>
                                        <p>Prix unitaire : {prod.price} &euro;</p>
                                        <p className=" font-bold text-lg">Prix en total : <b className="text-green-600">{cmd.nombre * Math.floor(prod.price)} €</b></p>
                                        <p>{prod.nom}</p>


                                    </div>
                                </div>

                                <div className="px-5 pb-5 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Calendar size={14} />
                                        <span>Commandé le : {new Date(cmd.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {cmd.created_at !== cmd.updated_at ? (
                                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                                            <Clock size={14} />
                                            <span>Mise à jour : {new Date(cmd.updated_at).toLocaleDateString()} à {new Date(cmd.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 italic flex items-center gap-2">
                                            <Clock size={14} /> En cours de traitement...
                                        </div>
                                    )}
                                </div>

                                {/* Footer : Actions */}
                                <div className="p-4 bg-gray-50 border-t mt-auto text-center">
                                    {cmd.status === 'pending' ? (
                                        <button
                                            onClick={() => handleCancel(cmd.id)}
                                            className="w-full py-2 bg-white border border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={18} /> Annuler la commande
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 text-gray-500 font-medium">
                                            {cmd.status === 'validate' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
                                            {cmd.status === 'validate' ? 'Traitée' : 'Terminée'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-gray-300">
                    <ShoppingBag size={100} strokeWidth={1} />
                    <p className="mt-4 text-xl font-medium text-gray-500">Vous n'avez pas encore passé de commande.</p>
                </div>
            )}
        </PublicLayout>
    );
}