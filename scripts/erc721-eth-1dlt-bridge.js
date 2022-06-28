const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const Bridge1DLT = require('../build/contracts/Bridge1DLT.json');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const web3Eth = new Web3(process.env.ETHEREUM_RPC);
const web3OneDLT = new Web3('http://127.0.0.1:8545');
const adminPrivKey = process.env.SIGNER_PRIVATE_KEY;
const { address: admin } = web3OneDLT.eth.accounts.wallet.add(adminPrivKey);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks['3'].address
);

const bridge1DLT = new web3OneDLT.eth.Contract(
  Bridge1DLT.abi,
  Bridge1DLT.networks['1231232'].address
);

bridgeEth.events.TransferERC721(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  const { to, tokenId, nonce } = event.returnValues;

  const tx = bridge1DLT.methods.mintERC721(to, tokenId, nonce);
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
