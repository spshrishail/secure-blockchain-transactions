const hre = require("hardhat");

async function main() {
  console.log("Starting deployment process...");

  try {
    // Get the contract factory
    const SecureToken = await hre.ethers.getContractFactory("SecureToken");
    console.log("Contract factory loaded...");

    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying from account:", deployer.address);

    // Get deployer balance
    const balance = await deployer.getBalance();
    console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

    // Check if we have enough balance
    if (balance.lt(hre.ethers.utils.parseEther("0.01"))) {
      throw new Error("Insufficient balance. Please add some Sepolia ETH to your account.");
    }

    // Get current nonce
    const currentNonce = await deployer.getTransactionCount();
    console.log("Current nonce:", currentNonce);

    // Get current gas price
    const gasPrice = await hre.ethers.provider.getGasPrice();
    console.log("Current gas price:", hre.ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");

    // Estimate gas for deployment
    const deploymentGas = await SecureToken.signer.estimateGas(
      SecureToken.getDeployTransaction()
    );
    console.log("Estimated gas for deployment:", deploymentGas.toString());

    // Calculate total cost
    const totalCost = gasPrice.mul(deploymentGas);
    console.log("Estimated total cost:", hre.ethers.utils.formatEther(totalCost), "ETH");

    // Try to deploy with increasing nonce values
    let deploymentSuccess = false;
    let retryCount = 0;
    const maxRetries = 3;

    while (!deploymentSuccess && retryCount < maxRetries) {
      try {
        const attemptNonce = currentNonce + retryCount;
        console.log(`Attempting deployment with nonce: ${attemptNonce}`);
        
        // Deploy the contract with optimized gas settings
        const secureToken = await SecureToken.deploy({
          nonce: attemptNonce,
          gasLimit: deploymentGas.mul(12).div(10), // 20% buffer
          gasPrice: gasPrice
        });
        
        // Wait for deployment
        await secureToken.deployed();
        console.log("Contract deployed, waiting for confirmations...");

        // Get the deployed address
        const address = secureToken.address;
        console.log("Contract deployed to:", address);

        // Verify the contract on Etherscan
        if (hre.network.name === "sepolia") {
          try {
            console.log("Verifying contract on Etherscan...");
            await hre.run("verify:verify", {
              address: address,
              constructorArguments: [],
            });
            console.log("Contract verified on Etherscan!");
          } catch (verifyError) {
            if (verifyError.message.includes("already verified")) {
              console.log("Contract is already verified on Etherscan");
            } else {
              console.error("Verification failed:", verifyError.message);
            }
          }
        }

        console.log("✅ Deployment successful!");
        console.log("Contract address:", address);
        deploymentSuccess = true;
      } catch (error) {
        retryCount++;
        if (error.message.includes("already known")) {
          console.log(`Attempt ${retryCount} failed: Transaction with nonce ${currentNonce + retryCount - 1} is in mempool`);
          if (retryCount < maxRetries) {
            console.log("Retrying with next nonce...");
            continue;
          }
        } else if (error.message.includes("insufficient funds")) {
          console.error("Insufficient funds for deployment. Current balance:", 
            hre.ethers.utils.formatEther(balance), "ETH");
          console.error("Estimated cost:", 
            hre.ethers.utils.formatEther(gasPrice.mul(deploymentGas)), "ETH");
          throw error;
        }
        throw error;
      }
    }

    if (!deploymentSuccess) {
      throw new Error("Failed to deploy after multiple attempts. Please try the following:\n" +
        "1. Check your pending transactions on Sepolia Etherscan\n" +
        "2. Cancel any pending transactions in MetaMask\n" +
        "3. Wait a few minutes and try again");
    }
  } catch (error) {
    console.error("❌ Deployment failed!");
    if (error.message.includes("already known")) {
      console.error("All deployment attempts failed. Please try these solutions:");
      console.error("1. Wait for pending transactions to be mined");
      console.error("2. Cancel pending transactions in MetaMask");
      console.error("3. Try again in a few minutes");
    } else if (error.message.includes("insufficient funds")) {
      console.error("Insufficient funds for deployment. Please add more Sepolia ETH to your account.");
      console.error("You can get test ETH from: https://sepoliafaucet.com/");
    } else {
      console.error("Error details:", error.message);
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 