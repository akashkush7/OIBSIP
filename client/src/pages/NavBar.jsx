import React from 'react'
import { NavLink } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../../node_modules/bootstrap/dist/js/bootstrap.min.js"
import { useAuth } from '../store/auth'

const NavBar = () => {
    const { isLoggedIn, isAdmin } = useAuth();
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top" style={{ opacity: '80%' }}>
            <div className="container-fluid col-10 text-center">
                <div>
                    {/* <img src={Logo} alt="SiteLogo" style={{ maxHeight: "25px" }} /> */}
                    <span className="navbar-brand mb-0 h1">Pizza Delivery Service</span>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item"><NavLink className="nav-link" to="/"><h6 data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Home</h6></NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/contact"><h6 data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Contact</h6></NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/about"><h6 data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">About</h6></NavLink></li>
                        {isLoggedIn ?
                            <> <li className="nav-item"><NavLink className="nav-link" to="/service"><h6 data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Order Now</h6></NavLink></li>
                                <li className="nav-item"><NavLink className="nav-link" to="/logout"><h6 data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Logout</h6></NavLink></li></> :
                            <>
                                <li className="nav-item"><NavLink className="nav-link" to="/register"><h6 data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Register</h6></NavLink></li>
                                <li className="nav-item"><NavLink className="nav-link" to="/login"><h6 data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Login</h6></NavLink></li>
                            </>}
                        {
                            isAdmin && isLoggedIn ?
                                <li className="nav-item"><NavLink className="nav-link" to="/admin"><h6 data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Admin</h6></NavLink></li> : <></>
                        }

                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;