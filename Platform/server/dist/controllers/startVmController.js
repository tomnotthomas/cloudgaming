"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const express = require('express');
const dotenv = require('dotenv');
const User = require('../models/User');
const cloudVmStarter = require('../azure/cloud-vm-start');
dotenv.config();
const startVm = async (req, res) => {
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
    if (user.virtualMachine) {
      // Collect the arguments for cloudVmStarter

      const vmName = user.virtualMachine;
      const resourceGroup = process.env.AZURE_RESOURCE_GROUP_DEV;
      try {
        await cloudVmStarter.main(resourceGroup, vmName);
      } catch (error) {
        console.error('Error calling main function:', error);
        res.status(500).json({
          message: 'Error starting vm'
        });
        return;
      }
    } else {
      res.status(400).json({
        message: "User does not have a machine yet."
      });
      return;
    }
    res.json({
      success: true
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
  startVm
};