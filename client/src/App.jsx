import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Header from './Components/Header/Header.jsx'
import Footer from './Components/Footer/Footer.jsx'
import AboutPage from './Pages/About/AboutPage.jsx'
import Contact from './Pages/Contact/ContactPage.jsx'
import ContactPage from './Pages/Contact/ContactPage.jsx'
import Service from './Pages/Service/Service.jsx'
import Register from './Pages/Auth/Register.jsx'
import Otp from './Pages/Auth/Otp.jsx'
import Login from './Pages/Auth/Login.jsx'
import Dashboard from './Pages/Dashboard/Dashboard.jsx'
import UpdateProfile from './Pages/Dashboard/UpdateProfile.jsx'
import UpdateCategory from './Pages/Dashboard/UpdateCategory.jsx'
import UpdatePassword from './Pages/Dashboard/UpdatePassword.jsx'
import Term from './Pages/Term/Term.jsx'
import Privacy from './Pages/Term/Privacy.jsx'
import ForgetPassword from './Pages/Auth/ForgetPassword.jsx'
import Recharge_History from './Pages/Dashboard/Recharge_History.jsx'
import Withdrawals from './Pages/Dashboard/Withdrawals.jsx'
import BhVerification from './Pages/Auth/Bh.Verifcication.jsx'
import Allreferral from './Pages/Dashboard/Allreferral.jsx'
import AllReferral from './Pages/Dashboard/Allreferral.jsx'
import DoneRefer from './Pages/Dashboard/DoneRefer.jsx'
// import About from './Pages/About/About'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/service" element={<Service />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/otp-verify' element={<Otp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/update-profile' element={<UpdateProfile />} />
        <Route path='/change-category' element={<UpdateCategory />} />
        <Route path='/change-password' element={<UpdatePassword />} />
        <Route path='/term' element={<Term />} />
        <Route path='/get-my-referral/:id' element={<DoneRefer />} />


        <Route path='/Bh' element={<BhVerification />} />


        <Route path='/Recharge-History' element={<Recharge_History />} />
        <Route path='/Withdrawals-History' element={<Withdrawals />} />
        <Route path='/Refrreral-History' element={<AllReferral />} />




        <Route path='/Forgot-Password' element={<ForgetPassword />} />



        <Route path='/privacy' element={<Privacy />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
