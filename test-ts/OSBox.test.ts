const Box = artifacts.require("Box");
const BoxV2 = artifacts.require("BoxV2");

import { deployProxy, upgradeProxy } from "@openzeppelin/truffle-upgrades";
import { BoxInstance, BoxV2Instance } from "../types/truffle-contracts";

contract("Box", () => {
	let box: BoxInstance;
	let boxv2: BoxV2Instance;

	beforeEach(async () => {
		//@ts-ignore
		box = await deployProxy(Box, [42], {
			initializer: "store"
		});
		//@ts-ignore
		boxv2 = await upgradeProxy(box.address, BoxV2);
	});

	it("retrieve returns a value previously initialized", async function () {
		// Test if the returned value is the same one
		// Note that we need to use strings to compare the 256 bit integers
		expect((await box.retrieve()).toString()).to.equal("42");
	});

	it("should increment the box value to 43", async () => {
		const result = await boxv2.increment();
		expect(result.tx).not.to.be.null;

		const value = await boxv2.retrieve();
		expect(value.toNumber()).to.be.equal(43);
	});
});
