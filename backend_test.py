import requests
import sys
import json
from datetime import datetime
import time

class CampusLinguaAPITester:
    def __init__(self, base_url="https://campus-lingua.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.session_id = f"test_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            print(f"   Status Code: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout (30s)")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_chat_english(self):
        """Test chat with English query"""
        data = {
            "message": "What is the fee payment deadline?",
            "session_id": self.session_id,
            "language": "en"
        }
        success, response = self.run_test("Chat - English Query", "POST", "chat", 200, data)
        if success and 'response' in response:
            print(f"   Bot Response: {response['response'][:100]}...")
            print(f"   Detected Language: {response.get('language', 'N/A')}")
        return success

    def test_chat_hindi(self):
        """Test chat with Hindi query"""
        data = {
            "message": "छात्रवृत्ति की आखिरी तारीख क्या है?",
            "session_id": self.session_id,
            "language": "hi"
        }
        success, response = self.run_test("Chat - Hindi Query", "POST", "chat", 200, data)
        if success and 'response' in response:
            print(f"   Bot Response: {response['response'][:100]}...")
            print(f"   Detected Language: {response.get('language', 'N/A')}")
        return success

    def test_chat_gujarati(self):
        """Test chat with Gujarati query"""
        data = {
            "message": "ફીસ ભરવાની છેલ્લી તારીખ કઈ છે?",
            "session_id": self.session_id,
            "language": "gu"
        }
        success, response = self.run_test("Chat - Gujarati Query", "POST", "chat", 200, data)
        if success and 'response' in response:
            print(f"   Bot Response: {response['response'][:100]}...")
            print(f"   Detected Language: {response.get('language', 'N/A')}")
        return success

    def test_language_detection(self):
        """Test automatic language detection"""
        data = {
            "message": "फीस कब तक भरनी है?",  # Hindi without specifying language
            "session_id": self.session_id
        }
        success, response = self.run_test("Language Detection", "POST", "chat", 200, data)
        if success and response.get('language') == 'hi':
            print(f"✅ Language detection working - detected: {response['language']}")
            return True
        elif success:
            print(f"⚠️  Language detection may not be working - detected: {response.get('language')}")
            return False
        return success

    def test_scholarship_query(self):
        """Test scholarship-related query to trigger web search"""
        data = {
            "message": "Tell me about current scholarship opportunities",
            "session_id": self.session_id,
            "language": "en"
        }
        success, response = self.run_test("Scholarship Query", "POST", "chat", 200, data)
        if success and 'response' in response:
            response_text = response['response'].lower()
            if any(keyword in response_text for keyword in ['scholarship', 'nsp', 'reliance', 'deadline']):
                print(f"✅ Scholarship information included in response")
                return True
            else:
                print(f"⚠️  Scholarship information may not be included")
                return False
        return success

    def test_conversation_history(self):
        """Test conversation history retrieval"""
        # First send a message to create history
        data = {
            "message": "Hello, this is a test message",
            "session_id": self.session_id,
            "language": "en"
        }
        self.run_test("Create History Message", "POST", "chat", 200, data)
        
        # Wait a moment for database write
        time.sleep(1)
        
        # Now test history retrieval
        return self.run_test("Chat History", "GET", f"chat/history/{self.session_id}", 200)

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test POST status
        data = {"client_name": "test_client"}
        success1, _ = self.run_test("Create Status Check", "POST", "status", 200, data)
        
        # Test GET status
        success2, _ = self.run_test("Get Status Checks", "GET", "status", 200)
        
        return success1 and success2

    def test_error_handling(self):
        """Test error handling with invalid data"""
        # Test with missing required fields
        data = {"message": ""}  # Empty message
        success, response = self.run_test("Error Handling - Empty Message", "POST", "chat", 200, data)
        
        # Even with empty message, the API should handle gracefully
        return success

    def test_multilingual_responses(self):
        """Test that responses are in correct languages"""
        test_cases = [
            ("What are library hours?", "en"),
            ("लाइब्रेरी कब खुलती है?", "hi"),
            ("લાઇબ્રેરી કેટલા વાગ્યે ખુલે છે?", "gu")
        ]
        
        all_passed = True
        for message, expected_lang in test_cases:
            data = {
                "message": message,
                "session_id": f"{self.session_id}_{expected_lang}",
                "language": expected_lang
            }
            success, response = self.run_test(f"Multilingual Response - {expected_lang}", "POST", "chat", 200, data)
            if success and response.get('language') == expected_lang:
                print(f"✅ Response in correct language: {expected_lang}")
            else:
                print(f"⚠️  Response language mismatch - expected: {expected_lang}, got: {response.get('language')}")
                all_passed = False
        
        return all_passed

def main():
    print("🚀 Starting Campus Lingua API Tests")
    print("=" * 50)
    
    tester = CampusLinguaAPITester()
    
    # Run all tests
    tests = [
        tester.test_root_endpoint,
        tester.test_chat_english,
        tester.test_chat_hindi,
        tester.test_chat_gujarati,
        tester.test_language_detection,
        tester.test_scholarship_query,
        tester.test_conversation_history,
        tester.test_status_endpoints,
        tester.test_error_handling,
        tester.test_multilingual_responses
    ]
    
    for test in tests:
        try:
            test()
            time.sleep(1)  # Small delay between tests
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())