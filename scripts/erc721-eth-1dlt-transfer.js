const BridgeEth = artifacts.require('./BridgeEth.sol');

module.exports = async done => {
  const bridgeEth = await BridgeEth.deployed();
  await bridgeEth.burn(9999);
  done();
}