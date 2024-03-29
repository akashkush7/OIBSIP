import Ingredients from './IngredList'
import { useAuth } from '../store/auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import OrderDetails from './OrderDetails';


const Service = () => {
    const { ingred, isLoggedIn, addToCart, token, radioOpt, getUserInfo, setOrder, options, setTotal, total, prices, setOrderList, orders, reset } = useAuth();
    const navigate = useNavigate();
    const [seen, setSeen] = useState(false);
    const [oid, setOid] = useState("");

    function togglePop(orderid) {
        setSeen(!seen);
        setOid(orderid);
    };

    const checkItems = () => {
        if (Object.keys(radioOpt).length < 3) {
            toast.error("Please select the required Items");
            return false;
        } else {
            return true;
        }
    }

    const itemToCart = async () => {
        if (checkItems()) {

            const addItem = addToCart();
            try {
                const result = await fetch(`${import.meta.env.VITE_BASE_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token, ingredients: addItem, price: total }),
                })
                const res = await result.json();
                if (result.ok) {
                    toast.success(res.msg);
                } else {
                    toast.error(res.msg);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const updateTotal = async () => {
        let resList = await setOrder();
        let res = Object.entries(resList["ingredients"]);
        let temp = 0;
        res.forEach((item) => {
            if (Array.isArray(item[1])) {
                temp += prices[item[0]] * item[1].length;
            } else {
                temp += prices[item[0]];
            }
        });
        setTotal(temp);
    };

    const submitChange = (e) => {
        e.preventDefault();
        if (checkItems()) {
            setOrderList([setOrder()]);
            navigate("/ordersummary");
        }
    }


    useEffect(() => {
        updateTotal();
    }, [radioOpt, options])

    useEffect(() => {
        reset();
        getUserInfo();
    }, []);

    return (
        <> {isLoggedIn ?
            <>
                <div className='text-center' style={{ marginTop: '100px' }}>
                    <h1 className='font-heading'>Order Now</h1>
                    <p>Make Your own Pizza by choosing from the wide variety of ingredients available using following menu.</p>
                    <div className='col-11 d-flex justify-content-end'>
                        <div className='btn btn-outline-dark' onClick={() => {
                            getUserInfo();
                            navigate("/cart");
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="currentColor" className="bi bi-cart"
                                viewBox="0 0 16 16">
                                <path
                                    d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-wrap justify-content-center">
                    {ingred.map((curr) => {
                        return <Ingredients key={curr._id} name={curr.name} description={curr.description} price={curr.price} items={curr.items} optional={curr.optional} />
                    })}
                </div>
                <div className='col-11 d-flex justify-content-end'>
                    <h3 className='m-2 font-heading size-font'>Total : {total} Rs.</h3>
                    <button type="button" className='btn btn-outline-dark btn-lg mx-3 size-font' onClick={itemToCart}>Add to Cart</button>
                    <button type="submit" className='btn btn-outline-dark btn-lg size-font' onClick={submitChange}>Buy Now</button>
                </div>
                <div className='mt-5'>
                    <h1 className='font-heading text-center'>Order History</h1>
                    <div className='d-flex justify-content-center'>
                        <div className='d-flex justify-content-center mt-3 col-10'>
                            <table className='table text-center' style={{ fontSize: "1.5vw" }}>
                                <thead className='table-dark'>
                                    <tr>
                                        <th scope="col">Order Id</th>
                                        <th scope="col">Order Date</th>
                                        <th scope="col">Payment Status</th>
                                        <th scope="col">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((curr, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{curr.orderId}</th>
                                                <td>{`${new Date(curr.date).toLocaleDateString()} ${new Date(curr.date).toLocaleTimeString()}`}</td>
                                                <td style={{ color: "green", fontWeight: "bold" }}>{curr.paymentStatus}</td>
                                                <td><button className='btn btn-outline-dark' style={{ fontSize: "1.5vw" }} onClick={() => togglePop(curr.orderId)}>View Details</button></td>
                                            </tr>
                                        );
                                    })}

                                </tbody>
                            </table>
                            {seen ? <OrderDetails toggle={togglePop} id={oid} /> : null}
                        </div>
                    </div>
                </div>
            </> : <h1 className='text-center font-heading' style={{ marginTop: "100px" }}>Please Login before using Our Services</h1>}
        </>
    )
}

export default Service