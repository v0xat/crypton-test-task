async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const SimpleFunding = await ethers.getContractFactory("SimpleFunding");
  const simpleFunding = await SimpleFunding.deploy();

  console.log("SimpleFunding address:", simpleFunding.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });