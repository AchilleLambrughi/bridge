const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const Bridge1CDLT = require('../build/contracts/Bridge1CDLT.json');

const web3Eth = new Web3('wss://ropsten.infura.io/ws/v3/<your-infura-project-key>');
const web3OneCDLT = new Web3('http://127.0.0.1:8545');
const adminPrivKey = 'your-wallet-private-key';
const { address: admin } = web3OneCDLT.eth.accounts.wallet.add(adminPrivKey);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks['3'].address
);

const bridge1CDLT = new web3OneCDLT.eth.Contract(
  Bridge1CDLT.abi,
  Bridge1CDLT.networks['1231232'].address
);

bridgeEth.events.Transfer(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  const { to, tokenId, nonce } = event.returnValues;

  const tx = bridge1CDLT.methods.mint(to, tokenId, nonce);
  const [gasPrice, gasCost] = await Promise.all([
    web3OneCDLT.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridge1CDLT.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3OneCDLT.eth.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - to ${to} 
    - token ${tokenId} 
  `);
});
