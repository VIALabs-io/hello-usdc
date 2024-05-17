import { DeployFunction } from "hardhat-deploy/types";
import chainConfig from "@cryptolink/contracts/config/chains";

const func: DeployFunction = async function (hre: any) {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy } = hre.deployments;

	console.log(chainConfig[hre.network.config.chainId].featureGateway);

	await deploy("HelloUSDC", {
		from: deployer,
		args: [
			chainConfig[hre.network.config.chainId].featureGateway
		],
		log: true,
		
	});

	return hre.network.live;
};

export default func;
func.id = "deploy_hello_usdc";
func.tags = ["HelloUSDC"];
func.dependencies = [];
