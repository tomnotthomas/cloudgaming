"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const express = require('express');
const dotenv = require('dotenv');
const User = require('../models/User');
const interfaces = require('../controllers/interfaces/interfaces');
const generateVmName = require('../helpers/instance-resource-name-generator');
const vmCreationProcess = require('../helpers/instance-resource-vm-creation-process');
dotenv.config();
const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_PROJ_ID;
const setPaymentStatus = async (req, res) => {
  try {
    const email = req.body.userEmail;
    const user = await User.findOne({
      email: email
    });
    if (!user) {
      res.status(404).send({
        error: '404',
        message: 'User not found'
      });
      return;
    }

    // Check if user already has a VM
    if (!user.virtualMachine) {
      const vm = await generateVmName();
      user.virtualMachine = vm;
      user.SubscriptionStatus = true;
      await user.save();

      // Converting user to TypeScript interface type
      const userInterface = user.toObject(); // Assuming toObject() returns the correct format

      const vmCreationResult = await vmCreationProcess.createAndStopVM(userInterface);
      if (vmCreationResult === '500') {
        res.status(500).json({
          message: 'Error creating VM'
        });
        return;
      }
    }

    // This is the response that will be sent back.
    res.json({
      success: true,
      redirectTo: '/steam-login'
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({
        message: err.message
      });
    } else {
      res.status(500).json({
        message: 'An unknown error occurred'
      });
    }
  }
};
module.exports = {
  setPaymentStatus
};