const NFTEth = artifacts.require('NFTEth.sol');
const NFT1DLT = artifacts.require('NFT1DLT.sol');
const BridgeEth = artifacts.require('BridgeEth.sol');
const Bridge1DLT = artifacts.require('Bridge1DLT.sol');

module.exports = async function (deployer, network, addresses) {
  if(network === 'ethTestnet') {
    await deployer.deploy(NFTEth);
    const tokenEth = await NFTEth.deployed();
    await tokenEth.mint(addresses[0], 9999);
    await deployer.deploy(BridgeEth, tokenEth.address);
    const bridgeEth = await BridgeEth.deployed();
    await tokenEth.updateAdmin(bridgeEth.address);
  }
  if(network === 'qpq') {
    await deployer.deploy(NFT1DLT);
    const token1DLT = await NFT1DLT.deployed();
    await deployer.deploy(Bridge1DLT, token1DLT.address);
    const bridge1DLT = await Bridge1DLT.deployed();
    await token1DLT.updateAdmin(bridge1DLT.address);
  }
};
