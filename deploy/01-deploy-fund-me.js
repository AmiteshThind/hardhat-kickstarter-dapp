const { networkConfig, developmentChain } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

// function deployFunc() {}

// //the function that runs when the script is called (basically like main)
// module.exports.default = deployFunc ;

// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre;
// };hre is global variable
// hre is hardhat run timenviroment object that gives all detaisl about the hre such as blockc number,transctions,accounts, deployments, networks etc
module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    console.log("chainId is:" + chainId);

    //if chainId is X use address Y
    // if cahin id iz M use address N
    if (developmentChain.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }
    //if the contract doesnt exist we deply a minimal version of it for local testing
    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer, //who deploying
        args: args, //constructor arguments
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    //verfiy deployed contract

    if (
        !developmentChain.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //verify
        await verify(fundMe.address, args);
    }

    log("-----------------------------------------------------");
};
module.exports.tags = ["all", "fundme"];
