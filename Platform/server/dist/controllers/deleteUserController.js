"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteUser = void 0;
var _cloudVmDestroyer = require("../azure/cloud-vm-destroyer");
var _User = _interopRequireDefault(require("../../dist/models/User"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//TODO- > Delete at end of month

const deleteUser = async (req, res) => {
  const email = req.body.userEmail;
  const user = await _User.default.findOne({
    email: email
  });
  if (!user) {
    res.status(404).send({
      error: '404',
      message: 'User not found'
    });
    return;
  }
  const resourceGroup = process.env.AZURE_RESOURCE_GROUP_DEV;
  const vmName = user.virtualMachine;
  await (0, _cloudVmDestroyer.virtualMachines_delete)(resourceGroup, vmName);
  await user.deleteOne({
    email: email
  });
};

//shut down and delete all cloud resources

//Unsubscribe from subscription on paypal

//delete user from database
exports.deleteUser = deleteUser;