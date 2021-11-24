import * as dotenv from "dotenv";
import path from "path";
dotenv.config({
	path: path.join(__dirname, "..", ".env")
});

const CustodianERC721Polygon = artifacts.require("PangolinBeta");
const name: string = process.env.COLLECTION_NAME || "";
const symbol: string = process.env.COLLECTION_SYMBOL || "";

module.exports = function (deployer) {
	deployer.deploy(CustodianERC721Polygon, name + "(Polygon)", symbol + "(P)");
} as Truffle.Migration;

export {};
