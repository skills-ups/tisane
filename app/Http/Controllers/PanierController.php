<?php

namespace App\Http\Controllers;

use App\Models\Panier;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PanierController extends Controller
{
    //
    public function create(Request $request)
    {
        $user = User::where('id', $request->user_id)->first();
        if ($user) {
            $users = $user->id;
        } else {
            $users = $request->user_id;
        }
        Panier::panier($request->produit_id, 'panier', $users);
        return response()->json([
            'user' => $users
        ]);
    }
}
