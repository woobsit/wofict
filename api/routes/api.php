<?php

use App\Http\Controllers\auth\UserAuthController;
use App\Http\Controllers\auth\AdminAuthController;
use App\Http\Controllers\admin\WebsiteInfoController;
use App\Http\Controllers\UserController;

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

//Route::prefix('v1')->group(function () {});

// Route::post('/register', [UserAuthController::class, 'register']);
// Route::post('/admin-login', [AdminAuthController::class, 'adminLogin']);
Route::middleware(['api'])->group(function () {
    //User Login
    Route::post('/user-login', [UserAuthController::class, 'userLogin']);
    //User forget password endpoint
    Route::post('/user-forget-password', [UserAuthController::class, 'forgetPassword']);
    //User confirm forget password token sent
    Route::post('/user-confirm-forget-password-token', [UserAuthController::class, 'userConfirmForgetPasswordToken']);
    //User Enter new password
    Route::post('/user-enter-new-password', [UserAuthController::class, 'enterNewPassword']);
    //Admin Login
    Route::post('/admin-login', [AdminAuthController::class, 'adminLogin']);
    //Admin forget password endpoint
    Route::post('/admin-forget-password', [AdminAuthController::class, 'adminForgetPassword']);
    //Admin confirm forget password token sent
    Route::post('/admin-confirm-forget-password-token', [AdminAuthController::class, 'adminConfirmForgetPasswordToken']);
    //Admin Enter new password
    Route::post('/admin-enter-new-password', [AdminAuthController::class, 'adminEnterNewPassword']);
    //Website info
    Route::get('/website-info', [WebsiteInfoController::class, 'showWebsiteInfo']);
});


Route::middleware(['auth:api', 'scope:user'])->group(function () {
    Route::post('/user-logout', [UserAuthController::class, 'userLogout']);
    Route::get('/get-user', [UserController::class, 'getUser']);
});

Route::middleware(['auth:api', 'scope:admin'])->group(function () {
    //Admin Logout
    Route::post('/admin-logout', [AdminAuthController::class, 'adminLogout']);
});
    // Endpoints that require admin scope

    // Other admin routes