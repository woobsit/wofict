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
            return $pdf->download('acknowledgement');
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
                'qualification' => 'required|string|max:255',
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
                $originalName = $request->file('upload_credentials')->getClientOriginalName();
                $fileName = $timestamp . '_' . $originalName;
                // Store the file in the 'uploads' directory with the unique name
                $filePath = $request->file('upload_credentials')->storeAs('uploads/credentials', $fileName, 'public');

                $user->qualification_level = $request->input('qualification');
                $user->credentials = $filePath;
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
