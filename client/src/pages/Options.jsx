import React, { useEffect } from 'react'
import { useAuth } from '../store/auth';

const Options = ({ item, optional, name }) => {
    const { getOptions, isLoggedIn, radioChange, reset } = useAuth();
    const checkChange = (event) => {
        const { name, value, checked } = event.target;
        getOptions(name, value, checked);
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        radioChange(name, value);
    }

    useEffect(() => {
        reset();
    }, []);

    return (
        <>
            {isLoggedIn ? optional ?
                <div className='d-flex m-1'>
                    <input className="form-check-input" type="checkbox" name={name} value={item} id={item} onChange={checkChange} />
                    <label className="m-1 fw-bold" htmlFor={item}>{item}</label>
                </div> :
                <div className='d-flex m-1'>
                    <input className="form-check-input" type="radio" name={name} value={item} id={item} style={{ width: "30px", height: "auto" }} onChange={handleChange} />
                    <label className="m-1 fw-bold" htmlFor={item}>{item}</label>
                </div> : <h1 className='font-heading'>Please Login before using our Services</h1>
            }
        </>
    )
}

export default Options