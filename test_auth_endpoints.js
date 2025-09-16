// Simple test script to verify auth endpoints
const http = require('http');

// Test data
const testData = {
  login: {
    identifier: 'test@example.com',
    password: 'wrongpassword',
    user_type: 'student'
  },
  signup: {
    email: 'newuser@example.com',
    password: 'newpassword',
    user_type: 'student',
    full_name: 'New User'
  }
};

// Function to make HTTP requests
function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Test login endpoint
async function testLogin() {
  console.log('Testing login endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  try {
    const postData = JSON.stringify(testData.login);
    const response = await makeRequest(options, postData);
    console.log('Login response:', response);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return { error: error.message };
  }
}

// Test signup endpoint
async function testSignup() {
  console.log('Testing signup endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  try {
    const postData = JSON.stringify(testData.signup);
    const response = await makeRequest(options, postData);
    console.log('Signup response:', response);
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return { error: error.message };
  }
}

// Run tests
async function runTests() {
  console.log('Running authentication tests...\n');
  
  const loginResult = await testLogin();
  console.log('\n--- Login Test Result ---');
  console.log('Status:', loginResult.statusCode);
  console.log('Data:', loginResult.data);
  
  const signupResult = await testSignup();
  console.log('\n--- Signup Test Result ---');
  console.log('Status:', signupResult.statusCode);
  console.log('Data:', signupResult.data);
  
  console.log('\n--- Test Summary ---');
  console.log('Login Test:', loginResult.error ? 'FAIL' : 'PASS');
  console.log('Signup Test:', signupResult.error ? 'FAIL' : 'PASS');
}

// Run the tests
runTests();