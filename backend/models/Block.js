const crypto = require('crypto');

class Block {
    constructor(previousHash, transactions) {
        this.previousHash = previousHash;
        this.transactions = transactions;
        this.timestamp = Date.now();
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256').update(JSON.stringify(this)).digest('hex');
    }
}

module.exports = Block;