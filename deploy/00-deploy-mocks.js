const {
    developmentChain,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    if (developmentChain.includes(network.name)) {
        console.log("Local Network detected! Deploying mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        });
        console.log("Mocks deployed");
        console.log("----------------------------------------");
    }
};

module.exports.tags = ["all", "mocks"];
