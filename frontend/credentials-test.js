const axios = require('axios');

// Create an axios instance that mimics the frontend configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('=== Campus Management System Authentication Test ===\n');

// Function to register a new user
async function registerUser(email, password, fullName, userType = 'student') {
  try {
    console.log(`Registering new user: ${email}`);
    
    const registrationData = {
      email: email,
      password: password,
      user_type: userType,
      full_name: fullName
    };
    
    const response = await api.post('/api/auth/register', registrationData);
    console.log('✅ Registration successful!');
    console.log(`User: ${response.data.user.full_name} (${response.data.user.email})`);
    console.log(`Token: ${response.data.access_token.substring(0, 20)}...\n`);
    
    return response.data;
  } catch (error) {
    console.log('❌ Registration failed:');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.detail || error.response.data.error || 'Unknown error'}\n`);
    } else {
      console.log(`Error: ${error.message}\n`);
    }
    throw error;
  }
}

// Function to login an existing user
async function loginUser(identifier, password, userType = 'student') {
  try {
    console.log(`Logging in user: ${identifier}`);
    
    const loginData = {
      identifier: identifier,
      password: password,
      user_type: userType
    };
    
    const response = await api.post('/api/auth/login', loginData);
    console.log('✅ Login successful!');
    console.log(`User: ${response.data.user.full_name} (${response.data.user.email})`);
    console.log(`Token: ${response.data.access_token.substring(0, 20)}...\n`);
    
    return response.data;
  } catch (error) {
    console.log('❌ Login failed:');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.detail || error.response.data.error || 'Unknown error'}\n`);
    } else {
      console.log(`Error: ${error.message}\n`);
    }
    throw error;
  }
}

// Test with sample credentials
async function runTests() {
  try {
    console.log('Test 1: Register a new user\n');
    const registrationResult = await registerUser(
      'myuser@example.com',
      'mypassword123',
      'My Test User',
      'student'
    );
    
    console.log('Test 2: Login with the same user\n');
    const loginResult = await loginUser(
      'myuser@example.com',
      'mypassword123',
      'student'
    );
    
    console.log('🎉 All tests completed successfully!');
    console.log('\n=== Credentials Summary ===');
    console.log('Email: myuser@example.com');
    console.log('Password: mypassword123');
    console.log('User Type: student');
    console.log('Full Name: My Test User');
    console.log('============================\n');
    
  } catch (error) {
    console.log('💥 Test failed!');
    console.log('Please check the error messages above.\n');
  }
}

// Run the tests
runTests();