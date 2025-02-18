const crypto = require('crypto')

function Wallet() {
  let self = this
  self.privateKey = crypto.randomBytes(32).toString('hex')
  self.publicKey = crypto.createHash('sha256').update(self.privateKey).digest('hex')
  self.balance = 1000

  // Sign the transaction with the private key
  self.signTransaction = function(transaction) {
    return crypto.createHmac('sha256', self.privateKey).update(transaction.toString()).digest('hex')
  }

  // Check if the wallet has enough balance
  self.hasEnoughBalance = function(amount) {
    return self.balance >= amount
  }

  // Update the wallet balance
  self.updateBalance = function(amount) {
    self.balance += amount
  }
}

module.exports = { Wallet }