import React from 'react'

const Cards = (props) => {
    return (
        <>
            <div className="card m-4 text-white" style={{ width: "25rem", backgroundColor: "#F98866" }}>
                <div className="card-body">
                    <h5>{props.heading}</h5>
                    <p className="card-text">{props.para}</p>
                </div>
            </div>
        </>
    )
}

export default Cards