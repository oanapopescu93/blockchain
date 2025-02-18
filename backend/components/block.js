const SHA256 = require("crypto-js/sha256")

class Block {
    constructor(index, timestamp, previousHash = "", data = null) {
      this.index = index
      this.timestamp = timestamp
      this.previousHash = previousHash
      this.data = data
      this.hash = this.calculateHash()
      this.nonce = 0
    }
  
    // Calculate SHA-256 hash of the block including transactions
    calculateHash() {
      return SHA256(
        this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce
      ).toString()
    }
  
    // Mine the block (Proof of Work)
    mineBlock(difficulty) {
      while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        this.nonce++
        this.hash = this.calculateHash() // Recalculate hash with the updated nonce
      }
      console.log(`Block mined: ${this.hash}`)
    }
  
    // Add a transaction to the block
    addTransaction(data) {
      console.log(data)
      if (data.isValid()) {
        this.data = []
        this.data.push(data)
      } else {
        console.log("Invalid transaction")
      }
    }
  }
  
  module.exports = { Block }