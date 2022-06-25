pragma solidity ^0.8.0;

interface IERC721Token {
  function mint(address to, uint256 tokenId) external;
  function burn(uint256 tokenId) external;
}
