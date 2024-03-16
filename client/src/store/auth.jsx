import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userData, setData] = useState({});
    const [ingred, setIngred] = useState([]);
    const [options, setOptions] = useState({});
    const [radioOpt, setOpt] = useState({});
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

    const getIngred = async () => {
        try {
            const response = await fetch('http://localhost:8000/ingredient');
            const resjson = await response.json();
            console.log(resjson);
            setIngred(resjson);
        } catch (error) {
            console.log(error);
        }
    }

    const getOptions = (name, value, checked) => {
        let getItems = options[name] || [];
        if (checked) {
            setOptions({ ...options, [name]: [...getItems, value] });
        } else {
            console.log(options[name]);
            let itemOpt = getItems.filter((item) => item !== value)
            setOptions({ ...options, [name]: [...itemOpt] });
        }

    };

    const radioChange = (name, value) => {
        setOpt({
            ...radioOpt,
            [name]: value,
        })
    };

    const getUserInfo = async () => {
        if (isLoggedIn) {
            try {
                const result = await fetch('http://localhost:8000/userinfo', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ token }),
                });
                const res = await result.json();
                setData(res);
                console.log(res);
                getIngred();
            } catch (error) {
                console.log(error);
            }
        }
    }


    return (
        <AuthContext.Provider value={{ storeTokenInLS, isLoggedIn, LogoutUser, getUserInfo, userData, isAdmin, ingred, getOptions, options, radioChange, radioOpt }}>
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