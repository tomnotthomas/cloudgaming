import { ComputeManagementClient } from "@azure/arm-compute";
import { DefaultAzureCredential } from "@azure/identity";

// Initialize the ComputeManagementClient with DefaultAzureCredential
const credential = new DefaultAzureCredential();
const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID || "THERE IS NO SUBSCRIPTION ID"; // Ensure your environment variable is set
const client = new ComputeManagementClient(credential, subscriptionId);

export async function virtualMachinesStart(resourceGroupName: string, virtualMachineName: string): Promise<void> {
  try {
    const response = await client.virtualMachines.beginStartAndWait(resourceGroupName, virtualMachineName);
    console.log("VM start initiated successfully.", response);
  } catch (error) {
    console.error("Error starting VM:", error);
  }
}
