export{}
const dotenv = require('dotenv');
const { getVmZone } = require('./instance-zone-translator');
const { instanceConfigurator } = require('./instance-resource-template');
const { User } = require('../controllers/interfaces/interfaces');

dotenv.config();

const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_PROJ_ID;

// Create an async function for initial VM creation in register process,
// that creates a VM, and stops it afterwards. Returns '200' for success or '500' for failure.
async function createAndStopVM(user:any) {
  // VM creation process
  const vmZone = getVmZone(user.zone);
  const vmName = user.virtualMachine;
  const configuredResource = instanceConfigurator(vmZone, vmName);
  console.log(vmZone, vmName, configuredResource);

  const cloudVmCreator = require('../google/cloud-vm-creator.cjs');
  const cloudVmStopper = require('../google/cloud-vm-stop.cjs');

  try {
    await cloudVmCreator.main(configuredResource, GOOGLE_CLOUD_PROJECT_ID, vmZone);
    await cloudVmStopper.main(vmName, GOOGLE_CLOUD_PROJECT_ID, vmZone);
    return '200';
  } catch (error) {
    console.error('Error calling main function:', error);
    return '500';
  }
}

module.exports = { createAndStopVM };
