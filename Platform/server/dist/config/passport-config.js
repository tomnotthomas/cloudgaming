"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const express = require('express');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const session = require('express-session');
function configureSessionMiddleware(app) {
  // Use the express-session middleware
  app.use(session({
    secret: 'your-secret-key',
    // Replace with a strong secret key
    resave: false,
    saveUninitialized: true
  }));

  // Initialize Passport after the express-session middleware
  app.use(passport.initialize());
  app.use(passport.session());
}
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the SteamStrategy within Passport.
passport.use(new SteamStrategy({
  returnURL: 'http://localhost:3001/auth/steam/return',
  realm: 'http://localhost:3001/',
  apiKey: process.env.REACT_APP_STEAM_API_KEY
}, function (identifier, profile, done) {
  console.log('Steam OpenID Response:', profile);
  process.nextTick(function () {
    if (!profile) {
      console.error('Profile is undefined or null');
      return done(new Error('Profile is undefined or null'));
    }
    // Here, the user's Steam profile is returned to represent the logged-in user.
    profile.identifier = identifier;
    return done(null, profile);
  });
}));
module.exports = {
  configureSessionMiddleware,
  passport
};