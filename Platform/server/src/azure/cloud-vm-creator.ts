import 'dotenv/config';
import { DefaultAzureCredential } from "@azure/identity";
import { ComputeManagementClient, VirtualMachine } from "@azure/arm-compute";
import { NetworkManagementClient, VirtualNetwork, Subnet, NetworkInterface } from "@azure/arm-network";
import { ResourceManagementClient, ResourceGroup } from "@azure/arm-resources";

export async function main(vmName: string, location: string) {
    console.log("vmName:", vmName);
    console.log("Region:", location);

    // Global variables
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID || "Problem with subscriptionID";
    const resourceGroupName = process.env.AZURE_RESOURCE_GROUP_DEV || "Problem with Resource Group";
    const virtualMachineName = vmName;
    const interfaceName = `networkinterface_${vmName}`;
    let networkName = `vnet-${location}`;
    let subnetName =  `subnet-${location}`;

    // Authentication and client initialization
    const credential = new DefaultAzureCredential();
    const computeClient = new ComputeManagementClient(credential, subscriptionId);
    const networkClient = new NetworkManagementClient(credential, subscriptionId);
    const resourceClient = new ResourceManagementClient(credential, subscriptionId);

    // Find or Create VNet and Subnet
    await findOrCreateVNetAndSubnet(networkClient, resourceGroupName, location, networkName, subnetName, vmName);

    // Create Public IP
    const publicIPId = await createPublicIP(networkClient, resourceGroupName, virtualMachineName, location, vmName);

    // Create Network Interface
    const nicId = await createNetworkInterface(networkClient, resourceGroupName, location, interfaceName, networkName, subnetName, publicIPId, virtualMachineName) ;

    // Create Virtual Machine
    await createVirtualMachine(computeClient, resourceGroupName, virtualMachineName, location, nicId);

    //Tag the OS disk after VM creation
    await tagOsDiskAfterVmCreation(computeClient, resourceGroupName, vmName)
    
    console.log("Deployment completed.");
}

async function findOrCreateVNetAndSubnet(networkClient, resourceGroupName, location, networkName, subnetName, vmName) {
    let foundVNet = null;

    // List all VNets in the resource group and find one in the specified location
    for await (const vnet of networkClient.virtualNetworks.list(resourceGroupName)) {
        if (vnet.location === location) {
            foundVNet = vnet;
            break; // Break the loop if we find a matching VNet
        }
    }

    // If no VNet found in the specified location, create one
    if (!foundVNet) {
        console.log(`No VNet found in ${location}. Creating VNet...`);
        await createVNet(networkClient, resourceGroupName, location, networkName, vmName);
        foundVNet = { name: networkName }; // Assume creation was successful
    }

    // Initialize variable to keep track of found subnet
    let foundSubnet = null;

    // List all subnets in the found VNet and find one with the specified name
    for await (const subnet of networkClient.subnets.list(resourceGroupName, foundVNet.name)) {
        if (subnet.name === subnetName) {
            foundSubnet = subnet;
            break; // Break the loop if we find the matching subnet
        }
    }

    // If no subnet found with the specified name, create one
    if (!foundSubnet) {
        console.log(`No subnet found in VNet ${foundVNet.name}. Creating subnet...`);
        await createSubnet(networkClient, resourceGroupName, foundVNet.name, subnetName, vmName);
        // Assume creation was successful
    }
}

async function createVNet(networkClient, resourceGroupName, location, vnetName, vmName) {
    const vnetParameters = {
        location: location,
        addressSpace: {
            addressPrefixes: ['10.0.0.0/16']
        },
        tags: {
            "vmName": vmName,
            "resourceType": "VNet",

        }
    };
    await networkClient.virtualNetworks.beginCreateOrUpdateAndWait(resourceGroupName, vnetName, vnetParameters);
    console.log(`VNet ${vnetName} created.`);
}

