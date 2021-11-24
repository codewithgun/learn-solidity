const PRXERC20v2 = artifacts.require("PRXERC20V2");
const ERC20Proxy = artifacts.require("ERC20Proxy");

module.exports = async function (deployer, network, accounts) {
	const proxyOwner = accounts[0].toString();
	const nonProxyOwner = accounts[1].toString();
	const erc20Owner = accounts[2].toString();

	await deployer.deploy(PRXERC20v2);
	const erc20v2Contract = await PRXERC20v2.deployed();
	const erc20Proxy = await ERC20Proxy.deployed();
	let initializeAbi: AbiItem = erc20v2Contract.abi.find((a) => a.name === "initialize" && a.type === "function") as AbiItem;
	let initializeFunctionCall = web3.eth.abi.encodeFunctionCall(initializeAbi, [erc20Owner]);
	await erc20Proxy.upgradeToAndCall(erc20v2Contract.address, initializeFunctionCall, {
		from: proxyOwner
	});
} as Truffle.Migration;

export {};
