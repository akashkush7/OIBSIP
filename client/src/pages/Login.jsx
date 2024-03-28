import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAuth } from '../store/auth';
import Img from "./Images";

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
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
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
            <section className="vh-100 mb-5 fade-in-div">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-xl-10">
                            <div className="card" style={{ borderRadius: "1rem" }}>
                                <div className="row g-0">
                                    <div className="col-md-6 col-lg-5 d-none d-md-block">
                                        <img src={Img['Cred']}
                                            alt="login form" className="img-fluid" style={{ borderRadius: "1rem 0 0 1rem" }} />
                                    </div>
                                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                        <div className="card-body p-4 p-lg-5 text-black">

                                            <form>

                                                <div className="d-flex align-items-center mb-3 pb-1">
                                                    <i className="fas fa-cubes fa-2x me-3" style={{ color: "#ff6219" }}></i>
                                                    <span className="h1 fw-bold mb-0">Pizza Delivery Service</span>
                                                </div>

                                                <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>Sign into your account</h5>

                                                <div className="form-outline mb-4">
                                                    <input type="email" className="form-control form-control-lg" name="email" onChange={inputChange} value={data.email} placeholder='Enter Your E-mail' autoComplete='off' required />
                                                    <label className="form-label" for="email">Email address</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <input type="password" className="form-control form-control-lg" name='password' onChange={inputChange} value={data.password} placeholder='Enter Your Password' autoComplete='off' required />
                                                    <label className="form-label" for="password">Password</label>
                                                </div>

                                                <div className="pt-1 mb-4">
                                                    <button className="btn btn-dark btn-lg btn-block" type="submit" onClick={submitData}>Login</button>
                                                </div>

                                                <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>Don't have an account? <NavLink to="/register"
                                                    style={{ color: "#393f81" }}>Register here</NavLink></p>
                                            </form>

                                        </div>
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