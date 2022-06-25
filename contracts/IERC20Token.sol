pragma solidity ^0.8.0;

interface IERC20Token {
  function mint(address to, uint amount) external;
  function burn(address owner, uint amount) external;
}
