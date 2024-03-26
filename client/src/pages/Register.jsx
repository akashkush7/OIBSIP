import React, { useState } from 'react'
import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card text-white" style={{ borderRadius: "1rem", backgroundColor: "#F98866" }}>
                                <div className="card-body p-3 pb-3 text-center">
                                    <div className="mb-md-5 mt-md-4 pb-2">
                                        <form>
                                            <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                                            <p className="text-white-75 mb-5">Please enter following Data</p>
                                            <div className="form-outline form-white mb-4">
                                                <input type="text" className="form-control form-control-lg" name="name" id="name" onChange={inputChange} value={data.name} placeholder='Enter Your Name' autoComplete='off' required />
                                            </div>
                                            <div className="form-outline form-white mb-4">
                                                <input type="text" className="form-control form-control-lg" name="username" id="username" onChange={inputChange} value={data.username} placeholder='Select Username' autoComplete='off' required />
                                            </div>
                                            <div className="form-outline form-white mb-4">
                                                <input type="email" className="form-control form-control-lg" name="email" id="email" onChange={inputChange} value={data.email} placeholder='Enter Your E-mail' autoComplete='off' required /><br />
                                                {!verified ? data.email ? <div>
                                                    <input type="text" className="form-control form-control-lg" name="otp" id="otp" onChange={inputChange} value={otp} placeholder='OTP' disabled={visible} autoComplete='off' required /><br />
                                                    <div className='d-flex justify-content-around'>
                                                        <button className='btn btn-outline-light btn-lg' onClick={sendOTP}>{clicked ? "Resend OTP" : "send OTP"}</button>
                                                        {clicked ? <button className='btn btn-outline-light btn-lg' onClick={verifyMail}>Verify</button> : <></>}
                                                    </div>
                                                </div> : <></> : <></>}
                                            </div>
                                            {verified ? <><div className="form-outline form-white mb-4">
                                                <input type="password" className="form-control form-control-lg" name="password" id="password" onChange={inputChange} value={data.password} placeholder='Select Password' autoComplete='off' required />
                                            </div>
                                                <div className="form-outline form-white mb-4">
                                                    <input type="text" className="form-control form-control-lg" name="phone" id="phone" onChange={inputChange} value={data.phone} placeholder='Mobile Number' autoComplete='off' required />
                                                </div>
                                                <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={submitData}>Register</button></> : <></>}
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

export default Register