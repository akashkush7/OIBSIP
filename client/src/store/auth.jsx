import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userData, setData] = useState({});
    const [ingred, setIngred] = useState([]);
    const [options, setOptions] = useState({});
    const [radioOpt, setOpt] = useState({});
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [prices, setPrices] = useState({});
    const [orderList, setOrderList] = useState([]);
    const [displayRazorpay, setDisplayRazorpay] = useState(false);
    const [address, setAddress] = useState("");
    const [orders, setOrders] = useState([]);
    //function to stored the token in local storage
    const storeTokenInLS = (serverToken) => {
        setToken(serverToken);
        return localStorage.setItem("token", serverToken);
    };

    let isLoggedIn = !!token;
    let isAdmin = userData.admin;

    const LogoutUser = () => {
        setToken("");
        return localStorage.removeItem('token');
    }

    const fixPrices = (resjson) => {
        resjson.forEach((item) => {
            let { name, price } = item;
            let appendPrice = { [name]: price };
            setPrices(prices => ({
                ...prices,
                ...appendPrice,
            }));
        })
    }

    const getIngred = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/ingredient`);
            const resjson = await response.json();
            setIngred(resjson);
            fixPrices(resjson);
        } catch (error) {
            console.log(error);
        }
    }

    const reset = (() => {
        setOpt({});
        setOptions({});
    })

    const getOptions = (name, value, checked) => {
        let getItems = options[name] || [];
        if (checked) {
            setOptions({ ...options, [name]: [...getItems, value] });
        } else {
            let itemOpt = getItems.filter((item) => item !== value)
            setOptions({ ...options, [name]: [...itemOpt] });
        }

    };

    const radioChange = (name, value) => {
        setOpt({
            ...radioOpt,
            [name]: value,
        });
    };

    const setOrder = () => {
        const order = {
            ingredients: { ...radioOpt, ...options },
        }
        return order;
    }

    const addToCart = () => {
        const addItem = setOrder();
        return addItem["ingredients"];
    }

    const getUserInfo = async () => {
        if (isLoggedIn) {
            try {
                console.log(import.meta.env.VITE_BASE_URL);
                const result = await fetch(`${import.meta.env.VITE_BASE_URL}/userinfo`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ token }),
                });
                const res = await result.json();
                setData(res);
                setCart(res['cart']);
                setOrders(res['orders'].reverse());
                getIngred();
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <AuthContext.Provider value={{
            storeTokenInLS,
            isLoggedIn,
            LogoutUser,
            getUserInfo,
            userData,
            isAdmin,
            ingred,
            getOptions,
            options,
            radioChange,
            radioOpt,
            addToCart,
            token,
            total,
            prices,
            setOrder,
            setTotal,
            reset,
            cart,
            orderList,
            setOrderList,
            displayRazorpay,
            setDisplayRazorpay,
            setCart,
            address,
            setAddress,
            orders
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the Provider");
    }
    return authContextValue;
};