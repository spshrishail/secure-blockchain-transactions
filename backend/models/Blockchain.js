const Block = require('./Block');
const Transaction = require('./Transaction');

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        return new Block("0", []);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    mineBlock() {
        const block = new Block(this.getLatestBlock().hash, this.pendingTransactions);
        this.chain.push(block);
        this.pendingTransactions = [];
        return block;
    }
}

module.exports = Blockchain;
