require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("interact", "Interacts with Rinkeby contract from account specified in .env")
  .addParam("address", "The contract address on Rinkeby")
  .setAction(async (taskArgs) => {
    const contract = require("./artifacts/contracts/SimpleFunding.sol/SimpleFunding.json");
    const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", process.env.ALCHEMY_API_KEY);
    const signer = new ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY, alchemyProvider);
    const simpleFunding = new ethers.Contract(taskArgs.address, contract.abi, signer);

    console.log("Sending 0.001 ether from " + process.env.RINKEBY_OWNER_ADDRESS);
    await simpleFunding.fund({ value: ethers.utils.parseEther("0.001") });

    console.log("Withdrawing all ether from contract to contract owner " + process.env.RINKEBY_OWNER_ADDRESS);
    await simpleFunding.withdrawTo(await simpleFunding.owner());
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.RINKEBY_PRIVATE_KEY}`]
    }
  }
};
