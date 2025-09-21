const axios = require('axios');

// Create an axios instance that mimics the frontend configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('Testing authentication flow with unique credentials...');

// Test 1: Register a new user with a unique email
async function testRegistration() {
  try {
    console.log('\n--- Testing Registration ---');
    // Generate a unique email using timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const email = `testuser${timestamp}${randomString}@example.com`;
    
    const registrationData = {
      email: email,
      password: 'password123',
      user_type: 'student',
      full_name: `Test User ${timestamp}`
    };
    
    console.log('Sending registration request with data:', registrationData);
    const registerResponse = await api.post('/api/auth/register', registrationData);
    console.log('Registration successful:', registerResponse.data);
    
    // Return the credentials for login test
    return {
      email: registrationData.email,
      password: registrationData.password,
      user_type: registrationData.user_type
    };
  } catch (error) {
    console.log('Registration failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test 2: Login with the registered user
async function testLogin(credentials) {
  try {
    console.log('\n--- Testing Login ---');
    const loginData = {
      identifier: credentials.email,
      password: credentials.password,
      user_type: credentials.user_type
    };
    
    console.log('Sending login request with data:', loginData);
    const loginResponse = await api.post('/api/auth/login', loginData);
    console.log('Login successful:', loginResponse.data);
    return loginResponse.data;
  } catch (error) {
    console.log('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

// Run the tests
async function runTests() {
  try {
    // Test registration
    const credentials = await testRegistration();
    
    // Test login
    const loginResult = await testLogin(credentials);
    
    console.log('\n--- All tests completed successfully ---');
    console.log('You can use these credentials to login in the frontend:');
    console.log('Email:', credentials.email);
    console.log('Password: password123');
    console.log('User Type: student');
  } catch (error) {
    console.error('\n--- Test failed ---');
    console.error(error);
  }
}

runTests();