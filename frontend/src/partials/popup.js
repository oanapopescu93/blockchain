import React from 'react'

function Popup(props) {
    const { template, text, handlePopupClose } = props
    console.log(template, text)

    return <div className="popup_container">
        <div className={"popup " + template}>
            <div className="popup_header">
                <div className="popup_close" onClick={handlePopupClose}>x</div>
                <h3>{template}</h3>
            </div>
            <div className="popup_body">
                <p>{text}</p>
            </div>
        </div>
    </div>
}

export default Popup