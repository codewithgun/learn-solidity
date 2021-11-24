// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract PRXERC20V2 is ERC20, Initializable {

    string private _name;
    string private _symbol;
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() ERC20("", "") {
    }

    function mint(address to_, uint256 amount_) public {
        require(msg.sender == owner, "only owner");
        _mint(to_, amount_);
    }

    function initialize(address owner_) public {
        require(owner == address(0), "already got owner");
        owner = owner_;
        emit OwnershipTransferred(address(0), owner_);
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function version() public pure returns (string memory) {
        return "v2";
    }
}