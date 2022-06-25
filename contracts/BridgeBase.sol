pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './IERC20Token.sol';

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import './IERC721Token.sol';

contract BridgeBase {
  address public admin;
  IERC721Token public ERC721token;
  IERC20Token public ERC20token;
  uint public nonce;
  mapping(uint => bool) public processedNonces;

  enum Step { Burn, Mint }

  event TransferERC20(
    address from,
    address to,
    uint amount,
    uint date,
    uint nonce,
    Step indexed step
  );

  event TransferERC721(
    address to,
    uint256 indexed tokenId,
    uint nonce, 
    Step indexed step
  );

  constructor(address _erc20token, address _erc721token) {
    admin = msg.sender;
    ERC20token = IERC20Token(_erc20token);
    ERC721token = IERC721Token(_erc721token);
  }

  //ERC20 functions------------------------------------------------------
  function burn(address to, uint amount) external {
    ERC20token.burn(msg.sender, amount);
    emit TransferERC20(
      msg.sender,
      to,
      amount,
      block.timestamp,
      nonce,
      Step.Burn
    );
    nonce++;
  }

  function mintERC20(address to, uint amount, uint otherChainNonce) external {
    require(msg.sender == admin, 'only admin');
    require(processedNonces[otherChainNonce] == false, 'transfer already processed');
    processedNonces[otherChainNonce] = true;
    ERC20token.mint(to, amount);
    emit TransferERC20(
      msg.sender,
      to,
      amount,
      block.timestamp,
      otherChainNonce,
      Step.Mint
    );
  }

  //ERC721 functions----------------------------------------------------------------
  function burn(uint256 tokenId) external {
    ERC721token.burn(tokenId);
    emit TransferERC721(
      msg.sender,
      tokenId,
      nonce,
      Step.Burn
    );
    nonce++;
  }

  function mintERC721(address to, uint256 tokenId, uint otherChainNonce) external {
    require(msg.sender == admin, 'only admin');
    require(processedNonces[otherChainNonce] == false, 'transfer already processed');
    processedNonces[otherChainNonce] = true;
    ERC721token.mint(to, tokenId);
    emit TransferERC721(
      to,
      tokenId,
      otherChainNonce,
      Step.Mint
    );
  }
}
