<?php

namespace Database\Seeders;

//use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\WebsiteInfo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class WebsiteInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $websiteInfo = [
            [
                'name' => 'website name',
                'value' => 'Whoba Ogo Foundation',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'website url',
                'value' => 'https://whobaogofoundation.org/',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'endpoint',
                'value' => 'http://localhost:8000/',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'primary logo',
                'value' => 'storage/assets/images/default-logo.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'secondary logo',
                'value' => 'storage/assets/images/default-logo.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'fav logo',
                'value' => 'storage/assets/images/default-logo.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'address',
                'value' =>  "No. 1 Tafawa Balewa Crescent. Surulere Lagos",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'address 2',
                'value' =>  null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [

                'name' => 'email',
                'value' => "info@whobaogofoundation.org",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'email 2',
                'value' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'email 3',
                'value' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [

                'name' => 'phone',
                'value' => "08180452165",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'phone 2',
                'value' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'phone 3',
                'value' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ];

        WebsiteInfo::insert($websiteInfo);
    }
}
