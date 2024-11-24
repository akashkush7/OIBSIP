import React, { useEffect, useState } from 'react';
import SpinLoader from './SpinLoader';

const OrderDetails = ({ toggle, id }) => {
    const [data, setData] = useState({});
    const [l, setL] = useState([]);
    const [seen, setSeen] = useState(false);
    const togg = () => {
        setSeen(!seen);
    }
    const [loader, setLoader] = useState(false);
    const orderData = async () => {
        if (id !== null) {
            // console.log(id);
            setLoader(true);
            try {
                const result = await fetch(`${import.meta.env.VITE_BASE_URL}/orderdetails`, {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                });
                const res = await result.json();
                // console.log(res);
                setLoader(false);
                if (result.ok) {
                    setL(res['order']);
                    setData(res);
                    togg();
                }
            } catch (error) {
                setLoader(false);
                console.log(error);
            }
        }
    }

    useEffect(() => {
        orderData();
    }, [])
    return (
        <>{seen ?
            <>
                <div className='popup fade-in-div'>
                    <div className='popup-inner'>
                        <h2 className='text-center fw-bold font-heading'>Order Details</h2>
                        <table className='table text-center'>
                            <tbody>
                                <tr>
                                    <th>Order Id</th>
                                    <td>{data.orderId}</td>
                                </tr>
                                <tr>
                                    <th>Order Status</th>
                                    <td>{data.orderStatus}</td>
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
                                    <td>{l.length}</td>
                                </tr>
                                <tr>
                                    <th>Date and Time</th>
                                    <td>{`${data.date}`}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='text-center'>
                            <button className="btn btn-outline-dark" onClick={toggle}>Close</button>
                        </div>
                    </div>
                </div></> : <></>}
            {loader ? <SpinLoader /> : <></>}
        </>
    )
}

export default OrderDetails