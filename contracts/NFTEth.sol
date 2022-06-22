pragma solidity ^0.8.0;

import './NFTokenBase.sol';

contract NFTEth is NFTokenBase {
  constructor() NFTokenBase('Eth NFT', 'ENFT') {}
}
