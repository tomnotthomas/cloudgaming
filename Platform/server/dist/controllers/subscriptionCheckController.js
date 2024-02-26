"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkForSubscription = void 0;
const express = require('express');
const User = require("../models/User");
const dotenv = require('dotenv');
dotenv.config();
const checkForSubscription = async (req, res) => {
  const email = req.body.userEmail;
  const user = await User.findOne({
    email: email
  });
  if (!user) {
    return res.status(404).send({
      error: '404',
      SubscriptionStatus: false
    });
  }
  if (user.SubscriptionStatus) {
    return res.status(200).send({
      SubscriptionStatus: true
    });
  }
  return res.status(404).send({
    error: '404',
    SubscriptionStatus: false
  });
};
exports.checkForSubscription = checkForSubscription;