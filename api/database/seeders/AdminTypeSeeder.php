<?php

namespace Database\Seeders;

use App\Models\AdminType;
use Carbon\Carbon;
//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $adminTypes = [
            [
                'name' => 'Super Admin',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Admin',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        AdminType::insert($adminTypes);
    }
}
