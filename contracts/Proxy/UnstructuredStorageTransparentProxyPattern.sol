// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract ERC20Proxy is TransparentUpgradeableProxy {
 constructor(
        address _logic,
        address admin_,
        string memory name_,
        string memory symbol_
    ) payable TransparentUpgradeableProxy(_logic, admin_, abi.encodeWithSignature("initialize(string,string)", name_, symbol_)) {}
}