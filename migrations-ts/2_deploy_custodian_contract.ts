import * as dotenv from "dotenv";
import path from "path";
dotenv.config({
	path: path.join(__dirname, "..", ".env")
});

const CustodianERC721 = artifacts.require("CustodianERC721");
const name: string = process.env.COLLECTION_NAME || "";
const symbol: string = process.env.COLLECTION_SYMBOL || "";

module.exports = function (deployer) {
	deployer.deploy(CustodianERC721, name, symbol);
} as Truffle.Migration;

export {};
