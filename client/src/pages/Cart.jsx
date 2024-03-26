import React, { useEffect } from 'react'
import CartItems from './CartItems';
import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { isLoggedIn, cart, setTotal, total, setOrderList } = useAuth();
    const navigate = useNavigate();

    const submitChange = (e) => {
        e.preventDefault();
        if (total > 0) {
            setOrderList(cart);
            navigate(`${import.meta.env.BASE_URL}/ordersummary`);
        }
    }

    useEffect(() => {
        let temp = 0;
        cart.forEach(item => {
            temp += item['price'];
        });
        setTotal(temp);
    }, [cart]);

    return (
        <>{isLoggedIn ?
            <>
                <div className='text-center' style={{ marginTop: '100px' }}>
                    <h1 className='font-heading'>Cart Items</h1>
                    <p>Following are the items added to your Cart.</p>
                    <div className='d-flex justify-content-center'>
                        <div className='col-10'>
                            {cart.map((curr, index) => {
                                return <CartItems key={index} item={curr} />
                            })}
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center'>
                    <div className='d-flex justify-content-end col-10'>
                        <h3 className='m-2 font-heading'>Cart Total : {total} Rs.</h3>
                        <button type="submit" className='btn btn-outline-dark btn-lg fw-bold' onClick={submitChange}>Order Now</button>
                    </div>
                </div>
            </> : <></>}</>
    )
}

export default Cart