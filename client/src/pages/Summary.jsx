import React, { useEffect, useState } from 'react'
import { useAuth } from '../store/auth';
import RenderRazorpay from './RenderRazorPay';
import { toast } from "react-toastify";

const Summary = () => {
    const { total, orderList, displayRazorpay, setDisplayRazorpay, address, setAddress } = useAuth();

    const entries = orderList.map((item) => {
        return Object.entries(item["ingredients"])
    });

    const handleChange = (event) => {
        const value = event.target.value;
        setAddress(value);
    }

    const [orderDetails, setOrderDetails] = useState({
        orderId: null,
        currency: null,
        amount: null,
    });

    const payAmount = async () => {
        try {
            if (address === "") {
                toast.warning("Please Enter Your Address Properly");
                return;
            }

            const result = await fetch(`${import.meta.env.VITE_BASE_URL}/order`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        amount: total * 100, //convert amount into lowest unit. here, Ruppees=>Paise
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
                setDisplayRazorpay(true);
            };
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <>
            <h1 className='text-center font-heading' style={{ marginTop: "100px" }}>Order Summary</h1>
            <div className='d-flex justify-content-center'>
                <div className='mt-3 col-10'>
                    {entries.map((currItem, index) => {
                        return (
                            <div key={index}>
                                <h4 className='font-heading text-center mt-3'>Custom Pizza {index + 1}</h4>
                                <div className='d-flex justify-content-center'>
                                    <table className='table text-center'>
                                        <thead className='table-dark'>
                                            <tr>
                                                <th scope="col">Ingredient Type</th>
                                                <th scope="col">Ingredients</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currItem.map((curr, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{curr[0]}</th>
                                                        <td>{curr[1].toString()}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='d-flex justify-content-center'>
                <h3 className='font-heading mt-3'>Grand Total: {total} Rs.</h3>
            </div>
            <div className='text-center mt-3'>
                <label htmlFor="address">House/Building number, Street Name, City/Town/Village, District, State, Country, Postal Code</label><br />
                <input className="col-10" type='text' onChange={handleChange} value={address} name='address' placeholder='Enter Your Address' require='required' /><br />
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