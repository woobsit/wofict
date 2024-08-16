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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->integer('active')->default(0);
            $table->string('firstname');
            $table->string('surname');
            $table->string('other_names')->nullable();
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->date('date_of_birth');
            $table->string('contact_address');
            $table->string('phone_number', 11);
            $table->string('state_of_origin');
            $table->string('photo')->default('storage/assets/images/users/default.jpg');
            $table->string('class_sessions');
            $table->string('qualification_level')->nullable();
            $table->string('credentials')->nullable();
            $table->integer('credentials_status')->default(0);
            $table->string('guarantors_1')->nullable();
            $table->string('guarantors_2')->nullable();
            $table->integer('guarantors_status')->default(0);
            $table->enum('admission_status', ['Pending documentation', 'Processing', 'Admitted'])->default('Pending documentation');
            $table->string('forget_password')->nullable();
            $table->string('expiry_timestamp')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
