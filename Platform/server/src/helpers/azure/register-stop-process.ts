export{}
const dotenv = require('dotenv');
const { getVmRegion } = require('./instance-region-translator');
const  instanceConfigurator = require('./instance-resource-template');
const { User } = require('../../controllers/interfaces/interfaces');
import {virtualMachinesDeallocate} from '../../azure/cloud-vm-stop'
dotenv.config();


// Create an async function for initial VM creation in register process,
// that creates a VM, and stops it afterwards. Returns '200' for success or '500' for failure.
export async function createAndStopVM(user:any) {
  // VM creation process
  const vmRegion = getVmRegion(user.region);
  const vmName = user.virtualMachine;
  const resourceGroup = process.env.AZURE_RESOURCE_GROUP_DEV || "NO RESOURCE GROUP MENTIONED"

  const cloudVmCreator = require('../../azure/cloud-vm-creator');
  //TODO CREATE CLOUD VM STOP

  try {
    console.log("VM REGION");
    console.log(vmRegion);
    await cloudVmCreator.main(vmName, vmRegion);
    await virtualMachinesDeallocate(resourceGroup, vmName);
    return '200';
  } catch (error) {
    console.error('Error calling main function:', error);
    return '500';
  }
}

