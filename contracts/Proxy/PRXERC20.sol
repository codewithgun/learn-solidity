pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract PRXERC20 is ERC20, Initializable {

    string private _name;
    string private _symbol;

    constructor() ERC20("", "") {}

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }
    
    function initialize(string memory name_, string memory symbol_) public initializer {
        _name = name_;
        _symbol = symbol_;
    }
}