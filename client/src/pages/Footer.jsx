import React from 'react'

const Footer = () => {
    const date = new Date().getUTCFullYear();
    return (
        <footer>
            <h5 className="text-center text-black-50" style={{ fontSize: "1.5vw" }}>Copyright{date}@All Rights Reserved</h5>
        </footer>
    )
}

export default Footer