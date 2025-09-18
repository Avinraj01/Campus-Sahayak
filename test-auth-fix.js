// Test script to verify authentication fixes
const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

async function testAuthFlow() {
  console.log('Testing authentication flow...\n');
  
  // Test 1: Try to register with invalid email
  console.log('Test 1: Trying to register with invalid email');
  try {
    await axios.post(`${API_BASE}/auth/register`, {
      email: 'invalid-email',
      password: 'password123',
      user_type: 'student',
      full_name: 'Test User'
    });
    console.log('ERROR: Registration should have failed but succeeded');
  } catch (error) {
    console.log('Registration correctly failed for invalid email');
  }
  
  // Test 2: Try to register with short password
  console.log('\nTest 2: Trying to register with short password');
  try {
    await axios.post(`${API_BASE}/auth/register`, {
      email: 'test1@example.com',
      password: '123',
      user_type: 'student',
      full_name: 'Test User'
    });
    console.log('ERROR: Registration should have failed but succeeded');
  } catch (error) {
    console.log('Registration correctly failed for short password');
  }
  
  // Test 3: Register a new user with valid data
  console.log('\nTest 3: Registering a new user with valid data');
  try {
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      email: 'testuser1@example.com',
      password: 'password123',
      user_type: 'student',
      full_name: 'Test User 1'
    });
    
    console.log('Registration successful:', registerResponse.data);
    const { access_token } = registerResponse.data;
    
    // Test 4: Try to register the same user again (should fail)
    console.log('\nTest 4: Trying to register the same user again (should fail)');
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        email: 'testuser1@example.com',
        password: 'password123',
        user_type: 'student',
        full_name: 'Test User 1'
      });
      console.log('ERROR: Registration should have failed but succeeded');
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 409)) {
        console.log('Registration correctly failed with status', error.response.status, ':', error.response.data.detail);
      } else {
        console.log('Unexpected error during registration test:', error.message);
      }
    }
    
    // Test 5: Login with correct credentials
    console.log('\nTest 5: Logging in with correct credentials');
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        identifier: 'testuser1@example.com',
        password: 'password123',
        user_type: 'student'
      });
      
      console.log('Login successful:', loginResponse.data);
      
      // Test 6: Try to login with wrong password (should fail)
      console.log('\nTest 6: Trying to login with wrong password (should fail)');
      try {
        await axios.post(`${API_BASE}/auth/login`, {
          identifier: 'testuser1@example.com',
          password: 'wrongpassword',
          user_type: 'student'
        });
        console.log('ERROR: Login should have failed but succeeded');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('Login correctly failed with status 401:', error.response.data.detail);
        } else {
          console.log('Unexpected error during login test:', error.message);
        }
      }
      
      // Test 7: Try to login with non-existent user (should fail)
      console.log('\nTest 7: Trying to login with non-existent user (should fail)');
      try {
        await axios.post(`${API_BASE}/auth/login`, {
          identifier: 'nonexistent@example.com',
          password: 'password123',
          user_type: 'student'
        });
        console.log('ERROR: Login should have failed but succeeded');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('Login correctly failed with status 401:', error.response.data.detail);
        } else {
          console.log('Unexpected error during login test:', error.message);
        }
      }
      
    } catch (error) {
      console.log('Login failed:', error.message);
    }
    
  } catch (error) {
    console.log('Registration failed:', error.message);
  }
  
  console.log('\nAuthentication flow test completed.');
}

testAuthFlow();