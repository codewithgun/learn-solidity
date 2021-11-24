const PRXERC20 = artifacts.require("PRXERC20");
const ERC20Proxy = artifacts.require("ERC20Proxy");

module.exports = async function (deployer, network, accounts) {
	await deployer.deploy(PRXERC20);
	const erc20Contract = await PRXERC20.deployed();
	await deployer.deploy(ERC20Proxy, erc20Contract.address, accounts[0].toString(), "Proxy", "PRX");
	const erc20Proxy = await ERC20Proxy.deployed();
} as Truffle.Migration;

export {};
