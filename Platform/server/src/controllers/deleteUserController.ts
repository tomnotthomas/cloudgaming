
//TODO- > Delete at end of month

import {virtualMachines_delete} from "../azure/cloud-vm-destroyer"
import User from "../../dist/models/User";

export const deleteUser = async (req:any, res:any) => {

  const email = req.body.userEmail;
  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(404).send({ error: '404', message: 'User not found' });
    return;
  }

  const resourceGroup = process.env.AZURE_RESOURCE_GROUP_DEV
  const vmName = user.virtualMachine;


  await virtualMachines_delete(resourceGroup, vmName)
  await user.deleteOne({ email:email })
  res.status(200).json({ message: "USER DELETED" });
  return
}

//shut down and delete all cloud resources


//Unsubscribe from subscription on paypal



//delete user from database

