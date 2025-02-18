function Transaction(senderWallet, recipient, amount) {
  let self = this
  self.sender = senderWallet.publicKey
  self.recipient = recipient
  self.amount = amount
  self.timestamp = new Date().toISOString()
  self.signature = senderWallet.signTransaction(self)

  // Check if the transaction is valid
  self.isValid = function() {
    return self.sender !== self.recipient && self.amount > 0 // Check if sender has enough balance and if the signature is correct
  }
}

module.exports = { Transaction }