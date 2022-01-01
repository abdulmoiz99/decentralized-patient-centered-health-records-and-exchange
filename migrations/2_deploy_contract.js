const Role = artifacts.require("./Role.sol");
const Right = artifacts.require("./Right.sol");
const User = artifacts.require("./User.sol");
const Hospital = artifacts.require("./Hospital.sol");
const Doctor = artifacts.require("./Doctor.sol");
const Patient = artifacts.require("./Patient.sol");

module.exports = function (deployer) {
  deployer.deploy(Role);
  deployer.deploy(Right);
  deployer.deploy(User);
  deployer.deploy(Hospital);
  deployer.deploy(Doctor);
  deployer.deploy(Patient);
};
