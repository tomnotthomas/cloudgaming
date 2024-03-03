"use strict";

const express = require("express");
const {
  createSubscription
} = require("../models/paypal");
const User = require("../models/User");
const router = express.Router();
const createPaypalSubscription = async (req, res) => {
  const {
    userAction,
    userEmail
  } = req.body;
  try {
    const subscriptionResponse = await createSubscription(userAction, userEmail);
    if (res.status(200)) {}
    res.json(subscriptionResponse);
  } catch (error) {
    console.error("Failed to create subscription:", error);
    res.status(500).json({
      error: "Failed to create subscription."
    });
  }
};
module.exports = {
  createPaypalSubscription
};