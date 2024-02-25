import { describe, it, expect, afterEach, afterAll } from '@jest/globals';
const User = require('../models/User');
import supertest from 'supertest';
const {server} = require('../index');

import path from 'path';

// Define base directory dynamically
const __basedir = __dirname;


//Check whether a user can be created
describe('user', () => {
  describe('Create a user', () => {
    describe('Create user should work', () => {
      it('should return a 201', async () => {
        const user = {
          email: 'buttor@example.com',
          password: 'ownefp23f',
          zone: 'Frankfurt, Germany, Europe'
        };
      
        const response = await supertest(server).post('/register').send(user);
 
        expect(response.status).toBe(201);
      });
    });
  });
  afterEach(async () => {
    try {
      const existingUser = await User.findOne({ email: 'buttor@example.com' });
      if (existingUser) {
        await User.deleteOne({ email: 'buttor@example.com' }); // Delete the user directly
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  });
});

//check whether there can be no duplicates for each user
describe('user', () => {
  describe('Create a user', () => {
    describe('Create a duplicate user should not work', () => {
      it('should return a 409', async () => {
        const user = {
          email: 'brad@example.com',
          password: 'owne32efefp23f',
          zone: 'Frankfurt, Germany, Europe'
        };
      
        await supertest(server).post('/register').send(user);
        const duplicateResponse = await supertest(server).post('/register').send(user);

        expect(duplicateResponse.status).toBe(409);
      });
    });
  });
});


//Check whether a user can be created without email
describe('user', () => {
  describe('Create a user', () => {
    describe('Create user without email should not work', () => {
      it('should return a 400', async () => {
        const user = {
          password: 'ownefp2fe3f',
          zone: 'Frankfurt, Germany, Europe'
        };
       
        const response = await supertest(server).post('/register').send(user);
 
        expect(response.status).toBe(400);
      });
    });
  });
});


//Check whether a user can be created without password
describe('user', () => {
  describe('Create a user', () => {
    describe('Create user without password should not work', () => {
      it('should return a 400', async () => {
        const user = {
          email: 'buor@example.com',
          zone: 'Frankfurt, Germany, Europe'
        };
       
        const response = await supertest(server).post('/register').send(user);
 
        expect(response.status).toBe(400);
      });
    });
  });
});

//Check whether a user can be created without zone
describe('user', () => {
  describe('Create a user', () => {
    describe('Create user without zone should not work', () => {
      it('should return a 400', async () => {
        const user = {
          email: 'buor@example.com',
          password: 'owne32efefp23f',
        };
     
        const response = await supertest(server).post('/register').send(user);
 
        expect(response.status).toBe(400);
      });
    });
  });
});




// Check the subscription of a user, for that we need to create a user first, then check initial subscription
describe ( 'User subscription', ()=> {
  describe('User subscribes', () => {
    describe('User should have initial subscription status set to no', () => {
      it('should return a 404', async() => {
        const user = {
          email: 'ther@example.com',
          password: 'owdfdsnefp23f',
          zone: 'Frankfurt, Germany, Europe'
        };
        
        await supertest(server).post('/register').send(user);
        const checkSubscription = await supertest(server).post('/checksubscription') .send(user.email)
        
        expect(checkSubscription.status).toBe(404);
      })
    })
  })
  afterEach(async () => {
    try {
      const existingUser = await User.findOne({ email: 'ther@example.com' });
      if (existingUser) {
        await User.deleteOne({ email: 'ther@example.com' }); // Delete the user directly
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  });
});



//Check the subscription of a non existing user shouldn't work
describe ( 'User subscription', ()=> {
  describe('User subscribes', () => {
    describe('non existing user should get a 404 when asking for subscription', () => {
      it('should return a 404', async() => {
        const user = {
          email: 'ther@example.com',
          password: 'owdfdsnefp23f',
          zone: 'Frankfurt, Germany, Europe'
        };
        
        const checkSubscription = await supertest(server).post('/checksubscription') .send(user.email)
        
        expect(checkSubscription.status).toBe(404);
      })
    })
  })
});

afterAll(() => {
  server.close(); // Close the server after all tests are finished
});