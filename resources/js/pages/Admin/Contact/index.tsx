import AppLayout from "@/layouts/app-layout";
import contacts from "@/pages/public/contacts";
import { BreadcrumbItem } from "@/types"; // Assure-toi d'ajouter le type Contact dans tes types
import { Head, router, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import { CheckCheckIcon, MessageCircleWarning, Trash2, Send, User, Mail, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";



const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Messages Contacts", href: "/contacts" },
];
export default function Contacts() {

    const { auth } = usePage().props as any;

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['auth'] });
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Contacts" />
            <Toaster position="top-right" />

            <div className="flex flex-col gap-6 p-4 py-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Messages reçus</h1>
                    <p className="text-muted-foreground">Consultez et répondez aux messages de vos utilisateurs.</p>
                </div>

                <div className="grid gap-6">
                    {auth.contacts.length > 0 ? (
                        auth.contacts.map((contact: any) => (
                            <ContactCard key={contact.id} contact={contact} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                            <MessageCircleWarning className="h-10 w-10 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">Aucun message</h3>
                            <p className="text-sm text-muted-foreground">Il n'y a aucun message de contact pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function ContactCard({ contact }: { contact: any }) {
    const { auth } = usePage().props as any;

    const { data, setData, processing, errors, reset } = useForm({
        reponse: contact.reponse || "",
        type: contact.type || "prive",
    });

    const handleUpdateResponse = (e: React.FormEvent) => {
        e.preventDefault();
        const res = axios.post(`/contacts/${contact.id}/reponse`, {
            reponse: data.reponse,
            type: data.type
        });

        toast.promise(res, {
            loading: 'Envoi de la réponse...',
            success: () => {
                reset();
                return 'Réponse envoyée avec succès !';
            },
            error: 'Erreur lors de l\'envoi de la réponse.'
        }, { duration: 5000, position: 'top-right' });
    };

    return (
        <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col md:flex-row md:divide-x">
                {/* Infos Client */}
                <div className="w-full bg-muted/30 p-6 md:max-w-xs">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{contact.nom}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{contact.sujet}</span>
                        </div>
                        <div className="pt-2">
                            {contact.reponse ? (
                                <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                                    <CheckCheckIcon className="h-3 w-3" /> Répondu
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit">
                                    <MessageCircleWarning className="h-3 w-3" /> En attente
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Message et Formulaire */}
                <div className="flex-1 p-6 flex flex-col gap-6">
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message de l'utilisateur :</h4>
                        <div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">
                            {contact.message}
                        </div>
                    </div>

                    <form onSubmit={handleUpdateResponse} className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Votre réponse :</h4>
                            <textarea
                                className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tapez votre réponse ici..."
                                value={data.reponse}
                                onChange={(e) => setData("reponse", e.target.value)}
                            />
                            {errors.reponse && <p className="text-xs text-destructive">{errors.reponse}</p>}
                        </div>

                        <div className="flex items-center justify-end gap-3">

                            {contact.type == 'general' && (
                                <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                                    Réponse publique
                                </span>
                            )}
                            {contact.type == 'prive' && (
                                <span className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full w-fit">
                                    Réponse privée
                                </span>
                            )}
                            {contact.reponse != null && auth.user.role_id == 2 ? (
                                <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                                    <CheckCheckIcon className="h-3 w-3" /> Réponse mise à jour
                                </span>
                            ) : (
                                <>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                                        onClick={() => setData('type', 'prive')}
                                    >
                                        <Send className="h-4 w-4" />
                                        {contact.reponse ? "Mettre à jour en privé" : "Envoyer la réponse en privé"}
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                                        onClick={() => setData('type', 'general')}
                                    >
                                        <Send className="h-4 w-4" />
                                        {contact.reponse ? "Mettre à jour en public" : "Envoyer la réponse en public"}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={processing}
                                        className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                                        onClick={() => {
                                            if (confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
                                                axios.delete(`/contacts/${contact.id}`).then(() => {
                                                    toast.success("Message supprimé avec succès !");
                                                }).catch(() => {
                                                    toast.error("Erreur lors de la suppression du message.");
                                                });
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Supprimer
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}