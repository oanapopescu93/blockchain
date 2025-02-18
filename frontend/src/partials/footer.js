import React, { useState, useEffect } from 'react'

function Footer() {
    const [date, setDate] = useState('')

    useEffect(() => {
        handleDate()
    }, [])
    
    function handleDate(){
        let my_date = new Date()
        my_date = my_date.getFullYear()
        setDate(my_date)
    }

    return <footer><h6>Copyright © {date} Oana Popescu. All rights reserved.</h6></footer>
}

export default Footer