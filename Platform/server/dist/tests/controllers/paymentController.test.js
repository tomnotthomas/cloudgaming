"use strict";

var _globals = require("@jest/globals");
var _supertest = _interopRequireDefault(require("supertest"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  setPaymentStatus
} = require('../../controllers/paymentController');
const User = require('../../models/User'); // Import the User model if it's not already imported
const {
  server
} = require('../../index');

// Mock the User model
_globals.jest.mock('../../models/User');
(0, _globals.describe)('Payment Controller', () => {
  (0, _globals.beforeEach)(() => {
    // Reset the mock implementation before each test
    _globals.jest.clearAllMocks();
  });
  (0, _globals.afterEach)(async () => {
    // Delete the user created during the test
    await User.deleteOne({
      email: 'test@example.com'
    });
  });
  (0, _globals.it)('should set payment status and create VM for a user', async () => {
    // Mock the user data
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      // Add a sample password
      region: 'Frankfurt, Germany, Europe' // Add a sample zone
    };

    // Create a new user with the specified data

    const response = await (0, _supertest.default)(server).post('/register').send(userData);
    (0, _globals.expect)(response.status).toBe(201);

    // Mock the request and response objects
    const req = {
      body: {
        userEmail: 'test@example.com'
      }
    };
    const res = {
      status: _globals.jest.fn().mockReturnValue({
        send: _globals.jest.fn()
      }),
      // Return an object with a mock send function
      json: _globals.jest.fn()
    };

    // Call the payment status function
    await setPaymentStatus(req, res);

    // Expectations
    (0, _globals.expect)(User.findOne).toHaveBeenCalledWith({
      email: 'test@example.com'
    });
  }, 8000);
});
(0, _globals.afterAll)(() => {
  server.close(); // Close the server after all tests are finished
});

//TODO each user should only have one vm. Ensure that the user only pays when