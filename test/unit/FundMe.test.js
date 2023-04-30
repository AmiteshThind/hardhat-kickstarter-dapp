const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("Fund Me", async () => {
    let fundme;
    let deployer;
    let mockV3Aggregator;
    beforeEach(async () => {
        //deploy fund me contract
        //using hardhat-deploy
        const { deployer } = await getNamedAccounts();
        await deployments.fixture("all");
        fundMe = ethers.deployContract("FundMe", deployer);
    });

    describe("constructor", async () => {});
});
