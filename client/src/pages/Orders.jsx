import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"
import OrderDetailsAdmin from './OrderDetailsAdmin';
import SpinLoader from './SpinLoader';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [seen, setSeen] = useState(false);
    const [toDisplay, setToDisplay] = useState({});
    const [loader, setLoader] = useState(false);
    const getOrders = async () => {
        setLoader(true);
        try {
            const result = await fetch(`${import.meta.env.VITE_BASE_URL}/getorders`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                },
            })
            const res = await result.json();
            setLoader(false);
            if (result.ok) {
                setOrders(res);
            } else {
                toast.error(res.msg);
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    }

    const togglePop = (item) => {
        setToDisplay(item);
        setSeen(!seen);
    }

    useEffect(() => {
        getOrders();
    }, [])

    return (
        <>
            <h1 className='font-heading text-center mt-5'>Orders</h1>
            <div className='d-flex justify-content-center mt-5 mb-5 flex-wrap col-lg-4 m-3'>
                {orders.map((curr, index) => {
                    return (
                        <table className='table text-center fade-in-div' key={index}>
                            <tbody>
                                <tr className='table-dark'>
                                    <th>Order Id</th>
                                    <td>{curr.orderId}</td>
                                </tr>
                                <tr>
                                    <th>Date</th>
                                    <td>{`${curr.date}`}</td>
                                </tr>
                                <tr>
                                    <th>Order Status</th>
                                    <td>{curr.orderStatus}</td>
                                </tr>
                                <tr>
                                    <th>Details</th>
                                    <td><button className='btn btn-outline-dark' onClick={() => togglePop(curr)}>View Details</button></td>
                                </tr>
                            </tbody>
                        </table >
                    );
                })}
            </div >
            {seen ? <OrderDetailsAdmin toggle={togglePop} data={toDisplay} fetchOrders={getOrders} /> : <></>}
            {loader ? <SpinLoader /> : <></>}
        </>
    )
}

export default Orders