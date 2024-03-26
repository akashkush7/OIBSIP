import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAuth } from '../store/auth';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const { storeTokenInLS } = useAuth();

    const inputChange = (events) => {
        const name = events.target.name;
        const value = events.target.value;

        setData({
            ...data,
            [name]: value
        });
    };

    const submitData = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://oibsip-3.onrender.com/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const resData = await res.json();
            if (res.ok) {
                storeTokenInLS(resData.token);
                toast.success("Login Successfull");
                navigate("/service");
            } else {
                toast.error(resData.extraDetails ? resData.extraDetails : "Invalid Credentials");
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card text-white" style={{ borderRadius: "1rem", backgroundColor: "#F98866" }}>
                                <div className="card-body px-5 pb-1 text-center">
                                    <div className="mb-md-5 mt-md-4 pb-2">
                                        <form>
                                            <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                            <p className="text-white-75 mb-5">Please enter your email and password!</p>
                                            <div className="form-outline form-white mb-4">
                                                <input type="email" className="form-control form-control-lg" name="email" onChange={inputChange} value={data.email} placeholder='Enter Your E-mail' autoComplete='off' required />
                                            </div>
                                            <div className="form-outline form-white mb-4">
                                                <input type="password" className="form-control form-control-lg" name='password' onChange={inputChange} value={data.password} placeholder='Enter Your Password' autoComplete='off' required />
                                            </div>
                                            <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={submitData}>Login</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login