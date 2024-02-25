"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const express = require('express');
const dotenv = require('dotenv');
const User = require('../models/User');
const getVmZone = require('../helpers/instance-zone-translator');
const cloudVmStarter = require('../google/cloud-vm-start');
dotenv.config();
const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_PROJ_ID;
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
      const vmZone = getVmZone(user.zone);
      const vmName = user.virtualMachine;
      console.log(vmZone, vmName);
      try {
        await cloudVmStarter.main(vmName, GOOGLE_CLOUD_PROJECT_ID, vmZone);
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