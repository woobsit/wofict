<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Mail\ForgetPassword;
use App\Mail\SignupRegistration;
use App\Models\User;
use App\Models\WebsiteInfo;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;



class UserAuthController extends Controller
{
    public function register(Request $request)
    {

        try {
            $validator = Validator::make($request->all(), [
                'firstname' => 'required|min:3|max:50',
                'surname' => 'required|min:3|max:50',
                'other_names' => 'nullable|min:3|max:50',
                'email' => 'required|email|unique:users',
                'password' => 'min:6|required|confirmed',
                'password_confirmation' => 'required',
                'gender' => 'required|in:Male,Female',
                'date_of_birth' => 'required',
                'phone_number' => 'required|size:11',
                'contact_address' => 'required|string|min:3|max:1000',
                'state_of_origin' => 'required|string|min:3|max:15',
                'qualification_level' => 'required|string|min:3|max:50',
                'course' => 'required|string|min:3|max:50',
                'session' => 'required|string|min:3|max:50',
                'english_fluency' => 'required|string',
                'conversation_strength' => 'required|string',
                'computer_literacy' => 'required|string',
                'ict_referral' => 'required|string',
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => $validator->messages()->all(),
                ]);
            }

            $email_verification = Str::random(30);
            $expiryTimestamp = now()->addDay(2);

            User::create([
                'firstname' => $request->input('firstname'),
                'surname' => $request->input('surname'),
                'other_names' => $request->input('other_names'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
                'gender' => $request->input('gender'),
                'date_of_birth' => $request->input('date_of_birth'),
                'phone_number' => $request->input('phone_number'),
                'contact_address' => $request->input('contact_address'),
                'state_of_origin' => $request->input('state_of_origin'),
                'qualification_level' => $request->input('qualification_level'),
                'course' => $request->input('course'),
                'session' => $request->input('session'),
                'english_fluency' => $request->input('english_fluency'),
                'conversation_strength' => $request->input('conversation_strength'),
                'computer_literacy' => $request->input('computer_literacy'),
                'ict_referral' => $request->input('ict_referral'),
                'email_verification' => $email_verification,
                'expiry_timestamp' => $expiryTimestamp,
            ]);


            $email_verification_code = ['verification_string' => $email_verification, 'surname' => $request->input('surname')];
            Mail::to($request->input('email'))->send(new SignupRegistration($email_verification_code));

            return response()->json([
                'status' => 201,
                'message' => 'Registration was successful'
            ]);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    public function verifyEmail(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email_verification' => 'required|string|size:30',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 422,
                    'message' => "Invalid",
                ]);
            }

            $user = User::where('email_verification', $request->input('email_verification'))->where('active', 0)->first();

            if ($user) {
                $expiryTimestamp = $user->expiry_timestamp;

                if (now()->lt($expiryTimestamp)) {
                    // Mark the user as verified
                    $user->email_verification = null;
                    $user->active = 1;
                    $user->email_verified_at = now();
                    $user->expiry_timestamp = null;
                    $user->save();

                    return response()->json(['status' => 200, 'message' => 'Email verification was successful']);
                } else {
                    // Token has expired
                    return response()->json(['status' => 401, 'message' => 'Email verification token has expired']);
                }
            } else {
                // User or verification code not found
                return response()->json(['status' => 401, 'message' => 'Invalid email verification request']);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }


    public function userLogin(Request $request)
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

            //admitted user
            $admittedUser = ['email' => $credentials['email'], 'password' => $credentials['password'], 'active' => 1, 'admission_status' => 'Admitted', 'guarantors_status' => 1, 'credentials_status' => 1];

            //unadmitted user (pending documentation)
            $unadmittedUserPending = ['email' => $credentials['email'], 'password' => $credentials['password'], 'active' => 1, 'admission_status' => 'Pending documentation'];

            //unadmitted user (processing)
            $unadmittedUserProcessing = ['email' => $credentials['email'], 'password' => $credentials['password'], 'active' => 1, 'admission_status' => 'Processing'];

