<!-- resources/views/pdf/myPDF.blade.php -->
<!DOCTYPE html>
<html>

<head>
    <title>Acknowledgement Letter - {{ $email }}</title>
</head>

<body>
    <h1 style="text-align:center;">Acknowledgement Letter</h1>
    <p>Name: {{ $user }}</p>
    <p>Email: {{ $email }}</p>
    <p>
        Here’s a sample acknowledgment letter that a school could use to confirm receipt of an application:

        [School Name]
        [School Address]
        [City, State, ZIP Code]
        [Email Address]
        [Phone Number]

        [Date]

        [Applicant's Name]
        [Applicant's Address]
        [City, State, ZIP Code]

        Dear [Applicant's Name],

        Subject: Acknowledgment of Application Submission

        We are pleased to acknowledge the receipt of your application for admission to [School Name] for the academic year [Academic Year]. We have received your application on [Date of Submission], and we appreciate your interest in joining our institution.

        Your application is currently under review by our admissions committee. Please note that the review process may take some time, and we will notify you of the outcome of your application as soon as possible. If additional information or documentation is required, we will contact you directly.

        In the meantime, should you have any questions or need further assistance, please do not hesitate to reach out to our admissions office at [Admissions Office Email] or [Admissions Office Phone Number]. We are here to help you through every step of the application process.

        Thank you for choosing [School Name] as a potential place for your educational journey. We look forward to the possibility of welcoming you to our school community.

        Sincerely,

        [Your Full Name]
        [Your Title]
        [School Name]</p>
</body>

</html>