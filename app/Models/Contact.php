<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    //
    protected $fillable = [
        'nom',
        'email',
        'sujet',
        'message',
        'reponse',
        'type'
    ];
    public static function contact($nom, $email, $sujet, $message)
    {
        return self::create([
            'nom' => $nom,
            'email' => $email,
            'sujet' => $sujet,
            'message' => $message
        ]);
    }
    public static function answers($id, $reponse, $type)
    {
        $res = Contact::findOrFail($id);
        $res->reponse = $reponse;
        $res->type = $type;
        return $res->save();
    }
}
