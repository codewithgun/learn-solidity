// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../MetaTransaction/ContextMixin.sol";
import "../MetaTransaction/NativeMetaTransaction.sol";

contract CustodianERC721Polygon is ERC721, Ownable, ReentrancyGuard, ContextMixin, NativeMetaTransaction {
    /*
    Signal OpenSea to mark the token metadata as Frozen
    However, tested and doesn't work on Ethereum chain
    Reference: https://docs.opensea.io/docs/metadata-standards
    */
    event PermanentURI(string _value, uint256 indexed _id);

    /*
    Log for new collaborator
    */
    event AddCollaborator(address indexed _collaborator);

    /*
    Log for collaborator being removed
    */
    event RemoveCollaborator(address indexed _collaborator);

    /*
    Mapping token id => token metadata URI
    Example: ipfs://..., https://..., ar://....
    */
    mapping(uint256 => string) private _tokenURI;

    /*
    Mapping to indicate whether the address is a collaborator
    */
    mapping(address => bool) private _collaboratorGranted;

    uint256 private tokenCount;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        _initializeEIP712(name_);
    }

    modifier onlyCollaboratorOrOwner() {
        require(_collaboratorGranted[_msgSender()] || owner() == _msgSender(), "only owner or collaborator");
        _;
    }

    function mint(address to, string memory metadata) public onlyCollaboratorOrOwner nonReentrant {
        _safeMint(to, tokenCount);
        _tokenURI[tokenCount] = metadata;
        emit PermanentURI(metadata, tokenCount);
        tokenCount += 1;
    }

    function removeCollaborator(address collaborator_) external onlyOwner {
        require(_collaboratorGranted[collaborator_], "not a collaborator");
        _collaboratorGranted[collaborator_] = false;
        emit RemoveCollaborator(collaborator_);
    }

    function addCollaborator(address collaborator_) external onlyOwner {
        require(!_collaboratorGranted[collaborator_], "already collaborator");
        _collaboratorGranted[collaborator_] = true;
        emit AddCollaborator(collaborator_);
    }

    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURI[tokenId];
    }

    function collaborator(address collaborator_) external view returns (bool) {
        return _collaboratorGranted[collaborator_];
    }

    function _msgSender()
        internal
        override
        view
        returns (address sender)
    {
        return ContextMixin.msgSender();
    }

    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
      // if OpenSea's ERC721 Mumbai Proxy Address is detected, auto-return true
        if (_operator == address(0xff7Ca10aF37178BdD056628eF42fD7F799fAc77c)) {
            return true;
        }
        return ERC721.isApprovedForAll(_owner, _operator);
    }

}