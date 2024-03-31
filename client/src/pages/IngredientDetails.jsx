import React, { useState } from 'react'
import { toast } from "react-toastify";

const IngredientDetails = ({ toggle, toDisplay, fetchIngred }) => {
    const [seen, setSeen] = useState(false);
    const [toSave, setToSave] = useState(false);
    const [newData, setNewData] = useState({
        price: toDisplay.price,
        stock: toDisplay.stock,
    });
    const togglePop = () => {
        setSeen(!seen);
    };

    const askToSave = async () => {
        if (window.confirm("Do You want to save the Stocks and Prices")) {
            try {
                const result = await fetch(`${import.meta.env.VITE_BASE_URL}/ingredient`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ _id: toDisplay._id, price: newData.price, stock: newData.stock }),
                })
                const res = await result.json();
                if (result.ok) {
                    toast.success(res.msg);
                    fetchIngred();
                    toSavePop();
                } else {
                    toast.error(res.msg);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const toSavePop = () => {
        setToSave(!toSave);
    }

    const setData = (event) => {
        console.log(newData.price);
        const { name, value } = event.target;
        setNewData({
            ...newData,
            [name]: Number(value),
        });
        if (!toSave) {
            toSavePop();
        }
    }

    return (
        <>
            <div className='popup fade-in-div'>
                <div className='popup-inner'>
                    <h2 className='text-center fw-bold'>Order Details</h2>
                    <table className='table text-center'>
                        <tbody>
                            <tr>
                                <th>Ingredient Name</th>
                                <td>{toDisplay.name}</td>
                            </tr>
                            <tr>
                                <th>Price</th>
                                <td><input className='text-center' type="text" name="price" id="price" onChange={setData} value={newData.price} /></td>
                            </tr>
                            <tr>
                                <th>Stock</th>
                                <td><input className='text-center' type="text" name="stock" id="stock" onChange={setData} value={newData.stock} /></td>
                            </tr>
                            <tr>
                                <th>No. of Items</th>
                                <td>{toDisplay["items"].length}</td>
                            </tr>
                        </tbody>
                    </table>
                    {seen ? <>
                        <div>
                            <table className='table text-center'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">Ingredient Items</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {toDisplay["items"].map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </> : <></>}
                    <div className='d-flex justify-content-around'>
                        <button className="btn btn-outline-dark" onClick={toggle}>Close</button>
                        <button className="btn btn-outline-dark" onClick={togglePop}>{seen ? "Hide Items" : "Show Items"}</button>
                        {toSave ? <button className="btn btn-outline-dark" onClick={askToSave}>Save</button> : <></>}

                    </div>
                </div>
            </div>
        </>
    )
}

export default IngredientDetails;