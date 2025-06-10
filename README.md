# Blockchain Development Environment

This directory contains the smart contract development environment using Hardhat.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in this directory with the following variables:
```
SEPOLIA_URL=<Your Sepolia RPC URL>
MAINNET_URL=<Your Mainnet RPC URL>
PRIVATE_KEY=<Your wallet private key>
ETHERSCAN_API_KEY=<Your Etherscan API key>
```

3. Compile contracts:
```bash
npx hardhat compile
```

## Available Commands

- `npx hardhat compile`: Compile smart contracts
- `npx hardhat test`: Run tests
- `npx hardhat node`: Start a local Hardhat node
- `npx hardhat run scripts/deploy.js --network <network>`: Deploy contracts
- `npx hardhat verify --network <network> <contract_address>`: Verify contracts on Etherscan

## Networks

- Local: `localhost`
- Test: `sepolia`
- Production: `mainnet`

## Security

- Never commit your `.env` file
- Keep your private keys secure
- Use environment variables for sensitive data 