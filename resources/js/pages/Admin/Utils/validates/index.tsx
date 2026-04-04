import AppLayout from "@/layouts/app-layout";
import { usePage } from "@inertiajs/react";
import { UserCircle } from "lucide-react";

export default function Validates() {
    const { url, auth } = usePage().props as any;
    return (
        <AppLayout>
            <div className="p-6">
                {/* c'est ici qu'on aura la liste des utilisateur qui sont valider  */}
                <h1 className="text-2xl font-bold mb-4">Les utilisateurs validés</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        auth.users.filter((user: any) => user.role_id != null && user.id != auth.user.id).map((user: any) => (
                            <div key={user.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                                {/* Top Decoration */}
                                <div className="h-2 bg-amber-400" />

                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                            <UserCircle size={40} strokeWidth={1.5} />
                                        </div>
                                        <div className="w-full">
                                            <h2 className="text-lg font-semibold">{user.name}</h2>
                                            <p className="text-gray-600">{user.email}</p>
                                        </div>
                                        {/* on pourra supprimer unutilisateur */}
                                        <div>
                                            <button className="bg-red-500 text-white px-4 py-2 rounded mt-2">
                                                Supprimer
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </div>
            </div>
        </AppLayout>

    );
}