import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import PublicTopbar from "@/components/public-topbar";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import AuthLayout from "@/layouts/auth-layout";
import { login } from "@/routes";
import { store } from "@/routes/register";
import { Form, Head, useForm } from "@inertiajs/react";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function Register() {
    // 1. Initialize the form helper
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    return (
        <>
            <PublicTopbar />
            <AuthLayout
                title="Create an account"
                description="Enter your details below to create your account"
            >
                <Head title="Register" />

                {/* 
                    2. Instead of spreading (...formProps), 
                    Inertia's <Form> works best when you pass the action and method 
                */}
                <Form
                    action={store().url} // Points to your registration POST route
                    method="post"
                    onBefore={() => form.clearErrors()}
                    onSuccess={() => form.reset('password', 'password_confirmation')}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <label htmlFor="name">Name</label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        placeholder="Full name"
                                    // Standard Inertia Form components link 
                                    // inputs to the form state via 'name'
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="email">Email address</label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="password">Password</label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        placeholder="Password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="password_confirmation">Confirm password</label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        placeholder="Confirm password"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 w-full"
                                    tabIndex={5}
                                    disabled={processing}
                                    data-test="register-user-button"
                                >
                                    {processing && <Spinner />}
                                    Create account
                                </Button>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <TextLink href={login()} tabIndex={6}>
                                    Log in
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </AuthLayout>
        </>
    );
}