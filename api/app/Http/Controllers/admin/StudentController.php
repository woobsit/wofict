<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use setasign\Fpdi\Fpdi;
use setasign\Fpdi\PdfReader;

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

    public function getPendingApprovalUsers()
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
                            ->orWhere('surname', 'LIKE', "%$part%")
                            ->orWhere('email', 'LIKE', "%$part%");
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
                            ->orWhere('surname', 'LIKE', "%$part%")
                            ->orWhere('email', 'LIKE', "%$part%");
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
                            ->orWhere('surname', 'LIKE', "%$part%")
                            ->orWhere('email', 'LIKE', "%$part%");
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

    public function getAllUsersWithGuarantors()
    {
        try {
            $user = User::where('active', 1)->whereNotNull('guarantors_1')->whereNotNull('guarantors_2')->orderBy('created_at', 'desc')->paginate(10);
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

    public function getPendingApprovalGuarantorUsers()
    {
        try {
            $user = User::where('active', 1)->whereNotNull('guarantors_1')->whereNotNull('guarantors_2')->where('guarantors_status', 0)->orderBy('created_at', 'desc')->paginate(10);
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

    public function getApprovedGuarantorsUsers()
    {
        try {
            $user = User::where('active', 1)->whereNotNull('guarantors_1')->whereNotNull('guarantors_2')->where('guarantors_status', 1)->orderBy('created_at', 'desc')->paginate(10);
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
                            ->orWhere('surname', 'LIKE', "%$part%")
                            ->orWhere('email', 'LIKE', "%$part%");
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

            // Search in the 'users' table across 'firstname', 'surname', and 'email'
            $users = User::where('active', 1)
                ->whereNotNull('guarantors_1')
                ->whereNotNull('guarantors_2')
                ->where('guarantors_status', 0)
                ->where(function ($query) use ($searchParts) {
                    foreach ($searchParts as $part) {
                        $query->orWhere('firstname', 'LIKE', "%$part%")
                            ->orWhere('surname', 'LIKE', "%$part%")
                            ->orWhere('email', 'LIKE', "%$part%");
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

            // Search in the 'users' table across 'firstname', 'surname', and 'email'
            $users = User::where('active', 1)
                ->whereNotNull('guarantors_1')
                ->whereNotNull('guarantors_2')
                ->where('guarantors_status', 1)
                ->where(function ($query) use ($searchParts) {
                    foreach ($searchParts as $part) {
                        $query->orWhere('firstname', 'LIKE', "%$part%")
                            ->orWhere('surname', 'LIKE', "%$part%")
                            ->orWhere('email', 'LIKE', "%$part%");
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
            $user = User::where('active', 1)->where('id', $id)->whereNotNull('guarantors_1')
                ->whereNotNull('guarantors_2')
                ->where('guarantors_status', 0)->first();

            if ($user) {
                $user->guarantors_status = 1;
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

    //disapprove/ignore guarantors status
    public function disapproveGuarantor($id)
    {
        try {
            $user = User::where('active', 1)->where('id', $id)->whereNotNull('guarantors_1')
                ->whereNotNull('guarantors_2')
                ->where('guarantors_status', 1)->first();

            if ($user) {

                // $filePath = storage_path('app/' . $user->credentials); // Assuming credentials are stored in 'storage/app/public'

                // Delete the file if it exists
                // if (file_exists($filePath)) {
                //     unlink($filePath);
                // }

                $user->guarantors_status = 0;
                //$user->credentials = null;
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
}
