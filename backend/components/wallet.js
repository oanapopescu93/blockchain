const crypto = require('crypto')

class Wallet {
  constructor() {    
    this.privateKey = crypto.randomBytes(32).toString('hex')
    this.publicKey = crypto.createHash('sha256').update(this.privateKey).digest('hex')
    this.balance = 1000
  }
  
  signTransaction(transaction) {    
    return crypto.createHmac('sha256', this.privateKey).update(transaction.toString()).digest('hex')
  }
  
  hasEnoughBalance(amount) {
    return this.balance >= amount
  }
  
  updateBalance(amount) {
    this.balance += amount
  }
}

module.exports = { Wallet }