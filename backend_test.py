import requests
import sys
import json
from datetime import datetime

class ArtemCreationsAPITester:
    def __init__(self, base_url="https://artisanbags-1.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.session_id = f"test_session_{datetime.now().strftime('%H%M%S')}"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            if not success:
                details += f", Expected: {expected_status}"
                try:
                    error_data = response.json()
                    details += f", Error: {error_data.get('detail', 'Unknown error')}"
                except:
                    details += f", Response: {response.text[:100]}"

            self.log_test(name, success, details)
            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root"""
        return self.run_test("API Root", "GET", "", 200)

    def test_seed_data(self):
        """Test seeding sample data"""
        return self.run_test("Seed Data", "POST", "seed", 200)

    def test_get_products(self):
        """Test getting all products"""
        return self.run_test("Get All Products", "GET", "products", 200)

    def test_get_featured_products(self):
        """Test getting featured products"""
        return self.run_test("Get Featured Products", "GET", "products?featured=true", 200)

    def test_get_products_by_category(self):
        """Test getting products by category"""
        return self.run_test("Get Products by Category", "GET", "products?category=tote", 200)

    def test_get_single_product(self):
        """Test getting a single product"""
        return self.run_test("Get Single Product", "GET", "products/prod_001", 200)

    def test_get_nonexistent_product(self):
        """Test getting a non-existent product"""
        return self.run_test("Get Non-existent Product", "GET", "products/nonexistent", 404)

    def test_cart_operations(self):
        """Test cart operations"""
        # Get empty cart
        success, _ = self.run_test("Get Empty Cart", "GET", f"cart/{self.session_id}", 200)
        if not success:
            return False

        # Add item to cart
        success, _ = self.run_test(
            "Add to Cart", 
            "POST", 
            f"cart/{self.session_id}/add",
            200,
            {"product_id": "prod_001", "quantity": 2}
        )
        if not success:
            return False

        # Get cart with items
        success, cart_data = self.run_test("Get Cart with Items", "GET", f"cart/{self.session_id}", 200)
        if not success:
            return False

        # Update cart item
        success, _ = self.run_test(
            "Update Cart Item",
            "PUT",
            f"cart/{self.session_id}/update",
            200,
            {"product_id": "prod_001", "quantity": 1}
        )
        if not success:
            return False

        # Remove item from cart
        success, _ = self.run_test(
            "Remove from Cart",
            "DELETE",
            f"cart/{self.session_id}/remove/prod_001",
            200
        )
        return success

    def test_user_registration(self):
        """Test user registration"""
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            {
                "email": test_email,
                "password": "TestPass123!",
                "name": "Test User"
            }
        )
        if success and 'token' in response:
            self.token = response['token']
        return success

    def test_user_login(self):
        """Test user login with existing user"""
        # First register a user
        test_email = f"login_test_{datetime.now().strftime('%H%M%S')}@example.com"
        reg_success, reg_response = self.run_test(
            "Register for Login Test",
            "POST",
            "auth/register",
            200,
            {
                "email": test_email,
                "password": "TestPass123!",
                "name": "Login Test User"
            }
        )
        
        if not reg_success:
            return False

        # Now test login
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            {
                "email": test_email,
                "password": "TestPass123!"
            }
        )
        if success and 'token' in response:
            self.token = response['token']
        return success

    def test_get_user_profile(self):
        """Test getting user profile"""
        if not self.token:
            self.log_test("Get User Profile", False, "No auth token available")
            return False
        
        return self.run_test("Get User Profile", "GET", "auth/me", 200)

    def test_contact_form(self):
        """Test contact form submission"""
        return self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            {
                "name": "Test User",
                "email": "test@example.com",
                "subject": "Test Message",
                "message": "This is a test message from the API tester."
            }
        )

    def test_checkout_flow(self):
        """Test checkout flow (without actual payment)"""
        # Add item to cart first
        add_success, _ = self.run_test(
            "Add Item for Checkout",
            "POST",
            f"cart/{self.session_id}/add",
            200,
            {"product_id": "prod_001", "quantity": 1}
        )
        
        if not add_success:
            return False

        # Test checkout session creation
        success, response = self.run_test(
            "Create Checkout Session",
            "POST",
            "checkout/create-session",
            200,
            {
                "email": "test@example.com",
                "cart_session_id": self.session_id,
                "shipping_address": None
            },
            headers={"Origin": "https://artisanbags-1.preview.emergentagent.com"}
        )
        return success

    def run_all_tests(self):
        """Run all tests"""
        print("🧪 Starting ArtemCreations API Tests...")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)

        # Basic API tests
        self.test_root_endpoint()
        self.test_seed_data()
        
        # Product tests
        self.test_get_products()
        self.test_get_featured_products()
        self.test_get_products_by_category()
        self.test_get_single_product()
        self.test_get_nonexistent_product()
        
        # Cart tests
        self.test_cart_operations()
        
        # Auth tests
        self.test_user_registration()
        self.test_user_login()
        self.test_get_user_profile()
        
        # Contact form test
        self.test_contact_form()
        
        # Checkout test
        self.test_checkout_flow()

        # Print results
        print("=" * 60)
        print(f"📊 Tests completed: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed")
            return 1

def main():
    tester = ArtemCreationsAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())