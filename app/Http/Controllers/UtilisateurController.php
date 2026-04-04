<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    //valide ou refuse un utilisateur
    public function validateUser(Request $request, $id)
    {
        $user = \App\Models\User::findOrFail($id);
        if ($request->action === 'accept') {
            $user->role_id = 2;
            $user->save();
        } elseif ($request->action === 'reject') {
            $user->delete();
        }
    }
}
