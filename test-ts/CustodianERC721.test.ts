import * as dotenv from "dotenv";
import { CustodianERC721Instance } from "../types/truffle-contracts";
import { AddCollaborator, Approval, ApprovalForAll, PermanentURI, Transfer } from "../types/truffle-contracts/CustodianERC721";
import { OwnershipTransferred } from "../types/truffle-contracts/Ownable";

dotenv.config();

const CustodianERC721 = artifacts.require("CustodianERC721");
const name: string = process.env.COLLECTION_NAME || "";
const symbol: string = process.env.COLLECTION_SYMBOL || "";
const sampleIPFSCid: string = process.env.IPFS_CID || "";
const burnAddress: string = "0x0000000000000000000000000000000000000000";

contract("CustodianERC721", async function (accounts) {
	const owner = accounts[0].toString();
	const collaborator = accounts[1].toString();
	const newOwner = accounts[2].toString();
	const receiver = accounts[3].toString();
	const nonCollaborator = accounts[4].toString();
	const receiver2 = nonCollaborator;
	let contract: CustodianERC721Instance;

	before(async () => {
		contract = await CustodianERC721.deployed();
		console.log("Contract address", contract.address);
	});

	describe("query collection name", () => {
		it("should equal to " + name, async () => {
			const name_ = await contract.name();
			expect(name_).to.be.equal(name);
		});
	});

	describe("query collection symbol", () => {
		it("should equal to " + symbol, async () => {
			const symbol_ = await contract.symbol();
			expect(symbol_).to.be.equal(symbol);
		});
	});

	describe("query collection owner", () => {
		it("should be " + owner, async () => {
			const owner_ = await contract.owner();
			expect(owner_).to.be.equal(owner);
		});
	});

	describe("query non-exist tokenID", () => {
		it("should result in error", async () => {
			const error = await contract.tokenURI(0).catch((e) => e);
			expect(error).to.be.instanceOf(Error);
		});
	});

	describe("add non-exists collaborator", () => {
		it("should add success", async () => {
			const result = await contract.addCollaborator(collaborator);
			expect(result).not.null;
			const addCollaboratorEvent = result.logs[0] as Truffle.TransactionLog<AddCollaborator>;
			expect(addCollaboratorEvent.args._collaborator).to.be.equal(collaborator);
		});

		it("should in collaborator mapping", async () => {
			const isCollaboratorExists = await contract.collaborator(collaborator);
			expect(isCollaboratorExists).to.be.true;
		});
	});

	describe("non-owner add collaborator", () => {
		it("should result in error", async () => {
			const result = await contract
				.addCollaborator(collaborator, {
					from: collaborator
				})
				.catch((e) => e);
			expect(result).to.be.instanceOf(Error);
		});
	});

	describe("add existence collaborator", () => {
		it("should result in error", async () => {
			const error = await contract.addCollaborator(collaborator).catch((e) => e);
			expect(error).to.be.instanceOf(Error);
		});
	});

	describe("owner mint token", () => {
		it("should mint success", async () => {
			const result = await contract.mint(receiver, sampleIPFSCid);
			expect(result).not.be.null;
			const transferEvent = result.logs[0] as Truffle.TransactionLog<Transfer>;
			const permanentUriEvent = result.logs[1] as Truffle.TransactionLog<PermanentURI>;
			expect(transferEvent.args.to).to.be.equal(receiver);
			expect(transferEvent.args.tokenId.toNumber()).to.be.equal(0);
			expect(permanentUriEvent.args._value).to.be.equal(sampleIPFSCid);
		});

		it("should return tokenURI for id 0", async () => {
			const tokenURI = await contract.tokenURI(0);
			expect(tokenURI).to.be.equal(sampleIPFSCid);
		});
	});

	describe("collaborator mint token", () => {
		it("should mint success", async () => {
			const result = await contract.mint(receiver, sampleIPFSCid, {
				from: collaborator
			});
			expect(result).not.be.null;
			const transferEvent = result.logs[0] as Truffle.TransactionLog<Transfer>;
			const permanentUriEvent = result.logs[1] as Truffle.TransactionLog<PermanentURI>;
			expect(transferEvent.args.to).to.be.equal(receiver);
			expect(transferEvent.args.tokenId.toNumber()).to.be.equal(1);
			expect(permanentUriEvent.args._value).to.be.equal(sampleIPFSCid);
		});

		it("should return tokenURI for id 1", async () => {
			const tokenURI = await contract.tokenURI(1);
			expect(tokenURI).to.be.equal(sampleIPFSCid);
		});
	});

	describe("non-collaborator mint token", () => {
		it("should result in error", async () => {
			const error = await contract
				.mint(receiver, sampleIPFSCid, {
					from: nonCollaborator
				})
				.catch((e) => e);
			expect(error).to.be.instanceOf(Error);
		});
	});

	describe("revoke exist collaborator", () => {
		it("should revoke success", async () => {
			const result = await contract.removeCollaborator(collaborator);
			expect(result).not.null;
		});

		it("should not in collaborator mapping", async () => {
			const isCollaboratorExists = await contract.collaborator(collaborator);
			expect(isCollaboratorExists).to.be.false;
		});

		it("should not able to mint token", async () => {
			const error = await contract
				.mint(receiver, sampleIPFSCid, {
					from: collaborator
				})
				.catch((e) => e);
			expect(error).to.be.instanceOf(Error);
		});
	});

	describe("revoke non-exists collaborator", () => {
		it("should fail", async () => {
			const error = await contract.removeCollaborator(collaborator).catch((e) => e);
			expect(error).to.be.instanceOf(Error);
		});
	});

	describe("non-owner revoke collaborator", () => {
		it("should fail", async () => {
			const error = await contract
				.removeCollaborator(collaborator, {
					from: collaborator
				})
				.catch((e) => e);
			expect(error).to.be.instanceOf(Error);
		});
	});

	describe("change contract owner", () => {
		it("should change owner to " + newOwner, async () => {
			const result = await contract.transferOwnership(newOwner);
			expect(result).not.to.be.null;
			const ownershipTransferredEvent = result.logs[0] as Truffle.TransactionLog<OwnershipTransferred>;
			expect(ownershipTransferredEvent.args.previousOwner).to.be.equal(owner);
			expect(ownershipTransferredEvent.args.newOwner).to.be.equal(newOwner);
		});

		it("should return new owner", async () => {
			const owner_ = await contract.owner();
			expect(owner_).to.be.equal(newOwner);
		});
	});

	describe("non-owner change contract owner", () => {
		it("should result in error", async () => {
			const error = await contract
				.transferOwnership(owner, {
					from: owner
				})
				.catch((e) => e);
			expect(error).to.be.instanceOf(Error);
		});
	});

	describe("owner transfer token", () => {
		it("should change token ownership", async () => {
			const tokenId = 0;
			const from = receiver;
			const to = receiver2;
			const result = await contract.transferFrom(from, to, tokenId, {
				from
			});
			const approvalEvent = result.logs[0] as Truffle.TransactionLog<Approval>;
			expect(approvalEvent.args.owner).to.be.equal(from);
			expect(approvalEvent.args.approved).to.be.equal(burnAddress);
			expect(approvalEvent.args.tokenId.toNumber()).to.be.equal(tokenId);

			const transferEvent = result.logs[1] as Truffle.TransactionLog<Transfer>;
			expect(transferEvent.args.from).to.be.equal(from);
			expect(transferEvent.args.to).to.be.equal(to);
			expect(transferEvent.args.tokenId.toNumber()).to.be.equal(tokenId);
		});

		it("should return new ownership", async () => {
			const newTokenOwnership = receiver2;
			const tokenId = 0;
			const tokenOwner = await contract.ownerOf(tokenId);
			expect(tokenOwner).to.be.equal(newTokenOwnership);
		});
	});

	describe("non-owner transfer token", () => {
		it("should result in error", async () => {
			const from = receiver2;
			const to = receiver;
			const tokenId = 0;
			const error = await contract
				.transferFrom(from, to, tokenId, {
					from: to
				})
				.catch((e) => e);
			expect(error).to.be.instanceOf(Error);
		});
	});

	describe("token approval all", () => {
		const owner = receiver2;
		const operator = receiver;
		const tokenId = 0;
		it("should approve all token of " + owner + " to " + operator, async () => {
			const result = await contract.setApprovalForAll(operator, true, {
				from: owner
			});
			const approvalAllEvent = result.logs[0] as Truffle.TransactionLog<ApprovalForAll>;
			expect(result).not.to.be.null;
			expect(approvalAllEvent.args.owner).to.be.equal(owner);
			expect(approvalAllEvent.args.operator).to.be.equal(operator);
			expect(approvalAllEvent.args.approved).to.be.equal(true);
		});

		it("should return approved", async () => {
			const isApprovedAll = await contract.isApprovedForAll(owner, operator);
			expect(isApprovedAll).to.be.equal(true);
		});

		it(operator + " should be able to transfer on behalf of " + owner, async () => {
			const result = await contract.transferFrom(owner, operator, 0, {
				from: operator
			});
			expect(result).not.to.be.null;
			const approvalEvent = result.logs[0] as Truffle.TransactionLog<Approval>;
			expect(approvalEvent.args.owner).to.be.equal(owner);
			expect(approvalEvent.args.approved).to.be.equal(burnAddress);
			expect(approvalEvent.args.tokenId.toNumber()).to.be.equal(tokenId);

			const transferEvent = result.logs[1] as Truffle.TransactionLog<Transfer>;
			expect(transferEvent.args.from).to.be.equal(owner);
			expect(transferEvent.args.to).to.be.equal(operator);
			expect(transferEvent.args.tokenId.toNumber()).to.be.equal(tokenId);
		});

		it("should return new ownership", async () => {
			const tokenOwner = await contract.ownerOf(tokenId);
			expect(tokenOwner).to.be.equal(operator);
		});
	});

	describe("revoke approval for all", () => {
		const operator = receiver;
		const owner = receiver2;
		const tokenId = 0;
		it("should successfully remove approval", async () => {
			const result = await contract.setApprovalForAll(operator, false, {
				from: owner
			});
			expect(result).not.to.be.null;
			const approvalEvent = result.logs[0] as Truffle.TransactionLog<ApprovalForAll>;
			expect(approvalEvent.args.approved).to.be.equal(false);
			expect(approvalEvent.args.operator).to.be.equal(operator);
			expect(approvalEvent.args.owner).to.be.equal(owner);
		});

		it("should return not approved", async () => {
			const isApprovedAll = await contract.isApprovedForAll(owner, operator);
			expect(isApprovedAll).to.be.equal(false);
		});

		it(operator + " should not able to transfer on behalf of " + owner, async () => {
			await contract.transferFrom(operator, owner, tokenId, {
				from: operator
			});
			const error = await contract
				.transferFrom(owner, operator, tokenId, {
					from: operator
				})
				.catch((e) => e);
			expect(error).to.be.instanceOf(Error);
		});
	});
});
