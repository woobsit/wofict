<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Log;


class AdminController extends Controller
{
    public function getAdmin()
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
