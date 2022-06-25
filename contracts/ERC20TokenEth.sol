pragma solidity ^0.8.0;

import './ERC20TokenBase.sol';

contract ERC20TokenEth is ERC20TokenBase {
  constructor() ERC20TokenBase('ETH Token', 'ETK') {}
}
