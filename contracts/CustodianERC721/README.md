# Custodian ERC721

The purpose of this contract is to allow multiple owners to mint token under the same collection.

Custodian ERC721 allows the SuperAdmin to invite other to join as an admin.

Super admin allowed to perform the following functions:
[ ] Grant address admin privilege
[ ] Revoke admin privilege

The address which has been granted admin privilege can mint token for the contract. However, the admin might wish to use centralized / decentralized, or their own server for hosting the metadata. Therefore, `mint` function has been customized to receive the metadata URL when the mint function is invoked.
