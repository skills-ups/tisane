import AppLayout from "@/layouts/app-layout";
import { usePage } from "@inertiajs/react";

export default function commandeValidate() {
    const { url, auth } = usePage().props as any;
    console.log(auth.commandes)
    return (
        <AppLayout>
            <div>
                <h1>Validation des commandes</h1>
                {/* ici on va afficher les commandes qui sont valider avec un style pro  */}
                <div>
                    {/* Liste des commandes validées */}
                    {auth.commandes.filter((cmd: any) => cmd.status === 'validate').map((cmd: any) => (
                        <div key={cmd.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all">
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
                                    src={`${url}/storage/${cmd.produit[0].image[0]}`}
                                    alt={cmd.produit[0].name}
                                    className="w-20 h-20 object-cover rounded-lg shadow-inner"
                                />
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">{cmd.produit[0].name}</h2>
                                    <p>Prix unitaire : {cmd.produit[0].price} €</p>
                                    <p>Nombre : {cmd.produit[0].stock_number + " " + cmd.produit[0].stock.replace('_', ' de ')}</p>
                                    <p className="text-gray-600">Quantité: {cmd.nombre + " " + cmd.produit[0].stock.replace('_', ' de ')} </p>
                                    <p className="text-gray-600">Prix total: {cmd.produit[0].price * cmd.nombre} €</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}