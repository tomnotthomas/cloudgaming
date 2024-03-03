import { DefaultAzureCredential } from "@azure/identity";
import { ComputeManagementClient } from "@azure/arm-compute";

// Your Azure subscription ID
const subscriptionId: string = process.env.AZURE_SUBSCRIPTION_ID || "<your-subscription-id>";

// Initialize the Azure credentials
const credential = new DefaultAzureCredential();

// Initialize the Compute Management Client with your subscription ID and credentials
const client = new ComputeManagementClient(credential, subscriptionId);

// Function to deallocate a virtual machine
export async function virtualMachinesDeallocate(resourceGroupName: string, virtualMachineName: string): Promise<void> {
    try {
        await client.virtualMachines.beginDeallocateAndWait(resourceGroupName, virtualMachineName);
        console.log("VM SUCCESSFULLY STOPPED");
    } catch (error) {
        console.error("An error occurred while deallocating the VM:", error);
    }
}
