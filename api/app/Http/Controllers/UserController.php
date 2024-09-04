<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Validator;


class UserController extends Controller
{
    public function downloadAcknowledgement()
    {
        try {
            $user = Auth::user();
            $data = ['user' => $user->firstname . ' ' . $user->surname, 'email' => $user->email];
            $pdf = PDF::loadView('pdf.acknowledgement', $data);
            return $pdf->download('acknowledgement', [
                'Content-Type' => 'application/pdf',
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    public function downloadGuarantorForm()
    {
        try {
            $user = Auth::user();
            $data = ['user' => $user->firstname . ' ' . $user->surname, 'email' => $user->email];
            $pdf = PDF::loadView('pdf.guarantor', $data);
            return $pdf->download('guarantor');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    public function uploadCredentials(Request $request)
    {
        try {
            // Validation rules
            $validator = Validator::make($request->all(), [
                'qualification_level' => 'required|string|max:255',
                'upload_credentials' => 'required|mimes:pdf|max:2048', // Only allow PDF files up to 2MB
            ]);

            // Check if validation fails
            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => $validator->messages()->all()
                ]);
            }

            // Handle the file upload
            if ($request->hasFile('upload_credentials')) {
                // Generate a unique file name
                $user = Auth::user();
                $timestamp = time();
                $firstName = $user->firstname;
                $surname = $user->surname;


                // Create the file name
                $fileName = "{$firstName}_{$surname}_{$timestamp}.pdf";
                $filePath = $request->file('upload_credentials')->storeAs('assets/uploads/credentials', $fileName, 'public');

                $user->qualification_level = $request->input('qualification_level');
                $user->credentials = $filePath;
                //$user->credentials_status = 1;

                //Set status to Processing
                if ($user->credentials && $user->guarantors_1 && $user->guarantors_2) {
                    $user->admission_status =  'Processing';
                }

                $user->save();

                return response()->json([
                    'status' => 201,
                    'message' => 'Credentials uploaded successfully',

                ]);
            }

            // Return an error if the file upload failed
            return response()->json([
                'status' => 500,
                'message' => 'File upload failed',
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    public function uploadGuarantors(Request $request)
    {
        try {
            // Validation rules
            $validator = Validator::make($request->all(), [
                'upload_guarantors_1' => 'required|mimes:pdf|max:2048',
                'upload_guarantors_2' => 'required|mimes:pdf|max:2048',
                // Only allow PDF files up to 2MB
            ]);

            // Check if validation fails
            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => $validator->messages()->all()
                ]);
            }

            // Handle the file upload
            if ($request->hasFile('upload_guarantors_1') && $request->hasFile('upload_guarantors_2')) {
                // Generate a unique file name
                $user = Auth::user();
                $timestamp = time();
                $firstName = $user->firstname;
                $surname = $user->surname;

                // guarantor 1
                $fileName = "{$firstName}_{$surname}_{$timestamp}_1.pdf";
                $filePath = $request->file('upload_guarantors_1')->storeAs('assets/uploads/guarantors', $fileName, 'public');

                $user->guarantors_1 = $filePath;

                // guarantor 2
                $fileName2 = "{$firstName}_{$surname}_{$timestamp}_2.pdf";
                $filePath2 = $request->file('upload_guarantors_2')->storeAs('assets/uploads/guarantors', $fileName2, 'public');

                $user->guarantors_2 = $filePath2;
                //$user->guarantors_status = 1;

                //Set status to Processing
                if ($user->credentials && $user->guarantors_1 && $user->guarantors_2) {
                    $user->admission_status =  'Processing';
                }

                $user->save();

                return response()->json([
                    'status' => 201,
                    'message' => 'Guarantor forms uploaded successfully',

                ]);
            }

            // Return an error if the file upload failed
            return response()->json([
                'status' => 500,
                'message' => 'File upload failed',
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }


    public function getUser()
    {
        try {
            $user = Auth::user();
            if ($user) {
                return response()->json([
                    'status' => 201,
                    'message' => 'success',
                    'result' => $user,
                ]);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }
}
