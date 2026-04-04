<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    //
    protected $fillable = [
        'user_id',
        'proper',
        'email',
        'produit_id',
        'nom',
        'nombre',
        'status',
    ];
    public function produit()
    {
        return $this->hasMany(Produit::class, 'id', 'produit_id');
    }
    public static function commande($proper, $produit, $email, $nom, $nombre, $user)
    {
        return self::create([
            'proper' => $proper,
            'produit_id' => $produit,
            'email' => $email,
            'user_id' => $user,
            'nombre' => $nombre,
            'nom' => $nom,
            'status' => 'pending'
        ]);
    }
}
