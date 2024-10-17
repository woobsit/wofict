<?php

namespace Database\Seeders;

use App\Models\QuestionnaireAnswer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class QuestionnaireAnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questionsAnswers = [
            [
                'answers' => 'How easy is it for you to speak in English?',
                'questionnaire_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'It is a lot easier than when I started learning, but I still get confused sometimes',
                'questionnaire_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'I find it quite tricky and have to think about it a lot',
                'questionnaire_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'I find it hard to string sentences together and use grammar rules correctly',
                'questionnaire_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Yes - understanding English is as natural as my native language',
                'questionnaire_id' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Most of the time, but sometimes I get lost if everyone is speaking fast',
                'questionnaire_id' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'I can understand when people speak slowly and clearly',
                'questionnaire_id' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'I get lost easily and usually only understand a few words in conversation',
                'questionnaire_id' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Yes, I can operate the computer system',
                'questionnaire_id' => 3,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'I have a personal computer and I use it effectively',
                'questionnaire_id' => 3,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'I do not have a personal computer but I can operate a computer system well',
                'questionnaire_id' => 3,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'No, I have never operated a computer system',
                'questionnaire_id' => 3,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Flyers',
                'questionnaire_id' => 4,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Banner',
                'questionnaire_id' => 4,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Road jingle',
                'questionnaire_id' => 4,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Social Media Advert',
                'questionnaire_id' => 4,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Radio Jingle',
                'questionnaire_id' => 4,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Through a friend, relative or someone',
                'questionnaire_id' => 4,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Through a WOF batch 1 students',
                'questionnaire_id' => 4,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

        ];

        QuestionnaireAnswer::insert($questionsAnswers);
    }
}
