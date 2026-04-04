import AppLayout from "@/layouts/app-layout";
import { user } from "@/routes/validate";
import { BreadcrumbItem } from "@/types";
import { usePage, router } from "@inertiajs/react";
import axios from "axios";
import { UserCircle, Check, X, ShieldAlert, Mail, Calendar } from "lucide-react";
import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function Utilisateur() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Administration', href: '#' },
        { title: 'Validation Utilisateurs', href: '#' }
    ];

    const { users } = usePage().props as any;

    // Filtrage des utilisateurs en attente
    const pendingUsers = users?.filter((user: any) => user.role_id === null) || [];

    const handleAction = (id: number, action: 'accept' | 'reject') => {
        const res = axios.post(`/admin/users/${id}/validate`, { action });
        toast.promise(res, {
            loading: 'Traitement en cours...',
            success: () => {
                router.reload({ only: ['users'] });
                return action === 'accept' ? 'Utilisateur accepté avec succès' : 'Utilisateur refusé avec succès';
            },
            error: 'Une erreur est survenue.',
        });
    };
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['users'], preserveScroll: true });
        }, 10000);
        return () => clearInterval(interval);
    }, [users]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Professionnel */}
                <div className="mb-8 border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Validations en attente
                        </h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <ShieldAlert size={18} className="text-amber-500" />
                            {pendingUsers.length} utilisateur(s) demandent un accès au système.
                        </p>
                    </div>
                </div>

                {/* Grid des Cards */}
                {pendingUsers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingUsers.map((user: any) => (
                            <div key={user.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                                {/* Top Decoration */}
                                <div className="h-2 bg-amber-400" />

                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                            <UserCircle size={40} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-amber-100 text-amber-700 rounded-md">
                                            En attente
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <h2 className="text-lg font-bold text-gray-800 leading-tight">
                                            {user.name}
                                        </h2>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Mail size={14} />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar size={14} />
                                                <span>Inscrit le {new Date(user.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-gray-50">
                                        <button
                                            onClick={() => handleAction(user.id, 'accept')}
                                            className="flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-green-100"
                                        >
                                            <Check size={16} /> Accepter
                                        </button>
                                        <button
                                            onClick={() => handleAction(user.id, 'reject')}
                                            className="flex items-center justify-center gap-2 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold rounded-xl transition-all"
                                        >
                                            <X size={16} /> Refuser
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4">
                            <Check size={40} className="text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Tout est à jour !</h3>
                        <p className="text-gray-500 mt-2">Aucun nouvel utilisateur ne nécessite de validation pour le moment.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}