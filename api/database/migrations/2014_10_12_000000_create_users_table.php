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
            $table->string('firstname', 30);
            $table->string('surname', 30);
            $table->string('other_names', 30)->nullable();
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('gender', ['Male', 'Female']);
            $table->date('date_of_birth');
            $table->text('contact_address', 1000);
            $table->string('phone_number', 11);
            $table->string('state_of_origin', 15);
            $table->string('photo')->default('storage/assets/images/users/default.jpg');
            $table->string('session', 50);
            $table->string('qualification_level', 50);
            $table->string('credentials')->nullable();
            $table->integer('credentials_status')->default(0);
            $table->string('guarantors_1')->nullable();
            $table->string('guarantors_2')->nullable();
            $table->integer('guarantors_status')->default(0);
            $table->enum('admission_status', ['Pending documentation', 'Processing', 'Admitted'])->default('Pending documentation');
            $table->string('course', 50);
            $table->string('english_fluency');
            $table->string('conversation_strength');
            $table->string('computer_literacy');
            $table->string('ict_referral');
            $table->string('forget_password')->nullable();
            $table->string('email_verification')->nullable();
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
