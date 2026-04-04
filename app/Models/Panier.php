<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class Panier extends Model
{
    //
    protected $fillable = [
        'produit_id',
        'user_id',
        'status',
    ];
    public function produit()
    {
        return $this->hasMany(Produit::class, 'id', 'produit_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public static function panier($produit, $status, $user)
    {
        return self::updateOrCreate([
            'user_id' => $user,
            'produit_id' => $produit
        ], [
            'status' => $status
        ]);
    }
}
