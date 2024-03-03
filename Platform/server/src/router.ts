import { create } from "domain";

const express = require('express');
const { configureSessionMiddleware, passport } = require('./config/passport-config'); // Destructure the exports

const steamController = require('./controllers/steamController');
const userController = require('./controllers/userController');
const authMiddlewares = require('./middlewares/auth');
const paymentController = require('./controllers/paymentController');
const stopVmController = require('./controllers/stopVmController');
const startVmController = require('./controllers/startVmController');
const steamIDController = require('./controllers/steamIDController');
const subscriptionCheckController = require('./controllers/subscriptionCheckController');
const paypalController = require('./controllers/PayPalController')
const deletePaidUserController = require('./controllers/deleteUserController')
const router = express.Router();

// Route definitions
router.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/login' }),
  function(req:any, res:any) { res.redirect('/') });
// Other routes...

// Export the router
module.exports = router;


// Route definitions
router.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/login' }),
  function(req:any, res:any) { res.redirect('/') });
router.post('/steamgames', steamController.getSteamGames);
router.post('/register', userController.createUser);
router.post('/auth', userController.authUser);
router.get('/auth/steam/return', authMiddlewares.authByToken, steamController.getSteamId);
router.post('/setpaiduser', paymentController.setPaymentStatus);
router.post('/stopvm', stopVmController.stopVm);
router.post('/startvm', startVmController.startVm);
router.post('/checksteamid', steamIDController.checkSteamID);
router.post('/checksubscription', subscriptionCheckController.checkForSubscription);
router.post('/api/paypal/create-subscription', paypalController.createPaypalSubscription)
router.delete('/paiduser', deletePaidUserController.deleteUser )
// Export the router
module.exports = router;
