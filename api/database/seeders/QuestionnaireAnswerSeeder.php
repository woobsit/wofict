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

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'It is a lot easier than when I started learning, but I still get confused sometimes',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'I find it quite tricky and have to think about it a lot',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'I find it hard to string sentences together and use grammar rules correctly',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Yes - understanding English is as natural as my native language',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Most of the time, but sometimes I get lost if everyone is speaking fast',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'I can understand when people speak slowly and clearly',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'I get lost easily and usually only understand a few words in conversation',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Yes, I can operate the computer system',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'I have a personal computer and I use it effectively',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'I do not have a personal computer but I can operate a computer system well',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'No, I have never operated a computer system',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Flyers',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Banner',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Road jingle',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Social Media Advert',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Radio Jingle',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Through a friend, relative or someone',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'questions' => 'Through a WOF batch 1 students',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

        ];

        QuestionnaireAnswer::insert($questionsAnswers);
    }
}
