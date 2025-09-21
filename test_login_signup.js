// Test script for login and signup functionality
import axios from 'axios';

// The REACT_APP_BACKEND_URL already includes /api
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api';

console.log('Testing login and signup functionality...');
console.log('API Base URL:', API_BASE);

// Test login endpoint
async function testLogin() {
  try {
    console.log('\n--- Testing Login Endpoint ---');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      identifier: 'test@example.com',
      password: 'wrongpassword',
      user_type: 'student'
    });
    console.log('Login response:', loginResponse.data);
  } catch (error) {
    console.log('Login error (expected for invalid credentials):', error.response?.data || error.message);
  }
}

// Test signup endpoint
async function testSignup() {
  try {
    console.log('\n--- Testing Signup Endpoint ---');
    const signupResponse = await axios.post(`${API_BASE}/auth/register`, {
      email: 'test@example.com',
      password: 'testpassword',
      user_type: 'student',
      full_name: 'Test User'
    });
    console.log('Signup response:', signupResponse.data);
  } catch (error) {
    console.log('Signup error:', error.response?.data || error.message);
  }
}

// Test API connectivity
async function testApiConnectivity() {
  try {
    console.log('\n--- Testing API Connectivity ---');
    const apiInfoResponse = await axios.get(`${API_BASE.replace('/api', '')}/api-info`);
    console.log('API Info response:', apiInfoResponse.data);
  } catch (error) {
    console.log('API connectivity error:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  await testApiConnectivity();
  await testLogin();
  await testSignup();
}

runTests();