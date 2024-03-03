"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.virtualMachinesStart = virtualMachinesStart;
var _armCompute = require("@azure/arm-compute");
var _identity = require("@azure/identity");
// Initialize the ComputeManagementClient with DefaultAzureCredential
const credential = new _identity.DefaultAzureCredential();
const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID || "THERE IS NO SUBSCRIPTION ID"; // Ensure your environment variable is set
const client = new _armCompute.ComputeManagementClient(credential, subscriptionId);
async function virtualMachinesStart(resourceGroupName, virtualMachineName) {
  try {
    const response = await client.virtualMachines.beginStartAndWait(resourceGroupName, virtualMachineName);
    console.log("VM start initiated successfully.", response);
  } catch (error) {
    console.error("Error starting VM:", error);
  }
}