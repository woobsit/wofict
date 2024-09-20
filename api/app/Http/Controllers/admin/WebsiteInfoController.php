<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WebsiteInfo;
use Exception;
use Illuminate\Support\Facades\Log;

class WebsiteInfoController extends Controller
{
    function showWebsiteInfo()
    {
        try {
            $websiteInfo = WebsiteInfo::all();
            return response()->json(['status' => 201, 'message' => 'success', 'result' => $websiteInfo]);
        } catch (Exception $e) {
            // Log the actual error message for debugging purposes
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }
}