            if (Auth::attempt($admittedUser)) {

                $user = Auth::user();
                $rememberMe = $request->input('remember_token');
                $remember = $rememberMe ? Str::random(60) : null;
                $user->remember_token = $remember;
                $user->save();

                $token = $user->createToken('UserToken', ['user'])->accessToken;

                $userInfo = [
                    'firstname' => $user->firstname,
                    'surname' => $user->surname,
                    'other_names' => $user->other_names,
                    'email' => $user->email,
                    'photo' => $user->photo,

                ];

                $websiteInfo = WebsiteInfo::all();

                return response()->json([
                    'status' => 200,
                    'token' => $token,
                    'remember_me' => $rememberMe,
                    'admission_status' => $user->admission_status,
                    'user_info' => $userInfo,
                    'website_info' => $websiteInfo
                ]); //Dont think I will need the 'admission_status'. Or at least not now 
            } else if (Auth::attempt($unadmittedUserPending)) {
                $user = Auth::user();
                $rememberMe = $request->input('remember_token');
                $remember = $rememberMe ? Str::random(60) : null;
                $user->remember_token = $remember;
                $user->save();

                $token = $user->createToken('UserToken', ['user'])->accessToken;

                $userInfo = [
                    'firstname' => $user->firstname,
                    'surname' => $user->surname,
                    'other_names' => $user->other_names,
                    'email' => $user->email,
                    'photo' => $user->photo,

                ];

                $websiteInfo = WebsiteInfo::all();

                return response()->json([
                    'status' => 200,
                    'token' => $token,
                    'remember_me' => $rememberMe,
                    'admission_status' => $user->admission_status,
                    'user_info' => $userInfo,
                    'website_info' => $websiteInfo
                ]); //Dont think I will need the 'admission_status'. Or at least not now
            } else if (Auth::attempt($unadmittedUserProcessing)) {
                $user = Auth::user();
                $rememberMe = $request->input('remember_token');
                $remember = $rememberMe ? Str::random(60) : null;
                $user->remember_token = $remember;
                $user->save();

                $token = $user->createToken('UserToken', ['user'])->accessToken;

                $userInfo = [
                    'firstname' => $user->firstname,
                    'surname' => $user->surname,
                    'other_names' => $user->other_names,
                    'email' => $user->email,
                    'photo' => $user->photo,

                ];

                $websiteInfo = WebsiteInfo::all();

                return response()->json([
                    'status' => 200,
                    'token' => $token,
                    'remember_me' => $rememberMe,
                    'admission_status' => $user->admission_status,
                    'user_info' => $userInfo,
                    'website_info' => $websiteInfo
                ]); //Dont think I will need the 'admission_status'. Or at least not now
            } else {
                return response()->json(['status' => 401, 'message' => 'Wrong login details entered'],);
            }
        } catch (Exception $e) {
            // Log the actual error message for debugging purposes
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }

    public function forgetPassword(Request $request)
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
            $passwordReset = User::where('email', $request->input('email'))->where('active', 1)->first();

            if ($passwordReset) {
                $forgetPassword = Str::random(30);
                $expiryTimestamp = now()->addHour();
                $passwordReset->forget_password = $forgetPassword;
                $passwordReset->expiry_timestamp = $expiryTimestamp;
                $passwordReset->save();

                $forgetPasswordCode = ['forget_password_code' => $forgetPassword];

                Mail::to($request->input('email'))->send(new ForgetPassword($forgetPasswordCode));
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

    // 
    public function userConfirmForgetPasswordToken(Request $request)
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

            $countForgetPasswordToken = User::where('forget_password', $request->input('forget_password'))->where('active', 1)->where('expiry_timestamp', '>', Carbon::now())->first();

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


    public function enterNewPassword(Request $request)
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

            $countNewPassword = User::where('email', $request->input('email'))->where('forget_password', $request->input('forget_password'))->where('active', 1)->where('expiry_timestamp', '>', Carbon::now())->first();

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

    public function userLogout()
    {
        try {

            if (Auth::guard('api')->check()) {
                Auth::guard('api')->user()->token()->revoke();
                return response()->json(['status' => 204, 'message' => 'Logout was successful']);
            }
            return response()->json(['status' => 401, 'message' => 'You are not unauthorized for this action']);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 500, 'message' => 'System error occured']);
        }
    }
}
