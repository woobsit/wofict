<?php

use App\Http\Controllers\auth\UserAuthController;
use App\Http\Controllers\auth\AdminAuthController;
use App\Http\Controllers\admin\WebsiteInfoController;
use App\Http\Controllers\admin\AdminController;
use App\Http\Controllers\admin\StudentController;

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
Route::middleware(['api'])->prefix('v1')->group(function () {
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

/*User routes*/
Route::middleware(['auth:api', 'scope:user'])->prefix('v1')->group(function () {
    Route::post('/user-logout', [UserAuthController::class, 'userLogout']);
    Route::get('/get-user', [UserController::class, 'getUser']);
    //Acknowledgement generation
    Route::get('/acknowledgement', [UserController::class, 'downloadAcknowledgement']);
    //Guarantor generation
    Route::get('/guarantor', [UserController::class, 'downloadGuarantorForm']);
    //upload-credentials'
    Route::post('/upload-credentials', [UserController::class, 'uploadCredentials']);
    //upload-guarantors'
    Route::post('/upload-guarantors', [UserController::class, 'uploadGuarantors']);
});


/*Admin routes*/
Route::middleware(['auth:api', 'scope:admin'])->prefix('v1')->group(function () {

    //Admin Logout
    Route::post('/admin-logout', [AdminAuthController::class, 'adminLogout']);
    //get admin
    Route::get('/get-admin', [AdminController::class, 'getAdmin']);
    //get users
    Route::get('/get-all-users', [StudentController::class, 'getAllUsers']);
    //get user
    Route::get('/get-user-by-credentials/{id}', [StudentController::class, 'getUserByCredentials']);
});
    // Endpoints that require admin scope

    // Other admin routes
