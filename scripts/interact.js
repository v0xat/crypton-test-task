const contract = require("../artifacts/contracts/SimpleFunding.sol/SimpleFunding.json");
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", process.env.ALCHEMY_API_KEY);
const signer = new ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY, alchemyProvider);
const simpleFundingContract = new ethers.Contract(process.env.RINKEBY_CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
  // Sending 0.000005 ether to contract
  await simpleFundingContract.fund({ value: ethers.utils.parseEther("0.000005") });
  console.log("Funder address: " + await simpleFundingContract.funders(0));

  // Withdraw ether back to owner
  await simpleFundingContract.withdrawTo(process.env.RINKEBY_OWNER_ADDRESS);
}
main();