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
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->integer('active')->default(0);
            $table->string('firstname')->nullable();
            $table->string('surname')->nullable();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->string('gender')->nullable();
            $table->string('profile_picture')->default('/storage/assets/images/admins/default.png');
            $table->string('address')->nullable();
            $table->integer('status')->default(0);
            $table->string('expiry_timestamp')->nullable();
            $table->string('forget_password')->nullable();
            $table->foreignId('admin_type_id')
                ->constrained()
                ->onUpdate('cascade');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
