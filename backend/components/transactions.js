class Transaction {
    constructor(senderWallet, recipient, amount) {
      this.sender = senderWallet.publicKey
      this.recipient = recipient
      this.amount = amount
      this.timestamp = new Date().toISOString()
      this.signature = senderWallet.signTransaction(this)
    }  
    
    isValid() {      
      return this.sender !== this.recipient && this.amount > 0 //Check if sender has enough balance and if the signature is correct
    }
  }
  
  module.exports = { Transaction }