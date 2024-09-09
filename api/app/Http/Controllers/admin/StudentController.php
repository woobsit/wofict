<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\User;


class StudentController extends Controller
{
    public function getAllUsers()
    {
        try {
            $user = User::where('active', 1)->whereNotNull('credentials')->orderBy('created_at', 'desc')->paginate(10);
            if ($user) {
                return response()->json([
                    'status' => 201,
                    'message' => 'success',
                    'result' => $user->items(),
                    'pagination' => [
                        'total' => $user->total(),
                        'per_page' => $user->perPage(),
                        'current_page' => $user->currentPage(),
                        'last_page' => $user->lastPage(),
                        'from' => $user->firstItem(),
                        'to' => $user->lastItem(),
                    ],
                ]);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    public function getApprovedUsers()
    {
        try {
            $user = User::where('active', 1)->whereNotNull('credentials')->where('credentials_status', 1)->orderBy('created_at', 'desc')->paginate(10);
            if ($user) {
                return response()->json([
                    'status' => 201,
                    'message' => 'success',
                    'result' => $user->items(),
                    'pagination' => [
                        'total' => $user->total(),
                        'per_page' => $user->perPage(),
                        'current_page' => $user->currentPage(),
                        'last_page' => $user->lastPage(),
                        'from' => $user->firstItem(),
                        'to' => $user->lastItem(),
                    ],
                ]);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    public function getUnapprovedUsers()
    {
        try {
            $user = User::where('active', 1)->whereNotNull('credentials')->where('credentials_status', 0)->orderBy('created_at', 'desc')->paginate(10);
            if ($user) {
                return response()->json([
                    'status' => 201,
                    'message' => 'success',
                    'result' => $user->items(),
                    'pagination' => [
                        'total' => $user->total(),
                        'per_page' => $user->perPage(),
                        'current_page' => $user->currentPage(),
                        'last_page' => $user->lastPage(),
                        'from' => $user->firstItem(),
                        'to' => $user->lastItem(),
                    ],
                ]);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }


    public function getUserByCredentials($id)
    {
        try {
            $user = User::where('active', 1)->where('id', $id)->whereNotNull('credentials')->first();
            if ($user) {
                return response()->json([
                    'status' => 201,
                    'message' => 'success',
                    'result' => $user
                ]);
            } else {
                // If the user with the provided ID does not exist
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found',
                    'result' => null
                ]);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    public function viewCredentials($id)
    {
        try {
            $user = User::where('active', 1)->where('id', $id)->whereNotNull('credentials')->first();

            if ($user && $user->credentials) {
                $filePath = storage_path($user->credentials);

                if (file_exists($filePath)) {
                    return response()->file($filePath, [
                        'Content-Type' => 'application/pdf',
                        'Content-Disposition' => 'inline; filename="' . $user->credentials . '"'
                    ])->setStatusCode(201);
                } else {
                    return response()->json(['status' => 404, 'message' => 'File not found']);
                }
            } else {
                return response()->json(['status' => 404, 'message' => 'User or file not found']);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    public function downloadStudentCredentials($studentId)
    {
        try {
            // Fetch student information and ensure they are active
            $student = User::where('active', 1)->where('id', $studentId)->first();

            if (!$student) {
                return response()->json(['status' => 404, 'message' => 'Student not found'], 404);
            }

            // Fetch student's credentials (assuming it's stored as a file path)
            $credentialsPath = storage_path($student->credentials);

            if (!file_exists($credentialsPath)) {
                return response()->json(['status' => 404, 'message' => 'Credentials not found'], 404);
            }

            // Serve the PDF for download
            return response()->download($credentialsPath, 'credentials_' . $student->firstname . '.pdf', [
                'Content-Type' => 'application/pdf',
            ])->setStatusCode(200);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred'], 500);
        }
    }
}
