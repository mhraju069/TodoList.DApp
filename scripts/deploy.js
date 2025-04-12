
// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  console.log("Deploying Todo contract...");
  const Todo = await hre.ethers.getContractFactory("Todo");
  const todo = await Todo.deploy();
  await todo.waitForDeployment();
  
  console.log("Successfully deployed Todo contract!");
  console.log("Todo contract address:", todo.target);
  
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
