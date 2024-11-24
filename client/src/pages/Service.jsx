import Ingredients from './IngredList'
import { useAuth } from '../store/auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import OrderDetails from './OrderDetails';
import SpinLoader from './SpinLoader';


const Service = () => {
    const { userData, ingred, isLoggedIn, addToCart, token, radioOpt, setOrder, options, setTotal, total, prices, setOrderList, orders, reset, getCartDetails, getOrderDetails } = useAuth();
    const navigate = useNavigate();
    const [seen, setSeen] = useState(false);
    const [oid, setOid] = useState("");
    const [loader, setLoader] = useState(false);

    function togglePop(orderid) {
        setOid(orderid);
        setSeen(!seen);
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
                setLoader(true);
                const result = await fetch(`${import.meta.env.VITE_BASE_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token, ingredients: addItem, price: total }),
                })
                const res = await result.json();
                setLoader(false);
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
        getOrderDetails(userData);
    }, []);

    return (
        <> {isLoggedIn ?
            <>
                <div className='text-center mt-5'>
                    <h1 className='font-heading'>Order Now</h1>
                    <p className='mx-3'>Make Your own Pizza by choosing from the wide variety of ingredients available using following menu.</p>
                    <div className='col-11 d-flex justify-content-end'>
                        <h3 className='font-heading m-2'>Cart:</h3>
                        <div className='btn btn-outline-dark' onClick={() => {
                            getCartDetails(userData);
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
                <div className='col-lg-11 d-flex justify-content-end price-div m-3'>
                    <h3 className='mt-2 font-heading'>Total : {total} Rs.</h3>
                    <button type="button" className='btn btn-outline-dark btn-lg mx-2' onClick={itemToCart}>Add to Cart</button>
                    <button type="submit" className='btn btn-outline-dark btn-lg' onClick={submitChange}>Buy Now</button>
                </div>
                {orders.length > 0 ?
                    <>
                        <div className='d-flex justify-content-center flex-column align-items-center'>
                            <h1 className='font-heading text-center mt-5'>Order History</h1>
                            <div className='d-flex justify-content-center m-3 mt-5 flex-wrap col-md-6 col-lg-4'>

                                {orders.map((curr, index) => {
                                    return (
                                        <table className='table text-center reveal fade' key={index}>
                                            <tbody>
                                                <tr>
                                                    <th scope="col">Order Id</th>
                                                    <td scope="row">{curr.orderId}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Order Date</th>
                                                    <td>{`${new Date(curr.date).toLocaleDateString('hi-IN')} ${new Date(curr.date).toLocaleTimeString('hi-IN')}`}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Payment Status</th>
                                                    <td style={{ color: "green", fontWeight: "bold" }}>{curr.paymentStatus}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Details</th>
                                                    <td><button className='btn btn-outline-dark' onClick={() => togglePop(curr.orderId)}>View Details</button></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    );
                                })}
                            </div>
                        </div></> : <></>
                }
                {seen ? <OrderDetails toggle={togglePop} id={oid} /> : null}

            </> : <h1 className='text-center font-heading' style={{ marginTop: "100px" }}>Please Login before using Our Services</h1>}
            {loader ? <SpinLoader /> : <></>}
        </>
    )
}

export default Service