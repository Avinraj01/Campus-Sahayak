# Login Troubleshooting Guide

## Common Issue: "Invalid credentials. Please check your email/ID and password."

This error occurs when the system cannot authenticate your login attempt. Here are the most common causes and solutions:

## Solution 1: Check Your Credentials Carefully

Make sure you're entering the exact credentials you used during registration:
- Email/ID: Must match exactly (case-sensitive)
- Password: Must match exactly (case-sensitive)
- User Type: Must match what you selected during registration

## Solution 2: Verify User Type

The user type during login must match what you selected during registration:
- If you registered as a "Student", select "Student" during login
- If you registered as "Faculty", select "Faculty" during login
- If you registered as "General", select "General" during login

## Solution 3: Try Alternative Identifiers

Depending on your user type, try different identifiers:

### For Students:
- Try your email address
- Try your enrollment number (e.g., ENR20258B41A537)

### For Faculty:
- Try your email address
- Try your teacher ID (e.g., TCH2025XXXXXXX)

### For General Users:
- Use your email address

## Registered Users List

Here are the currently registered users and their details:

1. **Email**: avinyaduvansi123@gmail.com
   - Full Name: Avin Raj
   - User Type: Student
   - Enrollment No: ENR202527CDDD87

2. **Email**: test@example.com
   - Full Name: Test User
   - User Type: Student
   - Enrollment No: ENR2025BBE8CCD2

3. **Email**: testuser@example.com
   - Full Name: Test User
   - User Type: Student
   - Enrollment No: ENR20253C244324

4. **Email**: testuser123@example.com
   - Full Name: Test User 123
   - User Type: Student
   - Enrollment No: ENR202527C8FAF1

5. **Email**: frontendtest123@example.com
   - Full Name: Frontend Test User 123
   - User Type: Student
   - Enrollment No: ENR2025DF5327E7

6. **Email**: testuser17581677270188t1n89pm@example.com
   - Full Name: Test User 1758167727018
   - User Type: Student
   - Enrollment No: ENR2025253D3E20

7. **Email**: uniqueuser12345@example.com
   - Full Name: Unique Test User
   - User Type: Student
   - Enrollment No: ENR202563472991

8. **Email**: testuser17581680055590lwa2sfk@example.com
   - Full Name: Test User 1758168005559
   - User Type: Student
   - Enrollment No: ENR2025F9547F5E

9. **Email**: user1758168142776c8uqdqra@example.com
   - Full Name: Test User 1758168142776
   - User Type: Student
   - Enrollment No: ENR2025E899C9D9

10. **Email**: mytest@example.com
    - Full Name: My Test User
    - User Type: Student
    - Enrollment No: ENR20259C4F84EB

11. **Email**: newuser123@example.com
    - Full Name: New User
    - User Type: Student
    - Enrollment No: ENR20258B41A537

## Successful Login Examples

### Example 1: Login with Email
1. Go to http://localhost:3000/login
2. Click "Login" tab
3. Enter:
   - User Type: Student
   - Email/ID: newuser123@example.com
   - Password: newpassword123
4. Click "Login"

### Example 2: Login with Enrollment Number (for students)
1. Go to http://localhost:3000/login
2. Click "Login" tab
3. Enter:
   - User Type: Student
   - Email/ID: ENR20258B41A537 (use the enrollment number from the list above)
   - Password: newpassword123
4. Click "Login"

## Troubleshooting Tips

1. **Double-check your user type**: It must match what you selected during registration
2. **Try alternative identifiers**: Use enrollment number instead of email for students, teacher ID instead of email for faculty
3. **Clear browser cache**: Sometimes cached data can cause issues
4. **Check for typos**: Make sure there are no extra spaces or incorrect characters
5. **Case sensitivity**: Passwords are case-sensitive

## If You're Still Having Issues

1. Try registering a new account with a unique email
2. Make sure to note down your credentials immediately after registration
3. Verify that you're using the correct user type during both registration and login