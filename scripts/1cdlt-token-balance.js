const NFT1CDLT = artifacts.require('./NFT1CDLT.sol');
const NFT = require('../build/contracts/NFT1CDLT.json');

module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const tokenOneCDLT = await NFT1CDLT.deployed();
  const balance = await tokenOneCDLT.balanceOf(recipient);
  console.log(balance.toString());
  if (balance > 0) {
    const contract = new web3.eth.Contract(NFT.abi, NFT.networks['1231232'].address);
    const owner = await contract.methods.ownerOf(9999).call();
    console.log(owner.toString());
  }
  done();
}
