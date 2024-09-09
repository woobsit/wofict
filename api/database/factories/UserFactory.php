<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $fileName = Str::random(10) . '.pdf';
        $filePath = storage_path('storage/assets/uploads/credentials/' . $fileName);

        // Create a dummy file with random content
        //file_put_contents($filePath, 'Dummy file content.');

        return [
            'active' => 1,
            'firstname' => $this->faker->firstName(),
            'surname' => $this->faker->lastName(),
            'other_names' => $this->faker->optional()->firstName(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('123456'), // same password for all users
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'date_of_birth' => $this->faker->date('Y-m-d', '2000-01-01'),
            'contact_address' => $this->faker->address(),
            'phone_number' => '08074574512',
            'state_of_origin' => $this->faker->state(),
            'qualification_level' => $this->faker->randomElement(['Bsc', 'Msc', 'PhD']),
            'credentials' => $filePath,
            'class_sessions' => $this->faker->randomElement(['Morning', 'Evening']),
            'credentials_status' => $this->faker->randomElement([0, 1]),
            'forget_password' => '',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return $this
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
