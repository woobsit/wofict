<x-mail::message>
# Reset Your Password

Hello,

We received a request to reset your password. If you didn't make this request, you can ignore this email. Otherwise,
please click the button below to reset your password:

<x-mail::button :url="config('app.url').'/enter-new-password/'.$forget_password_code['forget_password_code']">
Reset Password
</x-mail::button>

This link will expire in 1 hour for security reasons. If you continue to have trouble, please contact our support team.

Thank you!

Sincerely,<br>
{{ config('app.name') }}
</x-mail::message>
