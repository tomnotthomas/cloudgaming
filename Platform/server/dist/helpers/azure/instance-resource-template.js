"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function instanceConfigurator(location, name) {
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
  return vmParameter;
}
module.exports = instanceConfigurator;