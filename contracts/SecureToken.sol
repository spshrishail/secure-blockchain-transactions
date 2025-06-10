// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureToken {
    struct Transaction {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        string transactionType;
        bool completed;
        uint256 status; // 0: pending, 1: completed, 2: failed
        uint256 gasUsed;
    }

    mapping(address => mapping(uint256 => Transaction)) private userTransactions;
    mapping(address => uint256) private userTransactionCount;
    mapping(address => bool) private registeredUsers;
    mapping(address => uint256) private userDailyLimit;
    mapping(address => uint256) private userLastTransactionTime;
    
    address public owner;
    bool public paused;
    uint256 public constant MAX_DAILY_LIMIT = 100 ether; // Increased for testing
    uint256 public constant TRANSACTION_FEE = 0; // Removed fee for local testing
    uint256 public constant MIN_TRANSACTION_AMOUNT = 0; // Removed minimum for testing
    uint256 public constant MIN_GAS_LIMIT = 21000;
    uint256 public constant MAX_GAS_LIMIT = 12000000; // Increased for local network

    event TransactionExecuted(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp,
        string transactionType,
        uint256 status,
        uint256 gasUsed
    );

    event UserRegistered(address indexed user);
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);
    event DailyLimitUpdated(address indexed user, uint256 newLimit);
    event GasLimitUpdated(uint256 newGasLimit);

    constructor() {
        owner = msg.sender;
        paused = false;
    }

    modifier onlyRegisteredUser() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    function register() external {
        require(!registeredUsers[msg.sender], "User already registered");
        registeredUsers[msg.sender] = true;
        userDailyLimit[msg.sender] = MAX_DAILY_LIMIT;
        emit UserRegistered(msg.sender);
    }

    function transfer(address to) external payable whenNotPaused onlyRegisteredUser {
        require(to != address(0), "Invalid recipient address");
        require(msg.value > 0, "Amount must be greater than 0");
        require(msg.value <= userDailyLimit[msg.sender], "Amount exceeds daily limit");
        
        // Check if 24 hours have passed since last transaction
        if (block.timestamp - userLastTransactionTime[msg.sender] >= 1 days) {
            userDailyLimit[msg.sender] = MAX_DAILY_LIMIT;
        }

        // Transfer the full amount to recipient
        (bool success,) = payable(to).call{value: msg.value}("");
        require(success, "Transfer failed");
        
        uint256 gasUsed = gasleft();
        
        uint256 currentCount = userTransactionCount[msg.sender];
        Transaction memory newTransaction = Transaction({
            from: msg.sender,
            to: to,
            amount: msg.value,
            timestamp: block.timestamp,
            transactionType: "Transfer",
            completed: true,
            status: 1,
            gasUsed: gasUsed
        });

        userTransactions[msg.sender][currentCount] = newTransaction;
        userTransactionCount[msg.sender] = currentCount + 1;
        userLastTransactionTime[msg.sender] = block.timestamp;
        userDailyLimit[msg.sender] -= msg.value;

        if (msg.sender != to) {
            currentCount = userTransactionCount[to];
            userTransactions[to][currentCount] = newTransaction;
            userTransactionCount[to] = currentCount + 1;
        }

        emit TransactionExecuted(
            msg.sender,
            to,
            msg.value,
            block.timestamp,
            "Transfer",
            1,
            gasUsed
        );
    }

    function getUserTransactions(address userAddress) 
        external 
        view 
        returns (Transaction[] memory) 
    {
        uint256 count = userTransactionCount[userAddress];
        Transaction[] memory transactions = new Transaction[](count);
        
        for(uint256 i = 0; i < count; i++) {
            transactions[i] = userTransactions[userAddress][i];
        }
        
        return transactions;
    }

    function isRegistered(address user) external view returns (bool) {
        return registeredUsers[user];
    }

    function getDailyLimit(address user) external view returns (uint256) {
        return userDailyLimit[user];
    }

    function setDailyLimit(address user, uint256 newLimit) external onlyOwner {
        require(newLimit <= MAX_DAILY_LIMIT, "Limit exceeds maximum");
        userDailyLimit[user] = newLimit;
        emit DailyLimitUpdated(user, newLimit);
    }

    function pause() external onlyOwner {
        paused = true;
        emit ContractPaused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit ContractUnpaused(msg.sender);
    }

    // Function to receive ETH
    receive() external payable {}

    // Function to withdraw ETH (only owner)
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success,) = payable(owner).call{value: balance, gas: 50000}("");
        require(success, "Withdrawal failed");
    }
} 