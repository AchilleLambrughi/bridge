**<span style="color:red">Important!</span> before running the demo, please make sure you have filled in the missing information in files** `truffle-config.js` **and** `scripts/eth-1cdlt-bridge.js`

# Bridge 

## Demo
First of all, initialize your project: 

`npm install`

Then we will start the migration of the contracts on the two blockchain 

`truffle migrate --reset --network ethTestnet` 

`truffle migrate --reset --network qpq`

NB: the networks are defined in `truffle-config.js`
 

Before executing the transfer of the NFT we check its existence in the two blockchain 

`truffle exec scripts/1cdlt-token-balance.js --network qpq`

Output:
```
Using network 'qpq'.

0
```
`truffle exec scripts/eth-token-balance.js --network ethTestnet`

Output:
```
Using network 'ethTestnet'.

1
0x<your-address>
```

We have no tokens in the account on 1CDLT, while we have the token on Ethereum. The address of the owner is printed on the terminal, and it should match your address. 

Now, in a new terminal, start the bridge: 

`node scripts/eth-1cdlt-bridge.js`

And in the first terminal execute the transfer: 

`truffle exec scripts/eth-1cdlt-transfer.js --network ethTestnet`

After few seconds the bridge script should output the following: 

```
Transaction hash: 0x<Hash>

    Processed transfer:
    - to 0x<your-address> 
    - token 9999 
  

```
At the end, we can check if the token has been transferred from Ethereum to 1CDLT: 

`truffle exec scripts/eth-token-balance.js --network ethTestnet`

Output:
```
Using network 'ethTestnet'.

0
```
`truffle exec scripts/1cdlt-token-balance.js --network qpq`

Output:
```
Using network 'qpq'.

1
0x<your-address>
```

Your NFT is now on 1CDLT! 