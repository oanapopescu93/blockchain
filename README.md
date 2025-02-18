# Blockchain Project
This project consists of a blockchain backend and a React frontend that interacts with it. It also supports peer-to-peer (P2P) communication for decentralized interaction.

## Getting Started
Clone the Repository

git clone https://github.com/your-username/blockchain.git
cd blockchain

## Installation

### Backend Setup

1. Navigate to the backend directory: cd backend

2. Install dependencies: npm install

3. Go back: cd..

### Frontend Setup

1. Navigate to the frontend directory: cd frontend

2. Install dependencies: npm install

3. Go back: cd..

### Webapp Setup

1. Install dependencies: npm install

2. Start project: npm start (for production) or npm run dev (for development)

## Using the Frontend to Interact with the Blockchain

1. The frontend provides a Blockchain Explorer to view blocks and transactions.
2. You can create wallets, send transactions, and mine blocks through the UI.
3. Transactions are validated and added to the blockchain stored on the backend.

### Using Peer-to-Peer (P2P) Communication

1. The backend supports WebSocket-based P2P communication.

2. To start a new node and connect to existing nodes:
npm run dev

3. When multiple instances are running, they sync blockchain data automatically.

- Start Node 1 (Port 3001, P2P Port 5001)

HTTP_PORT=3001 P2P_PORT=5001 PEERS=ws://localhost:5002,ws://localhost:5003 node index.js

- Start Node 2 (Port 3002, P2P Port 5002)

HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001,ws://localhost:5003 node index.js

- Start Node 3 (Port 3003, P2P Port 5003)

HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 node index.js

- Mining a New Block

curl -X POST -H "Content-Type: application/json" -d '{"data":"First Transaction"}' http://localhost:3001/mine

- Example response:

{
  "index": 1,
  "timestamp": 1739814983656,
  "previousHash": "f6af0a8091973adc93e4dc5c293d73502b938d910b4f293c474bf2745384bbb2",
  "data": "First Transaction",
  "hash": "0000438ccc741116588d7364215e982db86033f33a038d79160dd9c4ac6769b8",
  "nonce": 215277
}
