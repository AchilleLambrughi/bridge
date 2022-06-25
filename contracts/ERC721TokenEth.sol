pragma solidity ^0.8.0;

import './ERC721TokenBase.sol';

contract ERC721TokenEth is ERC721TokenBase {
  constructor() ERC721TokenBase('Eth NFT', 'ENFT') {}
}
