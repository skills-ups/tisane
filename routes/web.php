<?php

use App\Http\Controllers\AvisController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PanierController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\UtilisateurController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/admin/produits', function () {
        return inertia('Admin/Produits/index');
    })->name('admin.produits');
    // ======================== Produit ============================
    Route::post('/produits', [ProduitController::class, 'store'])->name('admin.produits.store');
    Route::post('/supprimer/produit', [ProduitController::class, 'destroy'])->name('admin.produits.destroy');
    Route::put('/produits/{produit}', [ProduitController::class, 'update'])->name('admin.produits.update');
    // ========================End produit =========================

    // ======================== Commande ===========================
    Route::get('/admin/commandes', [CommandeController::class, 'index'])->name('commande.index.admin');
    Route::post('/envoyer/commande', [CommandeController::class, 'enveloppeValider'])->name('envoye.commande.admin');

    // =======================end commande =========================

    // ======================= Avis =============================

    Route::inertia('/admin/commentaires', 'Admin/Avis/Index')->name('avis.coms');

    Route::post('/avis/lu', [AvisController::class, 'updateAvis'])->name('avis.lu');

    Route::get('/admin/commandes', function () {
        return inertia('Admin/Commandes/Index');
    })->name('admin.commandes');

    Route::get('/admin/contacts', function () {
        return inertia('Admin/Contacts/Index');
    })->name('admin.contacts');

    //===================== Utilisateur ==========================

    Route::inertia('/admin/users', 'Admin/Utils/index')->name('utilisateurs');
    Route::post('/admin/users/{id}/validate', [UtilisateurController::class, 'validateUser'])->name('validate.user');

    //===================== end Utilisateur ==========================

    // ========================= Contact =========================
    Route::get('/admin/contacts', function () {
        return inertia('Admin/Contact/index');
    })->name('admin.contacts');
    Route::post('/contacts/{id}/reponse', [ContactController::class, 'answerContact'])->name('contact.answer');
    Route::delete('/contacts/{id}', [ContactController::class, 'destroy'])->name('contact.destroy');

    // ========================= end Contact =========================

    // ========================= utilisateur =========================

    Route::get('/admin/users/validate', function () {
        return inertia('Admin/Utils/validates/index');
    })->name('admin.users');

    // supprimer utilisateur
    Route::delete('/admin/users/{id}', [UtilisateurController::class, 'destroy'])->name('admin.users.destroy');

    // ================= Commande ========================

    Route::get('/admin/commande/list', function () {
        return inertia('Admin/Commandes/validate/index');
    })->name('commande.list.admin');
});

// public route 
// ======================== Produit ===========================
Route::get('/produits', function () {
    return Inertia::render('public/produit/index', []);
});
// ======================== Panier ===========================
Route::post('/panier', [PanierController::class, 'create'])->name('panier');
Route::get('/panier', function () {
    return Inertia::render('public/panier/index', []);
})->name('panier.index');
// ======================== Commande ===========================
Route::post('/commander', [CommandeController::class, 'create'])->name('create.commande');
Route::get('/commande', [CommandeController::class, 'takeCommande'])->name('commande');
Route::post('/commande/{id}/annuler', [CommandeController::class, 'cancelCommande'])->name('commande.annuler');

// ======================= Avis =========================
Route::post('/avis', [AvisController::class, 'createAvis'])->name('create.avis');

// ======================== Contact ===========================
Route::inertia('/contact', 'public/contacts/index', [])->name('contat');

//======================= Faq =========================
Route::inertia('/faq', 'public/Faq/index', [])->name('faq');

// ======================= About =========================
Route::inertia('/about', 'public/About/index', [])->name('about');

// ======================= Contact =========================
Route::post('/contact', [ContactController::class, 'addContact'])->name('contact');
Route::post('/contact/{id}/answer', [ContactController::class, 'answerContact'])->name('contact.answers');

Route::post('/panier/{id}/annuler', [CommandeController::class, 'annulePanier'])->name('annule.panier');


require __DIR__ . '/settings.php';
