<?php

namespace App\Http\Middleware;

use App\Models\Avis;
use App\Models\Commande;
use App\Models\Contact;
use App\Models\Panier;
use App\Models\Produit;
use App\Models\Role;
use App\Models\User;
use Illuminate\Contracts\Session\Session as ContractsSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Middleware;
use Symfony\Component\HttpFoundation\Session\Session as HttpFoundationSession;

use function Pest\Laravel\session;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'produits' => $request->user() ? $request->user()->produits : null,
                'commande' => $request->user() ? Commande::where('status', 'pending')->where('proper', Auth::id())->with('produit')->get() : null,
                'avis' => $request->user() ? Avis::where('propre', Auth::id())->where('status', 'pending')->get() : null,
                'avis_vue' => $request->user() ? Avis::where('propre', Auth::id())->get() : null,
                'commandes' => $request->user() ? Commande::where('status', 'validate')->where('proper', Auth::id())->with('produit')->get() : null,
                'contacts' => $request->user() ? Contact::get() : null,
                'users' => $request->user() ? User::with('role')->get() : null,
            ],
            'produite' => Produit::get(),
            'paniers' => Panier::where('status', 'panier')->with('produit')->get(),
            'utilisateur' => $request->userAgent('user_agent'),
            'pannier' => Panier::where('user_id', $request->userAgent('user_agent'))->where('status', 'panier')->get(),
            'commande' => Commande::where('status', 'pending')->with('produit')->get(),
            'url' => config('app.url'),
            'role' => Role::get(),
            'commande_take' => Commande::where('user_id', $request->userAgent('user_agent'))->with('produit')->orderBy('updated_at', 'desc')->get(),
            'users' => User::with('role')->get(),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'faqDatas' => Contact::where('type', 'general')->get()
        ];
    }
}
