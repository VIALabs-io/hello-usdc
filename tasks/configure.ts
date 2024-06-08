import { task } from "hardhat/config";
const chainsConfig = require('@vialabs-io/contracts/config/chains');
const networks = require("../networks.json");

const fs = require('fs');

task("configure", "")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre:any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		
		let addresses = [];
		let chainids = [];
		let confirmations=[];
		for(let x=0; x < networks.length; x++) {
			const helloQRND = require(process.cwd()+"/deployments/"+networks[x]+"/HelloUSDC.json");
			const chainId = fs.readFileSync(process.cwd()+"/deployments/"+networks[x]+"/.chainId").toString();
			addresses.push(helloQRND.address);
			chainids.push(chainId);
			confirmations.push(1);
		}

		const helloUSDC = await ethers.getContract("HelloUSDC");

		console.log('configuring message gateway:', chainsConfig[hre.network.config.chainId].message);
		await (await helloUSDC.configureClient(chainsConfig[hre.network.config.chainId].message, chainids, addresses, confirmations)).wait();

		console.log('configuring feature gateway:', chainsConfig[hre.network.config.chainId].featureGateway)
		await (await helloUSDC.configureFeatureGateway(chainsConfig[hre.network.config.chainId].featureGateway)).wait();
	});
