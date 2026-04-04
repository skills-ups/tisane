import { Head, Link, useForm, usePage } from '@inertiajs/react'; // Import standard Inertia
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import AuthLayout from '@/layouts/auth-layout';
import { register as registerRoute } from '@/routes';
import { request as forgotPasswordRoute } from '@/routes/password';
import PublicTopbar from '@/components/public-topbar';
import React from 'react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    // 1. Initialisation du formulaire avec useForm (L'approche standard et fiable)
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const { auth } = usePage().props as any;
    const isLogged = !!auth?.user;

    // 2. Gestion de la soumission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', { // Vérifie que ta route Laravel de login est bien '/login'
            onFinish: () => reset('password'),
        });
    };

    if (isLogged) {
        return (
            <>
                <PublicTopbar />
                <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 px-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-100 text-center max-w-sm">
                        <h1 className="text-2xl font-bold text-amber-900">Bon retour !</h1>
                        <p className="mt-2 text-gray-600">Vous êtes déjà authentifié sur cette session.</p>
                        <Link
                            href="/dashboard"
                            className="mt-6 inline-flex w-full justify-center bg-amber-700 text-white hover:bg-amber-800 px-4 py-3 rounded-xl font-semibold transition-all shadow-md"
                        >
                            Accéder au Dashboard
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PublicTopbar />
            <AuthLayout
                title="Connexion"
                description="Heureux de vous revoir. Entrez vos accès pour continuer."
            >
                <Head title="Se connecter" />

                {status && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
                        {status}
                    </div>
                )}

                {/* 3. Remplacement du composant <Form> par une balise <form> standard */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        {/* Champ Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Adresse Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="votre@email.com"
                                className={`h-11 rounded-xl transition-all ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-amber-600'}`}
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Champ Mot de passe */}
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Mot de passe</Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={forgotPasswordRoute()}
                                        className="text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
                                        tabIndex={5}
                                    >
                                        Oublié ?
                                    </TextLink>
                                )}
                            </div>
                            <PasswordInput
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className={`h-11 rounded-xl transition-all ${errors.password ? 'border-red-500' : ''}`}
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center space-x-2 py-1">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', !!checked)}
                                tabIndex={3}
                                className="rounded border-gray-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                            />
                            <Label htmlFor="remember" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
                                Se souvenir de moi
                            </Label>
                        </div>

                        {/* Bouton Submit */}
                        <Button
                            type="submit"
                            className="w-full h-11 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-lg shadow-amber-900/10 transition-all active:scale-[0.98]"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {processing ? 'Connexion en cours...' : 'Se connecter'}
                        </Button>
                    </div>

                    {canRegister && (
                        <p className="text-center text-sm text-gray-500 pt-2">
                            Pas encore de compte ?{' '}
                            <TextLink
                                href={registerRoute()}
                                tabIndex={6}
                                className="font-bold text-amber-700 hover:text-amber-900 underline-offset-4 hover:underline"
                            >
                                S'inscrire
                            </TextLink>
                        </p>
                    )}
                </form>
            </AuthLayout>
        </>
    );
}