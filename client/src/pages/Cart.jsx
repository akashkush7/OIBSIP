import React, { useEffect } from 'react'
import CartItems from './CartItems';
import { useAuth } from '../store/auth';

const Cart = () => {
    const { isLoggedIn, cart } = useAuth();

    return (
        <>{isLoggedIn ?
            <>
                <div className='text-center' style={{ marginTop: '100px' }}>
                    <h1 className='font-heading'>Cart Items</h1>
                    <p>Following are the items added to your Cart.</p>
                    {cart.map((curr, index) => {
                        return <CartItems key={index} item={curr} />
                    })}
                </div>
            </> : <></>}</>
    )
}

export default Cart