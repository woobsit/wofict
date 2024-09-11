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
                $filePath = storage_path('app/' . $user->credentials);

                if (file_exists($filePath)) {
                    return response()->file($filePath, [
                        'Content-Type' => 'application/pdf',
                        'Content-Disposition' => 'inline; filename="' . $user->credentials . '"'
                    ])->setStatusCode(201);
                } else {
                    return response()->json(['status' => 404, 'message' => $filePath]);
                }
            } else {
                return response()->json(['status' => 404, 'message' => 'User or file not found']);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    public function approveCredential($id)
    {
        try {
            $user = User::where('active', 1)->where('id', $id)->whereNotNull('credentials')->where('credentials_status', 0)->first();

            if ($user && $user->credentials && $user->credentials_status == 0) {
                $user->credentials_status = 1;
                $user->save();

                return response()->json(['status' => 200, 'message' => 'success']);
            } else {
                return response()->json(['status' => 404, 'message' => 'User is not found']);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    public function disapproveCredential($id)
    {
        try {
            $user = User::where('active', 1)->where('id', $id)->whereNotNull('credentials')->where('credentials_status', 1)->first();

            if ($user && $user->credentials && $user->credentials_status == 1) {

                $filePath = storage_path('app/' . $user->credentials); // Assuming credentials are stored in 'storage/app/public'

                // Delete the file if it exists
                if (file_exists($filePath)) {
                    unlink($filePath);
                }

                $user->credentials_status = 0;
                $user->credentials = null;
                $user->save();

                return response()->json(['status' => 200, 'message' => 'success']);
            } else {
                return response()->json(['status' => 404, 'message' => 'User is not found']);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    public function searchCredentials(Request $request)
    {
        try {
            // Get the search input from the query parameter
            $searchTerm = $request->query('prospective_students');

            // Ensure that a search term is provided
            if (!$searchTerm) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Please provide a search term (firstname, surname, or email).'
                ]);
            }

            // Split the search term into multiple parts (words)
            $searchParts = explode(' ', $searchTerm);

            // Search in the 'users' table across 'firstname', 'surname', and 'email'
            $users = User::where('active', 1)
                ->whereNotNull('credentials')
                ->where(function ($query) use ($searchParts) {
                    foreach ($searchParts as $part) {
                        $query->orWhere('firstname', 'LIKE', "%$part%")
                            ->orWhere('surname', 'LIKE', "%$part%")
                            ->orWhere('email', 'LIKE', "%$part%");
                    }
                })
                ->get();

            // Check if any users were found
            if ($users->isEmpty()) {
                return response()->json([
                    'status' => 404,
                    'message' => 'No users found with the given search term.'
                ]);
            }

            return response()->json([
                'status' => 200,
                'message' => 'success',
                'result' => $users
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }
}
