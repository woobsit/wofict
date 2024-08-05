<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Admin;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminForgetPassword;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;



class AdminAuthController extends Controller
{
    public function adminLogin(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|string',
                'password' => 'required|string',
                'remember_token' => 'nullable',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => $validator->messages()->all()
                ]);
            }

            $credentials = $request->only('email', 'password');
            $admin = Admin::where('email', $credentials['email'])
                ->where('active', 1)  // Ensure the admin is active
                ->first();

            if ($admin && Hash::check($credentials['password'], $admin->password)) {

                $rememberMe = $request->input('remember_token');
                $remember = $rememberMe ? Str::random(60) : null;
                $admin->remember_token = $remember;
                $admin->save();

                $token = $admin->createToken('AdminToken', ['admin'])->accessToken;

                return response()->json(['status' => 200, 'token' => $token, 'remember_me' => $rememberMe,]);
            } else {
                return response()->json(['status' => 401, 'message' => 'Wrong login details entered'],);
            }
        } catch (Exception $e) {
            // Log the actual error message for debugging purposes
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    public function adminForgetPassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => $validator->messages()->all()
                ]);
            }

            $passwordReset = Admin::where('email', $request->input('email'))->where('active', 1)->first();

            if ($passwordReset) {
                $forgetPassword = Str::random(30);
                $expiryTimestamp = now()->addHour();
                $passwordReset->forget_password = $forgetPassword;
                $passwordReset->expiry_timestamp = $expiryTimestamp;
                $passwordReset->save();

                $forgetPasswordCode = ['forget_password_code' => $forgetPassword];

                Mail::to($request->input('email'))->send(new AdminForgetPassword($forgetPasswordCode));

                return response()->json([
                    'status' => 200,
                    'message' => 'Forget password link has been sent'
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

    public function adminConfirmForgetPasswordToken(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'forget_password' => 'required|string|size:30',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => "Link is invalid",
                ]);
            }

            $countForgetPasswordToken = Admin::where('forget_password', $request->input('forget_password'))->where('active', 1)->where('expiry_timestamp', '>', Carbon::now())->first();

            if ($countForgetPasswordToken) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Token is valid'
                ]);
            } else {

                return response()->json([
                    'status' => 401,
                    'message' => 'Token has expired or is invalid'
                ]);
            }
        } catch (Exception $e) { // Log the actual error message for debugging purposes
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }


    public function adminEnterNewPassword(Request $request)
    {

        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|string',
                'password' => 'required|min:6',
                'forget_password' => 'required|string|size:30',
            ]);

            //'password_confirmation' => 'required|confirmed',
            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => $validator->messages()->all()
                ]);
            }

            $countNewPassword = Admin::where('email', $request->input('email'))->where('forget_password', $request->input('forget_password'))->where('active', 1)->where('expiry_timestamp', '>', Carbon::now())->first();

            if ($countNewPassword) {
                $countNewPassword->forget_password = null;
                $countNewPassword->expiry_timestamp = null;
                $countNewPassword->password =  Hash::make($request->input('password'));
                $countNewPassword->save();

                return response()->json([
                    'status' => 200,
                    'message' => 'Your password has now been successfully reset'
                ]);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => "You entered an invalid user details"
                ]);
            }
        } catch (Exception $e) {
            // Log the actual error message for debugging purposes
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }
    public function adminLogout()
    {
        try {
            if (Auth::guard('admin')->check()) {
                Auth::guard('admin')->user()->token()->revoke();
                return response()->json(['status' => 204, 'message' => 'Logout was successful']);
            }
            return response()->json(['status' => 401, 'message' => 'You are not unauthorized for this action']);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }
}
