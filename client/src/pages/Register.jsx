import React, { useState } from 'react'
import { useAuth } from '../store/auth';
import { useNavigate, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import Img from "./Images"

const Register = () => {
    const [data, setData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        phone: '',
    });

    const [clicked, setClick] = useState(false);
    const [visible, setVis] = useState(true);
    const [verified, setVer] = useState(false);

    const [otp, setOTP] = useState("");
    const [resOTP, setResOTP] = useState("");

    const { storeTokenInLS } = useAuth();
    const navigate = useNavigate();
    const { getUserInfo } = useAuth();

    const inputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === 'otp') {
            setOTP(value);
        } else {
            setData({
                ...data,
                [name]: value,
            })
        }
    };

    const sendOTP = async (e) => {
        e.preventDefault();
        const email = data.email;
        console.log(email);
        try {
            const result = await fetch(`${import.meta.env.VITE_BASE_URL}/verification/mail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email })
            })

            const res = await result.json();
            if (result.ok) {
                setClick(true);
                setVis(false);
                toast.success(res.msg);
            } else {
                toast.error(res.msg)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const verifyMail = async (e) => {
        e.preventDefault();
        try {
            const result = await fetch(`${import.meta.env.VITE_BASE_URL}/verification/otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email, otp: otp }),
            });
            const res = await result.json();
            if (result.ok) {
                setVer(true);
                toast.success(res.msg);
            } else {
                toast.error(res.msg);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const submitData = async (e) => {
        e.preventDefault();
        try {
            const result = await fetch(`${import.meta.env.VITE_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const resData = await result.json();
            console.log(resData);
            if (result.ok) {
                storeTokenInLS(resData.token);
                getUserInfo();
                toast.success("Successfull SignUp");
                navigate("/service");
            } else {
                toast.error(resData.extraDetails ? resData.extraDetails : resData.msg);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <section className='fade-in-div'>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-xl-10">
                            <div className="card" style={{ borderRadius: "1rem" }}>
                                <div className="row g-0">
                                    <div className="col-md-6 col-lg-5 d-none d-md-block">
                                        <img src={Img['Cred']}
                                            alt="login form" className="img-fluid" style={{ borderRadius: "1rem 0 0 0" }} />
                                    </div>
                                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                        <div className="card-body p-4 p-lg-5 text-black">
                                            <form>
                                                <div className="d-flex align-items-center mb-3 pb-1">
                                                    <span className="h1 fw-bold mb-0">Pizza Delivery Service</span>
                                                </div>

                                                <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>Sign into your account</h5>

                                                <div className="form-outline mb-4">
                                                    <input type="text" className="form-control form-control-lg" name="name" id="name" onChange={inputChange} value={data.name} placeholder='Enter Your Name' autoComplete='new' required />
                                                    <label className="form-label" htmlFor="name">Name</label>
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <input type="text" className="form-control form-control-lg" name="username" id="username" onChange={inputChange} value={data.username} placeholder='Select Username' autoComplete='new' required />
                                                    <label className="form-label" htmlFor="username">Username</label>
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <input type="text" className="form-control form-control-lg" name="phone" id="phone" onChange={inputChange} value={data.phone} placeholder='Mobile Number' autoComplete='new' required />
                                                    <label className="form-label" htmlFor="phone">Phone Number</label>
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <input type="email" className="form-control form-control-lg" name="email" id="email" onChange={inputChange} value={data.email} placeholder='Enter Your E-mail' autoComplete='new' disabled={clicked} required />
                                                    <label className="form-label" htmlFor="email">Email address</label>
                                                </div>
                                                {!verified ? data.email ? <div>
                                                    <input type="text" className="form-control form-control-lg" name="otp" id="otp" onChange={inputChange} value={otp} placeholder='OTP' disabled={visible} autoComplete='new' required /><br />
                                                    <div className='d-flex justify-content-around'>
                                                        <div className="pt-1 mb-4">
                                                            <button className="btn btn-dark btn-lg btn-block" onClick={sendOTP}>{clicked ? "Resend OTP" : "send OTP"}</button></div>
                                                        {clicked ? <div className="pt-1 mb-4">
                                                            <button className="btn btn-dark btn-lg btn-block" onClick={verifyMail}>Verify</button></div> : <></>}
                                                    </div>
                                                </div> : <></> : <></>}
                                                {verified ? <><div className="form-outline mb-4">
                                                    <input type="password" className="form-control form-control-lg" name="password" id="password" onChange={inputChange} value={data.password} placeholder='Select Password' autoComplete='off' required />
                                                </div>
                                                    <div className="pt-1 mb-4">
                                                        <button className="btn btn-dark btn-lg btn-block" type="submit" onClick={submitData}>Register</button></div></> : <></>}

                                                <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>Already have an account? <NavLink to="/login"
                                                    style={{ color: "#393f81" }}>Login here</NavLink></p>
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

export default Register