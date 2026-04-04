<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    //
    protected $fillable = [
        'name',
        'category',
        'stock',
        'stock_number',
        'status',
        'description',
        'price',
        'image',
        'user_id',
    ];
    protected $casts = [
        'image' => 'array'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function panier()
    {
        return $this->hasMany(Panier::class, 'produit_id', 'id');
    }
    public function commande()
    {
        return $this->hasMany(Commande::class, 'produit_id', 'id');
    }
}
