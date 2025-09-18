// Test script to verify frontend fixes
const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

async function testFrontendFixes() {
  console.log('Testing frontend fixes...\n');
  
  // Test 1: Register a new user
  console.log('Test 1: Registering a new user');
  try {
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      email: 'frontendtest@example.com',
      password: 'password123',
      user_type: 'student',
      full_name: 'Frontend Test User'
    });
    
    console.log('Registration successful!');
    const { access_token } = registerResponse.data;
    
    // Test 2: Try to register the same user again (should fail with "Email already registered")
    console.log('\nTest 2: Trying to register the same user again (should fail)');
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        email: 'frontendtest@example.com',
        password: 'password123',
        user_type: 'student',
        full_name: 'Frontend Test User'
      });
      console.log('ERROR: Registration should have failed but succeeded');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('Registration correctly failed with "Email already registered" error');
        console.log('Error message:', error.response.data.detail);
      } else {
        console.log('Unexpected error:', error.message);
      }
    }
    
    // Test 3: Login with correct credentials
    console.log('\nTest 3: Logging in with correct credentials');
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        identifier: 'frontendtest@example.com',
        password: 'password123',
        user_type: 'student'
      });
      
      console.log('Login successful!');
      
      // Test 4: Try to login with wrong password (should fail)
      console.log('\nTest 4: Trying to login with wrong password (should fail)');
      try {
        await axios.post(`${API_BASE}/auth/login`, {
          identifier: 'frontendtest@example.com',
          password: 'wrongpassword',
          user_type: 'student'
        });
        console.log('ERROR: Login should have failed but succeeded');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('Login correctly failed with "Invalid credentials" error');
        } else {
          console.log('Unexpected error:', error.message);
        }
      }
      
    } catch (error) {
      console.log('Login failed:', error.message);
    }
    
  } catch (error) {
    console.log('Registration failed:', error.message);
  }
  
  console.log('\nFrontend fixes test completed.');
}

testFrontendFixes();