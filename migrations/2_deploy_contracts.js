const Token1DLT = artifacts.require('ERC20Token1DLT.sol');
const TokenEth = artifacts.require('ERC20TokenEth.sol');
const NFTEth = artifacts.require('ERC721TokenEth.sol');
const NFT1DLT = artifacts.require('ERC721Token1DLT.sol');
const BridgeEth = artifacts.require('BridgeEth.sol');
const Bridge1DLT = artifacts.require('Bridge1DLT.sol');

module.exports = async function (deployer, network, addresses) {
  if(network === 'ethTestnet') {
    await deployer.deploy(TokenEth);
    const erc20Eth = await TokenEth.deployed();
    await erc20Eth.mint(addresses[0], 1000);  //Address & amount
    await deployer.deploy(NFTEth);
    const nftEth = await NFTEth.deployed();
    await nftEth.mint(addresses[0], 9999);    //Address & tokenId 
    await deployer.deploy(BridgeEth, erc20Eth.address, nftEth.address);
    const bridgeEth = await BridgeEth.deployed();
    await erc20Eth.updateAdmin(bridgeEth.address);
    await nftEth.updateAdmin(bridgeEth.address);
  }
  if(network === 'qpq') {
    await deployer.deploy(Token1DLT);
    const erc20OneDLT = await Token1DLT.deployed();
    await deployer.deploy(NFT1DLT);
    const nft1DLT = await NFT1DLT.deployed();
    await deployer.deploy(Bridge1DLT, erc20OneDLT.address, nft1DLT.address);
    const bridge1DLT = await Bridge1DLT.deployed();
    await nft1DLT.updateAdmin(bridge1DLT.address);
    await erc20OneDLT.updateAdmin(bridge1DLT.address);
  }
};
