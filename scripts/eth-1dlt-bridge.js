const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const Bridge1DLT = require('../build/contracts/Bridge1DLT.json');

const web3Eth = new Web3('wss://ropsten.infura.io/ws/v3/<your-infura-project-key>');
const web3OneDLT = new Web3('http://127.0.0.1:8545');
const adminPrivKey = 'your-wallet-private-key';
const { address: admin } = web3OneDLT.eth.accounts.wallet.add(adminPrivKey);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks['3'].address
);

const bridge1DLT = new web3OneDLT.eth.Contract(
  Bridge1DLT.abi,
  Bridge1DLT.networks['1231232'].address
);

bridgeEth.events.Transfer(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  const { to, tokenId, nonce } = event.returnValues;

  const tx = bridge1DLT.methods.mint(to, tokenId, nonce);
  const [gasPrice, gasCost] = await Promise.all([
    web3OneDLT.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridge1DLT.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3OneDLT.eth.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - to ${to} 
    - token ${tokenId} 
  `);
});
