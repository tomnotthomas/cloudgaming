"use strict";

var _globals = require("@jest/globals");
var _supertest = _interopRequireDefault(require("supertest"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = require('../models/User');
const {
  server
} = require('../index');
// Define base directory dynamically
const __basedir = __dirname;

//Check whether a user can be created
(0, _globals.describe)('user', () => {
  (0, _globals.describe)('Create a user', () => {
    (0, _globals.describe)('Create user should work', () => {
      (0, _globals.it)('should return a 201', async () => {
        const user = {
          email: 'buttor@example.com',
          password: 'ownefp23f',
          region: 'Richmond, Virginia, USA'
        };
        const response = await (0, _supertest.default)(server).post('/register').send(user);
        (0, _globals.expect)(response.status).toBe(201);
      });
    });
  });
  (0, _globals.afterEach)(async () => {
    try {
      const existingUser = await User.findOne({
        email: 'buttor@example.com'
      });
      if (existingUser) {
        await User.deleteOne({
          email: 'buttor@example.com'
        }); // Delete the user directly
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  });
});

//check whether there can be no duplicates for each user
(0, _globals.describe)('user', () => {
  (0, _globals.describe)('Create a user', () => {
    (0, _globals.describe)('Create a duplicate user should not work', () => {
      (0, _globals.it)('should return a 409', async () => {
        const user = {
          email: 'brad@example.com',
          password: 'owne32efefp23f',
          region: 'Richmond, Virginia, USA'
        };
        await (0, _supertest.default)(server).post('/register').send(user);
        const duplicateResponse = await (0, _supertest.default)(server).post('/register').send(user);
        (0, _globals.expect)(duplicateResponse.status).toBe(409);
      });
    });
  });
});

//Check whether a user can be created without email
(0, _globals.describe)('user', () => {
  (0, _globals.describe)('Create a user', () => {
    (0, _globals.describe)('Create user without email should not work', () => {
      (0, _globals.it)('should return a 400', async () => {
        const user = {
          password: 'ownefp2fe3f',
          region: 'Richmond, Virginia, USA'
        };
        const response = await (0, _supertest.default)(server).post('/register').send(user);
        (0, _globals.expect)(response.status).toBe(400);
      });
    });
  });
});

//Check whether a user can be created without password
(0, _globals.describe)('user', () => {
  (0, _globals.describe)('Create a user', () => {
    (0, _globals.describe)('Create user without password should not work', () => {
      (0, _globals.it)('should return a 400', async () => {
        const user = {
          email: 'buor@example.com',
          region: 'Richmond, Virginia, USA'
        };
        const response = await (0, _supertest.default)(server).post('/register').send(user);
        (0, _globals.expect)(response.status).toBe(400);
      });
    });
  });
});

//Check whether a user can be created without region
(0, _globals.describe)('user', () => {
  (0, _globals.describe)('Create a user', () => {
    (0, _globals.describe)('Create user without region should not work', () => {
      (0, _globals.it)('should return a 400', async () => {
        const user = {
          email: 'buor@example.com',
          password: 'owne32efefp23f'
        };
        const response = await (0, _supertest.default)(server).post('/register').send(user);
        (0, _globals.expect)(response.status).toBe(400);
      });
    });
  });
});

// Check the subscription of a user, for that we need to create a user first, then check initial subscription
(0, _globals.describe)('User subscription', () => {
  (0, _globals.describe)('User subscribes', () => {
    (0, _globals.describe)('User should have initial subscription status set to no', () => {
      (0, _globals.it)('should return a 404', async () => {
        const user = {
          email: 'ther@example.com',
          password: 'owdfdsnefp23f',
          region: 'Richmond, Virginia, USA'
        };
        await (0, _supertest.default)(server).post('/register').send(user);
        const checkSubscription = await (0, _supertest.default)(server).post('/checksubscription').send(user.email);
        (0, _globals.expect)(checkSubscription.status).toBe(404);
      });
    });
  });
  (0, _globals.afterEach)(async () => {
    try {
      const existingUser = await User.findOne({
        email: 'ther@example.com'
      });
      if (existingUser) {
        await User.deleteOne({
          email: 'ther@example.com'
        }); // Delete the user directly
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  });
});

//Check the subscription of a non existing user shouldn't work
(0, _globals.describe)('User subscription', () => {
  (0, _globals.describe)('User subscribes', () => {
    (0, _globals.describe)('non existing user should get a 404 when asking for subscription', () => {
      (0, _globals.it)('should return a 404', async () => {
        const user = {
          email: 'ther@example.com',
          password: 'owdfdsnefp23f',
          region: 'Frankfurt, Germany, Europe'
        };
        const checkSubscription = await (0, _supertest.default)(server).post('/checksubscription').send(user.email);
        (0, _globals.expect)(checkSubscription.status).toBe(404);
      });
    });
  });
});
(0, _globals.afterAll)(() => {
  server.close(); // Close the server after all tests are finished
});