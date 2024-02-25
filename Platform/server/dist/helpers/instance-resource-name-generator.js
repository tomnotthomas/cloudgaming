"use strict";

const User = require('../models/User');

// Generates a random VM name
async function generateVmName() {
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = 15;
  const prefix = 'vm';
  let result;
  do {
    result = prefix;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }
  } while (!(await isVmNameUnique(result)));
  return result;
}

// Checks whether the VM name is unique
async function isVmNameUnique(vmName) {
  try {
    const existingVm = await User.findOne({
      virtualMachine: vmName
    });
    return !existingVm; // Returns true if the name is unique, false otherwise
  } catch (error) {
    console.error('Error checking uniqueness in the database:', error);
    return false; // In case of an error, assume the name is not unique
  }
}
module.exports = generateVmName;