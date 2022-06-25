pragma solidity ^0.8.0;

import './BridgeBase.sol';

contract Bridge1DLT is BridgeBase {
  constructor(address erc20token, address erc721token) BridgeBase(erc20token, erc721token) {}
}
