<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //creation des roles
        $adminRole = \App\Models\Role::create([
            'name' => 'admin',
            'description' => 'Administrateur du site',
        ]);
        $userRole = \App\Models\Role::create([
            'name' => 'user',
            'description' => 'Utilisateur du site',
        ]);
        //creation des utilisateurs
        \App\Models\User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role_id' => $adminRole->id,
        ]);
        \App\Models\User::create([
            'name' => 'User',
            'email' => 'user@example.com',
            'password' => bcrypt('password'),
            'role_id' => $userRole->id,
        ]);
    }
}
