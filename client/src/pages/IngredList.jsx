import React from 'react'
import { useAuth } from '../store/auth';

const IngredList = ({ name, description, price }) => {
    const { getOptions, options, isLoggedIn } = useAuth();
    let isChecked = options.includes(name);
    const handleChange = (event) => {
        const { value, checked } = event.target;
        getOptions(value, checked);
    }
    return (
        <>
            <div className="card m-4 text-white" style={{ width: "400px", backgroundColor: "#F98866" }}>
                <img src={`/src/Images/${name}.jpg`} className="card-img-top img-fluid" alt={name} style={{ objectFit: "cover", height: "300px" }} />
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text">{description}</p>
                </div>
                <h6 className="mx-3 fw-bold">Price: {price} rupees</h6><br />
                <div className="d-flex m-3">
                    <input className="form-check-input" type="checkbox" name={name} value={name} onChange={handleChange} checked={isChecked} />
                    {isChecked ? <h5 className="px-3 py-1">Added</h5> : <h5 className="px-3 py-1">Add</h5>}
                </div>
            </div>
        </>
    )
}


export default IngredList;