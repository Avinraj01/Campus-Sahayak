// Test script to create a user and then login with valid credentials
const http = require('http');

// Test data
const testData = {
  signup: {
    email: 'validuser@example.com',
    password: 'validpassword',
    user_type: 'student',
    full_name: 'Valid User'
  },
  login: {
    identifier: 'validuser@example.com',
    password: 'validpassword',
    user_type: 'student'
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

// Test signup endpoint
async function testSignup() {
  console.log('Creating test user...');
  
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

// Test login endpoint with valid credentials
async function testValidLogin() {
  console.log('Testing login with valid credentials...');
  
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

// Run tests
async function runTests() {
  console.log('Running authentication tests with valid credentials...\n');
  
  // First create a user
  const signupResult = await testSignup();
  console.log('\n--- Signup Test Result ---');
  console.log('Status:', signupResult.statusCode);
  console.log('Data:', signupResult.data);
  
  // Then login with the same credentials
  const loginResult = await testValidLogin();
  console.log('\n--- Valid Login Test Result ---');
  console.log('Status:', loginResult.statusCode);
  console.log('Data:', loginResult.data);
  
  console.log('\n--- Test Summary ---');
  console.log('Signup Test:', signupResult.error ? 'FAIL' : 'PASS');
  console.log('Valid Login Test:', loginResult.error ? 'FAIL' : 'PASS');
  
  if (!signupResult.error && !loginResult.error && loginResult.statusCode === 200) {
    console.log('\n✅ All tests passed! Authentication is working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Check the output above for details.');
  }
}

// Run the tests
runTests();