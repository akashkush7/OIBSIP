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
import Summary from './pages/Summary'

export const App = () => {
  const { getUserInfo, isLoggedIn } = useAuth();
  let ignore = false;

  const reveal = () => {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 150;
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }

  window.addEventListener("scroll", reveal);

  // To check the scroll position on page load
  reveal();

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
        <Route path="/ordersummary" element={<Summary />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App;
