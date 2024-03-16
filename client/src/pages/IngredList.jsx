import React from 'react'
import Options from './Options';

const IngredList = ({ name, description, price, items, optional }) => {

    return (
        <>
            <div className="card m-4 text-white" style={{ width: "400px", backgroundColor: "#F98866" }}>
                <img src={`/src/Images/${name}.jpg`} className="card-img-top img-fluid" alt={name} style={{ objectFit: "cover", height: "300px" }} />
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text">{description}</p>
                </div>
                <h6 className="fw-bold mx-3">Price: {price} rupees</h6><br />
                <div className="d-flex flex-column mx-3 mb-2">
                    {items.map((curr, index) => {
                        return <Options key={index} item={curr} optional={optional} name={name} />
                    })}
                </div>
            </div>
        </>
    )
}


export default IngredList;