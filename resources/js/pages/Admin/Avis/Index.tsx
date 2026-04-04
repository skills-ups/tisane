import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { BreadcrumbItem } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import axios from "axios";
import { CheckCheckIcon, MessageCircleWarning, Star, Trash2 } from "lucide-react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AvisAdmin() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Avis Clients', href: '/admin/avis' },
    ];

    const { auth } = usePage().props as any;

    // Rafraîchissement automatique
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['auth'], preserveScroll: true });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = (id: number) => {
        const res = axios.post('/avis/lu', { id });

        toast.promise(res, {
            loading: 'Mise à jour...',
            success: () => {
                router.reload({ only: ['auth'] });
                return 'Avis marqué comme lu';
            },
            error: 'Erreur lors de la mise à jour'
        });
    };

    // Fonction utilitaire pour afficher les étoiles
    const RenderStars = ({ count }: { count: number }) => {
        return (
            <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        fill={i < count ? "currentColor" : "none"}
                        className={i < count ? "text-amber-400" : "text-gray-300"}
                    />
                ))}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Avis" />
            <Toaster position="top-right" />

            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Avis des clients</h2>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {auth.avis_vue.length} Total
                    </span>
                </div>

                {auth.avis_vue.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 font-semibold text-gray-700">Client (Email)</th>
                                    <th className="p-4 font-semibold text-gray-700">Note</th>
                                    <th className="p-4 font-semibold text-gray-700">Commentaire</th>
                                    <th className="p-4 font-semibold text-gray-700">Statut</th>
                                    <th className="p-4 font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {auth.avis_vue.map((avis: any) => (
                                    <tr key={avis.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-600 font-medium">{avis.email}</td>
                                        <td className="p-4">
                                            <RenderStars count={avis.etoile} />
                                        </td>
                                        <td className="p-4 text-gray-600 max-w-xs">
                                            <p className="truncate hover:text-clip hover:whitespace-normal transition-all cursor-help" title={avis.description}>
                                                {avis.desription}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            {avis.status === 'pending' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                    Nouveau
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Traité
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {avis.status === 'pending' ? (
                                                <button
                                                    onClick={() => handleMarkAsRead(avis.id)}
                                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors shadow-sm"
                                                >
                                                    <CheckCheckIcon size={16} /> Marquer lu
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm flex items-center gap-1">
                                                    <CheckCheckIcon size={16} className="text-green-500" /> Lu
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <MessageCircleWarning size={80} strokeWidth={1} />
                        <h3 className="text-xl font-medium mt-4">Aucun commentaire reçu</h3>
                        <p className="text-sm">Les avis de vos clients apparaîtront ici.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}