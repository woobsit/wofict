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
    //get users with credentials
    Route::get('/get-all-users', [StudentController::class, 'getAllUsers']);
    //get all applied users
    Route::get('/get-all-applied-users', [StudentController::class, 'getAllAppliedUsers']);
    //get users with approved credentials
    Route::get('/get-approved-credentials', [StudentController::class, 'getApprovedUsers']);
    //get users with pending credentials status
    Route::get('/get-pending-approval-credentials', [StudentController::class, 'getPendingApprovalUsers']);
    //get user with credentials id
    Route::get('/get-user-by-credentials/{id}', [StudentController::class, 'getUserByCredentials']);
    //view credentials by id
    Route::get('/view-credentials/{id}', [StudentController::class, 'viewCredentials']);
    //approve credential by id
    Route::get('/approve-credential/{id}', [StudentController::class, 'approveCredential']);
    //pend credential by id
    Route::get('/pend-credential/{id}', [StudentController::class, 'pendCredential']);
    //search all credentials
    Route::get('/search-credentials', [StudentController::class, 'searchCredentials']);
    //search proved credentials
    Route::get('/search-approved-credentials', [StudentController::class, 'searchApprovedCredentials']);
    //search proved credentials
    Route::get('/search-pending-credentials', [StudentController::class, 'searchPendingCredentials']);
    //get users with guarantors
    Route::get('/users-with-guarantors', [StudentController::class, 'getAllUsersWithGuarantors']);
    //get users with guarantors pending approval 
    Route::get('/pending-approval-guarantors', [StudentController::class, 'getPendingApprovalGuarantorUsers']);
    //get users with approved guarantors 
    Route::get('/users-with-approved-guarantors', [StudentController::class, 'getApprovedGuarantorsUsers']);
    //search all users with guarantors
    Route::get('/search-all-users-with-guarantors', [StudentController::class, 'searchAllGuarantors']);
    //search users with not approved/pending guarantors
    Route::get('/search-users-not-approved-guarantors', [StudentController::class, 'searchGuarantorsNotApproved']);
    //search users with approved guarantors
    Route::get('/search-users-with-approved-guarantors', [StudentController::class, 'searchApprovedGuarantors']);
    //approve guarantor by id
    Route::get('/approve-guarantor/{id}', [StudentController::class, 'approveGuarantor']);
    //pend/disapprove guarantor by id
    Route::get('/disapprove-guarantor/{id}', [StudentController::class, 'disapproveGuarantor']);
    //get user with guarantors id
    Route::get('/get-user-with-guarantors-by-id/{id}', [StudentController::class, 'getUserByIdWithGuarantors']);
    //view user guarantor form
    Route::get('/view-guarantor-forms/{id}', [StudentController::class, 'viewUserGuarantorForms']);
    //All registered users
    Route::get('/get-all-registered-users', [StudentController::class, 'getAllRegisteredUsers']);
    //search all registered users
    Route::get('/search-all-registered-users', [StudentController::class, 'searchAllRegisteredUsers']);
    //get a registered user
    Route::get('/get-registered-user/{id}', [StudentController::class, 'getRegisteredUser']);
    //All admitted users lists
    Route::get('/get-users-to-be-admitted', [StudentController::class, 'getUsersToBeAdmitted']);
    //search users that are to be admitted
    Route::get('/search-users-to-be-admitted', [StudentController::class, 'searchUsersToBeAdmitted']);
    //admit user
    Route::get('/admit-user/{id}', [StudentController::class, 'admitUser']);
    //get number of current students
    Route::get('/current-students-count', [StudentController::class, 'getStudentsCount']);
    //get student growth rate
    Route::get('/students-growth-rate', [StudentController::class, 'getStudentsGrowthRate']);
});


    // Endpoints that require admin scope
    // Other admin routes
