# 🔐 Secure Transaction System

<div align="center">
  <img src="https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white" alt="Ethereum" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Hardhat-F7DF1E?style=for-the-badge&logo=hardhat&logoColor=black" alt="Hardhat" />
  <img src="https://img.shields.io/badge/Solidity-e6e6e6?style=for-the-badge&logo=solidity&logoColor=black" alt="Solidity" />
</div>

<br />

<div align="center">
  <p><strong>A secure blockchain-based transaction system with advanced security features, user authentication, and real-time transaction tracking</strong></p>
</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Usage](#-usage)
  - [Smart Contract Development](#smart-contract-development)
  - [Backend Development](#backend-development)
  - [Frontend Development](#frontend-development)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

This project is a comprehensive secure transaction system built on Ethereum blockchain technology. It provides a robust platform for executing and tracking financial transactions with enhanced security features, user authentication, and real-time monitoring capabilities.

The system consists of three main components:
- **Smart Contracts**: Secure token implementation with transaction tracking
- **Backend API**: RESTful services for authentication and blockchain interactions
- **Frontend Application**: Modern UI for user interactions and transaction management

## ✨ Features

- **🔒 Secure Transactions**: Blockchain-based token transfers with cryptographic security
- **👤 User Authentication**: Complete authentication flow with JWT and blockchain verification
- **💰 Daily Limits**: Configurable transaction limits to prevent unauthorized large transfers
- **📊 Transaction History**: Comprehensive tracking and visualization of all user transactions
- **👁️ Real-time Monitoring**: Live updates on transaction status and blockchain events
- **🖥️ Responsive Design**: Modern dark-themed UI that works across devices
- **🛡️ Enhanced Security**: Multiple layers of protection including input validation and rate limiting

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │◄────┤     Backend     │◄────┤  Smart Contract │
│    (React)      │     │  (Node.js/API)  │     │   (Ethereum)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                       ▲                       ▲
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                        ┌───────▼───────┐
                        │               │
                        │   Database    │
                        │  (MongoDB)    │
                        │               │
                        └───────────────┘
```

## 🛠️ Tech Stack

### Blockchain
- **Ethereum**: Blockchain platform
- **Solidity**: Smart contract language
- **Hardhat**: Development environment
- **Web3.js**: Blockchain interaction library

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: Database
- **JWT**: Authentication

### Frontend
- **React**: UI library
- **Material-UI**: Component library
- **Vite**: Build tool
- **Framer Motion**: Animation library

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB
- MetaMask or similar Ethereum wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/secure-transaction.git
cd secure-transaction
```

2. Install root dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

### Environment Setup

1. Create a `.env` file in the root directory with the following variables:
```
SEPOLIA_URL=<Your Sepolia RPC URL>
MAINNET_URL=<Your Mainnet RPC URL>
PRIVATE_KEY=<Your wallet private key>
ETHERSCAN_API_KEY=<Your Etherscan API key>
```

2. Create a `.env` file in the backend directory:
```
PORT=3000
MONGODB_URI=<Your MongoDB connection string>
JWT_SECRET=<Your JWT secret key>
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 📝 Usage

### Smart Contract Development

1. Compile contracts:
```bash
npx hardhat compile
```

2. Run tests:
```bash
npx hardhat test
```

3. Start a local Hardhat node:
```bash
npx hardhat node
```

4. Deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network <network>
```

5. Verify contracts on Etherscan:
```bash
npx hardhat verify --network <network> <contract_address>
```

### Backend Development

1. Start the development server:
```bash
cd backend
npm run dev
```

2. Access the API at `http://localhost:3000`

### Frontend Development

1. Start the development server:
```bash
cd frontend
npm run dev
```

2. Access the application at `http://localhost:5173`

## 🌐 Deployment

### Smart Contracts

- **Local**: Deploy to Hardhat local network for development
- **Test**: Deploy to Sepolia testnet for testing
- **Production**: Deploy to Ethereum mainnet for production

### Backend & Frontend

- Deploy to your preferred hosting service (AWS, Heroku, Vercel, etc.)
- Configure environment variables for production
- Set up CI/CD pipelines for automated deployment

## 🔒 Security

- **Never commit your `.env` files or private keys**
- Keep sensitive data in environment variables
- Regularly update dependencies to patch security vulnerabilities
- Implement rate limiting to prevent brute force attacks
- Use secure HTTP headers and CORS policies
- Follow blockchain security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>Built with ❤️ by Your Team</p>
</div> 
