<?php

namespace App\Http\Controllers;

use App\Models\Avis;
use App\Models\User;
use Illuminate\Http\Request;

class AvisController extends Controller
{
    //
    public function createAvis(Request $request)
    {
        $request->validate([
            'description' => ['required'],
            'email' => 'required'
        ]);
        $user = User::where('id', $request->user_id)->first();
        if ($user) {
            $users = $user->id;
        } else {
            $users = $request->user_id;
        }
        Avis::avis($request->produit, $request->email, $request->description, $request->etoile, $users);
    }
    public function updateAvis(Request $request)
    {
        Avis::where('id', $request->id)->update([
            'status' => 'lu'
        ]);
    }
}
