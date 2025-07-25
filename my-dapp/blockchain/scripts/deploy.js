const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const Token = await hre.ethers.getContractFactory("MyToken");
  const token = await Token.deploy();
  // Đảm bảo có địa chỉ hợp đồng
    if (token.target ) {
        console.log("Token deployed to:", token.target);
    } else {
        console.log("Token address is undefined. Deployment may have failed.");
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});