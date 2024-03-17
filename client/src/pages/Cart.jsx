import React from 'react'
import CartItems from './CartItems';
import { useAuth } from '../store/auth';

const Cart = () => {
    const { userData, isLoggedIn } = useAuth();
    const cartItems = userData['cart'] || [];
    return (
        <>{isLoggedIn ?
            <>
                <div className='text-center' style={{ marginTop: '100px' }}>
                    <h1 className='font-heading'>Cart Items</h1>
                    <p>Following are the items added to your Cart.</p>
                    {cartItems.map((curr, index) => {
                        return <CartItems key={index} item={curr} />
                    })}
                </div>
            </> : <></>}</>
    )
}

export default Cart