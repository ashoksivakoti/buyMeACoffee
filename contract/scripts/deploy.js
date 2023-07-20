

const hre = require("hardhat");

async function main() {
  // We get the contract to deploy.
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();

  await buyMeACoffee.waitForDeployment();

  console.log("BuyMeACoffee deployed to:", buyMeACoffee.target);
}
 

// to properly handle errors
const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.erroe(error);
      process.exit(1);
    }
  };
  
runMain();