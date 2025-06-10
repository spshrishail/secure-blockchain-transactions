// Contract address (will be updated after deployment)
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Contract ABI
export const SECURE_TOKEN_ABI = [
    {
        "inputs": [],
        "name": "register",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "isRegistered",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            }
        ],
        "name": "getUserTransactions",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "transactionType",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "status",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "gasUsed",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SecureToken.Transaction[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getDailyLimit",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];

// Sepolia network configuration
export const NETWORK_CONFIG = {
    name: 'Sepolia',
    chainId: 11155111,
    chainIdHex: '0xaa36a7', // Properly formatted hex for Sepolia
    rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: {
        name: 'Sepolia ETH',
        symbol: 'ETH',
        decimals: 18
    },
    isTestnet: true,
    requiredConfirmations: 2,
    gasLimitMultiplier: 1.2,
    defaultGasLimit: 500000
};

// Helper functions for network support
export function isNetworkSupported(chainId) {
    return chainId === NETWORK_CONFIG.chainId;
}

export function formatChainId(chainId) {
    if (typeof chainId === 'string') {
        if (chainId.startsWith('0x')) {
            return chainId;
        }
        return `0x${parseInt(chainId).toString(16)}`;
    }
    return `0x${chainId.toString(16)}`;
} 