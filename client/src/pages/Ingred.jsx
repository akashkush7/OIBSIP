import React, { useEffect, useState } from 'react'
import { useAuth } from '../store/auth';
import IngredientDetails from './IngredientDetails';

const Ingred = () => {
    const { getIngred, ingred } = useAuth();
    const [seen, setSeen] = useState(false);
    const [toDisplay, setToDisplay] = useState({});

    const togglePop = (item) => {
        setToDisplay(item);
        setSeen(!seen);
    }

    useEffect(() => {
        getIngred();
    }, [])

    return (
        <>
            <h1 className='font-heading text-center mt-5'>Ingredients</h1>
            <div className='d-flex justify-content-center mt-5 mb-5 flex-wrap col-lg-4 m-3'>
                {ingred.map((curr, index) => {
                    return (
                        <table className='table text-center fade-in-div' key={index}>
                            <tbody>
                                <tr className='table-dark'>
                                    <th>Ingredient Name</th>
                                    <td>{curr.name}</td>
                                </tr>
                                <tr>
                                    <th>Stock</th>
                                    <td>{curr.stock}</td>
                                </tr>
                                <tr>
                                    <th>Price</th>
                                    <td>{curr.price}</td>
                                </tr>
                                <tr>
                                    <th>Details</th>
                                    <td><button className='btn btn-outline-dark' onClick={() => togglePop(curr)}>Edit</button></td>
                                </tr>
                            </tbody>
                        </table >
                    );
                })}
            </div >
            {seen ? <IngredientDetails toggle={togglePop} toDisplay={toDisplay} fetchIngred={getIngred} /> : <></>}
        </>
    )
}

export default Ingred;