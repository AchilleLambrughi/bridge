pragma solidity ^0.8.0;

import './ERC20TokenBase.sol';

contract ERC20Token1DLT is ERC20TokenBase {
  constructor() ERC20TokenBase('BSC Token', 'BTK') {}
}
