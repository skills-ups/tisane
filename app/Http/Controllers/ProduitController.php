<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProduitController extends Controller
{
    //
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'nullable|array',
            'image.*' => 'file|mimes:jpg,jpeg,png,gif|max:2048',
            'category' => 'required|boolean',
            'stock' => 'required|string|max:255',
            'stock_number' => 'required|integer|min:1',
        ]);

        $images = [];
        if ($request->hasFile('image')) {
            foreach ($request->file('image') as $file) {
                $path = $file->store('produits', 'public');
                $images[] = str_replace('public/', '', $path);
            }
        }

        Produit::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'image' => $images,
            'category' => $request->category,
            'stock' => $request->stock,
            'stock_number' => $request->stock_number,
            'status' => 'actif',
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('admin.produits')->with('success', 'Produit ajouté avec succès.');
    }
    public function destroy(Request $request)
    {

        Produit::where('id', $request->id)->delete();
        return redirect()->route('admin.produits')->with('success', 'Produit supprimé avec succès.');
    }
    public function update(Request $request, Produit $produit)
    {
        $produit = Produit::findOrFail($produit->id);

        // 1. Récupérer les images actuelles en base de données (décodage du JSON)
        $anciennesImagesEnBase = is_array($produit->image)
            ? $produit->image
            : json_decode($produit->image, true) ?? [];

        // 2. RÉCUPÉRER LES GARDÉES (depuis React)
        $oldImagesAGarder = $request->input('old_images', []);

        // 3. NETTOYAGE PHYSIQUE DU STOCKAGE
        foreach ($anciennesImagesEnBase as $imageFichier) {
            if (!in_array($imageFichier, $oldImagesAGarder)) {
                // Supprime le fichier s'il n'est plus dans la liste "à garder"
                Storage::disk('public')->delete($imageFichier);
            }
        }

        // 4. STOCKAGE DES NOUVELLES
        $nouveauxChemins = [];
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $file) {
                $path = $file->store('produits', 'public');
                $nouveauxChemins[] = $path;
            }
        }

        // 5. FUSION ET MISE À JOUR
        $tableauFinal = array_merge($oldImagesAGarder, $nouveauxChemins);

        $produit->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category' => $request->category,
            'stock' => $request->stock,
            'stock_number' => $request->stock_number,
            'status' => $request->stock_number > 0 ? 'actif' : 'inactif',
            // Si vous avez un Cast 'array' dans le modèle, envoyez juste le tableau PHP
            'image' => $tableauFinal,
        ]);

        return response()->json(['message' => 'Produit mis à jour !']);
    }
}
