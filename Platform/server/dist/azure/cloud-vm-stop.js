"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.virtualMachinesDeallocate = virtualMachinesDeallocate;
var _identity = require("@azure/identity");
var _armCompute = require("@azure/arm-compute");
// Your Azure subscription ID
const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID || "<your-subscription-id>";

// Initialize the Azure credentials
const credential = new _identity.DefaultAzureCredential();

// Initialize the Compute Management Client with your subscription ID and credentials
const client = new _armCompute.ComputeManagementClient(credential, subscriptionId);

// Function to deallocate a virtual machine
async function virtualMachinesDeallocate(resourceGroupName, virtualMachineName) {
  try {
    await client.virtualMachines.beginDeallocateAndWait(resourceGroupName, virtualMachineName);
    console.log("VM SUCCESSFULLY STOPPED");
  } catch (error) {
    console.error("An error occurred while deallocating the VM:", error);
  }
}