async function createSubnet(networkClient, resourceGroupName, vnetName, subnetName, vmName) {
    const subnetParameters = {
        addressPrefix: '10.0.0.0/24',
        tags: {
            "vmName": vmName,
            "resourceType": "Subnet",

        }
    };
    await networkClient.subnets.beginCreateOrUpdateAndWait(resourceGroupName, vnetName, subnetName, subnetParameters);
    console.log(`Subnet ${subnetName} created in VNet ${vnetName}.`);
}

async function createPublicIP(networkClient, resourceGroupName, publicIPName, location, vmName) {
    const publicIPParameters = {
        location: location,
        publicIPAllocationMethod: "Dynamic",
        tags: {
            "vmName": vmName,
            "resourceType": "PublicIP",
        }
    };
    const operationResult = await networkClient.publicIPAddresses.beginCreateOrUpdateAndWait(resourceGroupName, publicIPName, publicIPParameters);
    console.log(`Public IP ${publicIPName} created.`);
    return operationResult.id;
}

async function createNetworkInterface(networkClient, resourceGroupName, location, interfaceName, networkName, subnetName, publicIPId, virtualMachineName) {
    const nicParameters = {
        location: location,
        ipConfigurations: [{
            name: "MyIpConfig",
            subnet: { id: `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/virtualNetworks/${networkName}/subnets/${subnetName}` },
            publicIPAddress: { id: publicIPId }
        }],
        tags: {
            "vmName": virtualMachineName,
            "resourceType": "NetworkInterface",
        }
    };
    const nic = await networkClient.networkInterfaces.beginCreateOrUpdateAndWait(resourceGroupName, interfaceName, nicParameters);
    console.log(`Network interface ${interfaceName} created.`);
    return nic.id;
}

async function createVirtualMachine(computeClient, resourceGroupName, virtualMachineName, location, nicId) {
    const vmParameters = {
        location: location,
        hardwareProfile: { vmSize: "Standard_DS1_v2" },
        storageProfile: {
            imageReference: {
                publisher: "MicrosoftWindowsServer",
                offer: "WindowsServer",
                sku: "2019-Datacenter",
                version: "latest",
            },
            osDisk: {
                caching: "ReadWrite",
                managedDisk: { storageAccountType: "Standard_LRS" },
                createOption: "FromImage",
            },
        },
        osProfile: {
            adminUsername: process.env.OS_PROFILE_ADMIN_COMPUTER_USER_NAME || "exampleuser",
            computerName: process.env.OS_PROFILE_COMPUTER_NAME || "examplecomputer",
            adminPassword: process.env.OS_PROFILE_COMPUTER_PASSWORD || "F§§F§Sdcd12!42fvcd12",
        },
        networkProfile: { networkInterfaces: [{ id: nicId, primary: true }] },
    };
    await computeClient.virtualMachines.beginCreateOrUpdateAndWait(resourceGroupName, virtualMachineName, vmParameters);
    console.log(`Virtual machine ${virtualMachineName} created.`);
}

async function tagOsDiskAfterVmCreation(computeClient, resourceGroupName, vmName) {
    // Retrieve the created VM to get details about the OS disk
    const vm = await computeClient.virtualMachines.get(resourceGroupName, vmName);
    const osDiskId = vm.storageProfile.osDisk.managedDisk.id;

    // Extract the disk name from the disk ID
    const diskName = osDiskId.split('/').pop();

    // Retrieve the current disk resource to update it
    const disk = await computeClient.disks.get(resourceGroupName, diskName);

    // Update the disk with tags
    const diskUpdate = {
        ...disk,
        tags: {
            ...disk.tags,
            "vmName": vmName,
            "resourceType": "osDisk",
        }
    };

    // Apply the update using the beginCreateOrUpdate method
    await computeClient.disks.beginCreateOrUpdateAndWait(resourceGroupName, diskName, diskUpdate);
    console.log(`OS Disk for VM ${vmName} tagged successfully.`);
}
