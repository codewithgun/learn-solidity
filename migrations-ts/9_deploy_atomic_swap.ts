const DummyToken = artifacts.require("DummyToken");
const HashTimeLock = artifacts.require("HashTimeLock");

module.exports = async function (deployer, network, accounts) {
	const tokenName = network.substring(0, 1).toUpperCase() + network.substring(1) + " Token";
	const tokenSymbol = network.substring(0, 1) + "DTKN";
	const totalSupply = 100 + "000000000000000000";
	if (network === "rinkeby" || network === "development") {
		await deployer.deploy(DummyToken, tokenName, tokenSymbol, totalSupply, {
			from: accounts[0]
		});
		const tokenContract = await DummyToken.deployed();
		console.log(tokenName, tokenSymbol, tokenContract.address);
		await deployer.deploy(HashTimeLock, accounts[1], tokenContract.address);
		const hashTimeLockContract = await HashTimeLock.deployed();
		console.log("HTLC", network, hashTimeLockContract.address);
	} else {
		await deployer.deploy(DummyToken, tokenName, tokenSymbol, totalSupply, {
			from: accounts[1]
		});
		const tokenContract = await DummyToken.deployed();
		console.log(tokenName, tokenSymbol, tokenContract.address);
		await deployer.deploy(HashTimeLock, accounts[0], tokenContract.address, {
			from: accounts[1]
		});
		const hashTimeLockContract = await HashTimeLock.deployed();
		console.log("HTLC", network, hashTimeLockContract.address);
	}
} as Truffle.Migration;

export {};
