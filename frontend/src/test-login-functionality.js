import { api } from './utils/api';

console.log('Testing login and signup functionality...');
// Define API_BASE from the api instance baseURL
const API_BASE = api.defaults.baseURL;
console.log('API Base URL:', API_BASE);

// Function to test login
export async function testLogin() {
  try {
    console.log('\n--- Testing Login Endpoint ---');
    const response = await api.post("/auth/login", {
      identifier: 'test@example.com',
      password: 'wrongpassword',
      user_type: 'student'
    });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Login error (expected for invalid credentials):', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
}

// Function to test signup
export async function testSignup() {
  try {
    console.log('\n--- Testing Signup Endpoint ---');
    const response = await api.post("/auth/register", {
      email: 'testuser@example.com',
      password: 'testpassword',
      user_type: 'student',
      full_name: 'Test User'
    });
    console.log('Signup response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Signup error:', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
}

// Function to test API connectivity
export async function testApiConnectivity() {
  try {
    console.log('\n--- Testing API Connectivity ---');
    const response = await api.get("/");
    console.log('API Info response:', response.data);
    return response.data;
  } catch (error) {
    console.log('API connectivity error:', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
}

// Run all tests
export async function runAllTests() {
  console.log('Running all authentication tests...');
  
  const apiTest = await testApiConnectivity();
  const loginTest = await testLogin();
  const signupTest = await testSignup();
  
  console.log('\n--- Test Results ---');
  console.log('API Connectivity:', apiTest.error ? 'FAIL' : 'PASS');
  console.log('Login Test:', loginTest.error ? 'FAIL' : 'PASS');
  console.log('Signup Test:', signupTest.error ? 'FAIL' : 'PASS');
  
  return {
    api: apiTest,
    login: loginTest,
    signup: signupTest
  };
}

// Export for use in other files
export default {
  testLogin,
  testSignup,
  testApiConnectivity,
  runAllTests
};