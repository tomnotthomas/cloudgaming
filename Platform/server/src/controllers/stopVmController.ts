const express = require('express');
const dotenv = require('dotenv');
const User = require('../models/User');
import { virtualMachinesDeallocate } from '../azure/cloud-vm-stop'
dotenv.config();


export const stopVm = async (req:any, res:any) => {
  try {
    const email = req.body.userEmail;
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).send({ error: '404', message: 'User not found' });
      return;
    }

    // Check if user already has a VM
    if (user.virtualMachine) {
      // Collect the arguments for cloudVMStopper
      const vmName = user.virtualMachine;
      const resourceGroup = process.env.AZURE_RESOURCE_GROUP_DEV || "NO RESOURCE GROUP"


      try {
        await virtualMachinesDeallocate(resourceGroup, vmName);
      } catch (error) {
        console.error('Error calling main function:', error);
        res.status(500).json({ message: 'Error stopping vm' });
        return;
      }
    } else {
      res.status(400).json({ message: "User does not have a machine yet." });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};
