import React, { useEffect } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Logout from './pages/Logout'
import Service from './pages/Service'
import NavBar from './pages/NavBar'
import Contact from './pages/Contact'
import About from './pages/About'
import Admin from './pages/Admin'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './store/auth'
import Footer from './pages/Footer'
import Cart from './pages/Cart'

export const App = () => {
  const { getUserInfo, isLoggedIn } = useAuth();
  let ignore = false;
  useEffect(() => {
    if (!ignore) {
      getUserInfo();
      ignore = true;
    }
  }, [isLoggedIn]);
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Service />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App;
