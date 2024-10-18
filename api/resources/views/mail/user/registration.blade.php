<x-mail::message>
# Welcome to {{ config('app.name') }}!

Dear {{ $signup_registration['surname'] }},

Thank you for registering. We are excited to have you as part of us. Before you can begin, we need you to verify your email address.

Please click the button below to complete your registration and verify your account:

<x-mail::button :url="config('app.url').'/verify-email/'.$signup_registration[verification_string]">
Verify Email
</x-mail::button>

If you did not sign up for an account, please ignore this email.

Thanks again for joining. We wish you success.

Best regards,<br>
The {{ config('app.name') }} Team
</x-mail::message>
