<?php

namespace Database\Seeders;

//use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'active' => 1,
                'firstname' => 'Ahmed',
                'surname' => 'Olusesi',
                'other_names' => 'Oladipupo',
                'email' => 'olusesia@gmail.com',
                'password' => Hash::make('123456'),
                'gender' => 'Male',
                'date_of_birth' => '1970-01-01',
                'contact_address' => 'Ikeja Lagos',
                'phone_number' => '08074574512',
                'state_of_origin' => 'Ogun',
                'qualification_level' => 'Bsc',
                'credentials' => 'assets/uploads/credentials/Ahmed_Olusesi_1725959266.pdf',
                'credentials_status' => 1,
                'class_sessions' => 'Morning',
                'course' => 'Digital Marketing',
                'forget_password' => '',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'active' => 1,
                'firstname' => 'Emmanuel',
                'surname' => 'Okaz',
                'other_names' => '',
                'email' => 'okaz@gmail.com',
                'password' => Hash::make('123456'),
                'gender' => 'Male',
                'date_of_birth' => '1990-01-01',
                'contact_address' => 'Ikotun Lagos',
                'phone_number' => '08034523497',
                'state_of_origin' => 'Anambra',
                'qualification_level' => 'Bsc',
                'credentials' => null,
                'credentials_status' => 0,
                'class_sessions' => 'Evening',
                'course' => 'Digital Marketing',
                'forget_password' => '',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        User::insert($users);

        User::factory()->count(200)->create();
    }
}
