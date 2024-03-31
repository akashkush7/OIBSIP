import React, { useState } from 'react'
import Orders from './Orders';
import Users from './Users';
import Ingredientts from './Ingred';

const Admin = () => {
    const [active, setActive] = useState("orders");

    const changeActive = (e) => {
        const id = e.target.id;
        setActive(id);
    }

    return (
        <>
            <div className="d-flex justify-content-center mt-5">
                <ul className="nav nav-tabs nav-fill gap-2 p-1 small bg-dark text-white rounded-5 shadow-sm col-8" id="pillNav2" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active rounded-5 color" id="orders" data-bs-toggle="tab" type="button" role="tab" onClick={changeActive} aria-selected="true">Orders</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link rounded-5 color" id="users" data-bs-toggle="tab" type="button" role="tab" onClick={changeActive} aria-selected="false">Users</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link rounded-5 color" id="ingredients" data-bs-toggle="tab" type="button" role="tab" onClick={changeActive} aria-selected="false">Ingredients</button>
                    </li>
                </ul>
            </div>
            <div className='d-flex justify-content-center flex-column align-items-center'>
                {active === "orders" ? <Orders /> : active === "users" ? <Users /> : <Ingredientts />}
            </div>
        </>
    )
}

export default Admin;