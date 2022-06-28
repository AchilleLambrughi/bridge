const net = require('net');
const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const Bridge1DLT = require('../build/contracts/Bridge1DLT.json');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const web3Eth = new Web3(process.env.ETHEREUM_RPC);
const web3OneDLT = new Web3('http://127.0.0.1:8545');
const adminPrivKey = process.env.SIGNER_PRIVATE_KEY;
const { address: admin } = web3OneDLT.eth.accounts.wallet.add(adminPrivKey);

const signer = web3Eth.eth.accounts.privateKeyToAccount(
    adminPrivKey
);
web3Eth.eth.accounts.wallet.add(signer);

const bridgeEth = new web3Eth.eth.Contract(
    BridgeEth.abi,
    BridgeEth.networks['3'].address
);

const bridge1DLT = new web3OneDLT.eth.Contract(
    Bridge1DLT.abi,
    Bridge1DLT.networks['1231232'].address
);


var server = net.createServer(function (socket) {
    socket.write('Echo server\r\n');
    socket.on('data', async (eventData) => {
        const returnValues = JSON.parse(eventData);
        const { from, to, amount, date, nonce } = returnValues;

        const method = bridgeEth.methods.mintERC20(to, amount, nonce);
        const [gasPrice, gasCost] = await Promise.all([
            web3Eth.eth.getGasPrice(),
            method.estimateGas({ from: admin }),
        ]);
        const data = method.encodeABI();
        const txData = {
            from: signer.address,
            to: bridgeEth.options.address,
            data,
            gas: gasCost,
            gasPrice
        };
        signedTx = await web3Eth.eth.accounts.signTransaction(txData, signer.privateKey)
        const receipt = await web3Eth.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(`Transaction hash: ${receipt.transactionHash}`);
        console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
    });
    socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');
