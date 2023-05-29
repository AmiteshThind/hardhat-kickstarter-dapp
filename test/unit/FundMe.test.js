const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("Fund Me", async () => {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("0.08");
    beforeEach(async () => {
        //deploy fund me contract
        //using hardhat-deploy
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture("all");
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
    });

    describe("constructor", async () => {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address);
        });
    });

    describe("fund", async () => {
        it("Fails if you dont sent enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            );
        });

        it("updated the amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue });
            const response = await fundMe.addressToAmountFunded(deployer);
            assert.equal(response.toString(), sendValue.toString());
        });

        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue });
            const funder = await fundMe.funders(0);
            assert.equal(funder, deployer);
        });
    });

    describe("Withdraw", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue });
        });

        it("Withdraw ETH from a single founder", async () => {
            //arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            //act
            const transactionResponse = await fundMe.withdraw();
            const transactionReciept = await transactionResponse.wait(1);
            const { gasUsed, effectiveGasPrice } = transactionReciept;
            const gasCost = gasUsed.mul(effectiveGasPrice);
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            //assert
            assert.equal(endingFundMeBalance, 0);
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance),
                endingDeployerBalance.add(gasCost).toString()
            );
        });
    });

    it("only allows the owner to withdraw", async () => {
        const accounts = await ethers.getSigners();
        const attacker = accounts[1];
        const attackerConnectedContract = await fundMe.connect(attacker);
        await expect(attackerConnectedContract.withdraw()).to.be.reverted;
    });
});
