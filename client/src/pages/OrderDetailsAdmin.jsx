import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import SpinLoader from './SpinLoader';

const OrderDetailsAdmin = ({ toggle, data, fetchOrders }) => {
    const [seen, setSeen] = useState(false);
    const [toSave, setToSave] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const togglePop = () => {
        setSeen(!seen);
    };
    const [loader, setLoader] = useState(false);

    const askToSave = async () => {
        if (window.confirm("Do You want to save the Order Status")) {
            setLoader(true);
            try {
                const result = await fetch(`${import.meta.env.VITE_BASE_URL}/updatestatus`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ orderId: data.orderId, orderStatus: newStatus }),
                })
                const res = await result.json();
                setLoader(false);
                if (result.ok) {
                    toast.success(res.msg);
                    fetchOrders();
                } else {
                    toast.error(res.msg);
                }
            } catch (error) {
                setLoader(false);
                console.log(error);
            }
        }
        toSavePop();
    }

    const toSavePop = () => {
        setToSave(!toSave);
    }

    const setStatus = (event) => {
        setNewStatus(event.target.value);
        toSavePop();
    }

    useEffect(() => {
        setNewStatus(data.orderStatus);
    }, []);

    return (
        <>
            <div className='popup fade-in-div'>
                <div className='popup-inner-item'>
                    <h2 className='text-center fw-bold font-heading'>Order Details</h2>
                    <table className='table text-center'>
                        <tbody>
                            <tr>
                                <th>Order Id</th>
                                <td>{data.orderId}</td>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <td>{data.name}</td>
                            </tr>
                            <tr>
                                <th>Contact</th>
                                <td>{data.phone}</td>
                            </tr>
                            <tr>
                                <th>Order Status</th>
                                <td>
                                    <select name="order-status" id="order-status" defaultValue={data.orderStatus} onChange={setStatus}>
                                        <option value="Ordered" >Ordered</option>
                                        <option value="Out-For-Delivery">Out-For-Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>Address</th>
                                <td>{data.address}</td>
                            </tr>
                            <tr>
                                <th>Payment Status</th>
                                <td>{data.paymentStatus}</td>
                            </tr>
                            <tr>
                                <th>No. of Items</th>
                                <td>{data["order"].length}</td>
                            </tr>
                            <tr>
                                <th>Date and Time</th>
                                <td>{`${data.date}`}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        {seen ? data["order"].map((item, index) => {
                            let entries = Object.entries(item["ingredients"]);
                            return (
                                <div key={index}>
                                    <h4 className='text-center'>Item {index + 1}</h4>
                                    <table className='table'>
                                        <thead className='table-dark'>
                                            <tr>
                                                <th scope="col">Ingredient Type</th>
                                                <th scope="col">Ingredients</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.map((curr, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{curr[0]}</th>
                                                        {Array.isArray(curr[1]) ? <td>{curr[1].toString().replaceAll(',', ', ')}</td> : <td>{curr[1]}</td>}
                                                    </tr>
                                                )
                                            })}
                                            <tr className='table-info'>
                                                <th scope="row">Grand Total</th>
                                                <td>{data["price"]} Rs.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            );
                        }) : <></>}
                    </div>
                    <div className='d-flex justify-content-around'>
                        <button className="btn btn-outline-dark" onClick={toggle}>Close</button>
                        <button className="btn btn-outline-dark" onClick={togglePop}>{seen ? "Hide Items" : "Show Items"}</button>
                        {toSave ? <button className="btn btn-outline-dark" onClick={askToSave}>Save</button> : <></>}

                    </div>
                </div>
            </div>
            {loader ? <SpinLoader /> : <></>}
        </>
    )
}

export default OrderDetailsAdmin;