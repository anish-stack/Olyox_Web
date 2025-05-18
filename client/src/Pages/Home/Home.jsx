import React, { useEffect } from 'react'
import Hero from '../../Components/Hero/Hero'
import Services from '../../Components/services/services'
import Features from '../../Components/Features/Features'
import HowItWorks from '../../Components/HowItWorks/HowItWorks'
import Testimonials from '../../Components/Testimonials/Testimonials'
// import AboutMission from '../About/AboutMission'
import AboutComponent from '../../Components/AboutComponent/AboutComponent'
import AppComponent from '../../Components/AppComponent/AppComponent'

function Home() {
  useEffect(() => {
    const hostname = window.location.hostname;

    if (hostname === 'www.olyox.com' || hostname === 'www.www.olyox.com') {
      window.location.href = 'https://www.olyox.in/';
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);


  return (
    <>
      <Hero />
      <AppComponent />
      <AboutComponent />
      <Services />
      <Features />
      <HowItWorks />
      <Testimonials />
    </>
  );
}

export default Home
