<?php

namespace App\Http\Controllers;

use App\Mail\CommandeMail;
use App\Models\Commande;
use App\Models\Panier;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class CommandeController extends Controller
{
    //parti admin
    public function index()
    {
        return Inertia::render('Admin/Commandes/index', []);
    }
    public function takeCommande()
    {
        return Inertia::render('public/command/index', []);
    }
    //
    public function create(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email']
        ]);
        $user = User::where('id', $request->user_id)->first();
        if ($user) {
            $users = $user->id;
        } else {
            $users = $request->user_id;
        }
        $person = Produit::where('id', $request->produit_id)->first();
        if ($person->stock_number < $request->nombre) {
            return response()->json([
                'status' => 500,
                'message' => 'Erreur'
            ]);
        }

        $panier = Panier::panier($request->produit_id, 'commande', $users);
        Produit::where('id', $request->produit_id)->update([
            'stock_number' => ($request->nombre - $person->stock_number)
        ]);
        Commande::commande($person->user_id, $request->produit_id, $request->email, $request->nom, $request->nombre, $users);
        return response()->json([
            'user' => $users
        ]);
    }

    public function enveloppeValider(Request $request)
    {
        $commande = Commande::where('id', $request->id)->first();
        if ($commande) {
            Mail::to($commande->email)->send(new CommandeMail($commande));
            Commande::where('id', $request->id)->update([
                'status' => 'validate'
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'message' => 'Commande introuvable'
            ]);
        }
    }
    public function cancelCommande($id)
    {
        $commande = Commande::where('id', $id)->first();
        $person = Produit::where('id', $commande->produit_id)->first();

        if ($commande) {
            Commande::where('id', $id)->update([
                'status' => 'cancelled'
            ]);
            Produit::where('id', $commande->produit_id)->update([
                'stock_number' => $person->stock_number + $commande->nombre
            ]);
            return;
        } else {
            return response()->json([
                'status' => 400,
                'message' => 'Commande introuvable'
            ]);
        }
    }
    public function annulePanier($id, Request $request)
    {

        $panier = Panier::where('produit_id', $id)->first();
        if ($panier) {
            Panier::where('produit_id', $id)->where('user_id', $request->user_id)->delete();
            return response()->json([
                'status' => 200,
                'message' => 'Panier supprimé'
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'message' => 'Panier introuvable'
            ]);
        }
    }
}
