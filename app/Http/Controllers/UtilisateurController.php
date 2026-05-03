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
    public function createAdmin(Request $request)
    {
        $adminRole = \App\Models\Role::updateOrCreate([
            'name' => 'admin',
            'description' => 'Administrateur du site',
        ]);
        $userRole = \App\Models\Role::updateOrCreate([
            'name' => 'user',
            'description' => 'Utilisateur du site',
        ]);
        //creation des utilisateurs
        \App\Models\User::updateOrCreate([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role_id' => $adminRole->id,
        ]);
        \App\Models\User::updateOrCreate([
            'name' => 'User',
            'email' => 'user@example.com',
            'password' => bcrypt('password'),
            'role_id' => $userRole->id,
        ]);
    }
}
