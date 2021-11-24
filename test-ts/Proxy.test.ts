import { ERC20ProxyInstance, PRXERC20Instance, PRXERC20V2Instance } from "../types/truffle-contracts";

const PRXERC20 = artifacts.require("PRXERC20");
const ERC20Proxy = artifacts.require("ERC20Proxy");
const PRXERC20V2 = artifacts.require("PRXERC20V2");

contract("ProxyContract", async function (accounts) {
	const symbol: string = "PRX";
	const name: string = "Proxify";
	let prxErc20: PRXERC20Instance;
	let proxy: ERC20ProxyInstance;

	const proxyOwner = accounts[0].toString();
	const nonProxyOwner = accounts[1].toString();
	const erc20Owner = accounts[2].toString();

	before(async () => {
		prxErc20 = await PRXERC20.new({
			from: erc20Owner
		});
		proxy = await ERC20Proxy.new(prxErc20.address, proxyOwner, name, symbol, {
			from: proxyOwner
		});
	});

	describe("proxy version one", async () => {
		it("should invoke implementation contract symbol()", async () => {
			let proxifiedErc20: PRXERC20Instance = await PRXERC20.at(proxy.address);
			const symbol = await proxifiedErc20.symbol({
				from: nonProxyOwner
			});
			expect(symbol).to.be.equal(symbol);
		});
	});

	describe("proxy version two", async () => {
		let proxifiedErc20v2: PRXERC20V2Instance;
		const totalSupply: string = "100000000000000000000";

		it("should upgrade to v2 successfully", async () => {
			const prxErc20v2 = await PRXERC20V2.new({
				from: erc20Owner
			});
			let initializeAbi: AbiItem = prxErc20v2.abi.find((a) => a.name === "initialize" && a.type === "function") as AbiItem;
			let initializeFunctionCall = web3.eth.abi.encodeFunctionCall(initializeAbi, [erc20Owner]);
			await proxy.upgradeToAndCall(prxErc20v2.address, initializeFunctionCall, {
				from: proxyOwner
			});
			proxifiedErc20v2 = await PRXERC20V2.at(proxy.address);
			expect(proxifiedErc20v2.address).not.be.empty;
		});

		it("should be version 2", async () => {
			const version = await proxifiedErc20v2.version({
				from: nonProxyOwner
			});
			expect(version).to.be.equal("v2");
		});

		it("should be mintable", async () => {
			const result = await proxifiedErc20v2.mint(proxyOwner, totalSupply, {
				from: erc20Owner
			});
			expect(result.tx).not.to.be.empty;
		});

		it("owner should have balance", async () => {
			const balance = await proxifiedErc20v2.balanceOf(proxyOwner, {
				from: nonProxyOwner
			});
			expect(balance.toString()).to.be.equal(totalSupply);
		});
	});
});
