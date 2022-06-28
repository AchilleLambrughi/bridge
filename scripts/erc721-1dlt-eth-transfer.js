//const BridgeEth = artifacts.require('./Bridge1DLT.sol');
const Web3 = require('web3');
const Bridge1DLT = require('../build/contracts/Bridge1DLT.json');
const web3OneDLT = new Web3('http://127.0.0.1:8545');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const net = require('net');
const adminPrivKey = process.env.SIGNER_PRIVATE_KEY;
const { address: recipient } = web3OneDLT.eth.accounts.wallet.add(adminPrivKey);

const bridge1DLT = new web3OneDLT.eth.Contract(
    Bridge1DLT.abi,
    Bridge1DLT.networks['1231232'].address
);
async function transfer() {
    const tx = bridge1DLT.methods.burn(9999);
    const [gasPrice, gasCost] = await Promise.all([
        web3OneDLT.eth.getGasPrice(),
        tx.estimateGas({ from: recipient }),
    ]);
    const receipt = await bridge1DLT.methods.burn(9999).send({
        from: recipient,
        gas: gasCost,
        gasPrice
    })

    const returnValues = receipt.events.TransferERC721.returnValues;
    console.log(JSON.stringify(returnValues));

    const client = new net.Socket();
    client.connect(1338, '127.0.0.1', function () {
        console.log('Connected');
    });

    client.on('data', function (data) {
        console.log('Received: ' + data);
        client.write(JSON.stringify(returnValues));
        client.destroy(); // kill client after server's response
    });

    client.on('close', function () {
        console.log('Connection closed');
    });
}
transfer();