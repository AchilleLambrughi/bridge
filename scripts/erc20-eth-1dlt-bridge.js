const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const Bridge1DLT = require('../build/contracts/Bridge1DLT.json');

const web3Eth = new Web3('wss://ropsten.infura.io/ws/v3/037f6c631f3c4b94b7b41b1d22752139');
const web3OneDLT = new Web3('http://127.0.0.1:8545');
const adminPrivKey = '4547602672f525561a7864fc42de43b73542cc546a6d7c56b2804a938297d2dc';
const { address: admin } = web3OneDLT.eth.accounts.wallet.add(adminPrivKey);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks['3'].address
);

const bridge1DLT = new web3OneDLT.eth.Contract(
  Bridge1DLT.abi,
  Bridge1DLT.networks['1231232'].address
);

bridgeEth.events.TransferERC20(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  const { from, to, amount, date, nonce } = event.returnValues;

  const tx = bridge1DLT.methods.mintERC20(to, amount, nonce);
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
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
});

