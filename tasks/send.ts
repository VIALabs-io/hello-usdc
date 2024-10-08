import { task } from "hardhat/config";
import chainConfig from "@vialabs-io/contracts/config/chains";

task("send", "")
    .addParam("chain", "Chain ID")
	.addParam("recipient", "Recipient address")
	.addParam("amount", "Amount to send")
	.addOptionalParam("wallet", "Custom wallet")
	.addOptionalParam("signer", "Custom signer (private key)")
	.addOptionalParam("provider", "Custom provider RPC url")
	.setAction(async (args, hre: any) => {
		const ethers = hre.ethers;
		const [deployer] = await ethers.getSigners();

		let signer = deployer;
		let wallet = deployer.address;
		if (args.signer) signer = new ethers.Wallet(args.signer, new ethers.providers.JsonRpcProvider(args.provider));
		if (args.wallet) wallet = args.wallet;
		// get usdc contract that is already deployed by address

		console.log('usdc', chainConfig[hre.network.config.chainId].usdc);

		const usdc = await ethers.getContractAt("ERC20", chainConfig[hre.network.config.chainId].usdc, signer);
		const helloUSDC = await ethers.getContract("HelloUSDC");

		const amount = ethers.parseUnits(args.amount, await usdc.decimals());

		console.log('Approving', amount, 'to', await helloUSDC.getAddress());
		await (await usdc.connect(signer).approve(await helloUSDC.getAddress(), ethers.parseEther("10000000"))).wait();

		console.log('Sending', amount, 'to', args.recipient);
		await (await helloUSDC.send(args.chain, args.recipient, amount)).wait();
		console.log('Sent', amount, 'to', args.recipient);
	});
