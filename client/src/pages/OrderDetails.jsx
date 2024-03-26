import React, { useEffect, useState } from 'react'

const OrderDetails = ({ toggle, id }) => {
    const [data, setData] = useState({});
    const [l, setL] = useState([]);
    const [seen, setSeen] = useState(false);
    const togg = () => {
        setSeen(!seen);
    }
    const orderData = async () => {
        if (id !== null) {
            console.log(id);
            try {
                const result = await fetch("https://oibsip-3.onrender.com/orderdetails", {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                });
                const res = await result.json();
                // console.log(res);
                if (result.ok) {
                    setL(res['order']);
                    setData(res);
                    togg();
                }
            } catch (error) {
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
                <div className='popup'>
                    <div className='popup-inner'>
                        <h2>Order Details</h2>
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
                                    <td>{`${new Date(data.date).toLocaleDateString()} ${new Date(data.date).toLocaleTimeString()}`}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="btn btn-outline-dark" onClick={toggle}>Close</button>
                    </div>
                </div></> : <></>}
        </>
    )
}

export default OrderDetails