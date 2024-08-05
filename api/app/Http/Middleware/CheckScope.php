<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckScope
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$scopes
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$scopes)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['status' => 403, 'message' => 'Unauthorized']);
        }

        // Check if the authenticated user's access token has at least one of the required scopes
        $isScopeSatisfied = false;
        foreach ($scopes as $scope) {
            if ($user->tokenCan($scope)) {
                $isScopeSatisfied = true;
                break;
            }
        }

        if (!$isScopeSatisfied) {
            // None of the required scopes are present in the user's access token
            return response()->json(['status' => 403, 'message' => 'Insufficient scope']);
        }

        return $next($request);
    }
}
