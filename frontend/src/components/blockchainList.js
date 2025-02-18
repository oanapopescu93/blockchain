import React from 'react'
import { formatDate } from "../utils/utils"

function BlockchainList(props) {
    const { blocks } = props

    return <div className="blockchain_right">
    {blocks.length > 0 ? <>
        {blocks.map((block, index) => {
          return <div key={index} className="blockchain_transaction_container">
             <div className="blockchain_transaction">
              <p className="blockchain_transaction_title"><strong>Index:</strong> {block.index}</p>
              <p><strong>Date:</strong> {formatDate(block.timestamp)}</p>
              <p><strong>Hash:</strong> <span className="long_text">{block.hash}</span></p>
              <p><strong>Previous Hash:</strong> <span className="long_text">{block.previousHash}</span></p>
              {block.data ? <>
                {Array.isArray(block.data) > 0 ? <div>
                  <strong>Transactions:</strong>
                  <ul>
                    {block.data.map((tx, idx) => {
                      return <li key={idx}>
                        <p><strong>From:</strong> <span className="long_text">{tx.sender}</span></p>
                        <p><strong>To:</strong> <span className="long_text">{tx.recipient}</span></p>
                        <p><strong>Amount:</strong> {tx.amount}</p>
                      </li>
                    })}
                  </ul>
                </div> : <p><strong>Data:</strong> {block.data}</p>}
              </> : <p><strong>Data:</strong> No data</p>}
            </div>
          </div>
        })}
    </> : <p>No blocks available.</p>}    
  </div>
}

export default BlockchainList