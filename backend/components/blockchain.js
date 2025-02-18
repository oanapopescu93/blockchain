const { Transaction } = require('./transactions')
const { Wallet } = require('./wallet')
const { Block } = require("./block")

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4 // Difficulty for Proof of Work
    this.wallets = {}
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), 0, "Genesis Block")
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.timestamp = Date.now()
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock)
  }
  
  createWallet() {
    const wallet = new Wallet()
    this.wallets[wallet.publicKey] = wallet
    return wallet
  }

  // Create a transaction and add it to the block
  createTransaction(senderWallet, recipient, amount) {    
    if (senderWallet.hasEnoughBalance(amount)) {
      const transaction = new Transaction(senderWallet, recipient, amount)
      senderWallet.updateBalance(-amount)
      if (!this.wallets[recipient]) {
        this.wallets[recipient] = new Wallet() // Create wallet for recipient if not exists
      }
      this.wallets[recipient].updateBalance(amount)
      return transaction
    } else {
      console.log("Insufficient balance")
      return null
    }
  }

  // Validate the blockchain integrity
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      // Check if the current block's hash is still valid
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }

      // Check if the previous block hash is properly linked
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }
}

module.exports = { Blockchain }