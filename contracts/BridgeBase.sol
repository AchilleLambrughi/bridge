pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import './IToken.sol';

contract BridgeBase {
  address public admin;
  IToken public token;
  uint public nonce;
  mapping(uint => bool) public processedNonces;

  enum Step { Burn, Mint }
  event Transfer(
    address to,
    uint256 indexed tokenId,
    uint nonce, 
    Step indexed step
  );

  constructor(address _token) {
    admin = msg.sender;
    token = IToken(_token);
  }

  function burn(uint256 tokenId) external {
    token.burn(tokenId);
    emit Transfer(
      msg.sender,
      tokenId,
      nonce,
      Step.Burn
    );
    nonce++;
  }

  function mint(address to, uint256 tokenId, uint otherChainNonce) external {
    require(msg.sender == admin, 'only admin');
    require(processedNonces[otherChainNonce] == false, 'transfer already processed');
    processedNonces[otherChainNonce] = true;
    token.mint(to, tokenId);
    emit Transfer(
      to,
      tokenId,
      otherChainNonce,
      Step.Mint
    );
  }
}
