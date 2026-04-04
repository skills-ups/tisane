<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
    //
    protected $fillable = [
        'user_id',
        'email',
        'desription',
        'propre',
        'etoile',
        'produit_id',
        'status'
    ];
    public function produit()
    {
        return $this->hasMany(Produit::class);
    }
    public static function avis($produit, $email, $description, $etoile, $user)
    {
        $propre = Produit::where('id', $produit)->first();

        return self::create([
            'user_id' => $user,
            'email' => $email,
            'desription' => $description,
            'propre' => $propre->user_id,
            'etoile' => $etoile,
            'produit_id' => $produit,
        ]);
    }
}
