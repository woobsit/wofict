<?php

namespace Database\Seeders;

use App\Models\Admin;
use Carbon\Carbon;
//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;



class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = [
            [
                'active' => 1,
                'firstname' => 'Anita',
                'surname' => 'Olusesi',
                'email' => 'olusesianita@gmail.com',
                'password' => Hash::make('123456'),
                'phone' => '08023456676',
                'gender' => 'Female',
                'photo' => '',
                'address' => 'ikorodu',
                'admin_type_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'active' => 1,
                'firstname' => 'Eniola',
                'surname' => 'Olusesi',
                'email' => 'olusesieniola@gmail.com',
                'password' =>  Hash::make('123456'),
                'phone' => '08023456789',
                'photo' => '',
                'gender' => 'Female',
                'address' => 'kwara',
                'admin_type_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        Admin::insert($admins);
    }
}
