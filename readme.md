# 🌿 Tisane - Starter Kit (Laravel & React)

**Tisane** est une application de commande moderne conçue pour offrir une expérience fluide. Ce starter kit combine la robustesse de **Laravel** en backend et la réactivité de **React** en frontend, synchronisés via **Inertia.js**.

---

## 🚀 Fonctionnalités
* **Authentification complète** : Prêt à l'emploi avec Laravel Breeze ou Fortify.
* **Interface Réactive** : Frontend dynamique avec React et Tailwind CSS.
* **Gestion des Commandes** : Structure de base pour un système de panier et validation.
* **Données de Test** : Seeders configurés pour un démarrage instantané.

---

## 🛠️ Installation

### 1. Prérequis
Assurez-vous d'avoir installé **PHP**, **Composer**, **Node.js** et **NPM**.

### 2. Configuration Backend
```bash
# cloner le projet
git clone 
cd tisane

# Installer les dépendances PHP
composer install

# Configurer l'environnement
cp .env.example .env
php artisan key:generate

### 3. frontend

# Installer les dépendances JS
npm install

# Lancer le serveur de développement
npm run dev

#Base de données & Seeders
php artisan migrate --seed

#Comptes par défaut  Rôle

Email : admin@example.com

Mot de passe : password

Email : user@example.test

Mot de passe : password

#Stack Technique

Backend : Laravel (PHP)

Frontend : React (JS/TS)

Liaison : Inertia.js

Style : Tailwind CSS

Build : Vite
