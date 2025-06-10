class Transaction {
  constructor(sender, recipient, amount) {
      this.sender = sender;
      this.recipient = recipient;
      this.amount = amount;
      this.timestamp = Date.now();
  }
}

module.exports = Transaction;