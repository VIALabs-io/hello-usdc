import { DeployFunction } from "hardhat-deploy/types";
import chainConfig from "@vialabs-io/contracts/config/chains";

const func: DeployFunction = async function (hre: any) {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy } = hre.deployments;

	await deploy("HelloUSDC", {
		from: deployer,
		args: [],
		log: true,
	});

	return hre.network.live;
};

export default func;
func.id = "deploy_hello_usdc";
func.tags = ["HelloUSDC"];
func.dependencies = [];
