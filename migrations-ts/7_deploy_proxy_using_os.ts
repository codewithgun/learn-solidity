const FlattenCTokenV1 = artifacts.require("FlattenCToken");
import { deployProxy } from "@openzeppelin/truffle-upgrades";

module.exports = async function (deployer, network, accounts) {
	const totalSupply: string = "100000000000000000000";
	const erc20Owner = accounts[1];
	//@ts-ignore
	await deployProxy(FlattenCTokenV1, ["Proxification", "PRX", totalSupply, erc20Owner.toString()], {
		initializer: "initialize",
		//@ts-ignore
		deployer
	});
} as Truffle.Migration;

export {};
