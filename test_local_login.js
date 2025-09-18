// Test script to verify local login functionality
const axios = require('axios');

// Test data
const testUser = {
  identifier: 'test@example.com',
  password: 'password123',
  user_type: 'student'
};

// Test login endpoint
async function testLogin() {
  try {
    console.log('Testing login with:', testUser);
    
    // Make sure to use the correct local URL
    const response = await axios.post('http://localhost:8000/api/auth/login', testUser);
    
    console.log('Login successful!');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Test registration endpoint
async function testRegistration() {
  try {
    const testRegistrationData = {
      email: 'test@example.com',
      password: 'password123',
      user_type: 'student',
      full_name: 'Test User'
    };
    
    console.log('Testing registration with:', testRegistrationData);
    
    // Make sure to use the correct local URL
    const response = await axios.post('http://localhost:8000/api/auth/register', testRegistrationData);
    
    console.log('Registration successful!');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Registration failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run tests
async function runTests() {
  console.log('Starting local login/signup tests...\n');
  
  // Test registration first
  await testRegistration();
  
  console.log('\n---\n');
  
  // Then test login
  await testLogin();
}

// Run the tests
runTests();