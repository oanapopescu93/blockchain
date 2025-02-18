const WebSocket = require("ws")
const express = require("express")
const cors = require("cors")
const { Blockchain } = require("./components/blockchain")
const { Block } = require("./components/block")

const dotenv = require('dotenv')
const path = require('path')
var NODE_ENV = (process.env.NODE_ENV || 'development').trim() 
dotenv.config({
  path: path.resolve(__dirname, `.env.${NODE_ENV}`)
})

const HTTP_PORT = process.env.HTTP_PORT || 3001
const P2P_PORT = process.env.P2P_PORT || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(",") : []

const blockchain = new Blockchain()
const sockets = []

// Create HTTP server for block interaction
const app = express()
app.use(cors())
app.use(express.json())

// API to get the blockchain
app.get("/blocks", (req, res) => {
  res.json(blockchain.chain)
})

// API to add a new block
app.post("/mine", (req, res) => {
  const newBlock = new Block(
    blockchain.chain.length,
    new Date().toISOString(),
    blockchain.getLatestBlock().hash,
    req.body.data
  )

  blockchain.addBlock(newBlock)
  broadcastLatestBlock()
  console.log("Block added: ", req.body, JSON.stringify(newBlock))
  res.send(newBlock)
})

// API to create a new wallet
app.post("/wallet", (req, res) => {
  const wallet = blockchain.createWallet()
  res.json({
    publicKey: wallet.publicKey,
    balance: wallet.balance
  })
})

// API to create a new transaction
app.post("/transaction", (req, res) => {
  const { sender, recipient, amount } = req.body
  const senderWallet = blockchain.wallets[sender]
  if (senderWallet) {
    const transaction = blockchain.createTransaction(senderWallet, recipient, amount)
    if (transaction) {
      const latestBlock = blockchain.getLatestBlock()
      latestBlock.addTransaction(transaction)
      // Broadcast the new transaction to peers
      broadcastTransaction(transaction)
      res.json(transaction)
    } else {
      res.status(400).json({ error: "Transaction failed" })
    }
  } else {
    res.status(400).json({ error: "Sender wallet not found" })
  }
})

// Start HTTP Server
app.listen(HTTP_PORT, () => console.log(`HTTP Server running on port ${HTTP_PORT}`))

// WebSocket P2P Server
const server = new WebSocket.Server({ port: P2P_PORT })

server.on("connection", (ws) => {
  console.log("New peer connected")
  sockets.push(ws)
  ws.on("message", (message) => handleBlockchainMessage(ws, message))
  sendBlockchain(ws) // Send the blockchain to the new peer
})

// Connect to peers
const connectToPeers = () => {
  peers.forEach((peer) => {
    const ws = new WebSocket(peer)
    ws.on("open", () => {
      console.log("Connected to peer:", peer)
      sockets.push(ws)
      sendBlockchain(ws) // Send blockchain when connected
    })
    ws.on("message", (message) => handleBlockchainMessage(ws, message))
    ws.on("close", () => console.log("Peer disconnected"))
    ws.on("error", () => console.log("Connection failed", peer))
  })
}

// Send blockchain to a new node
const sendBlockchain = (ws) => {
  ws.send(JSON.stringify({ type: "BLOCKCHAIN", data: blockchain.chain }))
}

// Handle incoming messages
const handleBlockchainMessage = (ws, message) => {
  const msg = JSON.parse(message)
  if (msg.type === "BLOCKCHAIN") {
    replaceBlockchain(msg.data)
  } else if (msg.type === "NEW_BLOCK") {
    blockchain.addBlock(msg.data)
    console.log('New block added:', msg.data)
  } else if (msg.type === "NEW_TRANSACTION") {
    // Add new transaction to the latest block
    const latestBlock = blockchain.getLatestBlock()
    latestBlock.addTransaction(msg.data)
    console.log('New transaction added:', msg.data)
  }
}

// Replace blockchain if needed
const replaceBlockchain = (newChain) => {
  if (newChain.length > blockchain.chain.length && blockchain.isChainValid(newChain)) {
    console.log("Replacing blockchain with a longer valid chain")
    blockchain.chain = newChain
  }
}

// Broadcast the latest block to all nodes
const broadcastLatestBlock = () => {
  const latestBlock = blockchain.getLatestBlock()
  sockets.forEach((socket) => {
    socket.send(JSON.stringify({ type: "NEW_BLOCK", data: latestBlock }))
  })
}

// Broadcast a new transaction to all peers
const broadcastTransaction = (transaction) => {
  sockets.forEach((socket) => {
    socket.send(JSON.stringify({ type: "NEW_TRANSACTION", data: transaction }))
  })
}

// Connect to peers if any are specified
connectToPeers()