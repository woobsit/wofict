<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Course;
use Illuminate\Support\Facades\DB;
use setasign\Fpdi\Fpdi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;



class StudentController extends Controller
{
    //for all users with credentials 
    public function getAllUsers()
    {
        try {
            // Define cache duration (in minutes)
            $cacheDuration = 5;

            // Generate a unique cache key based on the current page
            $page = request()->get('page', 1); // Get the current page or default to 1
            $cacheKey = "all-users-page-{$page}";

            // Check if the data is already cached
            $user = Cache::remember($cacheKey, $cacheDuration * 60, function () {
                return User::where('active', 1)
                    ->whereNotNull('credentials')
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
            });

            // Check if there are any users
            if ($user->isEmpty()) {
                return response()->json([
                    'status' => 404,
                    'message' => 'No records found',
                ]);
            }

            // If users are found, return the result with pagination data
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
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //For pie chart
    public function getAllAppliedUsers()
    {
        try {
            $results = DB::table('users')
                ->select(DB::raw("
                CASE 
                    WHEN credentials IS NULL THEN 'No Credentials' 
                WHEN credentials_status = 1 THEN 'Credentials Verified'
                WHEN credentials IS NOT NULL THEN 'Has Credentials'
                END AS group_name, COUNT(*) AS user_count
            "))
                ->groupBy('group_name')
                ->get();

            return response()->json(['status' => 201, 'message' => 'successfull', 'result' => $results]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    //For users with credentials that are pending or disapproved
    public function getPendingApprovalUsers()
    {
        try {
            // Define cache duration (in minutes)
            $cacheDuration = 5;

            // Generate a unique cache key based on the current page
            $page = request()->get('page', 1); // Get the current page or default to 1
            $cacheKey = "pending-approval-users-page-{$page}";

            // Check if the data is already cached
            $user = Cache::remember($cacheKey, $cacheDuration * 60, function () {
                return User::where('active', 1)
                    ->whereNotNull('credentials')
                    ->where('credentials_status', 0)
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
            });

            // Check if there are any users
            if ($user->isEmpty()) {
                return response()->json([
                    'status' => 404,
                    'message' => 'No records found',
                ]);
            }

            // Return the response with paginated data
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
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //For approved users
    public function getApprovedUsers()
    {
        try {
            // Define cache duration (in minutes)
            $cacheDuration = 5;

            // Generate a unique cache key based on the current page
            $page = request()->get('page', 1); // Get the current page or default to 1
            $cacheKey = "approved-users-page-{$page}";

            // Check if the data is already cached
            $user = Cache::remember($cacheKey, $cacheDuration * 60, function () {
                return User::where('active', 1)
                    ->whereNotNull('credentials')
                    ->where('credentials_status', 1)
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
            });

            // Check if there are any users
            if ($user->isEmpty()) {
                return response()->json([
                    'status' => 404,
                    'message' => 'No records found',
                ]);
            }

            // Return the response with paginated data
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
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }
    //get user with id that has credentials
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

    //view user credentials
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
                    return response()->json(['status' => 404, 'message' => 'file not found']);
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

            if ($user) {
                $user->credentials_status = 1;
                $user->save();

                // Invalidate the cached data
                $totalPages = ceil(User::where('active', 1)->count() / 10); // Assuming 10 items per page
                for ($page = 1; $page <= $totalPages; $page++) {
                    Cache::forget("all-users-page-{$page}");
                    Cache::forget("approved-users-page-{$page}");
                    Cache::forget("pending-approval-users-page-{$page}");
                }

                return response()->json(['status' => 200, 'message' => 'success']);
            } else {
                return response()->json(['status' => 404, 'message' => 'User is not found']);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    public function pendCredential($id)
    {
        try {
            $user = User::where('active', 1)->where('id', $id)->whereNotNull('credentials')->where('credentials_status', 1)->first();

            if ($user) {

                // $filePath = storage_path('app/' . $user->credentials); // Assuming credentials are stored in 'storage/app/public'

                // Delete the file if it exists
                // if (file_exists($filePath)) {
                //     unlink($filePath);
                // }

                $user->credentials_status = 0;
                //$user->credentials = null;
                $user->save();

                // Invalidate the cached data
                $totalPages = ceil(User::where('active', 1)->count() / 10); // Assuming 10 items per page
                for ($page = 1; $page <= $totalPages; $page++) {
                    Cache::forget("all-users-page-{$page}");
                    Cache::forget("approved-users-page-{$page}");
                    Cache::forget("pending-approval-users-page-{$page}");
                }

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
            $searchTerm = $request->query('prospective-students');

            // Split the search term into multiple parts (words)
            $searchParts = explode(' ', $searchTerm);

            // Search in the 'users' table across 'firstname', 'surname', and 'email'
            $users = User::where('active', 1)
                ->whereNotNull('credentials')
                ->where(function ($query) use ($searchParts) {
                    foreach ($searchParts as $part) {
                        $query->orWhere('firstname', 'LIKE', "%$part%")
                            ->orWhere('surname', 'LIKE', "%$part%");
                    }
                })
                ->get();

            // Check if any users were found

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'result' => $users
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    public function searchApprovedCredentials(Request $request)
    {
        try {
            // Get the search input from the query parameter
            $searchTerm = $request->query('approved-credentials-students');

            // Split the search term into multiple parts (words)
            $searchParts = explode(' ', $searchTerm);

            // Search in the 'users' table across 'firstname', 'surname', and 'email'
            $users = User::where('active', 1)
                ->whereNotNull('credentials')
                ->where('credentials_status', 1)
                ->where(function ($query) use ($searchParts) {
                    foreach ($searchParts as $part) {
                        $query->orWhere('firstname', 'LIKE', "%$part%")
                            ->orWhere('surname', 'LIKE', "%$part%");
                    }
                })
                ->get();

            // Check if any users were found

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'result' => $users
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    public function searchPendingCredentials(Request $request)
    {
        try {
            // Get the search input from the query parameter
            $searchTerm = $request->query('pending-credentials-students');

            // Split the search term into multiple parts (words)
            $searchParts = explode(' ', $searchTerm);

            // Search in the 'users' table across 'firstname', 'surname', and 'email'
            $users = User::where('active', 1)
                ->whereNotNull('credentials')
                ->where('credentials_status', 0)
                ->where(function ($query) use ($searchParts) {
                    foreach ($searchParts as $part) {
                        $query->orWhere('firstname', 'LIKE', "%$part%")
                            ->orWhere('surname', 'LIKE', "%$part%");
                    }
                })
                ->get();

            // Check if any users were found

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'result' => $users
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //All users with guarantors
    public function getAllUsersWithGuarantors()
    {
        try {
            // Define cache duration (in minutes)
            $cacheDuration = 5;

            // Generate a unique cache key based on the current page
            $page = request()->get('page', 1);
            $cacheKey = "all-users-with-guarantors-page-{$page}";

            // Retrieve from cache or query if not cached
            $user = Cache::remember($cacheKey, $cacheDuration * 60, function () {

                return User::where('active', 1)
                    ->whereNotNull('guarantors_1')
                    ->whereNotNull('guarantors_2')
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
            });

            // Check if there are any users
            if ($user->isEmpty()) {
                return response()->json([
                    'status' => 404,
                    'message' => 'No records found',
                ]);
            }

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
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //All users with guarantors form that are pending/disapproved
    public function getPendingApprovalGuarantorUsers()
    {
        try {
            // Define cache duration (in minutes)
            $cacheDuration = 5;

            // Generate a unique cache key based on the current page
            $page = request()->get('page', 1);
            $cacheKey = "pending-approval-guarantor-users-page-{$page}";

            // Retrieve from cache or query if not cached
            $user = Cache::remember($cacheKey, $cacheDuration * 60, function () {

                return User::where('active', 1)
                    ->whereNotNull('guarantors_1')
                    ->whereNotNull('guarantors_2')
                    ->where('guarantors_status', 0)
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
            });

            // Check if there are any users
            if ($user->isEmpty()) {
                return response()->json([
                    'status' => 404,
                    'message' => 'No records found',
                ]);
            }

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
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //All users with approved guarantors forms
    public function getApprovedGuarantorsUsers()
    {
        try {
            // Define cache duration (in minutes)
            $cacheDuration = 5;

            // Generate a unique cache key based on the current page
            $page = request()->get('page', 1);
            $cacheKey = "approved-guarantors-users-page-{$page}";

            // Retrieve from cache or query if not cached
            $user = Cache::remember($cacheKey, $cacheDuration * 60, function () {

                return User::where('active', 1)
                    ->whereNotNull('guarantors_1')
                    ->whereNotNull('guarantors_2')
                    ->where('guarantors_status', 1)
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
            });

            // Check if there are any users
            if ($user->isEmpty()) {
                return response()->json([
                    'status' => 404,
                    'message' => 'No records found',
                ]);
            }

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
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //search users with guarantors
    public function searchAllGuarantors(Request $request)
    {
        try {
            // Get the search input from the query parameter
            $searchTerm = $request->query('all-guarantors-students');

            // Split the search term into multiple parts (words)
            $searchParts = explode(' ', $searchTerm);

            // Search in the 'users' table across 'firstname', 'surname', and 'email'
            $users = User::where('active', 1)
                ->whereNotNull('guarantors_1')
                ->whereNotNull('guarantors_2')
                ->where(function ($query) use ($searchParts) {
                    foreach ($searchParts as $part) {
                        $query->orWhere('firstname', 'LIKE', "%$part%")
                            ->orWhere('surname', 'LIKE', "%$part%");
                    }
                })
                ->get();

            // Check if any users were found

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'result' => $users
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //search users with guarantors status that are not approved/pending
    public function searchGuarantorsNotApproved(Request $request)
    {
        try {
            // Get the search input from the query parameter
            $searchTerm = $request->query('guarantors-not-approved-students');

            // Split the search term into multiple parts (words)
            $searchParts = explode(' ', $searchTerm);

            // Search in the 'users' table across 'firstname', 'surname'
            $users = User::where('active', 1)
                ->whereNotNull('guarantors_1')
                ->whereNotNull('guarantors_2')
                ->where('guarantors_status', 0)
                ->where(function ($query) use ($searchParts) {
                    foreach ($searchParts as $part) {
                        $query->orWhere('firstname', 'LIKE', "%$part%")
                            ->orWhere('surname', 'LIKE', "%$part%");
                    }
                })
                ->get();

            // Check if any users were found

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'result' => $users
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //search users with approved guarantors status
    public function searchApprovedGuarantors(Request $request)
    {
        try {
            // Get the search input from the query parameter
            $searchTerm = $request->query('approved-guarantors-students');

            // Split the search term into multiple parts (words)
            $searchParts = explode(' ', $searchTerm);

            // Search in the 'users' table across 'firstname', 'surname'
            $users = User::where('active', 1)
                ->whereNotNull('guarantors_1')
                ->whereNotNull('guarantors_2')
                ->where('guarantors_status', 1)
                ->where(function ($query) use ($searchParts) {
                    foreach ($searchParts as $part) {
                        $query->orWhere('firstname', 'LIKE', "%$part%")
                            ->orWhere('surname', 'LIKE', "%$part%");
                    }
                })
                ->get();

            // Check if any users were found

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'result' => $users
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //approve guarantors status
    public function approveGuarantor($id)
    {
        try {
            $user = User::where('active', 1)
                ->where('id', $id)
                ->whereNotNull('guarantors_1')
                ->whereNotNull('guarantors_2')
                ->where('guarantors_status', 0)
                ->first();

            if ($user) {
                $user->guarantors_status = 1;
                $user->save();

                // Invalidate the cache for all pages
                $totalPages = ceil(User::where('active', 1)
                    ->count() / 10); // Assuming 10 items per page

                for ($page = 1; $page <= $totalPages; $page++) {
                    Cache::forget("all-users-with-guarantors-page-{$page}");
                    Cache::forget("pending-approval-guarantor-users-page-{$page}");
                    Cache::forget("approved-guarantors-users-page-{$page}");
                }

                return response()->json(['status' => 200, 'message' => 'Guarantor approved successfully']);
            } else {
                return response()->json(['status' => 404, 'message' => 'User not found or not eligible for approval']);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }
    //disapprove/ignore guarantors status
    public function disapproveGuarantor($id)
    {
        try {
            $user = User::where('active', 1)->where('id', $id)->whereNotNull('guarantors_1')
                ->whereNotNull('guarantors_2')
                ->where('guarantors_status', 1)->first();

            if ($user) {

                $user->guarantors_status = 0;
                //$user->credentials = null;
                $user->save();

                // Invalidate the cache for all pages
                $totalPages = ceil(User::where('active', 1)
                    ->count() / 10); // Assuming 10 items per page

                for ($page = 1; $page <= $totalPages; $page++) {
                    Cache::forget("all-users-with-guarantors-page-{$page}");
                    Cache::forget("pending-approval-guarantor-users-page-{$page}");
                    Cache::forget("approved-guarantors-users-page-{$page}");
                }

                return response()->json(['status' => 200, 'message' => 'success']);
            } else {
                return response()->json(['status' => 404, 'message' => 'User is not found']);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //get user with id that has guarantors
    public function getUserByIdWithGuarantors($id)
    {
        try {
            $user = User::where('active', 1)->where('id', $id)->whereNotNull('guarantors_1')->whereNotNull('guarantors_2')->first();
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

    //view user guarantor forms
    public function viewUserGuarantorForms($id)
    {
        try {
            $user = User::where('active', 1)
                ->where('id', $id)
                ->whereNotNull('guarantors_1')
                ->whereNotNull('guarantors_2')
                ->first();

            if ($user) {
                $filePath1 = storage_path('app/' . $user->guarantors_1);
                $filePath2 = storage_path('app/' . $user->guarantors_2);

                if (file_exists($filePath1) && file_exists($filePath2)) {
                    // Create a new FPDI object
                    $pdf = new Fpdi();

                    // Add first guarantor form
                    $pageCount1 = $pdf->setSourceFile($filePath1);
                    for ($i = 1; $i <= $pageCount1; $i++) {
                        $templateId = $pdf->importPage($i);
                        $pdf->AddPage();
                        $pdf->useTemplate($templateId);
                    }

                    // Add second guarantor form
                    $pageCount2 = $pdf->setSourceFile($filePath2);
                    for ($i = 1; $i <= $pageCount2; $i++) {
                        $templateId = $pdf->importPage($i);
                        $pdf->AddPage();
                        $pdf->useTemplate($templateId);
                    }

                    // Output the combined PDF to the browser
                    return response($pdf->Output('S'), 201)
                        ->header('Content-Type', 'application/pdf')
                        ->header('Content-Disposition', 'inline; filename="' . $user->firstname . " " . $user->surname .
                            '_guarantor_form.pdf"');
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

    //All registered users
    public function getAllRegisteredUsers()
    {
        try {

            // Define cache duration (in minutes)
            $cacheDuration = 5;
            $page = request()->get('page', 1); // Default to page 1 if no page parameter is provided
            $cacheKey = "registered-users-page-{$page}";

            // Try to get data from cache
            $users = Cache::remember($cacheKey, $cacheDuration * 60, function () {
                return User::where('active', 1)
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
            });

            $user = User::where('active', 1)->orderBy('created_at', 'desc')->paginate(10);
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

            // Check if there are any users
            if ($user->isEmpty()) {
                return response()->json([
                    'status' => 404,
                    'message' => 'No records found',
                ]);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    //Search all registered users
    public function searchAllRegisteredUsers(Request $request)
    {
        try {
            // Get the search input from the query parameter
            $searchTerm = $request->query('search-all-registered-users');

            // Split the search term into multiple parts (words)
            $searchParts = explode(' ', $searchTerm);

            // Search in the 'users' table across 'firstname', 'surname'
            $users = User::where('active', 1)
                ->where(function ($query) use ($searchParts) {
                    foreach ($searchParts as $part) {
                        $query->orWhere('firstname', 'LIKE', "%$part%")
                            ->orWhere('surname', 'LIKE', "%$part%");
                    }
                })
                ->get();

            // Check if any users were found

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'result' => $users
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //get a registered user
    public function getRegisteredUser($id)
    {
        try {
            $user = User::where('active', 1)->where('id', $id)->first();
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

    //All users to be admitted
    public function getUsersToBeAdmitted()
    {
        try {
            // Define cache duration (in minutes)
            $cacheDuration = 5;
            $page = request()->get('page', 1); // Default to page 1 if no page parameter is provided
            $cacheKey = "users-to-be-admitted-page-{$page}";

            // Try to get data from cache
            $users = Cache::remember($cacheKey, $cacheDuration * 60, function () {
                return User::where('active', 1)
                    ->where('credentials_status', 1)
                    ->where('guarantors_status', 1)
                    ->where('admission_status', 'Processing')
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
            });

            if ($users->isEmpty()) {
                return response()->json([
                    'status' => 404,
                    'message' => 'No records found',
                ]);
            }

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'result' => $users->items(),
                'pagination' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                ],
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //search users to be admitted
    public function searchUsersToBeAdmitted(Request $request)
    {
        try {
            // Get the search input from the query parameter
            $searchTerm = $request->query('users-to-be-admitted');

            // Split the search term into multiple parts (words)
            $searchParts = explode(' ', $searchTerm);

            // Search in the 'users' table across 'firstname', 'surname'
            $users = User::where('active', 1)
                ->where('credentials_status', 1)->where('guarantors_status', 1)->where('admission_status', "Processing")
                ->where(function ($query) use ($searchParts) {
                    foreach ($searchParts as $part) {
                        $query->orWhere('firstname', 'LIKE', "%$part%")
                            ->orWhere('surname', 'LIKE', "%$part%");
                    }
                })
                ->get();

            // Check if any users were found
            return response()->json([
                'status' => 201,
                'message' => 'success',
                'result' => $users
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //confirm the users
    public function admitUser($id)
    {
        try {
            $user = User::where('active', 1)->where('id', $id)
                ->where('credentials_status', 1)->where('guarantors_status', 1)->where('admission_status', "Processing")->first();

            if ($user) {
                $data = [
                    'user' => $user->firstname . ' ' . $user->surname,
                    'email' => $user->email
                ];

                // Dynamically generate the PDF
                $pdf = PDF::loadView('mail.admitted', $data);

                // Get the PDF content as a string
                $pdfOutput = $pdf->output();

                // Send the email with the generated PDF attached
                Mail::send('mail.admitted', $data, function ($message) use ($user, $pdfOutput) {
                    $message->to($user->email)
                        ->subject('Admission Acknowledgement')
                        ->attachData($pdfOutput, 'admission-acknowledgement.pdf', [
                            'mime' => 'application/pdf',
                        ]);
                });

                $user->admission_status = 'Admitted';
                $user->save();

                return response()->json([
                    'status' => 200,
                    'message' => 'An acknowledgment mail has been sent to the user'
                ]);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Invalid user details entered'
                ]);
            }
        } catch (Exception $e) {
            // Log the actual error message for debugging purposes
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    //Current number of students
    public function getStudentsCount()
    {
        try {
            $currentStudent = User::where('active', 1)->where('admission_status', 'Admitted')->where('guarantors_status', 1)->where('credentials_status', 1)->count();

            return response()->json([
                'status' => 201,
                'result' => number_format($currentStudent),
                'message' => 'Successful'
            ]);
        } catch (Exception $e) {
            // Log the actual error message for debugging purposes
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    //growth rate for current number of students
    public function getStudentsGrowthRate()
    {
        try {
            // Get the current date
            $currentDate = Carbon::now();

            // Query to get the count of users created in the current month
            $currentMonthCount = User::where('active', 1)->where('admission_status', 'Admitted')->where('guarantors_status', 1)->where('credentials_status', 1)->whereYear('created_at', $currentDate->year)
                ->whereMonth('created_at', $currentDate->month)
                ->count();

            // Query to get the count of users created in the previous month
            $previousMonthCount = User::where('active', 1)->where('admission_status', 'Admitted')->where('guarantors_status', 1)->where('credentials_status', 1)->whereYear('created_at', $currentDate->year)
                ->whereMonth('created_at', $currentDate->subMonth()->month)
                ->count();

            // If there were no users last month, avoid division by zero
            if ($previousMonthCount == 0) {
                $growthRate = $currentMonthCount > 0 ? 100 : 0;  // If there are new users this month but none last month
            } else {
                // Calculate the percentage growth
                $growthRate = (($currentMonthCount - $previousMonthCount) / $previousMonthCount) * 100;
            }

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'data' => [
                    'current_month_users' => $currentMonthCount,
                    'previous_month_users' => $previousMonthCount,
                    'growth_rate' => round($growthRate, 2)
                ]
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //Count registered users
    public function getRegisteredUsersCount()
    {
        try {
            $registeredUsers = User::where('active', 1)->count();

            return response()->json([
                'status' => 201,
                'result' => number_format($registeredUsers),
                'message' => 'Successful'
            ]);
        } catch (Exception $e) {
            // Log the actual error message for debugging purposes
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    //growth rate for registered users
    public function getRegisteredUsersGrowthRate()
    {
        try {
            // Get the current date
            $currentDate = Carbon::now();

            // Query to get the count of users created in the current month
            $currentMonthCount = User::where('active', 1)->whereYear('created_at', $currentDate->year)
                ->whereMonth('created_at', $currentDate->month)
                ->count();

            // Query to get the count of users created in the previous month
            $previousMonthCount = User::where('active', 1)->whereYear('created_at', $currentDate->year)
                ->whereMonth('created_at', $currentDate->subMonth()->month)
                ->count();

            // If there were no users last month, avoid division by zero
            if ($previousMonthCount == 0) {
                $growthRate = $currentMonthCount > 0 ? 100 : 0;  // If there are new users this month but none last month
            } else {
                // Calculate the percentage growth
                $growthRate = (($currentMonthCount - $previousMonthCount) / $previousMonthCount) * 100;
            }

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'data' => [
                    'current_month_users' => $currentMonthCount,
                    'previous_month_users' => $previousMonthCount,
                    'growth_rate' => round($growthRate, 2)
                ]
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //Count pending credentials users
    public function getPendingCredentialsUsersCount()
    {
        try {
            $registeredUsers = User::where('active', 1)->whereNotNull('credentials')->where('credentials_status', 0)->count();

            return response()->json([
                'status' => 201,
                'result' => number_format($registeredUsers),
                'message' => 'Successful'
            ]);
        } catch (Exception $e) {
            // Log the actual error message for debugging purposes
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }
    //growth rate for pending credentials users
    public function getPendingCredentialsUsersGrowthRate()
    {
        try {
            // Get the current date
            $currentDate = Carbon::now();

            // Query to get the count of users created in the current month
            $currentMonthCount = User::where('active', 1)->whereNotNull('credentials')->where('credentials_status', 0)->whereYear('created_at', $currentDate->year)
                ->whereMonth('created_at', $currentDate->month)
                ->count();

            // Query to get the count of users created in the previous month
            $previousMonthCount = User::where('active', 1)->whereYear('created_at', $currentDate->year)
                ->whereMonth('created_at', $currentDate->subMonth()->month)
                ->count();

            // If there were no users last month, avoid division by zero
            if ($previousMonthCount == 0) {
                $growthRate = $currentMonthCount > 0 ? 100 : 0;  // If there are new users this month but none last month
            } else {
                // Calculate the percentage growth
                $growthRate = (($currentMonthCount - $previousMonthCount) / $previousMonthCount) * 100;
            }

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'data' => [
                    'current_month_users' => $currentMonthCount,
                    'previous_month_users' => $previousMonthCount,
                    'growth_rate' => round($growthRate, 2)
                ]
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //Count pending guarantors users
    public function getPendingGuarantorsUsersCount()
    {
        try {
            $registeredUsers = User::where('active', 1)->whereNotNull('guarantors_1')->whereNotNull('guarantors_2')->where('guarantors_status', 0)->count();

            return response()->json([
                'status' => 201,
                'result' => number_format($registeredUsers),
                'message' => 'Successful'
            ]);
        } catch (Exception $e) {
            // Log the actual error message for debugging purposes
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    //growth rate for pending guarantors users
    public function getPendingGuarantorsUsersGrowthRate()
    {
        try {
            // Get the current date
            $currentDate = Carbon::now();

            // Query to get the count of users created in the current month
            $currentMonthCount = User::where('active', 1)->whereNotNull('guarantors_1')->whereNotNull('guarantors_2')->where('guarantors_status', 0)->whereYear('created_at', $currentDate->year)
                ->whereMonth('created_at', $currentDate->month)
                ->count();

            // Query to get the count of users created in the previous month
            $previousMonthCount = User::where('active', 1)->whereYear('created_at', $currentDate->year)
                ->whereMonth('created_at', $currentDate->subMonth()->month)
                ->count();

            // If there were no users last month, avoid division by zero
            if ($previousMonthCount == 0) {
                $growthRate = $currentMonthCount > 0 ? 100 : 0;  // If there are new users this month but none last month
            } else {
                // Calculate the percentage growth
                $growthRate = (($currentMonthCount - $previousMonthCount) / $previousMonthCount) * 100;
            }

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'data' => [
                    'current_month_users' => $currentMonthCount,
                    'previous_month_users' => $previousMonthCount,
                    'growth_rate' => round($growthRate, 2)
                ]
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    //Search all current students
    public function getSearchAdmittedCurrentStudents(Request $request)
    {
        try {
            // Get the search input from the query parameter
            $searchTerm = $request->query('search-all-admitted-current-students');

            // Split the search term into multiple parts (words)
            $searchParts = explode(' ', $searchTerm);

            // Search in the 'users' table across 'firstname', 'surname'
            $users = User::where('active', 1)->whereNotNull('guarantors_1')->whereNotNull('guarantors_2')->where('guarantors_status', 1)->whereNotNull('credentials')->where('credentials_status', 1)->where('admission_status', 'Admitted')
                ->where(function ($query) use ($searchParts) {
                    foreach ($searchParts as $part) {
                        $query->orWhere('firstname', 'LIKE', "%$part%")
                            ->orWhere('surname', 'LIKE', "%$part%");
                    }
                })
                ->get();

            // Check if any users were found

            return response()->json([
                'status' => 201,
                'message' => 'success',
                'result' => $users
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occurred']);
        }
    }

    // Select all courses
    public function getCourses()
    {
        $courses = Course::all();

        if ($courses->isEmpty()) {
            return response()->json(['status' => 404, 'message' => 'No courses found', 'result' => []]);
        }

        return response()->json(['status' => 201, 'message' => 'success', 'result' => $courses]);
    }
}
