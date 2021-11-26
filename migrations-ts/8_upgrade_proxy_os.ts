const FlattenCTokenV2 = artifacts.require("FlattenCTokenV2");
const FlattenCTokenV1 = artifacts.require("FlattenCToken");

import { upgradeProxy } from "@openzeppelin/truffle-upgrades";

module.exports = async function (deployer, network, accounts) {
	//@ts-ignore
	await upgradeProxy(FlattenCTokenV1, FlattenCTokenV2);
} as Truffle.Migration;

export {};
