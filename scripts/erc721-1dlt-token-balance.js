const NFT1DLT = artifacts.require('./ERC721Token1DLT.sol');
const NFT = require('../build/contracts/ERC721Token1DLT.json');

module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const tokenOneDLT = await NFT1DLT.deployed();
  const balance = await tokenOneDLT.balanceOf(recipient);
  console.log(balance.toString());
  if (balance > 0) {
    const contract = new web3.eth.Contract(NFT.abi, NFT.networks['1231232'].address);
    const owner = await contract.methods.ownerOf(9999).call();
    console.log(owner.toString());
  }
  done();
}
