require('dotenv').config();

module.exports = {
    networks: {
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/your-api-key",
            chainId: 11155111
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337
        }
    },
    contracts: {
        SecureToken: {
            // This will be updated by deployment script
            address: process.env.SECURE_TOKEN_ADDRESS || "",
            // ABI will be imported from artifacts
            artifactPath: "../artifacts/contracts/SecureToken.sol/SecureToken.json"
        }
    }
}; 