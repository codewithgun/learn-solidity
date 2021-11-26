const Box = artifacts.require("Box");
import { deployProxy } from "@openzeppelin/truffle-upgrades";

module.exports = async function (deployer, network, accounts) {
	//@ts-ignore
	await deployProxy(Box, [42], {
		initializer: "store",
		deployer
	});
} as Truffle.Migration;

export {};
