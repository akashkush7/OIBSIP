import React, { useState } from 'react'
import { toast } from "react-toastify"

const ResetPass = ({ toggle }) => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [otp, setOTP] = useState("");

    const [clicked, setClick] = useState(false);
    const [visible, setVis] = useState(true);
    const [verified, setVer] = useState(false);

    const handleChange = (event) => {
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
        try {
            const result = await fetch(`${import.meta.env.VITE_BASE_URL}/verification/mail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, reset: true })
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
                body: JSON.stringify({ email: data.email, otp }),
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
            const result = await fetch(`${import.meta.env.VITE_BASE_URL}/changepassword`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email, password: data.password }),
            });
            const resData = await result.json();
            console.log(resData);
            if (result.ok) {
                toast.success(resData.msg);
                toggle();
            } else {
                toast.error(resData.msg);
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <div className='popup fade-in-div'>
                <div className='popup-inner p-5' style={{ minWidth: "80%" }}>
                    <h3 className='text-center fw-bold font-heading'>Reset Password</h3>
                    <div className="form-outline my-4">
                        <input type="email" className="form-control border-black" name="email" id="email" onChange={handleChange} value={data.email} placeholder='Enter Your E-mail' autoComplete='new' disabled={clicked} required />
                        <label className="form-label" htmlFor="email">Registered Email address</label>
                    </div>
                    {!verified ? data.email ? <div>
                        <input type="text" className="form-control border-black" name="otp" id="otp" onChange={handleChange} value={otp} placeholder='OTP' disabled={visible} autoComplete='new' required /><br />
                        <div className='d-flex justify-content-around'>
                            <div className="pt-1 mb-4">
                                <button className="btn btn-outline-dark" onClick={sendOTP}>{clicked ? "Resend OTP" : "send OTP"}</button></div>
                            {clicked ? <div className="pt-1 mb-4">
                                <button className="btn btn-outline-dark" onClick={verifyMail}>Verify</button></div> : <></>}
                        </div>
                    </div> : <></> : <></>}
                    {verified ? <><div className="form-outline mb-4">
                        <input type="password" className="form-control border-black" name="password" id="password" onChange={handleChange} value={data.password} placeholder='Select New Password' autoComplete='off' required />
                    </div>
                        <div className="pt-1 mb-4 d-flex justify-content-center">
                            <button className="btn btn-dark btn-lg btn-block" type="submit" onClick={submitData}>Change Password</button></div></> : <></>}
                    <div className='d-flex justify-content-center'>
                        <button className="btn btn-outline-dark" type="button" onClick={toggle}>Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPass;