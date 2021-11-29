const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const SimpleFunding = await ethers.getContractFactory("SimpleFunding");
  const simpleFunding = await SimpleFunding.deploy();

  console.log("SimpleFunding address:", simpleFunding.address);

  // Сохраняем артефакты и адрес контракта в /frontendnd
  saveFrontendFiles(simpleFunding);
}

const saveFrontendFiles = (simpleFunding) => {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "/../frontend/src/contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ SimpleFunding: simpleFunding.address }, undefined, 2)
  );

  const SimpleFundingArtifact = artifacts.readArtifactSync("SimpleFunding");

  fs.writeFileSync(
    contractsDir + "/SimpleFunding.json",
    JSON.stringify(SimpleFundingArtifact, null, 2)
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });