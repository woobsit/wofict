<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use Exception;
use Illuminate\Support\Facades\Log;


class CourseController extends Controller
{
    // Select all courses
    public function getCourses()
    {
        try {
            $courses = Course::all();

            if ($courses->isEmpty()) {
                return response()->json(['status' => 404, 'message' => 'No courses found', 'result' => []]);
            }

            return response()->json(['status' => 200, 'message' => 'success', 'result' => $courses]);
        } catch (Exception $e) {

            // Log the actual error message for debugging purposes
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }
}
