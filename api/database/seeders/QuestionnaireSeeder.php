<?php

namespace Database\Seeders;

use App\Models\Questionnaire;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class QuestionnaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            [
                'questions' => 'How easy is it for you to speak in English?',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Can you understand conversations easily?',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Do you have basic understanding of computer systems',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'How did you hear about the ICT Hub?',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

        ];

        Questionnaire::insert($questions);
    }
}
