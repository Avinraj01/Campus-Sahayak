const axios = require('axios');

// Create an axios instance that mimics the frontend configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('Testing frontend authentication flow...');

// Test 1: Try to register a new user
async function testRegistration() {
  try {
    console.log('\n--- Testing Registration ---');
    const registrationData = {
      email: 'frontendtest@example.com',
      password: 'password123',
      user_type: 'student',
      full_name: 'Frontend Test User'
    };
    
    console.log('Sending registration request with data:', registrationData);
    const registerResponse = await api.post('/auth/register', registrationData);
    console.log('Registration successful:', registerResponse.data);
    return registerResponse.data;
  } catch (error) {
    console.log('Registration failed:', error.response?.data || error.message);
    // If user already exists, that's okay for this test
    if (error.response?.data?.error?.includes('already registered')) {
      console.log('User already exists, continuing with login test...');
      return null;
    }
    throw error;
  }
}

// Test 2: Try to login with the registered user
async function testLogin() {
  try {
    console.log('\n--- Testing Login ---');
    const loginData = {
      identifier: 'frontendtest@example.com',
      password: 'password123',
      user_type: 'student'
    };
    
    console.log('Sending login request with data:', loginData);
    const loginResponse = await api.post('/auth/login', loginData);
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
    const registrationResult = await testRegistration();
    
    // Test login
    const loginResult = await testLogin();
    
    console.log('\n--- All tests completed successfully ---');
  } catch (error) {
    console.error('\n--- Test failed ---');
    console.error(error);
  }
}

runTests();