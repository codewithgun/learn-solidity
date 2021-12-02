// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract HashTimeLock {

    address public owner;
    address public recipient;
    IERC20 token;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public amount;
    string public secret;
    bytes32 public secretHash;

    constructor(address recipient_, address token_) {
        owner = msg.sender;
        recipient = recipient_;
        token = IERC20(token_);
    }

    function fund(uint amount_, bytes32 secretHash_) external {
        require(msg.sender == owner, "only owner");
        token.transferFrom(msg.sender, address(this), amount_);
        amount = amount_;
        secretHash = secretHash_;
        startTime = block.timestamp;
        endTime = startTime + 3600 seconds;
    }

    function swap(string memory secret_) external {
        require(msg.sender == recipient, "only recipient");
        require(endTime > block.timestamp, "expires");
        require(keccak256(abi.encodePacked(secret_)) == secretHash, "invalid secret");
        secret = secret_;
        token.transfer(msg.sender, amount);
    }

    function test(uint amount_) public {
        token.transfer(msg.sender, amount_);
    }

    function refund() external {
        require(msg.sender == owner, "only owner");
        require(endTime < block.timestamp, "not expired");
        token.transfer(owner, amount);
    }

}