const SHA256 = require("crypto-js/sha256")

function Block(index, timestamp, previousHash = "", data = null) {
  let self = this
  self.index = index
  self.timestamp = timestamp
  self.previousHash = previousHash
  self.data = data  
  self.nonce = 0
  
  // Calculate SHA-256 hash of the block including transactions
  self.calculateHash = ()=>{
    return SHA256(
      self.index + self.previousHash + self.timestamp + JSON.stringify(self.data) + self.nonce
    ).toString()
  }

  self.hash = self.calculateHash()
  
  // Mine the block (Proof of Work)
  self.mineBlock = (difficulty)=>{
      while (self.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        self.nonce++
        self.hash = self.calculateHash() // Recalculate hash with the updated nonce
      }
      console.log(`Block mined: ${self.hash}`)
  } 
  
  // Add a transaction to the block
  self.addTransaction = (data)=>{
      console.log(data)
      if (data.isValid()) {
        self.data = []
        self.data.push(data)
      } else {
        console.log("Invalid transaction")
      }
    }
}
  
  module.exports = { Block }