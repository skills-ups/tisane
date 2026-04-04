<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            $table->boolean('category')->default(1);
            $table->string('stock')->default('sachet_30g');
            $table->integer('stock_number')->default(0);
            $table->string('status')->default('actif');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            $table->dropColumn('category');
            $table->dropColumn('stock');
            $table->dropColumn('stock_number');
            $table->dropColumn('status');
        });
    }
};
