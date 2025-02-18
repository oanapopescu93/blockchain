
import "./style/index.css"

import React, { useState, useEffect } from "react"
import BlockchainControls from "./components/blockchainControlers"
import BlockchainList from "./components/blockchainList"
import Footer from "./partials/footer"
import Popup from "./partials/popup"

function App() {
  const [blocks, setBlocks] = useState([])
  const [popupTemplate, setPopupTemplate] = useState('')
  const [popupText, setPopupText] = useState('')

  // Fetch the blockchain
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await fetch("/blocks")
        const data = await res.json()
        setBlocks(data)
      } catch (err) {
        console.log('error==> ', err.message)
      }
    }
    fetchBlocks()    
    const interval = setInterval(fetchBlocks, 5000)
    return () => clearInterval(interval)
  }, [])

  function updatePopup(e){
    setPopupTemplate(e.template)
    setPopupText(e.text)
  }

  function handlePopupClose(){
    setPopupTemplate('')
    setPopupText('')
  }

  return <div className="blockchain_container">
    <div className="blockchain_title">
      <h1>Blockchain Explorer</h1>
    </div>

    <BlockchainControls updatePopup={updatePopup}/>
    <BlockchainList blocks={blocks} />

    <Footer />

    {popupTemplate !== "" && popupText !== "" ? <Popup template={popupTemplate} text={popupText} handlePopupClose={handlePopupClose}/> : null}
  </div>
}

export default App;