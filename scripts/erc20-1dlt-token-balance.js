const TokenBsc = artifacts.require('./ERC20Token1DLT.sol');

module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const tokenBsc = await TokenBsc.deployed();
  const balance = await tokenBsc.balanceOf(recipient);
  console.log(balance.toString());
  done();
}
