"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;
require("dotenv/config");
var _identity = require("@azure/identity");
var _armCompute = require("@azure/arm-compute");
var _armNetwork = require("@azure/arm-network");
var _armResources = require("@azure/arm-resources");
console.log(process.env.AZURE_SUBSCRIPTION_ID);
console.log(process.env.AZURE_RESOURCE_GROUP_DEV);
console.log(process.env.AZURE_SUBNET_DEV);
console.log(process.env.AZURE_VIRTUAL_NETWORK_DEV);
async function main(location) {
  // Global variables
  const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID || "Problem with subscriptionID";
  const resourceGroupName = process.env.AZURE_RESOURCE_GROUP_DEV || "Problem with Resource Group";
  const virtualMachineName = "testVirtualMachine";
  const subnetName = process.env.AZURE_SUBNET_DEV || "Problem with subnet";
  const interfaceName = "testNetworkInterface";
  const networkName = process.env.AZURE_VIRTUAL_NETWORK_DEV || "Problem with virtual network";

  //TODO Needs to go into resource template function
  location = location;

  // Authentication and client initialization
  const credential = new _identity.DefaultAzureCredential();
  const computeClient = new _armCompute.ComputeManagementClient(credential, subscriptionId);
  const networkClient = new _armNetwork.NetworkManagementClient(credential, subscriptionId);
  const resourceClient = new _armResources.ResourceManagementClient(credential, subscriptionId);
  async function createPublicIP() {
    const publicIPName = "gaming_public_ip_dynamic";
    const publicIPParameters = {
      location: location,
      publicIPAllocationMethod: "Dynamic"
    };
    console.log("Creating public IP address...");
    const operationResult = await networkClient.publicIPAddresses.beginCreateOrUpdateAndWait(resourceGroupName, publicIPName, publicIPParameters);
    console.log("Public IP address created.");
    return operationResult.id;
  }
  async function createNetworkInterface() {
    const publicIPId = await createPublicIP(); // Create Public IP and get its ID
    const nicParameter = {
      location: location,
      ipConfigurations: [{
        name: "MyIpConfig",
        subnet: {
          id: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/virtualNetworks/${networkName}/subnets/${subnetName}`
        },
        publicIPAddress: {
          id: publicIPId
        } // Reference the Public IP Address here
      }]
    };
    console.log("Creating network interface...");
    const nic = await networkClient.networkInterfaces.beginCreateOrUpdateAndWait(resourceGroupName, interfaceName, nicParameter);
    console.log("Network interface created.");
    return nic.id;
  }
  async function createVirtualMachine(nicId) {
    const vmParameter = {
      location: location,
      hardwareProfile: {
        vmSize: "Standard_DS1_v2"
      },
      storageProfile: {
        imageReference: {
          sku: "2019-Datacenter",
          publisher: "MicrosoftWindowsServer",
          version: "latest",
          offer: "WindowsServer"
        },
        osDisk: {
          caching: "ReadWrite",
          managedDisk: {
            storageAccountType: "Standard_LRS"
          },
          name: "myVMosdisk",
          createOption: "FromImage"
        }
      },
      osProfile: {
        adminUsername: "azureuser",
        computerName: "myVM",
        adminPassword: "Pa$$w0rd1234"
      },
      networkProfile: {
        networkInterfaces: [{
          id: nicId,
          primary: true
        }]
      }
    };
    console.log("Creating virtual machine...");
    await computeClient.virtualMachines.beginCreateOrUpdateAndWait(resourceGroupName, virtualMachineName, vmParameter);
    console.log("Virtual machine created.");
  }
  const nicId = await createNetworkInterface();
  await createVirtualMachine(nicId);
}
main("eastus");