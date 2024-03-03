"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.virtualMachines_delete = virtualMachines_delete;
var _armCompute = require("@azure/arm-compute");
var _armNetwork = require("@azure/arm-network");
var _identity = require("@azure/identity");
var _armResources = require("@azure/arm-resources");
const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID || "NO SUBSCRIPTION ID";
const credential = new _identity.DefaultAzureCredential();
const computeClient = new _armCompute.ComputeManagementClient(credential, subscriptionId);
const networkClient = new _armNetwork.NetworkManagementClient(credential, subscriptionId);
const resourceClient = new _armResources.ResourceManagementClient(credential, subscriptionId);
async function virtualMachines_delete(resourceGroupName, virtualMachineName) {
  // Delete the VM
  await computeClient.virtualMachines.beginDeleteAndWait(resourceGroupName, virtualMachineName).then(response => console.log(`VM deleted: ${virtualMachineName}`, response)).catch(error => console.error(`Error deleting VM: ${virtualMachineName}`, error));

  // Delete OS and Data Disks
  await deleteAssociatedDisks(resourceGroupName, virtualMachineName);

  // Delete NIC and associated Public IP
  await deleteAssociatedNICs(resourceGroupName, virtualMachineName);
}
async function deleteAssociatedDisks(resourceGroupName, virtualMachineName) {
  console.log(`Attempting to delete associated disks for VM: ${virtualMachineName} in resource group: ${resourceGroupName}`);

  // List all disks in the resource group
  for await (const resource of resourceClient.resources.listByResourceGroup(resourceGroupName)) {
    // Ensure we're looking at disks specifically and the resource is tagged with the vmName
    if (resource.type === "Microsoft.Compute/disks" && resource.tags && resource.tags.vmName === virtualMachineName) {
      console.log(`Found disk associated with ${virtualMachineName}: ${resource.name}, attempting to delete...`);
      try {
        await computeClient.disks.beginDeleteAndWait(resourceGroupName, resource.name);
        console.log(`Successfully deleted disk: ${resource.name}`);
      } catch (error) {
        console.error(`Failed to delete disk: ${resource.name}. Error: ${error.message}`);
      }
    }
  }
}
async function deleteAssociatedNICs(resourceGroupName, virtualMachineName) {
  // List all network interfaces in the resource group
  for await (const nic of networkClient.networkInterfaces.list(resourceGroupName)) {
    if (nic.tags && nic.tags.vmName === virtualMachineName) {
      // Disassociate Public IP (if any) before deletion
      if (nic.ipConfigurations && nic.ipConfigurations[0].publicIPAddress) {
        const publicIpId = nic.ipConfigurations[0].publicIPAddress.id || "NO PUBLIC IP ID";
        const publicIpName = publicIpId.split('/').pop() || "NO PUBLICIP NAME"; // Extract the name from the full ID

        // Disassociate the public IP from the NIC
        console.log(`Disassociating Public IP: ${publicIpName} from NIC: ${nic.name}`);
        nic.ipConfigurations[0].publicIPAddress = null;
        await networkClient.networkInterfaces.beginCreateOrUpdateAndWait(resourceGroupName, nic.name, nic);

        // Attempt to delete the Public IP after disassociation
        console.log(`Deleting Public IP: ${publicIpName}`);
        await networkClient.publicIPAddresses.beginDeleteAndWait(resourceGroupName, publicIpName);
        console.log("Public IP deleted");
      }

      // Delete the NIC after Public IP has been disassociated and deleted
      console.log(`Deleting NIC: ${nic.name}`);
      await networkClient.networkInterfaces.beginDeleteAndWait(resourceGroupName, nic.name);
      console.log("NIC deleted");
    }
  }
}