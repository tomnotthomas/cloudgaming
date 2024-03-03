import { describe, it, expect, jest, beforeEach, afterEach, afterAll } from '@jest/globals';
import supertest from 'supertest';
const { setPaymentStatus } = require('../../controllers/paymentController');
const User = require ('../../models/User'); // Import the User model if it's not already imported
const { server } = require('../../index');

// Mock the User model
jest.mock('../../models/User');

describe('Payment Controller', () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Delete the user created during the test
    await User.deleteOne({ email: 'test@example.com' });
  });

  it('should set payment status and create VM for a user', async () => {
    // Mock the user data
    const userData = {
      email: 'test@example.com',
      password: 'password123', // Add a sample password
      region: 'Frankfurt, Germany, Europe' // Add a sample zone
    };

    // Create a new user with the specified data

    const response = await supertest(server).post('/register').send(userData);
 
    expect(response.status).toBe(201);

    // Mock the request and response objects
    const req = {
      body: {
        userEmail: 'test@example.com'
      }
    };
    const res = {
      status: jest.fn().mockReturnValue({ send: jest.fn() }), // Return an object with a mock send function
      json: jest.fn()
    };

    // Call the payment status function
    await setPaymentStatus(req, res);

    // Expectations
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
  }, 8000);
});

afterAll(() => {
  server.close(); // Close the server after all tests are finished
});


//TODO each user should only have one vm. Ensure that the user only pays when 