import React, { useState } from 'react'
import { useAuth } from '../store/auth';
import RenderRazorpay from './RenderRazorPay';

const Summary = () => {
    const { setOrder, total } = useAuth();
    const [address, setAddress] = useState("");
    const order = setOrder();
    console.log(order);
    const entries = Object.entries(order["ingredients"]);

    const handleChange = (event) => {
        const value = event.target.value;
        setAddress(value);
    }

    const [displayRazorpay, setDisplayRazorpay] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        orderId: null,
        currency: null,
        amount: null,
    });

    const payAmount = async () => {
        const result = await fetch("http://localhost:8000/order", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    amount: total * 100, //convert amount into lowest unit. here, Dollar->Cents
                    currency: 'INR',
                }
            )
        }
        );

        const data = await result.json();

        if (result.ok) {
            setOrderDetails({
                ["orderId"]: data.order_id,
                ["currency"]: data.currency,
                ["amount"]: data.amount,
            });
            console.log(data);
            setDisplayRazorpay(true);
        };

    }

    return (
        <>
            <h1 className='text-center font-heading' style={{ marginTop: "100px" }}>Order Summary</h1>
            <div className='d-flex justify-content-center align-items-center mt-3'>
                <div className='d-flex justify-content-center col-10'>
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
                                        <td>{curr[1].toString()}</td>
                                    </tr>
                                )
                            })}
                            <tr className='table-info'>
                                <th scope="row">Grand Total</th>
                                <td>{total} Rs.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='text-center mt-3'>
                <input className="col-10" type='text' onChange={handleChange} value={address} name='address' placeholder='Enter Your Address' required /><br />
                <button className='mt-3 btn btn-outline-dark' onClick={payAmount}>Order and Pay</button>
            </div>
            {displayRazorpay ?
                <RenderRazorpay
                    amount={orderDetails.amount}
                    currency={orderDetails.currency}
                    orderId={orderDetails.orderId}
                /> : <></>
            }
        </>
    )
}

export default Summary;