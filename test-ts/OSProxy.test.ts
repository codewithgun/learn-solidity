const CToken = artifacts.require("FlattenCToken");
const CTokenV2 = artifacts.require("FlattenCTokenV2");

import { deployProxy, upgradeProxy } from "@openzeppelin/truffle-upgrades";
import { FlattenCTokenInstance, FlattenCTokenV2Instance } from "../types/truffle-contracts";

contract("OSProxy", (accounts) => {
	const totalSupply: string = "100000000000000000000";
	const erc20Owner = accounts[1];
	let proxifiedContractv1: FlattenCTokenInstance;
	let proxifiedContractv2: FlattenCTokenV2Instance;

	before(async () => {
		//@ts-ignore
		proxifiedContractv1 = await deployProxy(CToken, ["Proxification", "PRX", totalSupply, erc20Owner.toString()], {
			initializer: "initialize"
		});
	});

	describe("FlattenCToken version one", () => {
		it("should return 18 decimals", async () => {
			const decimal = await proxifiedContractv1.decimals();
			expect(decimal.toNumber()).to.be.equal(18);
			console.log("Decimal V1", decimal.toNumber());
		});
	});

	describe("Upgrade to v2", () => {
		it("should upgrade success", async () => {
			//@ts-ignore
			proxifiedContractv2 = await upgradeProxy(proxifiedContractv1.address, CTokenV2);
			expect(proxifiedContractv2.address).not.to.be.null;
		});
	});

	describe("FlattenCToken version two", () => {
		it("should return 8 decimals", async () => {
			const decimal = await proxifiedContractv2.decimals();
			expect(decimal.toNumber()).to.be.equal(8);
		});
	});
});
