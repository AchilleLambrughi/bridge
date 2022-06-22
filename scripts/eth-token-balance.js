const NFTEth = artifacts.require('./NFTEth.sol');
const NFT = require('../build/contracts/NFTEth.json');

module.exports = async done => {
  const [sender, _] = await web3.eth.getAccounts();
  const tokenEth = await NFTEth.deployed();
  const balance = await tokenEth.balanceOf(sender);
  console.log(balance.toString());
  if (balance > 0) {
    const contract = new web3.eth.Contract(NFT.abi, NFT.networks['3'].address);
    const owner = await contract.methods.ownerOf(9999).call();
    console.log(owner.toString());
  }
  done();
}
