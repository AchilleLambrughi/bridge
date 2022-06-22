const NFTEth = artifacts.require('NFTEth.sol');
const NFT1CDLT = artifacts.require('NFT1CDLT.sol');
const BridgeEth = artifacts.require('BridgeEth.sol');
const Bridge1CDLT = artifacts.require('Bridge1CDLT.sol');

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
    await deployer.deploy(NFT1CDLT);
    const token1CDLT = await NFT1CDLT.deployed();
    await deployer.deploy(Bridge1CDLT, token1CDLT.address);
    const bridge1CDLT = await Bridge1CDLT.deployed();
    await token1CDLT.updateAdmin(bridge1CDLT.address);
  }
};
