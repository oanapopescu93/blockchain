import React, { useState } from 'react'

function BlockchainControls(props) {
    const { updatePopup } = props

    const [blockData, setBlockData] = useState("")
    const [wallet, setWallet] = useState({ publicKey: "", balance: 0 })
    const [transaction, setTransaction] = useState({
        sender: "",
        recipient: "",
        amount: 0,
    })
    const [isMining, setIsMining] = useState(false)

    const createWallet = async () => {
        try {
          const res = await fetch("/wallet", {
            method: "POST",
          })
          const data = await res.json();
          setWallet({
            publicKey: data.publicKey,
            balance: data.balance,
          })
        } catch (err) {
            updatePopup({template: "error", text: "Error creating wallet: " + err.message})
        }
    }

    const createTransaction = async () => {
        try {
          const res = await fetch("/transaction", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(transaction),
          })
          const data = await res.json()
          if (data.error) {            
            updatePopup({template: "error", text: data.error})
          } else {
            setTransaction({ sender: "", recipient: "", amount: 0 })
            alert("Transaction successful")
            updatePopup({template: "success", text: "Transaction successful"})
          }
        } catch (err) {          
            updatePopup({template: "error", text: "Error creating transaction: " + err.message})
        }
    }

    const mineBlock = async () => {
        if (isMining) return
        setIsMining(true)
    
        const data = { data: blockData }
        try {
          const res = await fetch("/mine", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
    
          if (!res.ok) {
            updatePopup({template: "error", text: "Failed to mine the block."})
          }    
          
          setBlockData("")
        } catch (err) {          
          updatePopup({template: "error", text: "Error mining block: " + err.message})
        } finally {
          setIsMining(false)
        }
    }

    return <div className="blockchain_left">
    <div className="blockchain_box blockchain_create_wallet">
      <h2>Create Wallet</h2>
      <button className="blockchain_button" onClick={createWallet}>Create New Wallet</button>
      {wallet.publicKey && (
        <div>
          <p><strong>Public Key:</strong> <span className="long_text">{wallet.publicKey}</span></p>
          <p><strong>Balance:</strong> <span>{wallet.balance}</span></p>
        </div>
      )}
    </div>    
    <div className="blockchain_box blockchain_send_transactions">
      <h2>Send Transaction</h2>
      <input
        className="blockchain_input"
        type="text"
        value={transaction.sender}
        onChange={(e) => setTransaction({ ...transaction, sender: e.target.value })}
        placeholder="Sender Wallet Public Key"
      />
      <input
        className="blockchain_input"
        type="text"
        value={transaction.recipient}
        onChange={(e) => setTransaction({ ...transaction, recipient: e.target.value })}
        placeholder="Recipient Wallet Public Key"
      />
      <input
        className="blockchain_input"
        type="number"
        value={transaction.amount}
        onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
        placeholder="Amount"
      />
      <button className="blockchain_button" onClick={createTransaction}>Send Transaction</button>
    </div>
    <div className="blockchain_box blockchain_enter_block_data">
      <h2>Enter block data</h2>
      <input
        className="blockchain_input"
        type="text"
        value={blockData}
        onChange={(e) => setBlockData(e.target.value)}
        placeholder="Enter block data"
      />
      <button className="blockchain_button" onClick={mineBlock} disabled={isMining}>
        {isMining ? "Mining..." : "Mine Block"}
      </button>
    </div>    
  </div>
}

export default BlockchainControls