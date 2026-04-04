import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@radix-ui/react-navigation-menu';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard() {
    const { auth, users } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                {/* le dashboard doit afficher les statistiques de l'application, comme le nombre d'utilisateurs, le nombre de commandes pour l'admin et le nombre de tisanes ou miel commander pour les clients avec admin a le role_id = 1 et users a le role_id = 2 */}
                <Card>
                    <CardHeader>
                        <CardTitle>Statistiques</CardTitle>
                    </CardHeader>
                    {auth.user.role_id === 1 ? (
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <a href='/admin/users/validate' className="hover:bg-gray-200 p-4 bg-gray-100 rounded-lg text-center">
                                    <h2 className="text-lg font-semibold">Utilisateurs</h2>
                                    <p className="text-2xl">{users.length > 10 ? users.length : '0' + users.length}</p>
                                </a>
                                <a href='/admin/commande/list' className="p-4 bg-gray-100 rounded-lg text-center">
                                    <h2 className="text-lg font-semibold">Commandes</h2>
                                    <p className="text-2xl">{auth.commandes.length > 10 ? auth.commandes.length : "0" + auth.commandes.length}</p>
                                </a>

                                <div className="p-4 bg-gray-100 rounded-lg text-center">
                                    <h2 className="text-lg font-semibold">Produits</h2>
                                    <p className="text-2xl">{auth.produits.length > 10 ? auth.produits.length : "0" + auth.produits.length}</p>
                                </div>
                                <div className="p-4 bg-gray-100 rounded-lg text-center">
                                    <h2 className="text-lg font-semibold">Avis des clients</h2>
                                    <p className="text-2xl">{auth.avis_vue.length > 10 ? auth.avis_vue.length : "0" + auth.avis_vue.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    ) : (
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-100 rounded-lg text-center">
                                    <h2 className="text-lg font-semibold">Commandes</h2>
                                    <p className="text-2xl">{auth.commandes.length > 10 ? auth.commandes.length : "0" + auth.commandes.length}</p>
                                </div>

                                <div className="p-4 bg-gray-100 rounded-lg text-center">
                                    <h2 className="text-lg font-semibold">Produits</h2>
                                    <p className="text-2xl">{auth.produits.length > 10 ? auth.produits.length : "0" + auth.produits.length}</p>
                                </div>

                                <div className="p-4 bg-gray-100 rounded-lg text-center">
                                    <h2 className="text-lg font-semibold">Avis des clients</h2>
                                    <p className="text-2xl">{auth.avis_vue.length > 10 ? auth.avis_vue.length : "0" + auth.avis_vue.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}