import React from 'react'
import Hero from '../../Components/Hero/Hero'
import Services from '../../Components/services/services'
import Features from '../../Components/Features/Features'
import HowItWorks from '../../Components/HowItWorks/HowItWorks'
import Testimonials from '../../Components/Testimonials/Testimonials'
// import AboutMission from '../About/AboutMission'
import AboutComponent from '../../Components/AboutComponent/AboutComponent'
import AppComponent from '../../Components/AppComponent/AppComponent'

function Home() {
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
  )
}

export default Home
