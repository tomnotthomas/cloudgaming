"use strict";

const allocatedRegions = [{
  "Richmond, Virginia, USA": "eastus"
}, {
  "San Antonio, Texas, USA": "southcentralus"
}, {
  "Moses Lake, Washington, USA": "westus2"
}, {
  "Phoenix, Arizona, USA": "westus3"
}, {
  "Sydney, Australia": "australiaeast"
}, {
  "Singapore, Singapore": "southeastasia"
}, {
  "Dublin, Ireland": "northeurope"
}, {
  "Stockholm, Sweden": "swedencentral"
}, {
  "London, England": "uksouth"
}, {
  "Amsterdam, Netherlands": "westeurope"
}, {
  "Des Moines, Iowa, USA": "centralus"
}, {
  "Johannesburg, South Africa": "southafricanorth"
}, {
  "Pune, India": "centralindia"
}, {
  "Hong Kong": "eastasia"
}, {
  "Tokyo, Japan": "japaneast"
}, {
  "Seoul, South Korea": "koreacentral"
}, {
  "Toronto, Canada": "canadacentral"
}, {
  "Paris, France": "francecentral"
}, {
  "Frankfurt, Germany": "germanywestcentral"
}, {
  "Oslo, Norway": "norwayeast"
}, {
  "Warsaw, Poland": "polandcentral"
}, {
  "Zurich, Switzerland": "switzerlandnorth"
}, {
  "Dubai, UAE": "uaenorth"
}, {
  "São Paulo, Brazil": "brazilsouth"
}, {
  "Doha, Qatar": "qatarcentral"
}, {
  "Busan, Korea South": "asiapacific"
}, {
  "Northlake, Illinois, USA": "northcentralus"
}, {
  "San Francisco, USA": "westus"
}, {
  "Mumbai, India": "jioindiawest"
}, {
  "Cheyenne, Wyoming, USA": "westcentralus"
}, {
  "Cape Town, South Africa": "southafricawest"
}, {
  "Canberra, Australia": "australiacentral"
}, {
  "Melbourne, Australia": "australiasoutheast"
}, {
  "Osaka, Japan": "japanwest"
}, {
  "Jio India Central": "jioindiacentral"
}, {
  "Busan, South Korea": "koreasouth"
}, {
  "Chennai, India": "southindia"
}, {
  "Ahmedabad, India": "westindia"
}, {
  "Montreal, Canada": "canadaeast"
}, {
  "Marseille, France": "francesouth"
}, {
  "Bergen, Norway": "norwaywest"
}, {
  "Geneva, Switzerland": "switzerlandwest"
}, {
  "Cardiff, UK": "ukwest"
}, {
  "Abu Dhabi, UAE": "uaecentral"
}, {
  "Rio de Janeiro, Brazil": "brazilsoutheast"
}];

//This translates the region that the user chose to a zone in azure
function getVmRegion(area) {
  const cityObject = allocatedRegions.find(obj => obj.hasOwnProperty(area));
  if (cityObject && area in cityObject) {
    return cityObject[area];
  }
  return null;
}
module.exports = {
  getVmRegion
};