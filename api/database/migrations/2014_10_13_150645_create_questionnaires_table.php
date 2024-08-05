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
        Schema::create('questionnaires', function (Blueprint $table) {
            $table->id();
            $table->string('questions');
            $table->timestamps();
        });

        Schema::create('questionnaire_answers', function (Blueprint $table) {
            $table->id();
            $table->text('answers');
            $table->foreignId('questionnaire_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('user_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
             $table->foreignId('questionnaire_id')->constrained()->onDelete('cascade');
             $table->foreignId('questionnaire_answer_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questionnaires');
        Schema::dropIfExists('questionnaire_answers');
        Schema::dropIfExists('user_answers');
    }
};
