const PandaNFT = artifacts.require("PandaNFT");

module.exports = function (deployer) {
  deployer.deploy(PandaNFT);
};
