pragma solidity ^0.8.0;

import "./CToken.sol";

// Bugs in Opezeppelin Upgrade plugin. The upgrade plugin only works when without any "import" statement
// Therefore, ensure the the inheritance contract is inside the same file
contract CTokenV2 is CToken {

    function decimals() public override pure returns (uint8) {
        return 8;
    }

}