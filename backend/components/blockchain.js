const { Transaction } = require('./transactions')
const { Wallet } = require('./wallet')
const { Block } = require("./block")

function Blockchain() {
  let self = this  
  self.difficulty = 4 // Difficulty for Proof of Work
  self.wallets = {}

  // Create Genesis Block
  self.createGenesisBlock = function() {
    return new Block(0, Date.now(), 0, "Genesis Block")
  }

  self.chain = [self.createGenesisBlock()]

  // Get the latest block in the chain
  self.getLatestBlock = function() {
    return self.chain[self.chain.length - 1]
  }

  // Add a new block to the blockchain
  self.addBlock = function(newBlock) {
    newBlock.mineBlock(self.difficulty)
    newBlock.previousHash = self.getLatestBlock().hash
    newBlock.timestamp = Date.now()    
    self.chain.push(newBlock)
  }

  // Create a new wallet
  self.createWallet = function() {
    const wallet = new Wallet()
    self.wallets[wallet.publicKey] = wallet
    return wallet
  }

  // Create a transaction and add it to the block
  self.createTransaction = function(senderWallet, recipient, amount) {
    if (senderWallet.hasEnoughBalance(amount)) {
      const transaction = new Transaction(senderWallet, recipient, amount)
      senderWallet.updateBalance(-amount)
      if (!self.wallets[recipient]) {
        self.wallets[recipient] = new Wallet() // Create wallet for recipient if not exists
      }
      self.wallets[recipient].updateBalance(amount)
      return transaction
    } else {
      console.log("Insufficient balance")
      return null
    }
  }

  // Validate the blockchain integrity
  self.isChainValid = function() {
    for (let i = 1; i < self.chain.length; i++) {
      const currentBlock = self.chain[i]
      const previousBlock = self.chain[i - 1]

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