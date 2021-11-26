// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// Bugs in Opezeppelin Upgrade plugin. The upgrade plugin only works when without any "import" statement
// Therefore, ensure the the inheritance contract is inside the same file
contract CToken is ERC20Upgradeable, OwnableUpgradeable {

    function initialize(string memory name_, string memory symbol_, uint256 totalSupply_, address owner_) public initializer {
        __ERC20_init(name_, symbol_);
        __Ownable_init();
        _mint(owner_, totalSupply_);
    }
}